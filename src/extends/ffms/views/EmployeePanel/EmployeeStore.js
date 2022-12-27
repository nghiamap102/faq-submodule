import EmployeeService from 'extends/ffms/services/EmployeeService';
import { decorate, observable, action } from 'mobx';
import _findIndex from 'lodash/findIndex';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import UserService from 'extends/ffms/services/UserService';
import PermissionService from 'extends/ffms/services/PermissionService';
import DataEnum from 'extends/ffms/constant/ffms-enum';
import { CommonHelper } from 'helper/common.helper';

export class EmployeeStore
{
    LAYER_NAME = 'EMPLOYEE';
    properties = []; // Employee properties
    appStore = null;
    employees = [];
    totalCount = 0;
    teams = [];
    currentFilter = {};
    currentEmp = {};
    isShow = false;
    isShowForm = false;
    isEdit = false;
    isDel = false;
    searchKey = '';

    path = '/root/ims/vbd/users';
    currentAcc = null;
    userSvc = new UserService();
    permissionSvc = new PermissionService();

    data = undefined;
    totalItem = 0;
    pageSize = 20;
    currentPage = 1;
    sorters = undefined;
    isLoading = false;
    isDownloading = false;
    filterState = {};
    formAction = 'create'; // create, update
    urlParams = {}; // save the search params when switch tabs, do not observable it
    
    unassignDone = false;
    disableDone = false;
    disableCurrentStep = 0;

    constructor(fieldForceStore)
    {
        this.appStore = fieldForceStore?.appStore;
        this.i18n = fieldForceStore?.appStore?.contexts?.i18n;
        this.modalContext = fieldForceStore?.appStore?.contexts?.modal;
        
        this.comSvc = fieldForceStore.comSvc;
        this.empSvc = new EmployeeService(fieldForceStore?.appStore?.contexts);

        this.isShow = false;
        this.isShowForm = false;
        this.isEdit = false;
        this.employees = [];
        this.teams = [];
        this.unassignDone = false;
        this.disableDone = false;

        this.currentAcc = {
            password: '',
            confirmPassword: '',
        };
        this.formAction = 'create';
        this.resetFilterState();
        
        const { CREATE, EDIT } = this.permissionSvc.PERMISSION_LIST;
        this.permissionSvc.canPerformAction(this.empSvc.accountPath, CREATE).then((permission) =>
        {
            this.canCreateAccount = permission;
        });
        this.permissionSvc.canPerformAction(this.empSvc.accountPath, EDIT).then((permission) =>
        {
            this.canModifyAccount = permission;
        });
    }

    getEmployee = async (nodeId) =>
    {
        if (nodeId)
        {
            const data = await this.empSvc.getData(nodeId);
            return data;
        }
    };

    setFormState = (isShowForm, action) =>
    {
        if (isShowForm !== undefined)
        {
            this.isShowForm = isShowForm;
        }

        if (action !== undefined)
        {
            this.formAction = action;
        }
    };

    setFilterState = (key, value) =>
    {
        this.filterState[key] = value;
    };

    setAllFilterState = (filter = {}, isReplace) =>
    {
        if (isReplace)
        {
            this.filterState = filter;
        }
        else
        {
            for (const key in filter)
            {
                if (filter.hasOwnProperty(key))
                {
                    this.filterState[key] = filter[key];
                }
            }
        }
    };
    resetFilterState = (searchKey) =>
    {
        const filterState = {
            Title: '',
            searchKey: searchKey,
            employee_full_name: '',
            employee_username: '',
            employee_phone: '',
            employee_email: '',
            employee_status: [],
            employee_organization_id: [],
            employee_team_id: [],
            employee_type_id: [],
        };
        this.filterState = filterState;
    };

    getFullFilterState = () =>
    {
        const filterState = {};

        for (const key in this.filterState)
        {
            const value = this.filterState[key];
            if (value && (!Array.isArray(value) || value.length > 0))
            {
                switch (key)
                {
                    case 'Title':
                        filterState[key] = { like: `${value}` };
                        break;
                    case 'employee_full_name':
                    case 'employee_username':
                    case 'employee_phone':
                    case 'employee_email':
                        filterState[key] = { like: `${value}` };
                        break;
                    case 'searchKey':
                        filterState[key] = `${value}`;
                        break;
                    case 'employee_status':
                    case 'employee_type_id':
                    case 'employee_team_id':
                    case 'employee_organization_id':
                        filterState[key] = Array.isArray(value) && value.length === 1 ? value[0] : { inq: value };
                        break;
                    default:
                        filterState[key] = value;
                        break;
                }
            }
        }
        filterState.skip = (this.currentPage - 1) * this.pageSize;
        filterState.take = this.pageSize;

        if (this.sorters)
        {
            const fields = this.properties ? CommonHelper.toDictionary(this.properties, 'ColumnName', 'sortId') : {};
            const sorters = this.sorters.filter((x) => x.id && x.direction).map((col) =>
            {
                return {
                    Field: fields[col.id] ? fields[col.id] : col.id,
                    Direction: col.direction.toUpperCase(),
                };
            });

            filterState.sortBy = sorters;
        }
        else
        {
            delete filterState.sortBy;
        }

        filterState['includeRelations'] = false;

        return filterState;
    };

    getData = (filter, updateCount) =>
    {
        const filterState = filter ? filter : this.getFullFilterState();

        return this.empSvc.search(filterState).then((result) =>
        {
            if (updateCount)
            {
                this.totalItem = result.total;
            }

            return result.data;
        });
    };

    getDataDebounced = new AwesomeDebouncePromise(this.getData.bind(this), 300);

    setData = (data) =>
    {
        this.employees = data || [];
    };

    getDataCount = (filter) =>
    {
        const filterState = filter ? filter : this.getFullFilterState();
        delete filterState.includeRelations;
        delete filterState.skip;
        delete filterState.take;

        this.comSvc.queryCount('employees', filterState).then((total) =>
        {
            this.totalItem = total;
        });
    }

    togglePanel = () =>
    {
        this.isShow = !this.isShow;
    };

    toggleDel = () =>
    {
        this.isDel = !this.isDel;
    };

    setEdit = (editStt) =>
    {
        this.isEdit = editStt;
    };

    setEmp = (emp = {}) =>
    {
        this.currentEmp = emp;
    };

    getEmp = (emp) =>
    {
        this.currentEmp = emp;
    };

    changeAttr = (attr, value) =>
    {
        if (!this.currentEmp)
        {
            this.currentEmp = {};
        }
        this.currentEmp[attr] = value;
    };

    add = (empObj) =>
    {
        const sendEmp = Object.assign({}, empObj);
        sendEmp['Title'] = sendEmp['employee_full_name'];
        if (sendEmp.Title)
        {
            return this.empSvc.create(sendEmp).then((data) =>
            {
                if (data.status && data?.status?.success === false)
                {
                    this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Không thêm được nhân viên')}${data.status.message ? '\n' + data.status.message : ''}`, timeout: 5000 });
                }
                else if (data.result && data.result === -1)
                {
                    return { errorMessage: data.errorMessage, details: data.errorDetails };
                }
                else if (data)
                {
                    sendEmp.__secretKey = CommonHelper.uuid();
                    // add new item to grid, remove last item of array
                    this.employees = [sendEmp, ...this.employees];
                    if (this.employees.length > this.pageSize)
                    {
                        this.employees.pop();
                    }

                    data.__secretKey = sendEmp.__secretKey;
                    data.employee_status = data.employee_status || DataEnum.EMPLOYEE_STATUS.new;
                    this.getDataCount();

                    return this.bindEmployeeData(data);
                }
                delete data.__secretKey;
                return data;
            });
        }
        else
        {
            this.modalContext.toast({ type: 'error', message: 'Thông tin nhập liệu chưa đầy đủ', timeout: 5000 });
        }
    };

    delete = (empId) =>
    {
        const findPos = _findIndex(this.employees, (j) => j.employee_guid === empId);
        this.employees.splice(findPos, 1);

        return this.empSvc.delete(empId).then((res) =>
        {
            if (res && res.count > 0)
            {
                this.getDataCount();
                // this.modalContext.toast({ type: 'success', message: 'Xóa thành công' });
            }
            else
            {
                this.modalContext.toast({ type: 'error', message: res.errorMessage || 'Không xóa được nhân viên', timeout: 5000 });
            }
            return res;
        });
    };

    edit = (empId, empObj) =>
    {
        return this.empSvc.edit(empId, empObj).then((data) =>
        {
            if (data.status && data.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Cập nhật nhân viên thất bại')}${data.status.message ? '\n' + data.status.message : ''}` });
            }
            else if (data.result && data.result === -1)
            {
                return { errorMessage: data.errorMessage, details: data.errorDetails };
            }
            else if (data)
            {
                return this.bindEmployeeData(data);
            }
            return data;
        });
    };

    bindEmployeeData = async (empData) =>
    {
        if (empData && empData.employee_guid)
        {
            // update employee on grid
            const rs = await this.getData({ skip: 0, take: 1, employee_guid: empData.employee_guid, includeRelations: true });

            const data = rs && rs.length ? rs[0] : undefined;
            if (data)
            {
                const findPos = _findIndex(this.employees, (e) => e.employee_guid === empData.employee_guid || e.__secretKey === empData.__secretKey);
                this.employees[findPos] = data;
            }

            // update employee on form
            if (empData.Id || (data && data.Id))
            {
                const employee = await this.comSvc.getRawData(this.LAYER_NAME, empData.Id || data.Id).then((rs) => rs && rs.length ? rs[0] : rs);
                this.setEmp(employee);
                return employee;
            }
            return data || empData;
        }
        return empData;
    };

    // setPaging new by employee search API employees/search
    setPaging = (page, size = 20) =>
    {
        this.currentPage = page;
        this.pageSize = size;
    };

    createAccount = (employee, password) =>
    {
        return this.empSvc.createAccount(
            employee, { username: employee.employee_username, password: password },
        ).then((data) =>
        {
            if (data.status && data.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Tài khoản \'%0%\' không tạo được', [employee.employee_username])}. ${this.i18n.t('Chi tiết')}: ${this.i18n.t(data.status.message)}}`, timeout: 5000 });
            }
            else if (data)
            {
                if (data.errorMessage)
                {
                    this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Tài khoản \'%0%\' không tạo được', [employee.employee_username])}. ${this.i18n.t('Chi tiết')}: ${this.i18n.t(data.errorMessage)}}`, timeout: 5000 });
                }
                else
                {
                    this.modalContext.toast({ type: 'success', message: 'Thêm tài khoản mới thành công' });
                    return this.bindEmployeeData(data);
                }
            }
            return null;
        });
    };

    setActivate = (employee) =>
    {
        return this.empSvc.setActivated(employee).then((data) =>
        {
            if (data.status && data.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: data.status.message || 'Kích hoạt tài khoản thất bại', timeout: 5000 });
            }
            else if (data)
            {
                this.modalContext.toast({ type: 'success', message: 'Tài khoản đã kích hoạt' });
                return this.bindEmployeeData(data);
            }
            return false;
        });
    };

    setDisable = async (employee) =>
    {
        return this.empSvc.setDisable(employee).then(async (data) =>
        {
            if (data.status && data.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Không thể vô hiệu hóa nhân viên')}${data.status.message ? '\n' + data.status.message : ''}`, timeout: 5000 });
            }
            else if (data)
            {
                this.modalContext.toast({ type: 'success', message: 'Nhân viên đã bị vô hiệu hóa' });
                return this.bindEmployeeData(data);
            }
            return false;
        });
    };

    setEnable = (employee) =>
    {
        return this.empSvc.setEnable(employee).then((data) =>
        {
            if (data.status && data.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Không thể kích hoạt nhân viên')}${data.status.message ? '\n' + data.status.message : ''}`, timeout: 5000 });
            }
            else if (data)
            {
                this.modalContext.toast({ type: 'success', message: 'Nhân viên đã được kích hoạt' });
                return this.bindEmployeeData(data);
            }
            return false;
        });
    };

    resetPassword = async (employee, setPassword) =>
    {
        return this.empSvc.resetPassword(employee, setPassword).then((data) =>
        {

            if (data.status && data.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Đặt lại mật khẩu thất bại')}${data.status.message ? '\n' + data.status.message : ''}`, timeout: 5000 });
            }
            else if (data)
            {
                this.modalContext.toast({ type: 'success', message: 'Mật khẩu đã được đặt lại thành công' });
            }
            return data;
        });
    };

    setSorters = (columns) =>
    {
        if (columns)
        {
            this.sorters = columns;
        }
    };

    checkEmailExist = async (value, exceptIds) =>
    {
        const filter = {
            employee_email: value,
            // employee_status: { inq: [parseInt(DataEnum.EMPLOYEE_STATUS.new), parseInt(DataEnum.EMPLOYEE_STATUS.inactive), parseInt(DataEnum.EMPLOYEE_STATUS.active)] },
            includeRelations: false,
            skip: 0,
            take: 0,
        };

        if (exceptIds && exceptIds.length)
        {
            filter.employee_guid = { nin: exceptIds };
        }

        const queries = [
            this.empSvc.count(filter),
            this.empSvc.checkIfUserExistsByEmail(value),
        ];
        const results = await Promise.allSettled(queries);
        let existed = false;

        results.forEach((result, index) =>
        {
            if (result && result.status === 'fulfilled' && result.value)
            {
                if (index === 0 && result.value > 0)
                {
                    existed = true;
                }
                else if (result.value.UserName)
                {
                    existed = true;
                }
            }
        });
        return existed;
    };

    checkPhoneExist = async (value, exceptIds) =>
    {
        const filter = {
            employee_phone: value,
            // employee_status: { inq: [DataEnum.EMPLOYEE_STATUS.new, DataEnum.EMPLOYEE_STATUS.inactive, DataEnum.EMPLOYEE_STATUS.active] },
            includeRelations: false,
            skip: 0,
            take: 0,
        };

        if (exceptIds && exceptIds.length)
        {
            filter.employee_guid = { nin: exceptIds };
        }

        const result = await this.empSvc.count(filter);

        if (result > 0)
        {
            return true;
        }
        return false;
    };

    checkUserExist = async (value) =>
    {
        const result = await this.empSvc.checkIfUserExistsByUserName(value);
        return result ? true : false;
    };

    setLoading = (isLoading) =>
    {
        this.isLoading = isLoading;
    };

    setDownloading = (isDownloading) =>
    {
        this.isDownloading = isDownloading;
    };

    setUnassignDone = (unassignDone) =>
    {
        this.unassignDone = unassignDone;
    };
    
    setDisableDone = (disableDone) =>
    {
        this.disableDone = disableDone;
    };

    setDisableEmployeeStep = (step) =>
    {
        this.disableCurrentStep = step;
    }
}

decorate(EmployeeStore, {
    employees: observable,
    currentEmp: observable,
    isShow: observable,
    isShowForm: observable,
    formAction: observable,
    isEdit: observable,
    isDel: observable,
    setEdit: action,
    setEmp: action,
    getEmp: action,
    togglePanel: action,
    toggleDel: action,
    changeAttr: action,
    add: action,
    edit: action,
    delete: action,
    addUser: action,
    currentAcc: observable,
    bindEmployeeData: action,
    totalCount: observable,
    isLoading: observable,
    isDownloading: observable,
    setLoading: action,

    filterState: observable,
    setFilterState: action,
    resetFilterState: action,
    getFullFilterState: action,
    setAllFilterState: action,

    totalItem: observable,
    pageSize: observable,
    currentPage: observable,
    data: observable,
    setPaging: action,
    setFormState: action,

    getData: action,
    setData: action,
    setSorters: action,
    checkEmailExist: action,
    checkPhoneExist: action,
    checkUserExist: action,

    canCreateAccount: observable,
    canModifyAccount: observable,
    unassignDone: observable,
    disableDone: observable,
    setUnassignDone: action,
    setDisableDone: action,

    disableCurrentStep: observable,
    setDisableEmployeeStep: action,
});
