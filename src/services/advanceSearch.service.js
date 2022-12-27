import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';
import { AppConstant } from 'constant/app-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export class AdvanceSearchService
{
    apiURL = AppConstant.c4i2.url;

    http = new HttpClient();

    constructor(apiURL)
    {
        this.apiURL = apiURL || this.apiURL;
    }

    getQuerysByIncidentId = (incidentId) =>
    {
        return this.http.get(`/api/advance-searches/gets?incidentId=${incidentId}`, AuthHelper.getSystemHeader());
    };

    getQuerysById = (queryId) =>
    {
        return this.http.get(`/api/advance-searches/getQuery?queryId=${queryId}`, AuthHelper.getSystemHeader());
    };

    addQuery = (mapObj) =>
    {
        return this.http.post('/api/advance-searches', mapObj, AuthHelper.getSystemHeader());
    };

    delQuery = (id) =>
    {
        return this.http.post('/api/advance-searches/delete', { id }, AuthHelper.getSystemHeader());
    };

    updateQuery = (mapObj) =>
    {
        return this.http.post('/api/advance-searches/modify', mapObj, AuthHelper.getSystemHeader());
    };

    search = (params) =>
    {
        return this.http.post(`${this.apiURL}/api/v1/query/multi`, params, AuthHelper.getVDMSHeader());
    };

    getAllLayers = () =>
    {
        return this.http.get(`${this.apiURL}/api/v1/layers`, AuthHelper.getVDMSHeader());
    };

    getLayerProps = (layerName) =>
    {
        return this.http.get(`${this.apiURL}/api/v1/layers/${layerName}`, AuthHelper.getVDMSHeader());
    };

    searchDebounced = AwesomeDebouncePromise(this.search, 200);
}
