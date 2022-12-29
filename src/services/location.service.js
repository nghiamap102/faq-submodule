import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class LocationService
{
    http = new HttpClient();

    gets = () =>
    {
        return this.http.get('/api/locations/gets', AuthHelper.getSystemHeader());
    };

    get = (id) =>
    {
        return this.http.get(`/api/locations/get?id=${id}`, AuthHelper.getSystemHeader());
    };

    add = (location) =>
    {
        return this.http.post('/api/locations', location, AuthHelper.getSystemHeader());
    };

    getLocationDataByGeo = async (lng, lat) =>
    {
        return this.http.get(`/api/locations/get-data-by-geo?lng=${lng}&lat=${lat}`, AuthHelper.getSystemHeader());
    };
}
