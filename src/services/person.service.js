import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class PersonService
{
    http = new HttpClient();
    gets = () =>
    {
        return this.http.get('/api/people/gets', AuthHelper.getSystemHeader());
    };
    get = (id) =>
    {
        return this.http.get(`/api/people/get?id=${id}`, AuthHelper.getSystemHeader());
    };
}
