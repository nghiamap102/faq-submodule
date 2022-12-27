import Axios from 'axios';

const BaseURL = '' ?? process.env.BaseURL;
const DefaultHeaders = {};

export class HttpAxiosService
{
    axios;
    cancel;

    constructor(config = {
        baseURL: BaseURL,
        timeout: 30000,
        headers: {
            ...DefaultHeaders,
        },
    })
    {
        const { token, cancel } = Axios.CancelToken.source();
        this.cancel = cancel;

        this.axios = Axios.create({ ...config, cancelToken: token });
    }

    get(path, config)
    {
        return this.axios.get(path, config);
    }

    post(path, data, config)
    {
        return this.axios.post(path, data, config);
    }

    post_timeout(path, data, config)
    {
        return this.axios.post(path, data, { ...config, timeout: 600000 });
    }

    put(path, data, config)
    {
        return this.axios.put(path, data, config);
    }

    delete(path, config)
    {
        return this.axios.delete(path, config);
    }
}
