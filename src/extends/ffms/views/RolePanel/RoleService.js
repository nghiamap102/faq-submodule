import HttpClient from 'helper/http.helper';

import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export default class RoleService
{
    http = new HttpClient();

    constructor()
    {
        this.dataPath = `/root/vdms/hethong/feature/ffms/${AppConstant.sysIdPlaceholder}`;
    }

    gets = (where = null) =>
    {
        const filter = where ? new URLSearchParams(where).toString() : null;
        if (filter)
        {
            return this.http.get(`/api/ffms/app-roles?${filter}`, AuthHelper.getVDMSHeader());
        }

        return this.http.get('/api/ffms/app-roles', AuthHelper.getVDMSHeader());
    };

    // search = (filter) =>
    // {
    //     const filterParams = new URLSearchParams(filter).toString();
    //     return this.http.get(`/api/ffms/app-roles?${filterParams}`, AuthHelper.getVDMSHeader());
    // };

    get = (roleName) =>
    {
        return this.http.get(`/api/ffms/app-roles/${roleName}`, AuthHelper.getVDMSHeader());
    };

    create = (role) =>
    {
        return this.http.post('/api/ffms/app-roles', role, AuthHelper.getVDMSHeader());
    }

    edit = (roleName, role) =>
    {
        return this.http.put(`/api/ffms/app-roles/${roleName}`, role, AuthHelper.getVDMSHeader());
    };

    delete = (roleName) =>
    {
        return this.http.delete(`/api/ffms/app-roles/${roleName}`, null, AuthHelper.getVDMSHeader());
    };

    getEmpRoles = (filter) =>
    {
        const filterParams = new URLSearchParams(filter).toString();
        return this.http.get(`/api/ffms/app-roles/roles?${filterParams}`, AuthHelper.getVDMSHeader());
    };

    addEmpRole = (roleName, accountNames) =>
    {
        return this.http.post(`/api/ffms/app-roles/${roleName}/accounts`, accountNames, AuthHelper.getVDMSHeader());
    }

    delEmpRole = (roleName, accountNames) =>
    {
        return this.http.post(`/api/ffms/app-roles/${roleName}/accounts/remove`, accountNames, AuthHelper.getVDMSHeader());
    }
    
    checkIfRoleExistsByName = (roleName) =>
    {
        return this.http.get(`/api/ffms/app-roles/${roleName}`, AuthHelper.getVDMSHeader()).then((res) =>
        {
            return res.data;
        });
    };
}
