import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export default class EmailService
{
    http = new HttpClient();
    apiURL = AppConstant.vdms.url;
    authURL = '/api/auth';

    checkEmailConfig = () =>
    {
        return this.http.get('/api/ffms/email', AuthHelper.getVDMSHeader());
    }
    
    sendEmail = (data) =>
    {
        return this.http.post('/api/ffms/email', data, AuthHelper.getVDMSHeader());
    }
}
