import HttpClient from 'helper/http.helper';
import { AppConstant } from 'constant/app-constant';
import { AuthHelper } from 'helper/auth.helper';

export default class PermissionService
{
    http = new HttpClient();
    apiURL = AppConstant.vdms.url;

    PERMISSION_LIST = {
        CREATE: 'AddNew',
        EDIT: 'Save',
        DELETE: 'Delete',
        VIEW: 'OpenMinor',
        SET_PERMISSION: 'SetPermissions',
    };

    canPerformAction = async (path, permission) =>
    {
        const body = {
            'path': path || '/root/vdms',
            'permission': permission || 'OpenMinor',
        };
        
        return this.http.post(`/api/vdms-api/v1/permission/me?path=${body.path}&permission=${body.permission}`, {}, AuthHelper.getVDMSHeader()).then((res) =>
        {
            if (!res || !res.status || !res.status.success || !res.data)
            {
                // console.log(`You do not have permission to ${permission} on ${path}.`);
            }
            return res && res.data;
        });
    };
}
