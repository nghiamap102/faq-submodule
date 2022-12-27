import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export default class TeamService
{
    http = new HttpClient();

    gets = (where = null) =>
    {
        const filter = where ? { where } : null;
        if (filter)
        {
            return this.http.get(`/api/ffms/teams?filter=${encodeURIComponent(JSON.stringify(filter))}`, AuthHelper.getVDMSHeader());
        }

        return this.http.get('/api/ffms/teams', AuthHelper.getVDMSHeader());
    };

    get = (guid) =>
    {
        return this.http.get(`/api/ffms/teams/${guid}`, AuthHelper.getVDMSHeader());
    };

    create = (obj) =>
    {
        return this.http.post('/api/ffms/teams', obj, AuthHelper.getVDMSHeader());
    };

    edit = (guid, obj) =>
    {
        return this.http.put(`/api/ffms/teams/${guid}`, obj, AuthHelper.getVDMSHeader());
    };

    delete = (guid) =>
    {
        return this.http.delete(`/api/ffms/teams/${guid}`, null, AuthHelper.getVDMSHeader());
    }
}
