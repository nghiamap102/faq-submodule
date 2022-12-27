import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class GeneralDetectionService
{
    http = new HttpClient();

    search(searchState)
    {
        return this.http.post('/api/general-detection/search', searchState, AuthHelper.getSystemHeader());
    }

    getById(id)
    {
        return this.http.get(`/api/general-detection/get/by-id?id=${id}`, AuthHelper.getSystemHeader());
    }

    getCameras(systemName = '')
    {
        return this.http.get(`/api/general-detection/cameras?systemName=${systemName}`, AuthHelper.getSystemHeader());
    }

    getSystems()
    {
        return this.http.get('/api/general-detection/systems', AuthHelper.getSystemHeader());
    }

    getMetaData()
    {
        return this.http.get('/api/general-detection/metadata', AuthHelper.getSystemHeader());
    }
}
