import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export default class ActivityLogService
{
    http = new HttpClient();

    gets = (where = null) =>
    {
        const filter = where ? { where } : null;
        if (filter)
        {
            return this.http.get(`/api/ffms/activity-logs?filter=${encodeURIComponent(JSON.stringify(filter))}`, AuthHelper.getVDMSHeader());
        }

        return this.http.get('/api/ffms/activity-logs', AuthHelper.getVDMSHeader());
    };

    get = (logjobGuid) =>
    {
        return this.http.get(
            `/api/ffms/activity-logs/${logjobGuid}`,
            AuthHelper.getVDMSHeader()
        );
    };

    create = (logjobObj) =>
    {
        return this.http.post(
            '/api/ffms/activity-logs',
            logjobObj,
            AuthHelper.getVDMSHeader()
        );
    };

    edit = (logjobGuid, logjobObj) =>
    {
        return this.http.put(
            `/api/ffms/activity-logs/${logjobGuid}`,
            logjobObj,
            AuthHelper.getVDMSHeader()
        );
    };

    delete = (logjobGuid) =>
    {
        return this.http.delete(
            `/api/ffms/activity-logs/${logjobGuid}`, {},
            AuthHelper.getVDMSHeader()
        );
    };
}
