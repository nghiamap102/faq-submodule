import AppStore from 'components/app/stores/AppStore';
import HttpClient from 'helper/http.helper';
import { action, computed, decorate, observable } from 'mobx';
import LayerService from 'services/layer.service';
import { UserService } from 'services/user.service';
import { DATA_PATHs, LAYERs } from '../constant/LayerMetadata';
import { VDMSQuery } from '../helper/InterfaceDefination';
import { OptionsFilter } from './QuestionStore';

export type Feedback = {
    Id?: string;
    questionId?: string;
    topicId?: string;
    projectId?: string;
    feedbackTitle?: string;
    feedbackContent?: string;
};

const init = {
    Id: '',
    questionId: '',
    topicId: '',
    projectId: '',
    feedbackTitle: '',
    feedbackContent: '',
};
class FeedbackStore
{
    http = new HttpClient();
    layerSvc = new LayerService();
    userService = new UserService();
    appStore;
    feedbacks: Feedback[] = [];
    feedbacksFilter: Feedback[] = [];
    feedback: Feedback = init;
    options: OptionsFilter = { id: '', method: '' };

    users = [];
    currentPage = 1;
    pageSize = 10;
    isOpenPopupConfirm = false;
    isOpenPopupEdit = false;
    isOpenPopupAdd = false;
    constructor(appStore: AppStore)
    {
        this.appStore = appStore;
    }
    resetFeedback = (): void =>
    {
        this.feedback = init;
    };

    setFeedback = (feedback: Feedback): void =>
    {
        this.feedback = {
            ...this.feedback,
            Id: feedback.Id,
            feedbackContent: feedback.feedbackContent,
            feedbackTitle: feedback.feedbackTitle,
            projectId: feedback.projectId,
            questionId: feedback.questionId,
            topicId: feedback.topicId,
        };
    };

    getQuery = (query: VDMSQuery): VDMSQuery =>
    {
        const queryFeedback: VDMSQuery = {
            path: DATA_PATHs.FEEDBACK,
            layers: [LAYERs.FEEDBACK],
            start: query?.start ? query.start : 0,
            count: query?.count ? query.count : 25,
            searchKey: query?.searchKey,
            filterQuery: query?.filterQuery,
            returnFields: ['*'],
            sortOption: { sortInfo: [{ Field: 'ModifiedDate', Direction: 1 }] },
        };
        return query ? { ...queryFeedback, ...query } : queryFeedback;
    };

    getFeedbacks = async (query: VDMSQuery): Promise<any> =>
    {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.feedbacks = rs.data; return rs.data; }
        return [];
    };
    getFeedbacksFilter = async (query: VDMSQuery): Promise<any> =>
    {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.feedbacksFilter = rs.data; return rs.data; }
        return [];
    };
    addFeedback = async (Feedback: Feedback): Promise<any> =>
    {
        return await this.layerSvc.addNodeLayer(
            LAYERs.FEEDBACK,
            Feedback,
            DATA_PATHs.FEEDBACK,
        );
    };

    updateFeedback = async (Feedback: Feedback): Promise<any> =>
    {
        return await this.layerSvc.updateNodeLayer(
            LAYERs.FEEDBACK,
            Feedback.Id,
            Feedback,
        );
    };

    deleteFeedback = async (Feedback: Feedback): Promise<any> =>
    {
        return await this.layerSvc.deleteNodeLayer(Feedback.Id);
    };
    get isValidFeedback()
    {
        return (
            this.feedback.feedbackTitle !== undefined &&
            this.feedback.questionId !== undefined &&
            this.feedback.topicId !== undefined &&
            this.feedback.projectId !== undefined
        );
    }
    setIsOpenPopupConfirm = (value: boolean): void =>
    {
        this.isOpenPopupConfirm = value;
    }

    setIsOpenPopupEdit = (value: boolean): void =>
    {
        this.isOpenPopupEdit = value;
    }
    setIsOpenPopupAdd = (value: boolean): void =>
    {
        this.isOpenPopupAdd = value;
    }
    setOptions = (options: OptionsFilter): void =>
    {
        this.options = { ...this.options, ...options };
    };
    setCurrentPage = (page: number) =>
    {
        this.currentPage = page;
    }
    getUser = async (): Promise<any> =>
    {
        const res = await this.userService.getAll();
        this.users = res.data;
    }
    setPageSize = (page: number): void =>
    {
        this.pageSize = page;
    }
}

decorate(FeedbackStore, {
    feedback: observable,
    feedbacks: observable,
    isOpenPopupConfirm: observable,
    isOpenPopupEdit: observable,
    isOpenPopupAdd: observable,
    options: observable,
    currentPage: observable,
    pageSize: observable,
    feedbacksFilter: observable,
    users: observable,

    getFeedbacks: action,
    getFeedbacksFilter: action,
    addFeedback: action,
    updateFeedback: action,
    deleteFeedback: action,
    isValidFeedback: computed,
    setFeedback: action,
    resetFeedback: action,
    setOptions: action,

    setIsOpenPopupConfirm: action,
    setIsOpenPopupEdit: action,
    setIsOpenPopupAdd: action,
    setCurrentPage: action,
    setPageSize: action,
    getUser: action,
})


export default FeedbackStore;
