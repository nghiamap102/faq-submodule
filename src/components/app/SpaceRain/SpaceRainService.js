import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class SpaceRainService
{
    http = new HttpClient();

    search = (searchState) =>
    {
        return this.http.post('/api/spacerain/search', searchState, AuthHelper.getSystemHeader());
    };
}
