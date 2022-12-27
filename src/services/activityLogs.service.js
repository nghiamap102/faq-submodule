import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { SecurityHttpClient } from 'customs/SecurityHttpClient';

export default class ActivityLogsService
{
    http = new HttpClient();

    constructor (appStore)
    {
        this.securityHttp = new SecurityHttpClient(appStore);
    }

    getLoopbackModels = () =>
    {
        return this.securityHttp.get(
            '/api/activityLogs/get-loopback-models'
            , AuthHelper.getSystemHeader());
    };

    gets = (queryObject = {}) =>
    {
        const body = {
            limit: queryObject?.limit || 0,
            skip: queryObject?.skip || 0,
            where: queryObject?.where || {}
        };

        return this.securityHttp.get(
            `/api/activityLogs/gets?limit=${body.limit}&skip=${body.skip}&where=${JSON.stringify(body.where)}`
            , AuthHelper.getSystemHeader());
    };
}
