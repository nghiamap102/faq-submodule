import AppStore from 'components/app/stores/AppStore';
import HttpClient from 'helper/http.helper';
import { action, computed, decorate, observable } from 'mobx';
import LayerService from 'services/layer.service';
import { UserService } from 'services/user.service';
import { DATA_PATHs, LAYERs } from '../constant/LayerMetadata';
import { VDMSQuery } from '../helper/InterfaceDefination';

export interface Project {
    Id?: string;
    projectId?: string;
    projectName?: string;
    logo?: string;
}

const initProject = { projectId: '', projectName: '' };

class ProjectStore {
    http = new HttpClient();
    layerSvc = new LayerService();
    userService = new UserService();
    appStore;
    project: Project = initProject;
    projects: Project[] = [];
    projectsFilter: Project[] = [];

    users = [];
    currentPage = 1;
    pageSize = 10;
    isOpenPopupConfirm = false;
    isOpenPopupEdit = false;
    isOpenPopupAdd = false;
    constructor(appStore: AppStore) {
        this.appStore = appStore;
    }

    resetProject = (): void => {
        this.project = initProject;
    };

    setProject = (project: Project): void => {
        this.project = { ...this.project, Id: project.Id, logo: project.logo, projectId: project.projectId, projectName: project.projectName };
    };

    getQuery = (query?: VDMSQuery): VDMSQuery => {
        const queryProject: VDMSQuery = {
            path: DATA_PATHs.PROJECT,
            layers: [LAYERs.PROJECT],
            start: query?.start ? query.start : 0,
            count: query?.count ? query.count : 25,
            searchKey: query?.searchKey,
            returnFields: ["*"],
            sortOption: { sortInfo: [{ Field: 'ModifiedDate', Direction: 1 }] },
        };


        return query ? { ...queryProject, ...query } : queryProject;
    };

    getProjects = async (query?: VDMSQuery): Promise<any> => {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.projects = rs.data; return rs.data; }
        return [];
    };
    getProjectsFilter = async (query?: VDMSQuery): Promise<any> => {
        const request = this.getQuery(query);
        const rs = await this.layerSvc.getLayers(request);
        if (rs && rs.data) { this.projectsFilter = rs.data; return rs.data; }
        return [];
    };
    addProject = async (project: Project): Promise<any> => {
        return await this.layerSvc.addNodeLayer(
            LAYERs.PROJECT,
            project,
            DATA_PATHs.PROJECT,
        );
    };

    updateProject = async (project: Project): Promise<any> => {
        return await this.layerSvc.updateNodeLayer(
            LAYERs.PROJECT,
            project.Id,
            project,
        );
    };

    deleteProject = async (project: Project): Promise<any> => {
        return await this.layerSvc.deleteNodeLayer(project.Id);
    };

    get isValidProject() {
        return (
            this.project.projectId !== undefined &&
            this.project.projectName !== undefined
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
    setCurrentPage = (page: number) => {
        this.currentPage = page;
    }
    getUser = async (): Promise<any> => {
        const res = await this.userService.getAll();
        this.users = res.data;
    }
    setPageSize = (page: number): void => {
        this.pageSize = page;
    }
}

decorate(ProjectStore, {
    project: observable,
    projects: observable,
    projectsFilter: observable,
    isOpenPopupConfirm: observable,
    isOpenPopupEdit: observable,
    isOpenPopupAdd: observable,
    currentPage: observable,
    users: observable,
    pageSize: observable,

    getUser: action,
    resetProject: action,
    setProject: action,
    getProjects: action,
    addProject: action,
    updateProject: action,
    deleteProject: action,
    setCurrentPage: action,
    setPageSize: action,
    getProjectsFilter: action,

    setIsOpenPopupConfirm: action,
    setIsOpenPopupEdit: action,
    setIsOpenPopupAdd: action,
    isValidProject: computed,
});
export default ProjectStore;
