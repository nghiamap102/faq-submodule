import { decorate, observable, action, computed, runInAction } from 'mobx';
import _findIndex from 'lodash/findIndex';
import moment from 'moment';

import { LayerStore } from 'components/app/stores/LayerStore';

import JobService from 'extends/ffms/services/JobService';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { CommonHelper } from 'helper/common.helper';

import { AdministrativeService } from 'services/administrative.service';
import LayerService from 'services/layer.service';
import { Constants } from 'constant/Constants';
import DataEnum, { MAP_OPTIONS } from 'extends/ffms/constant/ffms-enum';
import { MapUtil } from 'components/app/Map/MapUtil';
import EmployeeService from 'extends/ffms/services/EmployeeService';
import { AppConstant } from 'constant/app-constant';


export class JobStore
{
    properties = []; // JOB properties
    appStore = null;
    jobFilter = [];
    jobCompleteDateBefore = null;
    jobCompleteDateAfter = null;
    isJobFiltered = false;
    jobConditions = {};
    jobStatuses = [];
    jobTypes = [];
    jobTypeAndEmployeeType = [];
    employees = [];
    selectedEmployeeOptions = [];
    customers = [];
    currentFilter = {};
    currentJob = {};
    isShowJobForm = false;
    isDel = false;
    isEdit = false;
    jobEnabled = false;
    jobLayerInfo = null;
    currentAssign = {};
    isAssign = false;
    employees = [];
    entries = [];
    jobEnabled = false;
    isLoading = false;
    isDownloading = false;
    mappingJobTypesEmployeeTypes = {};
    selectedPath = [];

    stateOptions = [];
    districtOptions = [];
    tehsilOptions = [];

    data = [];

    totalItem = 0;
    pageSize = 20;
    currentPage = 1;
    sorters = undefined;
    filterState = {};
    jobFormAction = 'create'; // create, update
    assignJob = {
        searchKey: '',
    };

    urlParams = {}; // save the search params when switch tabs, do not observable it

    isDrawer = false;

    jobBefore = [];

    constructor(fieldForceStore)
    {
        this.appStore = fieldForceStore?.appStore;
        this.comSvc = fieldForceStore?.comSvc;
        this.jobSvc = new JobService(fieldForceStore?.appStore?.contexts);
        this.empSvc = new EmployeeService(fieldForceStore?.appStore?.contexts);

        this.i18n = fieldForceStore?.appStore?.contexts?.i18n;
        this.modalContext = fieldForceStore?.appStore?.contexts?.modal;

        // this.layerStore = appStore.layerStore
        this.layerStore = new LayerStore(this.appStore);
        this.isShowJobForm = false;

        this.jobCompleteDateBefore = new Date();
        this.jobCompleteDateAfter = new Date();
        this.isJobFiltered = false;
        this.jobConditions = {};
        this.isDel = false;
        this.isAssign = false;
        this.jobStatuses = [];
        this.jobTypes = [];
        this.employees = [];
        this.customers = [];
        this.currentGridFilter = {
            page: 1,
            count: 20,
        };
        this.jobTypeAndEmployeeType = [];

        this.administrativeSvc = new AdministrativeService(AppConstant.vdms.url);
        this.layerSvc = new LayerService(AppConstant.vdms.url);
        this.mapUtil = new MapUtil(this.map);
        this.jobFormAction = 'create';
        this.assignJob = {
            searchKey: '',
        };
        this.resetFilterState();
    }
    
    getJob = async (nodeId) =>
    {
        if (nodeId)
        {
            const job = await this.jobSvc.getData(nodeId);

            this.setJob(job);

            return job;
        }
    };

    setDrawer = (isDrawer) =>
    {
        if (isDrawer !== undefined)
        {
            this.isDrawer = isDrawer;
        }
    };

    getJob = async (nodeId) =>
    {
        if (nodeId)
        {
            const job = await this.jobSvc.getData(nodeId);

            this.setJob(job);

            return job;
        }
    };

    setFilterState = (key, value) =>
    {
        this.filterState[key] = value;
    };

    setAllFilterState = (filter = {}, isReplace) =>
    {
        if (isReplace)
        {
            this.filterState = filter;
        }
        else
        {
            for (const key in filter)
            {
                if (filter.hasOwnProperty(key))
                {
                    this.filterState[key] = filter[key];
                }
            }
        }
    };

    resetFilterState = (searchKey) =>
    {
        const filterState = {
            Title: '',
            searchKey: searchKey,
            job_type_id: [],
            job_status_id: [],
            job_assigned_time: undefined,
            job_start_time: undefined,
            job_completed_time: undefined,
            job_assignee_guid: [],
        };
        this.filterState = filterState;
    };

    getFullFilterState = () =>
    {
        const filterState = {};

        for (const key in this.filterState)
        {
            const value = this.filterState[key];
            if (value && (!Array.isArray(value) || value.length > 0))
            {
                switch (key)
                {
                    case 'Title':
                        filterState[key] = { like: `${value}` };
                        break;
                    case 'searchKey':
                        filterState[key] = `${value}`;
                        break;
                    case 'job_type_id':
                    case 'job_status_id':
                    case 'job_assignee_guid':
                        filterState[key] = Array.isArray(value) && value.length === 1 ? value[0] : { inq: value };
                        break;
                    case 'job_assigned_time':
                    case 'job_start_time':
                    case 'job_completed_time':
                        filterState[key] = { between: [moment(value).startOf('date'), moment(value).endOf('date')] };
                        break;
                    default:
                        filterState[key] = Array.isArray(value) && value.length === 1 ? value[0] : { inq: value };
                        break;
                }
            }
        }
        filterState.skip = (this.currentPage - 1) * this.pageSize;
        filterState.take = this.pageSize;

        // add sorter(s)

        if (this.sorters)
        {
            let sorters = [...this.sorters];
            const index = _findIndex(sorters, (x) => x.id === 'job_destination_address');
            if (index > -1)
            {
                const col = sorters.splice(index, 1)[0];
                sorters = sorters.concat([
                    { id: 'job_destination_address_state', direction: col.direction },
                    { id: 'job_destination_address_district', direction: col.direction },
                    { id: 'job_destination_address_tehsil', direction: col.direction },
                    { id: 'job_destination_address_pincode', direction: col.direction },
                    { id: 'job_destination_address_village', direction: col.direction },
                    { id: 'job_destination_address_street', direction: col.direction },
                ]);
            }
            
            const fields = this.properties ? CommonHelper.toDictionary(this.properties, 'ColumnName', 'sortId') : {};
            filterState.sortBy = sorters.filter((x) => x.id && x.direction).map((col) =>
            {
                return {
                    Field: fields[col.id] ? fields[col.id] : col.id,
                    Direction: col.direction.toUpperCase(),
                };
            });
        }
        else
        {
            delete filterState.sortBy;
        }

        filterState['includeRelations'] = false;
        return filterState;
    };

    setSorters = (columns) =>
    {
        if (columns)
        {
            this.sorters = columns;
        }
    }

    getData = (filter, updateCount) =>
    {
        const filterState = filter ? filter : this.getFullFilterState();

        return this.jobSvc.search(filterState).then((result) =>
        {
            if (updateCount)
            {
                this.totalItem = result.total;
            }

            return result.data?.map((data) =>
            {
                const fullAddress = [
                    data.job_destination_address_street ? data.job_destination_address_street : null,
                    data.job_destination_address_village ? `${this.i18n.t('Làng')} ${data.job_destination_address_village}` : null,
                    data.job_destination_address_pincode ? `${this.i18n.t('Mã pin')}: ${data.job_destination_address_pincode}` : null,
                    data.job_destination_address_tehsil ? `${data.job_destination_address_tehsil}` : null,
                    data.job_destination_address_district ? `${data.job_destination_address_district}` : null,
                    data.job_destination_address_state ? `${data.job_destination_address_state}` : null,
                ].filter((x) => x).join(', ');
                data['job_destination_address'] = fullAddress;
                return data;
            });
        });
    };

    getDataCount = async (filter) =>
    {
        const filterState = filter ? filter : this.getFullFilterState();
        delete filterState.includeRelations;
        delete filterState.skip;
        delete filterState.take;

        this.totalItem = await this.comSvc.queryCount('jobs', filterState);
        return this.totalItem;
    }

    getDataDebounced = new AwesomeDebouncePromise(this.getData.bind(this), 300);

    setData = (data) =>
    {
        this.data = data;
    };

    updateData = (data) =>
    {
        this.data = this.data.map((d) =>
        {
            if (d.id === data.id)
            {
                return data;
            }
            return d;
        });
    };

    setPaging = (page, size = 20) =>
    {
        this.currentPage = page;
        if (size)
        {
            this.pageSize = size;
        }
    };
    
    toggleDel = () =>
    {
        this.isDel = !this.isDel;
    };

    setJobFormState = (isShowJobForm, action) =>
    {
        if (isShowJobForm !== undefined)
        {
            this.isShowJobForm = isShowJobForm;
        }

        if (action !== undefined)
        {
            this.jobFormAction = action;
        }
    };

    setJob = (job = {}) =>
    {
        const locationField = 'job_destination_location';
        if (job[locationField])
        {
            if (typeof (job[locationField]) === 'string')
            {
                job[locationField] = JSON.parse(job[locationField]);
            }
        }
        else
        {
            job[locationField] = { type: 'Point', coordinates: [MAP_OPTIONS.longitude, MAP_OPTIONS.latitude] };
        }
        this.currentJob = job;
    };

    getEmployeeTypeFromJobType = async (jobTypeId) =>
    {
        if (jobTypeId && (!this.mappingJobTypesEmployeeTypes[jobTypeId] || this.mappingJobTypesEmployeeTypes[jobTypeId].length === 0))
        {
            const jobTypeFilter = {
                jobtype_id: jobTypeId,
            };

            const mappingTypes = await this.jobSvc.getJobTypeAndEmployeeType(jobTypeFilter);
            this.mappingJobTypesEmployeeTypes[jobTypeId] = mappingTypes;
        }

        return this.mappingJobTypesEmployeeTypes[jobTypeId] || [];

    };

    setAssign = (toggle) =>
    {
        this.isAssign = toggle;
    };

    toggleAssign = () =>
    {
        this.isAssign = !this.isAssign;
    };

    getEmployeesData = async (filter = {}) =>
    {
        const { data, total } = await this.empSvc.search({
            skip: 0,
            take: 10,
            ...filter,
        });

        if (!data || data.length === 0)
        {
            return [];
        }

        return data.map((employee) =>
        {
            let display = `${employee.employee_full_name} (${employee.employee_username})`;
            if (!employee.employee_username && !employee.employee_full_name)
            {
                display = employee.employee_email;
            }

            return {
                id: employee.employee_guid,
                label: display || '-- Empty name --',
            };
        });
    };

    getEmpData = async (filter = {}) =>
    {
        const { data, total } = await this.empSvc.search({
            skip: 0,
            take: 10,
            ...filter,
        });

        this.entries = data;

        if (this.entries.length > 0)
        {
            this.employees = this.entries.map((entry) =>
            {
                let display = `${entry.employee_full_name} (${entry.employee_username})`;
                if (!entry.employee_username && !entry.employee_full_name)
                {
                    display = entry.employee_email;
                }

                return {
                    id: entry.employee_guid,
                    label: display || '-- Empty name --',
                };
            }) || [];
        }
        else
        {
            this.employees = [];
        }
    };

    getEmpDataDebounced = AwesomeDebouncePromise(this.getEmpData.bind(this), 300);

    add = async (jobObj) =>
    {
        const sendJob = Object.assign({}, jobObj);


        const newJob = await this.jobSvc.create(sendJob);
        if (newJob)
        {
            if (newJob.status && newJob.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: newJob.status.message || 'Không thể tạo công việc mới' });

            }
            else if (newJob.result && newJob.result === -1)
            {
                return { errorMessage: newJob.errorMessage, details: newJob.errorDetails };
            }
            else
            {
                // add new item to grid, remove last item of array
                sendJob.__secretKey = CommonHelper.uuid();
                this.data = [sendJob, ...this.data];
                if (this.data.length > this.pageSize)
                {
                    this.data.pop();
                }
                
                newJob.__secretKey = sendJob.__secretKey;
                this.getDataCount();
                const job = await this.bindJobData(newJob);
                return job;
            }
        }
        else
        {
            // for debugging
            // console.error('Add job not error but still return empty object', sendJob);
        }

        return newJob;
    };

    delete = async (jobId) =>
    {
        const findPos = _findIndex(this.data, (j) => j.job_guid === jobId);
        this.data.splice(findPos, 1);

        return this.jobSvc.delete(jobId).then((res) =>
        {
            if (res && res.count > 0)
            {
                this.getDataCount();
                // this.modalContext.toast({ type: 'success', message: 'Đã xóa công việc thành công' });
            }
            else
            {
                this.modalContext.toast({ type: 'error', message: res.errorMessage || 'Xóa công việc thất bại' });
            }
            return res;
        });
    };

    edit = async (jobId, jobObj, silent) =>
    {
        const job = await this.jobSvc.edit(jobId, jobObj);
        if (job)
        {
            if (job.status && job.status.success === false)
            {
                this.modalContext.toast({ type: 'error', message: job.status.message || 'Cập nhật thông tin công việc không thành công' });
            }
            else if (job.result && job.result === -1)
            {
                return { errorMessage: job.errorMessage, details: job.errorDetails };
            }
            else
            {
                const _job = await this.bindJobData(job);
                return _job;
            }
        }
        return job;
    };

    bindJobData = async (job) =>
    {
        if (job && job.job_guid)
        {
            // update job on grid
            const rs = await this.getData({ skip: 0, take: 1, job_guid: job.job_guid, includeRelations: true });

            if (rs && rs.length)
            {
                const data = rs[0];
                const findPos = _findIndex(this.data, (j) => j.job_guid === job.job_guid || (job.__secretKey && j.__secretKey === job.__secretKey));

                if (findPos > -1)
                {
                    this.data[findPos] = data;
                    return data;
                }
            }

            // update job in form
            // if (data.Id)
            // {
            //     const job = await this.getData({ Id: data.Id }).then((rs) => rs && rs.length ? rs[0] : rs);
            //     this.setJob(job);
            //     return job;
            // }
        }
        return job;
    };

    setRegionOptions = (level, regions) =>
    {
        const regionOptions = this.mapRegionOptions(regions || []);

        if (level === 0)
        {
            this.stateOptions = regionOptions;
            this.districtOptions = [];
            this.tehsilOptions = [];
        }

        if (level === 1)
        {
            this.districtOptions = regionOptions;
            this.tehsilOptions = [];
        }

        if (level === 2)
        {
            this.tehsilOptions = regionOptions;
        }
    };

    mapRegionOptions = (regions = []) =>
    {
        return regions && Array.isArray(regions) && regions.map((reg) =>
        {
            return {
                id: reg.AdministrativeID,
                label: reg.UniqueName || reg.Title,
                ...reg,
            };
        });
    };

    // todo: should move this function to common helper instead of duplicate code (use in customer store too)
    bindRegionOptions = async (field, state, district, tehsil) =>
    {
        state = !isNaN(state) ? parseInt(state) : state;
        district = !isNaN(district) ? parseInt(district) : district;
        tehsil = !isNaN(tehsil) ? parseInt(tehsil) : tehsil;

        let districts = undefined;
        let tehsils = undefined;
        
        const abStore = this.appStore.adminBoundariesStore;
        if (abStore)
        {
            this.setRegionOptions(0, abStore.countryRegion);
            if (state)
            {
                // LOAD DISTRICTS
                const stateOption = this.stateOptions.filter((r) => `${r[field]}`.toLowerCase() === `${state}`.toLowerCase())[0];
                
                if (stateOption)
                {
                    districts = await abStore.getChildByParentId(Constants.TYPE_DISTRICT, stateOption.AdministrativeID);
                    this.setRegionOptions(1, districts);

                    if (district)
                    {
                        // LOAD TEHSILS
                        const districtOption = this.districtOptions.filter((r) => `${r[field]}`.toLowerCase() === `${district}`.toLowerCase())[0];
                        if (districtOption)
                        {
                            tehsils = await abStore.getChildByParentId(Constants.TYPE_WARD, districtOption.AdministrativeID);
                            this.setRegionOptions(2, tehsils);
                        }
                    }
                }
            }
        }
    };

    getAdministrativeIds = (state, district, tehsil) =>
    {
        const result = {};

        const stateOption = this.stateOptions?.filter((r) => r.Title?.toLowerCase() === state?.toLowerCase())[0];
        if (stateOption)
        {
            result['state'] = stateOption.AdministrativeID;

            const districtOption = this.districtOptions?.filter((r) => r.Title?.toLowerCase() === district?.toLowerCase())[0];
            if (districtOption)
            {
                result['district'] = districtOption.AdministrativeID;
                
                const tehsilOption = this.tehsilOptions?.filter((r) => r.Title?.toLowerCase() === tehsil?.toLowerCase())[0];
                if (tehsilOption)
                {
                    result['tehsil'] = tehsilOption.AdministrativeID;
                }
            }
        }
    
        return result;
    }
    
    get lastSelected()
    {
        if (this.selectedPath && this.selectedPath.length)
        {
            return this.selectedPath[Math.min(2, this.selectedPath.length - 1)];
        }
        else
        {
            return null;
        }
    }

    getAssignableEmployees = async (jobTypeIds, employeeFilter) =>
    {
        let employeeTypes = null;

        for (let i = 0; i < jobTypeIds.length; i++)
        {
            const jobType = jobTypeIds[i];

            // get employee type from JOBTYPE_EMPLOYEETYPE table [{jobtype_id, employeetype_id},...]
            const mappingTypes = await this.getEmployeeTypeFromJobType(jobType);
            
            // get employee ids from mappingTypes [1,2,3,4]
            const _employeeTypeIds = mappingTypes?.map((t) => t.employee_type_id);

            // if employeeType = [] -> stop checking cause [] intersect with anything always []
            if (!_employeeTypeIds || _employeeTypeIds.length === 0)
            {
                break;
            }

            if (i === 0)
            {
                employeeTypes = [..._employeeTypeIds];
            }
            else
            {
                employeeTypes = CommonHelper.arrayIntersection(employeeTypes, _employeeTypeIds);
            }
        }


        if (employeeTypes && employeeTypes.length)
        {
            const empTypeDict = CommonHelper.toDictionary(await this.comSvc.getLayerListOptions('JOBTYPE_EMPLOYEETYPE', 'employee_type_id'), 'indexed', 'id');
            // get employees by employee type ids
            const filter = {
                includeRelations: false,
                employee_type_id: { inq: employeeTypes.map((x) => empTypeDict[x] || x) },
                employee_status: DataEnum.EMPLOYEE_STATUS.active,
                ...employeeFilter,
                skip: 0,
                take: 5
            };
            
            if (this.assignJob.searchKey)
            {
                filter.searchKey = `${this.assignJob.searchKey}`;
            }

            const result = await this.empSvc.search(filter);
            
            return result && result.total > 0 ? result.data : [];
        }
        return [];
    };

    getAssignableEmployeeOptions = async (jobTypeIds, employeeFilter) =>
    {
        const employees = await this.getAssignableEmployees(jobTypeIds, employeeFilter);

        if (Array.isArray(employees))
        {
            return employees?.map((emp) =>
            {
                return {
                    id: emp.employee_guid,
                    label: `${emp.employee_full_name ? emp.employee_full_name : ''}${emp.employee_username ? ` (${emp.employee_username})` : ''}`,
                    ...emp,
                };
            }) ?? [];
        }
        
        return [];
    };

    getAssignableEmployeeOptionsDebounced = new AwesomeDebouncePromise(this.getAssignableEmployeeOptions.bind(this), 300);

    setLoading = (isLoading) =>
    {
        this.isLoading = isLoading;
    };

    setDownloading = (isDownloading) =>
    {
        this.isDownloading = isDownloading;
    };

    setJobBefore = (jobBefore) =>
    {
        this.jobBefore = jobBefore;
    }
}

decorate(JobStore, {
    jobFilter: observable,
    jobCompleteDate: observable,
    jobCompleteDateAfter: observable,
    jobCompleteDateBefore: observable,
    isJobFiltered: observable,
    jobConditions: observable,
    jobTypes: observable,
    jobStatuses: observable,
    employees: observable,
    selectedEmployeeOptions: observable,
    customers: observable,
    currentFilter: observable,
    currentGridFilter: observable,
    currentJob: observable.deep,
    paging: observable,

    jobEnabled: observable,
    jobLayerInfo: observable,
    isDel: observable,
    isEdit: observable,
    jobTypeAndEmployeeType: observable,
    setJob: action,
    toggleDel: action,
    togglePanel: action,
    changeAttr: action,
    add: action,
    edit: action,
    delete: action,
    changeFromDate: action,
    changeToDate: action,
    addCondition: action,
    removeCondition: action,
    reloadCustomerList: action,
    loadJobTypes: action,
    isAssign: observable,
    getEmpData: action,
    setAssign: action,
    loadJobTypeAndEmployeeType: action,
    entries: observable,

    totalItem: observable,
    pageSize: observable,
    currentPage: observable,
    data: observable,
    isLoading: observable,
    setLoading: action,
    isDownloading: observable,
    setDownloading: action,
    filterState: observable,
    assignJob: observable,
    sorters: observable,

    bindJobData: action,
    setPaging: action,
    getData: action,
    setData: action,
    getDataCount: action,
    setFilterState: action,
    resetFilterState: action,
    getFullFilterState: action,
    setAllFilterState: action,

    setFilter: action,

    init: action,
    selectedPath: observable,
    lastSelected: computed,
    getChildByParentId: action,
    stateOptions: observable,
    districtOptions: observable,
    tehsilOptions: observable,
    setRegionOptions: action,
    isShowJobForm: observable,
    jobFormAction: observable,
    setJobFormState: action,
    setSorters: action,
    bindRegionOptions: action,
    getEmployeesData: action,
    shouldMapRerender: observable,

    getJob: action,
    isDrawer: observable,
    setDrawer: action,

    jobBefore: observable,
    setJobBefore: action,
});
