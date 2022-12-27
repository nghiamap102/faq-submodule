// import { spin } from 'components/bases/Modal/Modal';
import HttpClient from 'helper/http.helper';

export class SpinnerHttpClient
{
    http = new HttpClient();

    async get(url, header)
    {
        return this.http.get(url, header);
    }

    async post(url, data, header)
    {
        const request = this.http.post(url, data, header);
        // spin({ timeout: request });
        return request;
    }

    async postFile(url, fromData)
    {
        const request = this.http.postFile(url, fromData);
        // spin({ timeout: request });
        return request;
    }

    async put(url, data, header)
    {
        const request = this.http.put(url, data, header);
        // spin({ timeout: request });
        return request;
    }

    async patch(url, data, header)
    {
        const request = this.http.patch(url, data, header);
        // spin({ timeout: request });
        return request;
    }

    async delete(url, data, header)
    {
        const request = this.http.delete(url, data, header);
        // spin({ timeout: request });
        return request;
    }
}

