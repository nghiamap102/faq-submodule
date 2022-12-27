import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

export class PlateWatchListService
{
    http = new HttpClient();

    getAll()
    {
        return this.http.get('/api/plate-watch-lists', AuthHelper.getSystemHeader());
    }

    getByIds(ids)
    {
        return this.http.get(`/api/plate-watch-lists/?ids=${ids.join('&ids=')}`, AuthHelper.getSystemHeader());
    }

    add(watchList)
    {
        return this.http.post('/api/plate-watch-lists', watchList, AuthHelper.getSystemHeader());
    }

    edit(watchList)
    {
        const id = watchList.id;
        delete watchList.id;

        return this.http.put(`/api/plate-watch-lists/${id}`, watchList, AuthHelper.getSystemHeader());
    }

    delete(ids)
    {
        const requests = [];
        for (const id of ids)
        {
            requests.push(this.http.delete(`/api/plate-watch-lists/${id}`, AuthHelper.getSystemHeader()));
        }

        return Promise.all(requests);
    }
}
