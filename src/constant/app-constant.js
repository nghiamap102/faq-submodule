export class AppConstant
{
    static sysIdPlaceholder = '${SYSID}';
    static defaultAddIncidentGeo = {
        lng: 106.6029738547868,
        lat: 10.754634350198572,
    };

    static streamInfo = {
        hlsUrl: `https://${process.env.REACT_APP_STREAM_URL}/streams/`,
        rtcUrl: `wss://${process.env.REACT_APP_STREAM_URL}/websocket`,
        token: null,
    };

    static map = {
        url: '/service/map-image',
    };

    static chat = {
        url: '/service/chat-page',
    };

    static c4i2 = {
        url: '/service/c4i2',
    };

    static vdms = {
        url: '/service/vdms',
    };

    static tracking = {
        url: '/service/tracking',
    };

    static mapnik = {
        url: '/service/mapnik',
    };

    static ogis = {
        url: '/service/ogis',
    };
}
