import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { SecurityHttpClient } from 'customs/SecurityHttpClient';

export class SystemLogsService
{
    http = new HttpClient();

    constructor(appStore)
    {
        this.securityHttp = new SecurityHttpClient(appStore);
    }

    gets = async ({ type, limit, skip }) =>
    {
        const param = new URLSearchParams();
        param.set('type', type);
        param.set('limit', limit);
        param.set('skip', skip);

        return await this.securityHttp.get(`/api/systemLogs/?${param.toString()}`, AuthHelper.getSystemHeader());
    };

    getCount = async (type) =>
    {
        const { data } = await this.securityHttp.get(`/api/systemLogs/count/?type=${type}`, AuthHelper.getSystemHeader());

        return data;
    }

}
