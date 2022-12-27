import HttpClient from 'helper/http.helper';

export default class RoleService
{
    http = new HttpClient();

    getRoleAccount = (roleName, paging) =>
    {
        const searchQuery = new URLSearchParams(paging).toString();
        return this.http.get(`/api/ffms/app-roles/${roleName}/accounts?${searchQuery}`);
    }

    addAccountToRole = (roleName, accounts) =>
    {
        return this.http.post(`/api/ffms/app-roles/${roleName}/accounts`, accounts);
    }

    removeAccountToRole = (roleName, accounts) =>
    {
        return this.http.post(`/api/ffms/app-roles/${roleName}/accounts/remove`, accounts);
    }


    getRolePermission = (roleName, recursive = false, path = '') =>
    {
        const filter = { recursive, ...path && { path } };
        const query = new URLSearchParams(filter).toString();
        return this.http.get(`/api/ffms/app-roles/${roleName}/permissions?${query}`);
    }

    modifyPermission = (roleName, path, canAccess) =>
    {
        const body = { path, canAccess };
        return this.http.put(`/api/ffms/app-roles/${roleName}/permissions`, body);

    }

    getRolePermissionMe = (recursive = true, path = '') =>
    {
        const filter = { recursive, ...path && { path } };
        const query = new URLSearchParams(filter).toString();
        return this.http.get(`/api/ffms/app-roles/permissions/me?${query}`);
    }
}
