import AppStore from 'components/app/stores/AppStore';
import HttpClient from 'helper/http.helper';
import { action, computed, decorate, observable } from 'mobx';
import LayerService from 'services/layer.service';
import { UserService } from 'services/user.service';
import { DATA_PATHs, LAYERs } from '../constant/LayerMetadata';
import { VDMSQuery } from '../helper/InterfaceDefination';
import { OptionsFilter } from './QuestionStore';

export type Topic = {
    Id?: string;
    topicTitle?: string;
    projectId?: string;
    parentId?: string;
    rootId?: string;
};

const initTopic = { topicTitle: '' };

class TopicStore {
    http = new HttpClient();
    layerSvc = new LayerService();
    userService = new UserService();
    appStore;

    topic: Topic = initTopic;

    topics: Topic[] = [];
    topicsFilter: Topic[] = [];

    users = [];
    currentPage = 1;
    pageSize = 10;
    isOpenPopupConfirm = false;
    isOpenPopupEdit = false;
    isOpenPopupAdd = false;
    options: OptionsFilter = { id: '', method: '' };

    constructor(appStore: AppStore) {
        this.appStore = appStore;
    }

    setTopic = (topic: Topic): void => {
        this.topic = {
            ...this.topic,
            Id: topic.Id,
            parentId: topic.parentId,
            projectId: topic.projectId,
            rootId: topic.rootId,
            topicTitle: topic.topicTitle,
        };
    };

    resetTopic = (): void => {
        this.topic = initTopic;
    };

    getQuery = (query: VDMSQuery): VDMSQuery => {
        const queryTopic: VDMSQuery = {
            path: DATA_PATHs.TOPIC,
            layers: [LAYERs.TOPIC],
            start: query?.start ? query.start : 0,
            count: query?.count ? query.count : 25,
            searchKey: query?.searchKey,
            filterQuery: query?.filterQuery,
            returnFields: ["*"],
            sortOption: { sortInfo: [{ Field: 'ModifiedDate', Direction: 1 }] },
        };

        return query ? { ...queryTopic, ...query } : queryTopic;
    };

    getTopics = async (query: VDMSQuery): Promise<any> => {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.topics = rs.data; return rs.data; }
        return [];
    };
    getTopicsFilter = async (query: VDMSQuery): Promise<any> => {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.topicsFilter = rs.data; return rs.data; }
        return [];
    };
    getStateById = async (query: VDMSQuery): Promise<any> => {
        const request = this.getQuery(query);
        try {
            const rs = await this.layerSvc.getLayers(request);
            if (rs?.status?.code === 200) {
                this.topic = rs.data[0];
                return rs.data;
            }
        }
        catch (error) {
            console.log('getProjects', error);
        }

        return [];
    };

    addTopic = async (topic: Topic): Promise<any> => {
        return await this.layerSvc.addNodeLayer(LAYERs.TOPIC, topic, DATA_PATHs.TOPIC);
    };

    updateTopic = async (topic: Topic): Promise<any> => {
        return await this.layerSvc.updateNodeLayer(LAYERs.TOPIC, topic.Id, topic);
    };

    deleteTopic = async (topic: Topic): Promise<any> => {
        return await this.layerSvc.deleteNodeLayer(topic.Id);
    };

    get isValidTopic() {
        return (
            this.topic.topicTitle !== undefined
        );
    }

    setIsOpenPopupConfirm = (value: boolean): void => {
        this.isOpenPopupConfirm = value;
    }

    setIsOpenPopupEdit = (value: boolean): void => {
        this.isOpenPopupEdit = value;
    }
    setIsOpenPopupAdd = (value: boolean): void => {
        this.isOpenPopupAdd = value;
    }
    setOptions = (options: OptionsFilter): void => {
        this.options = { ...this.options, ...options };
    };
    setCurrentPage = (page: number) => {
        this.currentPage = page;
    }
    setPageSize = (page: number): void => {
        this.pageSize = page;
    }
    getUser = async (): Promise<any> => {
        const res = await this.userService.getAll();
        this.users = res.data;
    }
}

decorate(TopicStore, {
    topic: observable,
    topics: observable,
    isOpenPopupConfirm: observable,
    isOpenPopupEdit: observable,
    isOpenPopupAdd: observable,
    options: observable,
    currentPage: observable,
    pageSize: observable,
    users: observable,
    topicsFilter:observable,

    setTopic: action,
    resetTopic: action,
    addTopic: action,
    updateTopic: action,
    deleteTopic: action,
    getStateById: action,
    getTopicsFilter:action,
    

    setIsOpenPopupConfirm: action,
    setIsOpenPopupAdd: action,
    setIsOpenPopupEdit: action,
    isValidTopic: computed,
    setOptions: action,
    setCurrentPage: action,
    setPageSize: action,
    getUser: action,
});

export default TopicStore;
