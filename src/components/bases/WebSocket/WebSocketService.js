export class WebSocketService
{
    static init = (options) =>
    {
        this.options = options;
        this.url = this.options.url;
        this.connect();
    };

    static close = () =>
    {
        this.ws.close();
    };

    static connect = () =>
    {
        if (this.ws)
        {
            this.ws.close(1000, 'Stop current websocket');
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () =>
        {
            this.logging('Websocket onopen', this.url);

            if (typeof this.options.onOpen === 'function')
            {
                this.options.onOpen();
            }
        };

        this.ws.onclose = (evt) =>
        {
            this.logging('Websocket closing. Reason', evt.reason, 'Code', evt.code);

            if (typeof this.options.onClose === 'function')
            {
                this.options.onClose(evt.code, evt.reason);
            }

            if (this.options.reconnect && (!this.ws || this.ws.readyState === WebSocket.CLOSED))
            {
                this.logging('Websocket reconnect after closes');
                this.connect();
            }
        };

        this.ws.onerror = (err) =>
        {
            this.logging('Error and Close Websocket', err);

            if (typeof this.options.onError === 'function')
            {
                this.options.onError(err);
            }

            this.ws.close(1000, err);
        };

        this.ws.onmessage = (evt) =>
        {
            this.logging('Websocket onmessage', evt.data);

            try
            {
                const message = JSON.parse(evt.data);

                if (message.channel)
                {
                    if (this.chanelSubscribers && this.chanelSubscribers[message.channel])
                    {
                        this.chanelSubscribers[message.channel].forEach((onMessage) =>
                        {
                            onMessage(message.data);
                        });
                    }
                }
                else
                {
                    console.error('Websocket invalid message: missing channel', message);
                }
            }
            catch (e)
            {
                console.error('Websocket malformed message', e);
            }
        };
    };

    static subscribeChanel(channel, listener)
    {
        this.chanelSubscribers = this.chanelSubscribers || [];
        this.chanelSubscribers[channel] = this.chanelSubscribers[channel] || [];

        if (!this.chanelSubscribers[channel].includes(listener))
        {
            this.chanelSubscribers[channel].push(listener);
        }
    }

    static leaveChanel(channel, listener)
    {
        if (this.chanelSubscribers && this.chanelSubscribers[channel] && this.chanelSubscribers[channel].includes(listener))
        {
            this.chanelSubscribers[channel] = this.chanelSubscribers[channel].filter((l) => l !== listener);
        }
    }

    static hasChannel(channel)
    {
        if (this.chanelSubscribers)
        {
            return !!this.chanelSubscribers[channel];
        }
    }

    static sendMessage(channel, data)
    {
        if (this.ws && this.ws.readyState === WebSocket.OPEN)
        {
            const message = JSON.stringify({
                type: 'message',
                channel,
                data
            });

            this.ws.send(message);
        }
    }

    static requestAPI(channel, body)
    {
        if (this.ws && this.ws.readyState === WebSocket.OPEN)
        {
            const message = JSON.stringify({
                type: 'api',
                channel,
                ...body
            });

            this.ws.send(message);
        }
    }

    static logging = (...args) =>
    {
        if (this.options.debug)
        {
            console.log(args);
        }
    };
}
