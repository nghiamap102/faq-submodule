import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export default class FileService
{
    apiURL = AppConstant.c4i2.url;

    http = new HttpClient();

    getContent = (nodeId) =>
    {
        return this.http.get(`${this.apiURL}/api/v1/folder/GetContentById/${nodeId}`, AuthHelper.getVDMSHeader());
    };

    static cacheFiles = {};

    static getFile = async (path) =>
    {
        if (!path)
        {
            throw new Error('Invalid path');
        }

        if (FileService.cacheFiles[path])
        {
            return FileService.cacheFiles[path];
        }

        try
        {
            const response = await fetch(`${AppConstant.vdms.url}/api/v1/file/adv?path=${path}`, { method: 'GET', headers: AuthHelper.getVDMSHeader() });

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            FileService.cacheFiles[path] = url;

            return url;
        }
        catch (e)
        {
            throw new Error(e.message);
        }
    };
}
