import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';
const axios = require('axios');
export default class UploadService
{
    apiURL = AppConstant.vdms.url;

    http = new HttpClient();

    constructor(contexts)
    {
        this.contexts = contexts;
    }

    uploadExcelToTempTable = (layerName, file, config = null) =>
    {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('layerName', layerName);
        if (config)
        {
            formData.append('config', Buffer.from(JSON.stringify(config)).toString('base64'));
        }

        return axios.post('/api/ffms-files/vdms-files/import', formData, {
            headers: {
                'Content-type': 'multipart/form-data' ,
                ...AuthHelper.getVDMSHeaderAuthOnly(),
            },
        }).then((result) => result.data);
    };

    getImportedFileData = (layerName, username, fileName, recordFrom, limit) =>
    {
        if (!fileName)
        {
            return [];
        }
        return this.http.get(`/api/vdms-api/v1/file/import/getalldata?strLayername=${layerName}&userName=${username}&strFileName=${fileName}&recordFrom=${recordFrom}&limit=${limit}`, AuthHelper.getVDMSHeader());
    };

    getImportFilesByLayerName = (layerName) =>
    {
        return this.http.get(`/api/ffms/vdms-files/get-import-files?layerName=${layerName}`, AuthHelper.getVDMSHeader());
    };

    countImportData = (layerName, fileName) =>
    {
        if (!fileName)
        {
            return 0;
        }
        return this.http.get(
            `/api/vdms-api/v1/file/import/CountData?layerName=${layerName}&fileName=${fileName}`,
            AuthHelper.getVDMSHeader(),
        );
    };

    delete = (layerName, userName, fileName) =>
    {
        return this.http.delete(`/api/vdms-api/v1/file/import?layerName=${layerName}&userName=${userName}&fileName=${fileName}`, {}, AuthHelper.getVDMSHeader());
    };

    import = (layerName, fileName, limit) =>
    {
        const body = {
            LayerName: layerName,
            FileName: fileName,
            limit,
        };
        return this.http.post('/api/ffms/vdms-files/import/advanced', body, AuthHelper.getVDMSHeader());
    };
}
