import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class SketchMapService
{
    http = new HttpClient();

    get = () =>
    {
        return this.http.get('/api/sketchmaps/get', AuthHelper.getSystemHeader());
    };

    commit = (data, code) =>
    {
        return this.http.post('/api/sketchmaps/commit', { data, code }, AuthHelper.getSystemHeader());
    };
}
