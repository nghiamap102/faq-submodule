import HttpClient from 'helper/http.helper';
import {AuthHelper} from '../helper/auth.helper';
import {AppConstant} from "../constant/app-constant";

export class WorkflowService {
    http = new HttpClient();
    apiURL = AppConstant.c4i2.url;

    gets() {
        return this.http.get('/api/workflow/gets', AuthHelper.getVDMSHeader());
    }

    init(wfSchemeCode) {
        return this.http.post('/api/workflow/init', wfSchemeCode, AuthHelper.getVDMSHeader());
    }

    getActivities(wfSchemeCode) {
        return this.http.post('/api/workflow/get-activities', wfSchemeCode, AuthHelper.getVDMSHeader());
    }

    // getCurrentState(wfSchemeCode) {
    //     return this.http.post('/api/case/get-wf-activities', wfSchemeCode, AuthHelper.getVDMSHeader());
    // }
}
