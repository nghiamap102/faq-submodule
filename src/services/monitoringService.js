import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { ZabbixClient } from 'zabbix-client';

export class MonitoringService
{
    http = new HttpClient();
    zabbixClient = new ZabbixClient('http://monitoring.c4i2.net/api_jsonrpc.php');

    getDetectionsCount = async (data) =>
    {
        return await this.http.post('/api/camera-monitoring/detections-count', data, AuthHelper.getSystemHeader());
    };

    getSignalStatus = (cameraNames) =>
    {
        return this.http.post('/api/camera-monitoring/get-latest-camera-signal', { cameraNames: cameraNames }, AuthHelper.getSystemHeader());
    };


    getZabbixSignalStatus = async () =>
    {
        const api = await this.zabbixClient.login('vietbando', 'Vbd@2020');
        const data = {
            'jsonrpc': '2.0',
            'method': 'host.get',
            'params': {},
            'id': 1
        };

        try
        {
            return await api.method('host.get').call(data);
        }
        catch (err)
        {
            console.error(err);
        }
    };
}
