import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export default class OrganizationService
{
    http = new HttpClient();

    gets = () =>
    {
        return this.http.get('/api/ffms/organizations', AuthHelper.getVDMSHeader());
    };

    get = (orgGuid) =>
    {
        return this.http.get(`/api/ffms/organizations/${orgGuid}`, AuthHelper.getVDMSHeader());
    };

    create = (orgObj) => {
        return this.http.post(`/api/ffms/organizations`, orgObj, AuthHelper.getVDMSHeader());
    }
}
