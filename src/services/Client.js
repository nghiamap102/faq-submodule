export default class Client
{
    get (query, params, cb)
    {
        let qs = '';
        if (params)
        {
            const esc = encodeURIComponent;
            qs = Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
            if (qs)
            {
                qs = '?' + qs;
            }
        }

        return fetch(query + qs, {
            accept: 'application/json',
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(this.checkError)
            .then(cb);
    }

    post (query, data, cb)
    {
        return fetch(query, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(this.checkError)
            .then(cb);
    }

    checkStatus (response)
    {
        if (response.status >= 200 && response.status < 300)
        {
            return response;
        }

        const error = new Error(`HTTP Error ${response.statusText}`);
        error.status = response.statusText;
        error.response = response;

        console.log(error); // eslint-disable-line no-console

        // throw error;
        return response;
    }

    parseJSON (response)
    {
        return response.json();
    }

    checkError (response)
    {
        if (response && response.error)
        {
            // todo: add dialog style later

            return null;
        }

        return response;
    }
}
