import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class ActionPlanService
{
    http = new HttpClient();

    gets = () =>
    {
        return this.http.get('/api/actionPlans/gets', AuthHelper.getSystemHeader());
    };

    get = (actionPlanId) =>
    {
        return this.http.get(`/api/actionPlans/get?actionPlanId=${actionPlanId}`, AuthHelper.getSystemHeader());
    };

    start = (params) =>
    {
        return this.http.post('/api/actionPlans/start', params, AuthHelper.getSystemHeader());
    };

    processing = (params) =>
    {
        return this.http.post('/api/actionPlans/processing', params, AuthHelper.getSystemHeader());
    };

    executeCommand = (params) =>
    {
        return this.http.post('/api/actionPlans/execute-command', params, AuthHelper.getSystemHeader());
    };
}
