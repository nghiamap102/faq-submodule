import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class PlateDetectService
{
    http = new HttpClient();

    search(searchState)
    {
        return this.http.post('/api/plate-detection/search', searchState, AuthHelper.getSystemHeader());
    }

    getCameras(systemName = '')
    {
        return this.http.get(`/api/plate-detection/cameras?systemName=${systemName}`, AuthHelper.getSystemHeader());
    }

    getSystems()
    {
        return this.http.get('/api/plate-detection/systems', AuthHelper.getSystemHeader());
    }
}
