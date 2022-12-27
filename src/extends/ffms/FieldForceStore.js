import { decorate, observable, action } from 'mobx';

import { TENANT_STATUS } from 'extends/ffms/constant/ffms-enum';
import HttpClient from 'helper/http.helper';
import { AuthHelper } from 'helper/auth.helper';

import { EmployeeStore } from 'extends/ffms/views/EmployeePanel/EmployeeStore';
import { JobStore } from 'extends/ffms/views/JobPanel/JobStore';
import { JobFilterStore } from 'extends/ffms/views/JobFilterView/JobFilterStore';
import { HistoryStore } from 'extends/ffms/views/TrackingHistory/HistoryStore';
import { OverlayPopupStore } from 'extends/ffms/components/OverlayPopup/OverlayPopupStore';
import { DashboardStore } from 'extends/ffms/pages/Dashboard/DashboardStore';
import { ReportStore } from 'extends/ffms/pages/Report/ReportStore';
import { CustomerStore } from 'extends/ffms/views/JobPanel/Customer/CustomerStore';
import { WorkerStore } from 'extends/ffms/views/TrackingWorker/WorkerStore';
import { ManagerLayerStore } from 'extends/ffms/pages/Layerdata/ManagerLayerStore';
import { MiniMapStore } from 'extends/ffms/components/MiniMap/MiniMapStore';
import { RoleStore } from 'extends/ffms/views/RolePanel/RoleStore';


import CommonService from 'extends/ffms/services/CommonService';
import TenantService from 'extends/ffms/services/TenantService';
import TrackingWorkerService from 'extends/ffms/views/TrackingWorker/TrackingWorkerService';
import { DetailTreeStore } from 'extends/ffms/components/DetailTree/DetailTreeStore';
import { RelatedJobStore } from 'extends/ffms/views/DetailView/RelatedJobStore';
import { UploadStore } from 'extends/ffms/components/Import/UploadStore';
import { PermissionStore } from 'extends/ffms/components/Permission/PermissionStore';
import { AdminBoundaryStore } from './views/AdministrativeBoundary/AdminBoundaryStore';
import { AppConfigStore } from 'extends/ffms/pages/AppConfig/AppConfigStore';

class FieldForceStore
{
    http = new HttpClient();
    tenantSvc = new TenantService();
    readyToStart = true;
    constructor(appStore)
    {
        this.appStore = appStore;

        this.comSvc = new CommonService(appStore.contexts);
        this.trackingSvc = new TrackingWorkerService();

        this.empStore = new EmployeeStore(this);
        this.jobStore = new JobStore(this);
        this.uploadStore = new UploadStore(this);
        this.historyStore = new HistoryStore(this);
        this.jobFilterStore = new JobFilterStore(this);
        this.detailTreeStore = new DetailTreeStore(this);
        this.relatedJobStore = new RelatedJobStore(this);
        this.customerStore = new CustomerStore(this);
        this.overlayPopupStore = new OverlayPopupStore(this);
        this.dashboardStore = new DashboardStore(this);
        this.reportStore = new ReportStore(this);
        this.workerStore = new WorkerStore(this);
        this.managerLayerStore = new ManagerLayerStore(this);
        this.miniMapStore = new MiniMapStore(this);
        this.roleStore = new RoleStore(this);
        this.permissionStore = new PermissionStore(this);
        this.adminBoundaryStore = new AdminBoundaryStore(this);
        this.appConfigStore = new AppConfigStore(this);
        this.toggleDataOn = {};
        this.setReadyToStart(appStore.contexts?.tenant);
    }

    // TODO read from vdms
    getJobStatusColor = (statusId) =>
    {
        if (typeof (statusId) === 'string')
        {
            statusId = parseInt(statusId);
        }
        switch (statusId)
        {
            case 1:
            // case 'New':
                return '#3dcad4';
            case 2:
            // case 'Assigned':
                return '#bb99f7';
            case 3:
            // case 'In Progress':
                return '#37a6ff';
            case 4:
            // case 'Done':
                return '#8ae355';
            case 5:
            // case 'Cancel':
                return '#d4e3f6';
            default:
                return '#ccc';
        }
    };

    // TODO: replace this with comSvc.getDataReferences(layers);
    loadDataReferences = (layers) =>
    {
        return this.comSvc.getDataReferences(layers);
    };

    // TODO: move this to helper/utils
    getDataReferenceOptions = (layer, idField, labelField) =>
    {
        return CommonService.DataRefs[layer] && Array.isArray(CommonService.DataRefs[layer])
            ? CommonService.DataRefs[layer].map((data) =>
            {
                return {
                    id: `${data[idField]}`,
                    label: data[labelField],
                    color: 'var(--primary)',
                    ...data,
                };
            })
            : [];
    }

    setReadyToStart = (tenantConfig, autoUpdate) =>
    {
        if (!tenantConfig || tenantConfig.status >= TENANT_STATUS.readyToConfig)
        {
            // check rules
            this.http.get('/api/ffms/system/validate', AuthHelper.getVDMSHeader()).then((res) =>
            {
                let newStatus = tenantConfig.status;
                if (res && Object.keys(res).length === 0)
                {
                    this.readyToStart = true;
                    // newStatus = TENANT_STATUS.ready;
                }
                else
                {
                    this.readyToStart = false;
                    newStatus = TENANT_STATUS.userConfig;
                }

                // update tenant status
                if (autoUpdate && newStatus !== tenantConfig.status)
                {
                    this.tenantSvc.setTenantStatus(newStatus);
                }

                this.systemValidation = res || {};
            });
        }
        else
        {
            this.readyToStart = false;
        }
    }
}

decorate(FieldForceStore, {
    toggleDataOn: observable,

    systemValidation: observable,
    readyToStart: observable,
    setReadyToStart: action,
});

export default FieldForceStore;
