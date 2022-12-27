import HttpClient from 'helper/http.helper';

export default class TenantService
{
    http = new HttpClient();

    getTenant()
    {
        return this.http.get('/api/tenant');
    }
}
