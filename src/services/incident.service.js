import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { SecurityHttpClient } from 'customs/SecurityHttpClient';

export class IncidentService
{
    http = new HttpClient();

    constructor(appStore)
    {
        this.securityHttp = new SecurityHttpClient(appStore);
    }

    gets = () =>
    {
        return this.http.get('/api/incidents/gets', AuthHelper.getSystemHeader());
    };

    get = (incidentId) =>
    {
        return this.securityHttp.get(`/api/incidents/get?incidentId=${incidentId}`, AuthHelper.getSystemHeader());
    };

    getById = (id) =>
    {
        return this.http.get(`/api/incidents/getById?id=${id}`, AuthHelper.getSystemHeader());
    };

    getByIds = (ids) =>
    {
        return this.http.get(`/api/incidents/getByIds?incidentIds=${ids.join('&incidentIds=')}`, AuthHelper.getSystemHeader());
    };

    getSketchMap = (incidentId) =>
    {
        return this.http.get(`/api/incidentSketchMaps/get?incidentId=${incidentId}`, AuthHelper.getSystemHeader());
    };

    lockSketchMap = (incidentId, featureId, lockSession) =>
    {
        return this.securityHttp.post('/api/incidentSketchMaps/lock', {
            incidentId,
            featureId,
            lockSession,
        }, AuthHelper.getSystemHeader());
    };

    commitSketchMap = (data, code, incidentId, lockSession) =>
    {
        return this.http.post('/api/incidentSketchMaps/commit', {
            data,
            code,
            incidentId,
            lockSession,
        }, AuthHelper.getSystemHeader());
    };

    cancelSketchMap = (incidentId, lockSession) =>
    {
        return this.securityHttp.post('/api/incidentSketchMaps/cancel', {
            incidentId,
            lockSession,
        }, AuthHelper.getSystemHeader());
    };

    addWithNewLocation = (incident) =>
    {
        return this.securityHttp.post('/api/incidents/with-new-location', incident, AuthHelper.getSystemHeader());
    };

    cancel = (incidentId) =>
    {
        return this.http.post('/api/incidents/cancel', { incidentId }, AuthHelper.getSystemHeader());
    };

    complete = (incidentId) =>
    {
        return this.http.post('/api/incidents/complete', { incidentId }, AuthHelper.getSystemHeader());
    };

    updateByCondition = (where, data) =>
    {
        return this.http.post('/api/incidents/update-by-condition', { where, data }, AuthHelper.getSystemHeader());
    };

    getEvents = (incidentId) =>
    {
        return this.http.get(`/api/incidentEvents/gets?incidentId=${incidentId}`, AuthHelper.getSystemHeader());
    };

    doneEvent = (incidentEventId) =>
    {
        return this.securityHttp.post('/api/incidentEvents/done', { incidentEventId }, AuthHelper.getSystemHeader());
    };

    addPost = (incidentEventId, message) =>
    {
        return this.http.post('/api/incidentEventPosts', {
            incidentEventId,
            message,
        }, AuthHelper.getSystemHeader());
    };

    inviteMembers = (data) =>
    {
        return this.http.post('/api/incidents/add-user', data, AuthHelper.getSystemHeader());
    };

    addAttachment = (eventId, incidentId) =>
    {
        return this.securityHttp.post('/api/incidents/add-attachment', {
            eventId,
            incidentId,
        }, AuthHelper.getSystemHeader());
    };

    start = (incident) =>
    {
        return this.http.post('/api/incidents/start', incident, AuthHelper.getSystemHeader());
    };

    getSketchMapControl = (controlId) =>
    {
        return this.http.get(`/api/incidentSketchMaps/get-control?controlId=${controlId}`, AuthHelper.getSystemHeader());
    };

    sendMessageToChannel = (message) =>
    {
        return this.http.post('/api/mattermost/send', message, AuthHelper.getSystemHeader());
    };

    updateForces = (param) =>
    {
        return this.securityHttp.post('/api/incidents/update-forces', param, AuthHelper.getSystemHeader());
    };

    startEvent = (incidentEventId) =>
    {
        return this.http.post('/api/start', { incidentEventId }, AuthHelper.getSystemHeader());
    };

    settingEvent = (eventId, params) =>
    {
        return this.http.post('/api/incidentEvents/setting', { eventId, params }, AuthHelper.getSystemHeader());
    };

    findEventCommand = (wfCode, wfProcessId, incidentEventId) =>
    {
        return this.http.post('/api/incidentEvents/find-event-command', {
            wfCode,
            wfProcessId,
            incidentEventId,
        }, AuthHelper.getSystemHeader());
    };

    processTriggers = (wfCode, wfProcessId, incidentEventId) =>
    {
        return this.http.post('/api/incidentEvents/process-triggers', {
            wfCode,
            wfProcessId,
            incidentEventId,
        }, AuthHelper.getSystemHeader());
    };

    getCommandMapping = (name) =>
    {
        return this.http.get(`/api/mappings/get?name=${name}`, AuthHelper.getSystemHeader());
    };
}
