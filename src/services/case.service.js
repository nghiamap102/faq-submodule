import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';

export class CaseService
{
    http = new HttpClient();
    apiURL = AppConstant.c4i2.url;

    gets(queryInfo)
    {
        return this.http.post('/api/case/gets', queryInfo, AuthHelper.getVDMSHeader());
    }

    get(id)
    {
        return this.http.get(`/api/case/get/${id}`, AuthHelper.getVDMSHeader());
    }

    add(caseData)
    {
        return this.http.post('/api/case/add', caseData, AuthHelper.getVDMSHeader());
    }

    update(id, caseData)
    {
        return this.http.put(`/api/case/${id}`, caseData, AuthHelper.getVDMSHeader());
    }

    addVictims(victims)
    {
        return this.http.post('/api/case/addVictims', victims, AuthHelper.getVDMSHeader());
    }

    addSuspects(suspects)
    {
        return this.http.post('/api/case/addSuspects', suspects, AuthHelper.getVDMSHeader());
    }

    getVictims(ids)
    {
        return this.http.post('/api/case/getVictims', ids, AuthHelper.getVDMSHeader());
    }

    getSuspects(ids)
    {
        return this.http.post('/api/case/getSuspects', ids, AuthHelper.getVDMSHeader());
    }

    updateVictims(victims)
    {
        return this.http.post('/api/case/updateVictims', victims, AuthHelper.getVDMSHeader());
    }

    updateSuspects(suspects)
    {
        return this.http.post('/api/case/updateSuspects', suspects, AuthHelper.getVDMSHeader());
    }

    getCaseTypeDetails(parentType)
    {
        return this.http.post('/api/case/getCaseTypeDetails', parentType, AuthHelper.getVDMSHeader());
    }

    delete(ids)
    {
        return this.http.post('/api/case/delete', ids, AuthHelper.getVDMSHeader());
    }

    getUsers()
    {
        return this.http.get('/api/case/get-users', AuthHelper.getVDMSHeader());
    }

    getCreator()
    {
        return this.http.get('/api/case/get-creator', AuthHelper.getVDMSHeader());
    }

    getWfs()
    {
        return this.http.get('/api/case-workflow/gets', AuthHelper.getVDMSHeader());
    }

    initWf(wfSchemeCode)
    {
        return this.http.post('/api/case-workflow/init-wf', wfSchemeCode, AuthHelper.getVDMSHeader());
    }

    getWfInstanceEvent(wfInstanceId)
    {
        return this.http.get(`/api/case-event/gets/${wfInstanceId}`, AuthHelper.getVDMSHeader());
    }

    onWfDoneStep(id)
    {
        return this.http.put(`/api/case-event/done/${id}`, AuthHelper.getVDMSHeader());
    }

    postMessage(caseId, eventId, message)
    {
        return this.http.post('/api/case/post-message/', { caseId, eventId, message }, AuthHelper.getVDMSHeader());
    }

    setPermission(caseId, username, isRemove, path)
    {
        return this.http.post('/api/case/set-permission/', { caseId, username, isRemove, path }, AuthHelper.getVDMSHeader());
    }

    deleteWfInstance(wfCode, wfInstanceId)
    {
        return this.http.post('/api/case-workflow/delete-instance/', { wfCode, wfInstanceId }, AuthHelper.getVDMSHeader());
    }

    getOU()
    {
        return this.http.get('/api/case/get-ou/', AuthHelper.getVDMSHeader());
    }

    getAdminIdByName(province, district, ward)
    {
        const body = { province, district, ward };
        return this.http.post('/api/case/get-admin-code-by-name', body, AuthHelper.getVDMSHeader());
    }

    addAttachment(eventId, caseId)
    {
        return this.http.post('/api/case/add-attachment', { eventId, caseId }, AuthHelper.getVDMSHeader());
    }

    getActivities(caseId)
    {
        return this.http.get(`/api/case/get-activities/${caseId}`, AuthHelper.getVDMSHeader());
    }
}
