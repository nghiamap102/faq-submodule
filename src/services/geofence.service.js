import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

import { SecurityHttpClient } from 'customs/SecurityHttpClient';

export class GeofenceService
{
    http = new HttpClient();

    constructor(appStore)
    {
        this.securityHttp = new SecurityHttpClient(appStore);
    }

    insert = (geofenceObject) =>
    {
        return this.securityHttp.post('api/geofence/InsertGeofence', geofenceObject, AuthHelper.getSystemHeader());
    };

    update = (geofenceObject) =>
    {
        return this.securityHttp.post('api/geofence/UpdateGeofence', geofenceObject, AuthHelper.getSystemHeader());
    };

    delete = (id) =>
    {
        return this.securityHttp.get(`api/geofence/DeleteGeofence?id=${id}`, AuthHelper.getSystemHeader());
    };

    register = (dataRegister) =>
    {
        return this.securityHttp.post('api/geofence/Register', dataRegister, AuthHelper.getSystemHeader());
    };

    unregister = (dataUnRegister) =>
    {
        return this.securityHttp.post('api/geofence/Unregister', dataUnRegister, AuthHelper.getSystemHeader());
    };

    getStatusOne = (sensorId, geofenceId) =>
    {
        return this.securityHttp.get(`api/geofence/GetStatus?sensorId=${sensorId}&geofenceId=${geofenceId}`, AuthHelper.getSystemHeader());
    };

    getStatuses = (dataRegister) =>
    {
        return this.securityHttp.post('api/geofence/GetStatus', dataRegister, AuthHelper.getSystemHeader());
    };
}
