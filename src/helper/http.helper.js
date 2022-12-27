export default class HttpClient
{
    get(url, header, cb = undefined)
    {
        return fetch(url, {
            method: 'GET',
            headers: new Headers(header || {
                'Content-Type': 'application/json',
            }),
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(this.checkError)
            .then(cb);
    }

    getWithParams(url, params, header, cb)
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

        return fetch(url + qs, {
            method: 'GET',
            headers: new Headers(header || {
                'Content-Type': 'application/json',
            }),
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(this.checkError)
            .then(cb);
    }

    getImage(url, header, cb = undefined)
    {
        return fetch(url, {
            method: 'GET',
            headers: new Headers(header || {
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            }),
        })
            .then(this.checkStatus)
            .then(this.checkError)
            .then(cb);
    }

    post(url, data, header, cb = undefined)
    {
        if (header)
        {
            return fetch(url, {
                method: 'POST',
                headers: new Headers(header || {
                    'Content-Type': 'application/json',
                }),
                body: JSON.stringify(data),
            })
                .then(this.checkStatus)
                .then(this.parseJSON)
                .then(this.checkError)
                .then(cb);
        }
        else
        {
            return null;
        }
    }

    postFileStream(url, data, header = undefined, cb = undefined)
    {
        return fetch(url, {
            method: 'POST',
            headers: new Headers(header || {
                'Content-Type': 'application/octet-stream',
            }),
            body: JSON.stringify(data),
        })
            .then(this.checkStatus)
            .then(this.checkError)
            .then(cb);
    }

    postFile(url, formData, header = undefined, cb = undefined)
    {
        return fetch(url, {
            method: 'POST',
            headers: header,
            body: formData,
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(this.checkError)
            .then(cb);
    }

    patch(url, data, header, cb = undefined)
    {
        return fetch(url, {
            method: 'PATCH',
            headers: new Headers(header || {
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data),
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(this.checkError)
            .then(cb);
    }

    put(url, data, header, cb = undefined)
    {
        return fetch(url, {
            method: 'PUT',
            headers: new Headers(header || {
                'Content-Type': 'application/json',
            }),
            body: JSON.stringify(data),
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(this.checkError)
            .then(cb);
    }

    delete(url, data, header, cb = undefined)
    {
        return fetch(url, {
            method: 'DELETE',
            headers: new Headers(header || {
                'Content-Type': 'application/json',
            }),
            body: data ? JSON.stringify(data) : null,
        })
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(this.checkError)
            .then(cb);
    }

    checkStatus(response)
    {
        if (response.status >= 200 && response.status < 300)
        {
            return response;
        }

        const error = new Error(`HTTP Error ${response.statusText}`);
        error.status = response.statusText;
        error.response = response;

        // throw error;
        return response;
    }

    parseJSON(response)
    {
        return response.json();
    }

    checkError(response)
    {
        if (response && response.error)
        {
            // todo: add dialog style later
            alert(response.error.message);

            return null;
        }

        return response;
    }
}
