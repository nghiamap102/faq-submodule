import { decorate, observable, action } from 'mobx';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import EmployeeService from 'extends/ffms/services/EmployeeService';
import UserService from 'extends/ffms/services/UserService';
import PermissionService from 'extends/ffms/services/PermissionService';
import { CommonHelper } from 'helper/common.helper';
import _findIndex from 'lodash/findIndex';
import RoleService from 'extends/ffms/views/RolePanel/RoleService';


export class RoleStore
{
    appStore = null;
    roles = [];
    currentRole = {};
    empRoles = [];

    filterState = {};
    searchKey = '';
    totalItem = 0;
    pageSize = 20;
    currentPage = 1;
    sorters = undefined;
    isLoading = false;

    path = '/root/ims/vbd/users';
    currentAcc = null;
    userSvc = new UserService();
    permissionSvc = new PermissionService();

    rolSvc = new RoleService();

    urlParams = {};
    isShowForm = false;
    isEdit = false;
    isDel = false;
    formAction = 'create'; // create, update

    isDrawer = false;
    isBasicRoles = [];

    constructor(fieldForceStore)
    {
        this.appStore = fieldForceStore?.appStore;
        this.i18n = fieldForceStore?.appStore?.contexts?.i18n;
        this.modalContext = fieldForceStore?.appStore?.contexts?.modal;

        this.comSvc = fieldForceStore.comSvc;
        this.empSvc = new EmployeeService(fieldForceStore?.appStore?.contexts);

        this.rolSvc = new RoleService(fieldForceStore?.appStore?.contexts);

        this.roles = [];
        this.empRoles = [];

        this.isShowForm = false;
        this.isEdit = false;
        this.formAction = 'create';
        this.isBasicRoles = ['Admin', 'RoleManager'];

        this.resetFilterState();

    }

    getData = (filter) =>
    {
        const filterState = filter ? filter : this.getFullFilterState();
        return this.rolSvc.gets(filterState).then((result) =>
        {
            return result.data;
        });
    };

    setData = (data, isAppend) =>
    {
        if (isAppend)
        {
            this.roles = this.roles.concat(data);
        }
        else
        {
            this.roles = data;
        }
    };

    resetData = () =>
    {
        this.roles = [];
    };

    getDataDebounced = new AwesomeDebouncePromise(this.getData.bind(this), 300);

    setFilterState = (key, value) =>
    {
        this.filterState[key] = value;
    };

    resetFilterState = () =>
    {
        this.filterState = {};
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
                    case 'searchKey':
                        filterState[key] = `${value}`;
                        break;
                    default:
                        filterState[key] = value;
                        break;
                }
            }
        }
        filterState.skip = (this.currentPage - 1) * this.pageSize;
        filterState.take = this.pageSize;

        return filterState;
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

    getDataCount = (filter) =>
    {
        // todo
    }

    bindRoleData = async (data) =>
    {
        if (data && data.Name)
        {
            // update on grid
            const rs = await this.rolSvc.get(data.Name);

            if (rs && rs.data)
            {
                const findPos = _findIndex(this.roles, (r) => r.Name === data.Name);
                this.roles[findPos] = rs.data;
                return rs.data;
            }
        }
        return data;
    }

    add = (roleObj) =>
    {
        const sendRole = Object.assign({}, roleObj);

        if (sendRole.role_name)
        {
            return this.rolSvc.create(sendRole).then((rs) =>
            {
                if (rs.result === -1)
                {
                    this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Không thêm được vai trò')}${rs.message ? '\n' + rs.message : ''}`, timeout: 5000 });
                }
                else if (rs)
                {
                    // add new item to grid, remove last item of array
                    const data = rs.data;
                    this.roles = [data, ...this.roles];

                    if (this.roles.length > this.pageSize)
                    {
                        this.roles.pop();
                    }

                    return this.bindRoleData(data);
                }
                return rs.data;
            });
        }
    }

    edit = (roleName, roleObj) =>
    {
        return this.rolSvc.edit(roleName, roleObj).then((rs) =>
        {
            if (rs.result === -1)
            {
                this.modalContext.toast({ type: 'error', message: `${this.i18n.t('Cập nhật vai trò thất bại')}${rs.message ? '\n' + rs.message : ''}` });
            }
            else if (rs)
            {
                return this.bindRoleData(rs.data);
            }
            return rs.data;
        });
    };

    delete = (roleName) =>
    {
        return this.rolSvc.delete(roleName).then((res) =>
        {
            if (res && res.result === 0)
            {
                const findPos = _findIndex(this.roles, (r) => r.Name === roleName);
                this.roles.splice(findPos, 1);
                this.modalContext.toast({ type: 'success', message: 'Xóa thành công', timeout: 3000 });
            }
            else
            {
                this.modalContext.toast({ type: 'error', message: res.message || 'Không xóa được vai trò', timeout: 5000 });
            }
            return res;
        });
    };

    setEdit = (roleStt) =>
    {
        this.isEdit = roleStt;
    };

    setRole = (role = {}) =>
    {
        this.currentRole = role;
    };

    getRoleData = async (roleName) =>
    {
        const res = await this.rolSvc.get(roleName);
        if (res && res.data)
        {
            return res.data;
        }
    };

    setPaging = (page, size = 20) =>
    {
        this.currentPage = page;
        this.pageSize = size;
    };

    setSorters = (columns) =>
    {
        if (columns)
        {
            this.sorters = columns;
        }
    };

    setLoading = (isLoading) =>
    {
        this.isLoading = isLoading;
    };

    setFormAction = (isShowForm, action) =>
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

    // Roles for Employee
    getDataRoleEmployee = (userName) =>
    {
        const filter = {
            account: userName,
            skip: 0,
            take: -1,
        };

        return this.rolSvc.getEmpRoles(filter).then((result) =>
        {
            if (result && result.data)
            {
                return result.data.Roles;
            }
        });
    };

    setDataRoleEmp = (data) =>
    {
        this.empRoles = data || [];
    };

    addEmployeeToRole = (roleName, userName) =>
    {
        const accounts = userName.split();

        return this.rolSvc.addEmpRole(roleName, accounts).then((res) =>
        {
            if (res.result == -1)
            {
                this.modalContext.toast({ type: 'error', message: res.errorMessage || 'Không thêm được được vai trò', timeout: 5000 });
            }
            else
            {
                // this.modalContext.toast({ type: 'success', message: res.message, timeout: 3000 });
            }

            return res;
        });
    }

    deleteEmployeeRole = (roleName, userName) =>
    {
        const accounts = userName.split();

        return this.rolSvc.delEmpRole(roleName, accounts).then((res) =>
        {
            if (res.result == -1)
            {
                this.modalContext.toast({ type: 'error', message: res.errorMessage || res.message || 'Tác vụ không thể được thực hiện', timeout: 5000 });
            }

            return res;
        });
    };

    setDrawer = (isDrawer) =>
    {
        if (isDrawer !== undefined)
        {
            this.isDrawer = isDrawer;
        }
    };

    checkRoleExists = async (value) =>
    {
        const result = await this.rolSvc.checkIfRoleExistsByName(value);
        return result ? true : false;
    };
}

decorate(RoleStore, {
    roles: observable,
    getData: action,
    setData: action,
    getDataCount: action,
    resetData: action,

    empRoles: observable,
    getDataRoleEmployee: action,
    setDataRoleEmp: action,
    addEmployeeToRole: action,
    deleteEmployeeRole: action,

    filterState: observable,
    setFilterState: action,
    resetFilterState: action,
    getFullFilterState: action,
    setAllFilterState: action,

    searchKey: observable,
    totalItem: observable,
    pageSize: observable,
    currentPage: observable,
    setPaging: action,
    isLoading: observable,
    setLoading: action,
    sorters: observable,
    setSorters: action,

    bindRoleData: action,
    add: action,
    edit: action,
    delete: action,
    setRole: action,
    setEdit: action,
    getRoleData: action,

    isShowForm: observable,
    isEdit: observable,
    isDel: observable,
    formAction: observable,
    setFormAction: action,
    checkRoleExists: action,

    isDrawer: observable,
    setDrawer: action,
    isBasicRoles: observable,
});
