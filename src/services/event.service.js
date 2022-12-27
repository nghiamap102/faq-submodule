import { AuthHelper } from 'helper/auth.helper';
import { SecurityHttpClient } from 'customs/SecurityHttpClient';

export class EventService
{

    constructor(appStore)
    {
        this.securityHttp = new SecurityHttpClient(appStore);
    }

    gets = (skip = 0, limit = 20) =>
    {
        return this.securityHttp.get(`/api/eventMessages/gets?skip=${skip}&limit=${limit}`, AuthHelper.getSystemHeader());
    };

    del = (id) =>
    {
        return this.securityHttp.post('/api/eventMessages/del', { id }, AuthHelper.getSystemHeader());
    };
}
