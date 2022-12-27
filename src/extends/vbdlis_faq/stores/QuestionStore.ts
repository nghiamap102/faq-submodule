import AppStore from 'components/app/stores/AppStore';
import HttpClient from 'helper/http.helper';
import { action, decorate, observable } from 'mobx';
import LayerService from 'services/layer.service';
import { UserService } from 'services/user.service';
import { DATA_PATHs, LAYERs } from '../constant/LayerMetadata';
import { VDMSQuery } from '../helper/InterfaceDefination';
import Validation from '../utils/Validation';

export interface Question {
    Id?: string;
    topicId?: string;
    projectId?: string;
    questionTitle?: string;
    questionContent?: string;
    public_status?: boolean;
    tags?: string;
}
export interface OptionsFilter {
    id?: string | null;
    method?: string | null;
}
const init = {
    Id: '',
    topicId: '',
    projectId: '',
    questionContent: '',
    questionTitle: '',
    public_status: false,
    tags: '',
}
class QuestionStore {
    http = new HttpClient();
    layerSvc = new LayerService();
    userService = new UserService();
    appStore;

    questions: Question[] = [];
    questionsFilter: Question[] = [];
    question: Question = init;

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
    resetQuestion = (): void => {
        this.question = init;
    };

    setQuestion = (question: Question): void => {
        this.question = {
            ...this.question,
            Id: question.Id,
            projectId: question.projectId,
            public_status: question.public_status,
            questionContent: question.questionContent,
            questionTitle: question.questionTitle,
            topicId: question.topicId,
            tags: question.tags,
        };
    };

    getQuery = (query: VDMSQuery): VDMSQuery => {
        const queryQuestion: VDMSQuery = {
            path: DATA_PATHs.QUESTION,
            layers: [LAYERs.QUESTION],
            start: query?.start ? query.start : 0,
            count: query?.count ? query.count : 25,
            searchKey: query?.searchKey,
            filterQuery: query?.filterQuery,
            returnFields: ["*"],
            sortOption: { sortInfo: [{ Field: 'ModifiedDate', Direction: 1 }] },
        };

        return query ? { ...queryQuestion, ...query } : queryQuestion;
    };

    getQuestions = async (query: VDMSQuery): Promise<any> => {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.questions = rs.data; return rs.data; }
        return [];
    };

    getQuestionsFilter = async (query: VDMSQuery): Promise<any> => {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.questionsFilter = rs.data; return rs.data; }
        return [];
    };
    addQuestion = async (question: Question): Promise<any> => {
        return await this.layerSvc.addNodeLayer(
            LAYERs.QUESTION,
            question,
            DATA_PATHs.QUESTION,
        );
    };

    updateQuestion = async (question: Question): Promise<any> => {
        return await this.layerSvc.updateNodeLayer(
            LAYERs.QUESTION,
            question.Id,
            question,
        );
    };

    deleteQuestion = async (question: Question): Promise<any> => {
        await this.layerSvc.deleteNodeLayer(question.Id);
    };
    validateQuestion = (question: Question): boolean => {
        return (
            Validation.isNonEmptyString(question?.projectId) &&
            Validation.isNonEmptyString(question?.questionContent) &&
            Validation.isNonEmptyString(question?.questionTitle) &&
            Validation.isNonEmptyString(question?.topicId)
        )
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
    setCurrentPage = (page: number): void => {
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

decorate(QuestionStore, {
    questions: observable,
    question: observable,
    isOpenPopupAdd: observable,
    isOpenPopupConfirm: observable,
    isOpenPopupEdit: observable,
    options: observable,
    questionsFilter: observable,
    currentPage: observable,
    pageSize: observable,
    users: observable,

    getQuery: action,
    getQuestions: action,
    getQuestionsFilter: action,
    addQuestion: action,
    updateQuestion: action,
    deleteQuestion: action,

    setIsOpenPopupConfirm: action,
    setIsOpenPopupEdit: action,
    setIsOpenPopupAdd: action,
    setOptions: action,
    setCurrentPage: action,
    setPageSize: action,
    getUser: action,

    validateQuestion: action,
    setQuestion: action,
    resetQuestion: action,
});

export default QuestionStore;
