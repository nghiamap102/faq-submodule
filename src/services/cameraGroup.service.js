import HttpClient from 'helper/http.helper';
import { AuthHelper } from '../helper/auth.helper';

export class CameraGroupService
{
    http = new HttpClient();

    gets()
    {
        return this.http.get('/api/cameraGroups/gets', AuthHelper.getSystemHeader());
    }

    add(cameraGroup)
    {
        return this.http.post('/api/cameraGroups/add', cameraGroup, AuthHelper.getSystemHeader());
    }

    edit(cameraGroup)
    {
        return this.http.post('/api/cameraGroups/edit', cameraGroup, AuthHelper.getSystemHeader());
    }

    delete(ids)
    {
        return this.http.post('/api/cameraGroups/delete', ids, AuthHelper.getSystemHeader());
    }
}
