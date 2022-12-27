import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { SpinnerHttpClient } from 'customs/SpinnerHttpClient';

export class PlateAlertService
{
    http = new HttpClient();

    constructor(appStore)
    {
        this.spinnerHttp = new SpinnerHttpClient(appStore);
    }

    search(searchState)
    {
        return this.http.post('/api/plate-galleries/search', searchState, AuthHelper.getSystemHeader());
    }

    add(gallery)
    {
        return this.spinnerHttp.post('/api/plate-galleries', gallery, AuthHelper.getSystemHeader());
    }

    edit(gallery)
    {
        const id = gallery.id;
        delete gallery.id;

        return this.spinnerHttp.put(`/api/plate-galleries/${id}`, gallery, AuthHelper.getSystemHeader());
    }

    delete(galleryIds)
    {
        const requests = [];
        for (const id of galleryIds)
        {
            requests.push(this.spinnerHttp.delete(`/api/plate-galleries/${id}`, AuthHelper.getSystemHeader()));
        }

        return Promise.all(requests);
    }

    addOrUpdatePlateGalleryWatchList(watchList)
    {
        return this.http.post('/api/plate-galleries/watch-list/add-or-update', watchList, AuthHelper.getSystemHeader());
    }

    deletePlateGalleryWatchList(watchList)
    {
        return this.http.delete('/api/plate-galleries/watch-list/delete', watchList, AuthHelper.getSystemHeader());
    }
}
