import { AppConstant } from "constant/app-constant";
import { AuthHelper } from "helper/auth.helper";
import HttpClient from "helper/http.helper";

class FileServices {
    apiURL = '';
    http = new HttpClient();
    constructor(apiURL) {
        this.apiURL = apiURL || AppConstant.vdms.url;
    }

    uploadFileDirect = (file) => {
        const formData = new FormData();
        formData.append('', file);
        console.log(formData);
        return this.http.postFile(`${this.apiURL}/api/v1/file`, formData, AuthHelper.getVDMSHeaderAuthOnly());
    }

    uploadFileNode = (file, path, title, description) => {
        if (path) {
            const params = [`parentPath=${path}`];
            if (title) params.push(`title=${title}`);
            // if (description) params.push(`description=${description}`);
            const formData = new FormData();
            formData.append('file', file);

            return this.http.postFile(`${this.apiURL}/api/v1/file/AsNode?${params.join('&')}`, formData, AuthHelper.getVDMSHeaderAuthOnly());
        }
        console.error("ParentPath is empty");
        return null;
    }
}

export default FileServices;