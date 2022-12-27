import HttpClient from 'helper/http.helper';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const http = new HttpClient();

export class FaceIndexService
{
    searchFaceId = async (input: {faceId: string}) =>
    {
        const { faceId } = input;
        const url = '/api/face-index/search';
        return await http.get(`${url}?faceId=${faceId}`);
    }

    getIndexCount = async () =>
    {
        const url = '/api/face-index/count';
        return await http.get(url);
    }

    cleanAllIndex = async () =>
    {
        const url = '/api/face-index/clean';
        return await http.delete(url);
    }

    listFaceIndex = async (input: {skip: number, limit: number, searchKey?: string}) =>
    {
        const { skip = 100, limit = 10, searchKey = '' } = input;
        const url = '/api/face-index/list';
        return await http.get(`${url}?skip=${skip}&limit=${limit}&searchKey=${searchKey}`);
    }

    deleteFaceIndex = async (faceId: string) =>
    {
        const url = `/api/face-index?faceId=${faceId}`;
        return await http.delete(url);
    }

    listFaceIndexDebounce = AwesomeDebouncePromise(this.listFaceIndex, 200)
}
