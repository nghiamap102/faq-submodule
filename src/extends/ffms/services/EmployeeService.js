import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

import DataEnum from 'extends/ffms/constant/ffms-enum';
import CommonService from 'extends/ffms/services/CommonService';
import UserService from 'extends/ffms/services/UserService';
import PermissionService from 'extends/ffms/services/PermissionService';
import { AppConstant } from 'constant/app-constant';

export default class EmployeeService extends CommonService
{
    LAYER_NAME = 'EMPLOYEE';
    model = 'employees';
    defaultPassword = '123456';

    http = new HttpClient();

    permissionSvc = new PermissionService();
    userSvc = new UserService();

    constructor(contexts)
    {
        super(contexts);
        this.contexts = contexts;

        // TODO move to ffms-backend, not work on tenant.sysid from client side
        this.accountPath = `/root/ims/vbd/users${contexts.tenant.product ? `/${contexts.tenant.product}` : '/ffms' }/${AppConstant.sysIdPlaceholder}`;
        this.dataPath = `/root/vdms/tangthu/data/ffms/${AppConstant.sysIdPlaceholder}/AppData/${AppConstant.sysIdPlaceholder}_EMPLOYEE`;
    }

    gets = (where = null, valueType = '') =>
    {
        const filter = where ? { where, valueType: valueType } : null;
        if (filter)
        {
            return this.http.get(`/api/ffms/employees?filter=${encodeURIComponent(JSON.stringify(filter))}`, AuthHelper.getVDMSHeader());
        }

        return this.http.get('/api/ffms/employees', AuthHelper.getVDMSHeader());
    };

    getData = (nodeId) =>
    {
        return this.getRawData(this.LAYER_NAME, nodeId);
    };

    search = (filter) =>
    {
        return this.queryData(this.model, filter);
    };

    count = (filter) =>
    {
        return this.queryData(this.model, { ...filter, take: 0, skip: 0 }).then((rs) =>
        {
            
            return rs ? rs.total : 0;
        });
    }

    get = (employeeGuid) =>
    {
        return this.http.get(`/api/ffms/employees/${employeeGuid}`, AuthHelper.getVDMSHeader());
    };

    create = (employeeObj) =>
    {
        return this.http.post('/api/ffms/employees', employeeObj, AuthHelper.getVDMSHeader());
    };

    edit = (employeeGuid, employeeObj) =>
    {
        return this.http.patch(`/api/ffms/employees/${employeeGuid}`, employeeObj, AuthHelper.getVDMSHeader());
    };

    delete = (employeeGuid) =>
    {
        return this.http.delete(`/api/ffms/employees/${employeeGuid}`, null, AuthHelper.getVDMSHeader());
    };

    getEmpTypes = () =>
    {
        return this.http.get('/api/ffms/employee-types', AuthHelper.getVDMSHeader());
    };

    getEmpShifts = () =>
    {
        return this.http.get('/api/ffms/shifts', AuthHelper.getVDMSHeader());
    };

    // todo: this is business logic for employee, must move this to ffms-backend
    // Create account for employee (accInfo includes username & password)
    createAccount = (employee, accInfo) =>
    {
        const permission = 'AddNew';
        return this.permissionSvc.canPerformAction(this.accountPath, permission).then((yes) =>
        {
            if (yes)
            {
                const data = {
                    AppPath: this.accountPath,
                    UserInfo: {
                        Email: employee.employee_email,
                        PhoneNumber: employee.employee_phone,
                        UserName: accInfo.username,
                        Password: accInfo.password,
                    },
                };
                // should check existed here, then create if valid
                // this.checkIfUserExistsByName(accInfo.userName).then()
                return this.userSvc.createUser(data).then((res) =>
                {
                    if (res.status.success === true)
                    {
                        const userName = res.data.UserName || accInfo.username;
                        
                        this.userSvc.addUsersToGroup(`${this.accountPath}/worker`, [userName]);

                        return this.edit(employee.employee_guid, {
                            Id: employee.Id, // must have
                            employee_guid: employee.employee_guid, // must have

                            employee_username: res.data.UserName || accInfo.username,
                            employee_code: res.data.UserId,
                            employee_status: DataEnum.EMPLOYEE_STATUS.inactive,
                        });
                    }
                    else
                    {
                        return res;
                    }
                });
            }
            return yes;
        });
    };

    // todo: this is business logic for employee, must move this to ffms-backend
    // Approve user. MUST move this to ffms-backend

    // Note: only activate employee when account was created. So that
    // when employee has NO ACCOUNT: do nothing
    // when account is APPROVED (ACTIVATED): update employee status if it is not active status, otherwise do nothing
    // when account is NOT APPROVED: approve account & update employee status to active
    setActivated = async (employee) =>
    {
        // 0 (no account): do nothing,
        // 1 (account already approved): update status
        // 2 (inactivated account): approve account & update status
        let flag;
        if (!employee.employee_username)
        {
            flag = 0;
        }
        else
        {
            const accountInfo = await this.checkIfUserExistsByUserName(employee.employee_username);
            flag = !accountInfo ? 0 : (accountInfo.EmailConfirmed ? 1 : 2);
        }

        if (flag === 0)
        {
            return false;
        }
        else if (flag === 1 && employee.employee_status !== 3) // status !== active => set to active (3)
        {
            return this.edit(employee.employee_guid, {
                Id: employee.Id,
                employee_status: DataEnum.EMPLOYEE_STATUS.active,
            });
        }
        else if (flag === 2)
        {
            const permission = 'Save';
            return this.permissionSvc.canPerformAction(this.accountPath, permission).then((yes) =>
            {
                if (yes)
                {
                    return this.userSvc.approveUser(employee.employee_username).then((res) =>
                    {
                        return this.edit(employee.employee_guid, {
                            Id: employee.Id,
                            employee_status: DataEnum.EMPLOYEE_STATUS.active,
                        });
                    });
                }
                return employee;
            });
        }
        else
        {
            return employee;
        }
    };


    // todo: this is business logic for employee, must move this to ffms-backend
    // Disable employee
    // First: change employee status to disable
    // Second: LOCK account linked to this employee if needed
    setDisable = async (employee) =>
    {
        // 1 (no account OR not activated OR already disabled): disable employee (update status only)
        // 2: disable employee && lock account
        let flag;
        if (!employee.employee_username)
        {
            flag = 1;
        }
        else
        {
            const accountInfo = await this.checkIfUserExistsByUserName(employee.employee_username);
            if (!accountInfo || !accountInfo.EmailConfirmed || accountInfo.IsLockedOut)
            {
                flag = 1;
            }
            else
            {
                flag = 2;
            }
        }

        if (flag === 1 && employee.employee_status !== 4)
        {
            return this.edit(employee.employee_guid, {
                Id: employee.Id,
                employee_status: DataEnum.EMPLOYEE_STATUS.disabled,
            });
        }
        else if (flag === 2)
        {
            // Only update employee status when lock account successfully. Otherwise, do nothing
            const permission = 'Save';
            return this.permissionSvc.canPerformAction(this.accountPath, permission).then((yes) =>
            {
                if (yes)
                {
                    return this.userSvc.lockUser(employee.employee_username).then((res) =>
                    {
                        if (res && res.status && res.status.success)
                        {
                            return this.edit(employee.employee_guid, {
                                Id: employee.Id,
                                employee_status: DataEnum.EMPLOYEE_STATUS.disabled,
                            });
                        }
                        return res;
                    });
                }
                return false;
            });
        }
        else
        {
            return employee;
        }
    };

    // todo: this is business logic for employee, must move this to ffms-backend
    // Enable Employee
    // First: change employee status to active/inactive based on whether employee has account
    // Second: UNLOCK account linked to this employee if needed
    setEnable = async (employee) =>
    {
        let newStatus = DataEnum.EMPLOYEE_STATUS.active;
        // Adjust the employee status based on status of account:
        // when employee has NO ACCOUNT: new
        // when account is NOT EXISTED/account is NOT APPROVED (NOT ACTIVATED): inactive (1)
        // when employee has approved/activated account: active (2)
        if (!employee.employee_username)
        {
            newStatus = DataEnum.EMPLOYEE_STATUS.new;
        }
        else
        {
            const accountInfo = await this.checkIfUserExistsByUserName(employee.employee_username);
            if (!accountInfo || !accountInfo.EmailConfirmed)
            {
                newStatus = DataEnum.EMPLOYEE_STATUS.inactive;
            }
            else
            {
                newStatus = DataEnum.EMPLOYEE_STATUS.active;
            }
        }


        if (newStatus === 1)
        {
            return this.edit(employee.employee_guid, {
                Id: employee.Id,
                employee_status: newStatus,
            });
        }
        else
        {
            // when unlock account successfully, update employee status. Otherwise, do nothing
            const permission = 'Save'; // Approve???
            return this.permissionSvc.canPerformAction(this.accountPath, permission).then((yes) =>
            {
                if (yes)
                {
                    return this.userSvc.unlockUser(employee.employee_username).then((res) =>
                    {
                        if (res && res.status && res.status.success)
                        {
                            return this.edit(employee.employee_guid, {
                                Id: employee.Id,
                                employee_status: newStatus,
                            });
                        }
                        return res;
                    });
                }
                return yes;
            });
        }
    };

    // todo: this is business logic for employee, must move this to ffms-backend
    // Reset password
    resetPassword = (employee, setPassword) =>
    {
        const chars = ['0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*', '0123456789'];

        const data = {
            userName: employee.employee_username,
            password: [setPassword?.minLength, setPassword?.number].map((len, i) =>
            {
                return Array(len).fill(chars[i]).map((x) =>
                {
                    return x[Math.floor(Math.random() * x.length)];
                }).join('');
            }).concat().join('').split('').sort(() =>
            {
                return 0.5 - Math.random();
            }).join(''),
        };
        return this.userSvc.resetPassword(data);
    };

    // todo: this is business logic for employee, must move this to ffms-backend
    // Change your own password using current logged in user.
    // passInfo must includes oldPassword, newPassword
    changePassword = (passInfo) =>
    {
        return this.userSvc.changePassword(passInfo);
    };

    // todo: this is business logic for employee, must move this to ffms-backend
    // check valid employee
    checkIfUserExistsByEmail = (email) =>
    {
        return this.userSvc.checkIfUserExistsByEmail(email);
    };

    // todo: this is business logic for employee, must move this to ffms-backend
    // check valid employee
    checkIfUserExistsByUserName = (userName) =>
    {
        return this.userSvc.checkIfUserExistsByUserName(userName);
    };

    // todo: this is business logic for employee, must move this to ffms-backend
    // check valid employee
    checkIfUserExistsByUserId = (userId) =>
    {
        // Not implement yet
    };

    countJobs = (guid, jobFilter) =>
    {
        let filter = {
            job_assignee_guid: guid,
            take: 0,
            skip: 0,
        };

        if (jobFilter)
        {
            filter = { ...filter, ...jobFilter };
        }

        return this.queryCount('jobs', filter, AuthHelper.getSystemHeader());
    };

    getJobs = (guid, statuses = []) =>
    {
        const strFilter = [
            `job_assignee_guid_sfacet:("${guid}")`,
            `job_status_id:(${statuses.join(' OR ')})`,
        ];
        
        const filters = {
            filterQuery: [strFilter.join(' AND ')],
            take: -1,
            skip: 0,
        };
        
        return this.queryData('jobs', filters).then((res) =>
        {
            if (res && res.data)
            {
                return res.data;
            }
        });
    };

    cancelJobs = async (username, clone = false) =>
    {
        // getJobs of current employee guid
        const filter = {
            id: username,
            clone: clone,
        };
        return this.http.post('/api/ffms/employees/cancelJobs', filter, AuthHelper.getSystemHeader());
    };

    employeeMatchStatus = (employee, inStatuses = [], ninStatuses = []) =>
    {
        if (employee)
        {
            inStatuses = inStatuses || [];
            ninStatuses = ninStatuses || [];
            let isValid = true;
            if (!inStatuses.length && !ninStatuses)
            {
                isValid = employee.employee_status == null;
            }
            else
            {
                if (inStatuses.length)
                {
                    isValid = inStatuses.indexOf(employee.employee_status) >= 0;
                }

                if (ninStatuses.length)
                {
                    isValid = isValid && ninStatuses.indexOf(employee.employee_status) === -1;
                }
            }
            return isValid;
        }
        return false;
    };
}
