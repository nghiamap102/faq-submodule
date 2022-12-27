import HttpClient from 'helper/http.helper';

export class AuthService
{
    http = new HttpClient();

    getProfile = () =>
    {
        return this.http.get('/api/user/profile');
    };
    getPublicAccessToken = () =>
    {
        return this.http.get('/api/auth/public-access-token');
    };
    refreshToken = () =>
    {
        return this.http.post('/api/auth/refresh-token', { "refreshToken": localStorage.getItem("refresh-token") });
    }
}
