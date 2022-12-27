import AppStore from 'components/app/stores/AppStore';
import HttpClient from 'helper/http.helper';
import { action, decorate, observable } from 'mobx';
import { MomentInput } from 'moment';
import LayerService from 'services/layer.service';
import { DATA_PATHs, LAYERs } from '../constant/LayerMetadata';
import { VDMSQuery } from '../helper/InterfaceDefination';


export type Keyword = {
    Id?: string,
    questionId: string,
    keyword: string
}

class KeywordStore {
    http = new HttpClient();
    layerSvc = new LayerService();
    appStore;

    keywords: Keyword[] = [];
    keywordSelected: any[] = []
    searchKey = '';
    timeFrom: MomentInput = null;
    timeTo: MomentInput = null;

    constructor(appStore: AppStore) {
        this.appStore = appStore;
    }
    getQuery = (query: VDMSQuery): VDMSQuery => {

        const queryKeyword: VDMSQuery = {
            path: DATA_PATHs.KEYWORD,
            layers: [LAYERs.KEYWORD],
            start: 0,
            count: 0,
            returnFields: ['*'],
            sortOption: { sortInfo: [{ Field: 'ModifiedDate', Direction: 1 }] },
        };

        return query ? { ...queryKeyword, ...query } : queryKeyword;
    };
    getKeywords = async (query: VDMSQuery): Promise<any> => {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.keywords = rs.data; return rs.data; }
        return [];
    }
    addKeyword = async (keyword: Keyword): Promise<any> => {
        await this.layerSvc.addNodeLayer(LAYERs.KEYWORD, keyword, DATA_PATHs.KEYWORD);
    }

    updateKeyword = async (keyword: Keyword): Promise<any> => {
        await this.layerSvc.updateNodeLayer(LAYERs.KEYWORD, keyword.Id, keyword);
    }

    deleteKeyword = async (keyword: Keyword): Promise<any> => {
        await this.layerSvc.deleteNodeLayer(keyword.Id);
    }
    setSearchKey = (value: string) => {
        this.searchKey = value;
    }
    setTimeFrom = (value: string) => {
        this.timeFrom = value;
    }
    setTimeTo = (value: string) => {
        this.timeTo = value;
    }
    setKeywordSelected = (value: any) => {
        this.keywordSelected = value;
    }
}

decorate(KeywordStore, {
    keywords: observable,
    searchKey: observable,
    timeFrom: observable,
    timeTo: observable,
    keywordSelected: observable,

    addKeyword: action,
    updateKeyword: action,
    deleteKeyword: action,
    setSearchKey: action,
    getKeywords: action,
    setKeywordSelected: action,

    setTimeFrom: action,
    setTimeTo: action,
});
export default KeywordStore;
