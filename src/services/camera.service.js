import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export class CameraService
{
    cameraListUrl = `${AppConstant.vdms.url}/api/v1/query`;

    dataList = {
        'path': '/root/vdms/tangthu/data',
        'layers': ['CAMERAGIAOTHONG'],
        'isInTree': true,
        'searchKey': '',
        'start': 0,
        'count': -1,
        'filterQuery': ['CamStatus:(UP)'],
        'returnFields': ['*']
    };

    cameraSnapShotImageUrl = 'http://giaothong.hochiminhcity.gov.vn:8007/Render/CameraHandlerAdv.ashx?id=';

    http = new HttpClient();

    getMjpegCameraList = () =>
    {
        const data = Object.assign({}, this.dataList, { layers: ['CAMERAGIAOTHONG'] });

        return this.http.post(this.cameraListUrl, data, AuthHelper.getVDMSHeader());
    };

    getSnapShotCameraList = () =>
    {
        const data = Object.assign({}, this.dataList, { layers: ['CAMERAGT'] });

        return this.http.post(this.cameraListUrl, data, AuthHelper.getVDMSHeader());
    };

    getStreamCameraList = () =>
    {
        return this.http.get('/api/camerastreams/gets', AuthHelper.getVDMSHeader());
    };

    addStreamCamera = (camera) =>
    {
        return this.http.post('/api/camerastreams/add', camera, AuthHelper.getVDMSHeader());
    };

    editStreamCamera = (camera) =>
    {
        return this.http.post('/api/camerastreams/edit', camera, AuthHelper.getVDMSHeader());
    };

    deleteStreamCamera = (ids) =>
    {
        return this.http.post('/api/camerastreams/delete', ids, AuthHelper.getVDMSHeader());
    };

    getSnapShotImage = (camId) =>
    {
        return this.http.getImage(`${this.cameraSnapShotImageUrl}${camId}`, AuthHelper.getCameraSnapShotImageHeader());
    };
}
