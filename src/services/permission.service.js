import HttpClient from 'helper/http.helper';
import {AppConstant} from 'constant/app-constant';
import {AuthHelper} from 'helper/auth.helper';

export default class PermissionService {
    constructor(apiUrl) {
        this.apiURL = apiUrl || AppConstant.vdms.url
    }

    http = new HttpClient();
    apiURL = AppConstant.vdms.url;

    PERMISSION_LIST = {
        CREATE: 'AddNew',
        EDIT: 'Save',
        DELETE: 'Delete',
        VIEW: 'OpenMinor',
        SET_PERMISSION: 'SetPermission'
    };

    // TODO: CHANGE /api/v1/folder/HasPermissionByPath to /api/v1/permission/me?path={path}&permission={permission}
    canPerformAction = async (path, permission) => {
        const body = {
            'path': path || '/root/vdms',
            'permission': permission || 'OpenMinor'
        };

        return this.http.post(`${this.apiURL}/api/v1/folder/HasPermissionByPath`, body, AuthHelper.getVDMSHeader()).then((res) => {
            if (!res || !res.status || !res.status.success) {
                // console.log(`You do not have permission to ${permission} on ${path}.`);
            }
            return res && res.status && res.status.success;
        });
    };

    canAccess = (path, permission) => {
        const body = {
            'path': path || '/root/vdms',
            'permission': permission || 'OpenMinor'
        };

        return this.http.post(`${this.apiURL}/api/v1/folder/HasPermissionByPath`, body, AuthHelper.getVDMSHeader()).then((res) => {
            if (!res || !res.status || !res.status.success) {
                // console.log(`You do not have permission to ${permission} on ${path}.`);
            }
            return res && res.status && res.status.success;
        });
    };
    me = async () => {
        return await this.http.get(`${this.apiURL}/api/v1/users/me`, AuthHelper.getVDMSHeader());

    };
    cointainsUser = async (userName) => {
        return await this.http.get(`${this.apiURL}/api/v1/group/ou/cointainsuser/?userName=${userName}`, AuthHelper.getVDMSHeader());

    }
}
