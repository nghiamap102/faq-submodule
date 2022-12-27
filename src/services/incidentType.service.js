import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class IncidentTypeService
{
    http = new HttpClient();

    gets = () =>
    {
        return this.http.get('/api/incidenttypes/gets', AuthHelper.getSystemHeader());
    };
    get = (id) =>
    {
        return this.http.get(`/api/incidenttypes/get?id=${id}`, AuthHelper.getSystemHeader());
    };
}
