import HttpClient from 'helper/http.helper';

export class SecurityHttpClient
{
    http = new HttpClient();

    async get(url, header)
    {
        const res = await this.http.get(url, header);
        if (res && res.result === -2)
        {
            this.showErrorMessage(res.errorMessage);
            return null;
        }
        else if (res)
        {
            return res;
        }
    }


    async post(url, data, header)
    {
        const res = await this.http.post(url, data, header);
        if (res && res.result === -2)
        {
            this.showErrorMessage(res.errorMessage);
            return null;
        }
        else if (res)
        {
            return res;
        }
    }

    async put(url, data, header)
    {
        const res = await this.http.put(url, data, header);
        if (res && res.result === -2)
        {
            this.showErrorMessage(res.errorMessage);
            return null;
        }
        else if (res)
        {
            return res;
        }
    }

    async delete(url, data, header)
    {
        const res = await this.http.delete(url, data, header);
        if (res && res.result === -2)
        {
            this.showErrorMessage(res.errorMessage);
            return null;
        }
        else if (res)
        {
            return res;
        }
    }

    showErrorMessage(message)
    {
        // toast({ type: 'error', message });
    }
}
