import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class LocationService
{
    http = new HttpClient();

    gets = () =>
    {
        return this.http.get('/api/locations/gets', AuthHelper.getVDMSHeader());
    };

    get = (id) =>
    {
        return this.http.get(`/api/locations/get?id=${id}`, AuthHelper.getVDMSHeader());
    };

    add = (location) =>
    {
        return this.http.post('/api/locations', location, AuthHelper.getVDMSHeader());
    };

    getLocationDataByGeo = async (lng, lat) =>
    {
        return this.http.get(`/api/locations/get-data-by-geo?lng=${lng}&lat=${lat}`, AuthHelper.getVDMSHeader());
    };
}
