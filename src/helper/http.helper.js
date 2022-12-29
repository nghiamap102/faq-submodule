export default class HttpClient
{
    get(url, header = undefined, cb = undefined)
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

    getImage(url, header = undefined, cb = undefined)
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

    post(url, data, header = undefined, cb = undefined)
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

    patch(url, data, header = undefined, cb = undefined)
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

    put(url, data, header = undefined, cb = undefined)
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

    delete(url, data, header = undefined, cb = undefined)
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
            // alert(response.error.message);

            return null;
        }

        return response;
    }
}
