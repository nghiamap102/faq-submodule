import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { SpinnerHttpClient } from 'customs/SpinnerHttpClient';

export class FaceAlertService
{
    http = new HttpClient();

    constructor(appStore)
    {
        this.spinnerHttp = new SpinnerHttpClient(appStore);
    }

    detectSearch(searchState)
    {
        return this.http.post('/api/faceDetectMessages/search', searchState, AuthHelper.getSystemHeader());
    }

    deleteDetect(deleteData)
    {
        return this.http.post('/api/faceDetectMessages/delete', deleteData, AuthHelper.getSystemHeader());
    }

    getCameras()
    {
        return this.http.get('/api/faceDetectMessages/cameras', AuthHelper.getSystemHeader());
    }

    getFaceIds(file, orientation)
    {
        const formData = new FormData();
        formData.append('face', file);
        formData.append('orientation', orientation);

        return this.http.postFile('/api/face-search', formData);
    }

    checkFace(file, orientation)
    {
        const formData = new FormData();
        formData.append('face', file);
        formData.append('orientation', orientation);
        return this.http.postFile('/api/face-check', formData);
    }

    multiFaceIndex(data)
    {
        const formData = new FormData();
        formData.append('data', data);

        return this.http.postFile('/api/multi-face-index', formData);
    }

    gallerySearch(searchState)
    {
        return this.http.post('/api/galleries/search', searchState, AuthHelper.getSystemHeader());
    }

    gallerySearchAll(searchState)
    {
        return this.http.post('/api/galleries/search-all', searchState, AuthHelper.getSystemHeader());
    }

    galleryGetByFaceId(faceId)
    {
        return this.http.get(`/api/galleries/get/by-face-id?faceId=${faceId}`, AuthHelper.getSystemHeader());
    }

    galleryGetByFaceIds(faceIds)
    {
        return this.http.get(`/api/galleries/get/by-face-ids?faceIds=${faceIds}`, AuthHelper.getSystemHeader());
    }

    galleryAdd(gallery)
    {
        return this.spinnerHttp.post('/api/galleries/add', gallery, AuthHelper.getSystemHeader());
    }

    galleryEdit(gallery)
    {
        return this.spinnerHttp.post('/api/galleries/edit', gallery, AuthHelper.getSystemHeader());
    }

    galleryDelete(galleryIds)
    {
        return this.spinnerHttp.post('/api/galleries/remove', galleryIds, AuthHelper.getSystemHeader());
    }

    getWatchListByFaceId(faceId)
    {
        return this.http.get(`/api/watchLists/get/by-face-id?faceId=${faceId}`, AuthHelper.getSystemHeader());
    }

    addOrUpdateGalleryWatchList(watchList)
    {
        return this.http.post('/api/galleries/watchList/add-or-update', watchList, AuthHelper.getSystemHeader());
    }

    deleteGalleryWatchList(watchList)
    {
        return this.http.post('/api/galleries/watchList/delete', watchList, AuthHelper.getSystemHeader());
    }

    getBestMatchImageUrl(value)
    {
        const timestamp = (new Date()).getTime();
        return `/api/gallery/image?id=${value}&v=${timestamp}`;
    }

    getGallerySubImageUrl(value)
    {
        const timestamp = (new Date()).getTime();
        return `/api/gallery/sub-image?id=${value}&v=${timestamp}`;
    }
}
