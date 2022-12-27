import HttpClient from 'helper/http.helper';
import { AuthHelper } from '../helper/auth.helper';

export class WatchListService
{
    http = new HttpClient();

    gets()
    {
        return this.http.get('/api/watchLists/gets', AuthHelper.getSystemHeader());
    }

    getByIds(ids)
    {
        return this.http.get(`/api/watchLists/getByIds?ids=${ids.join('&ids=')}`, AuthHelper.getSystemHeader());
    }

    add(watchList)
    {
        return this.http.post('/api/watchLists/add', watchList, AuthHelper.getSystemHeader());
    }

    edit(watchList)
    {
        return this.http.post('/api/watchLists/edit', watchList, AuthHelper.getSystemHeader());
    }

    delete(ids)
    {
        return this.http.post('/api/watchLists/delete', ids, AuthHelper.getSystemHeader());
    }
}
