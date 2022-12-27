import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class DashboardService
{
    http = new HttpClient();
    countAll = () =>
    {
        return this.http.get('/api/dashboards/count-all', AuthHelper.getSystemHeader());
    };
}
