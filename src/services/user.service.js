import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class UserService
{
    http = new HttpClient();

    get = (id) =>
    {
        return this.http.get(`/api/users/${id}`, AuthHelper.getSystemHeader());
    };

    getAll = () =>
    {
        return this.http.get('/api/users', AuthHelper.getSystemHeader());
    };

    grant = (id, role) =>
    {
        return this.http.post('/api/users/grant', { id, role }, AuthHelper.getSystemHeader());
    };

    revoke = (id, role) =>
    {
        return this.http.post('/api/users/revoke', { id, role }, AuthHelper.getSystemHeader());
    };
}
