import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class StreetViewService
{
    http = new HttpClient();

    getLinks = (nodeId) =>
    {
        return this.http.get(`/api/streetview/links/${nodeId}`, AuthHelper.getSystemHeader());
    };

    getId = (lngLat) =>
    {
        const { lng, lat } = lngLat;
        return this.http.get(`/api/streetview/id?lng=${lng}&lat=${lat}`, AuthHelper.getSystemHeader());
    };
}
