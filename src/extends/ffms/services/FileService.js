import { AppConstant } from 'constant/app-constant';
import { Constants } from 'constant/Constants';
import { HttpAxiosService } from 'helper/https.axios.helper';

export class FileService
{
    http = new HttpAxiosService();
    imagePath = Constants.TENANT_IMAGE_PATH;

    upload = (file, parentFolder, name)=>
    {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post(`/api/media/${parentFolder}?name=${name}`, formData);
    };

    update = (file, parentFolder, name)=>
    {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.put(`/api/media/${parentFolder}?name=${name}`, formData);
    };
}
