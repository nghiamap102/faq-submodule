import { decorate, observable, action } from 'mobx';
import React from 'react';
import _omit from 'lodash/omit';
import _groupBy from 'lodash/groupBy';
import moment from 'moment';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import {
    Row, Container, Spacer,
    Button, Sub1, TB1, T,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { CommonHelper } from 'helper/common.helper';
import { isEmpty } from 'helper/data.helper';

import { AdministrativeService } from 'services/administrative.service';
import JobService from 'extends/ffms/services/JobService';

import { JobInfo } from 'extends/ffms/views/JobInfoPopup/JobInfo';
import { JobReport } from 'extends/ffms/views/JobInfoPopup/JobReport';
import { JOB_STATUS } from 'extends/ffms/constant/ffms-enum';


const EMPLOYEE_GRAPH_TEMPLATE = {
    'fromLayer': 'EMPLOYEE',
    'fromFilterQuery': null,
    'FromField': 'employee_username',
    'returnRoot': false,
    'returnOnlyLeaf': true,
    'toLayer': 'JOB',
    'toField': 'job_assignee_guid',
    'toFilterQuery': null,
};

export class JobFilterStore
{
    appStore = null;
    jobCompleteDateBefore = null;
    jobCompleteDateAfter = null;
    isJobFiltered = false;
    jobConditions = {};
    jobStatuses = [];
    jobTypes = [];
    employeeTypes=[];

    jobs = [];
    jobTree = [];
    currentFilter = {};
    currentJob = null;
    jobDetailActive = false;
    panStatus = {};
    employees = [];
    administrativeSvc = new AdministrativeService();
    isFilterPanel = false;
    searchKey = '';
    jobSwitcher = {
        dateTime: true,
        advanceFilter: true,
    }


    tempFilter = {};

    assigneeMap = {};

    loading = false;
    sortField = 'job_created';
    sortDirection = 'ASC';
    totalItem = 0;
    MAXIMUM = 50;
    state = {
        showJobReport: false,
    };
    urlParams = {};

    constructor(fieldForceStore)
    {
        this.fieldForceStore = fieldForceStore;

        this.comSvc = fieldForceStore?.comSvc;
        this.jobSvc = new JobService(fieldForceStore?.appStore?.contexts);

        // this.layerStore = appStore.layerStore
        this.jobCompleteDateBefore = new Date();
        this.jobCompleteDateAfter = new Date();
        this.isJobFiltered = false;
        this.jobDetailActive = false;
        this.estimated = false;
        this.panStatus = {
            isPanned: false,
            panEntry: '',
        };
        this.jobConditions = {};
        this.jobStatuses = [];
        this.jobTypes = [];
        this.employees = [];
        this.jobs = [];
        this.jobTree = [];
        this.searchKey = '';
        this.clearFilter();

    }

    set(key, data)
    {
        if (key && this.hasOwnProperty(key))
        {
            this[key] = data;
        }
    }

    showJobDetailPopup = async (data) =>
    {
        const rs = await this.jobSvc.gets({ job_guid: data.job_guid });
        const jobDetail = Array.isArray(rs) && rs.length ? rs[0] : rs;
        if (jobDetail && typeof (jobDetail) === 'object')
        {
            const jobStatusId = await this.comSvc.getDatabaseValue('JOB', 'job_status_id', jobDetail.job_status_id);
            this.fieldForceStore.overlayPopupStore.add({
                className: 'no-padding-body',
                id: jobDetail.Id,
                title: (
                    <Container flex={1}>
                        <Row itemMargin={'sm'} crossAxisAlignment={'center'}>
                            <FAIcon
                                icon={'map-marker'}
                                type={'solid'}
                                size={'1rem'}
                                color={this.fieldForceStore.getJobStatusColor(jobStatusId)}
                            />
                            <Spacer/>
                            <TB1>{jobDetail.Title}</TB1>
                            <Spacer/>
                            <Sub1>({jobDetail.job_type_id})</Sub1>
                        </Row>
                    </Container>
                ),
                content: <JobInfo data={jobDetail}/>,
                footer: (jobStatusId === JOB_STATUS.done || jobStatusId === JOB_STATUS.cancel) &&
                <Row mainAxisAlignment={'start'}>
                    <Button
                        key={jobDetail.Id}
                        text={'Xem báo cáo công việc'}
                        type={'info'}
                        onClick={() =>
                        {
                            this.showJobReportPopup(jobDetail);
                        }}
                    />
                </Row>,
                padding: '0',
                width: '60rem',
                height: 'auto',
                maxHeight: '65%',
                minHeight: '50%',
            });
        }
    };
    showJobReportPopup = async (data) =>
    {
        this.fieldForceStore.overlayPopupStore.add({
            className: 'no-padding-body',
            id: `${data.Id}-report`,
            title: data.Title || 'BÁO CÁO CÔNG VIỆC',
            content: <JobReport data={data} />,
            padding: '0',
            height: 'auto',
            maxHeight: '85%',
            minHeight: '50%',
            width: '50rem',
        });
    };

    getJobData = async (filter = {}) =>
    {
        this.setLoading(true);

        if (filter.skip === undefined)
        {
            filter.skip = 0;
        }
        if (filter.take === undefined)
        {
            filter.take = this.MAXIMUM;
        }

        filter.take = Math.min(filter.take, this.MAXIMUM);

        if (this.sortField && this.sortDirection)
        {
            filter.sortBy = [{ Field: this.sortField, Direction: this.sortDirection }];
        }

        if (this.searchKey.length >= 3 || (this.isFilterPanel && this.searchKey.length > 0))
        {
            if (filter.graphQuery)
            {
                filter.graphQuery.toFilterQuery.push(`${this.searchKey}`);
            }
            else
            {
                filter.searchKey = `${this.searchKey}`;
            }
        }

        const counter = this.jobSwitcher.advanceFilter ? await this.jobSvc.statFields(filter) : null;
        counter && this.set('fieldCounter', counter);

        const result = await this.jobSvc.search(filter);

        this.setLoading(false);

        if (result && Array.isArray(result.data))
        {
            const jobStatus = CommonHelper.toDictionary(this.jobStatuses, 'jobstatus_name', 'jobstatus_id');
            // this.jobs = await this.getAdministrativeValues(rs.data.data);
            this.jobs = result.data.map((d) =>
            {
                d.job_status_id = jobStatus[d.job_status_id];
                d.treeNodeInfo = {
                    'icon': {
                        icon: 'info-circle',
                        type: 'light',
                        tooltip: 'Xem chi tiết',
                        onClick: async () =>
                        {
                            this.jobDetailActive = !this.jobDetailActive;
                            this.currentJob = {
                                ..._omit(d, 'job_destination_location'),
                                job_destination_location: JSON.stringify(
                                    d.job_destination_location,
                                ),
                            };

                            await this.showJobDetailPopup(d);
                        },
                    },
                    'job_created': d.job_created,
                    'Assignee': d.job_assignee_guid ? d.job_assignee_guid : <T>Chưa phân công</T>,
                    'time': {
                        'completed': d.job_completed_time && new Date(d.job_completed_time),
                        'start': d.job_start_time && new Date(d.job_start_time),
                        'estimated': {
                            'start': d.job_estimated_start_time && new Date(d.job_estimated_start_time),
                            'completed': d.job_estimated_completed_before_time && new Date(d.job_estimated_completed_before_time),
                        },
                    },
                    'address': {
                        'state': d.job_destination_address_state,
                        'district': d.job_destination_address_district,
                        'tehsil': d.job_destination_address_tehsil,
                    },
                };
                return d;
            });

            this.totalItem = result.total;
        }
        else
        {
            this.jobs = [];
            this.totalItem = 0;
        }

        // Jake's note: Below is the GroupByEmployee execution of the tree. Commented for future use.
        // const jobsByEmployee = _groupBy(rawData, c => c.job_assignee_guid);
        // this.jobTree = this.buildTree(jobsByEmployee);
        this.jobTree = { '': this.jobs };

        return this.jobTree;
    };

    getJobDataDebounced = AwesomeDebouncePromise(this.getJobData.bind(this), 500);

    getFilter = (value, key, paramKey_fieldName)=>
    {
        const dataFilter = value.map(item =>`"${paramKey_fieldName[key]?.dict[item]}"`);

        // object to array and convert value => "value"
        const dataEmptyFilter = Object.values(paramKey_fieldName[key]?.dict).map(item => `"${item}"`);

        if (value[0] === '_')
        {
            return `NOT ${paramKey_fieldName[key]?.id}:(${dataEmptyFilter.join(' OR ')})`;
        }
        else
        {
            return `${paramKey_fieldName[key]?.id}:(${dataFilter.join(' OR ')})`;
        }
    };

    setFilter = async (filter) =>
    {
        const filterQuery = [];
        const filterGraphQuery = [];
        const _filters = {};

        const jStatusDict = CommonHelper.toDictionary(this.jobStatuses, 'jobstatus_id', 'indexed');
        const jTypes = CommonHelper.toDictionary(this.jobTypes, 'jobtype_id', 'indexed');
        const eTypeDict = CommonHelper.toDictionary(this.employeeTypes, 'employeetype_id', 'indexed');
        const eTeamDict = CommonHelper.toDictionary(this.teams, 'team_id', 'indexed');

        const paramKey_fieldName = {
            jobStatuses: { id: 'job_status_id_sfacet', dict: jStatusDict },
            jobTypes: { id: 'job_type_id_sfacet', dict: jTypes },
            employeeTypes: { id: 'employee_type_id_sfacet', dict: eTypeDict },
            teams: { id: 'employee_team_id_sfacet', dict: eTeamDict } ,
        };

        filter && this.setCurrentFilter(filter);

        if (this.jobSwitcher.dateTime)
        {
            const job_created = `job_created:[${filter.from.toISOString()} TO ${filter.to.toISOString()}]`;
            filterQuery.push(job_created);
        }

        // object value => condition and; array value => condition or
        Object.entries(filter).forEach(([key, value]) =>
        {
            if (['jobStatuses', 'jobTypes'].includes(key) && this.jobSwitcher.advanceFilter && Array.isArray(value))
            {
                const filter = this.getFilter(value, key, paramKey_fieldName);
                filterQuery.push(filter);
            }
            if (['employeeTypes', 'teams'].includes(key) && this.jobSwitcher.advanceFilter && Array.isArray(value))
            {
                const filter = this.getFilter(value, key, paramKey_fieldName);
                filterGraphQuery.push(filter);
            }
        });

        if (filterGraphQuery.length > 0)
        {
            _filters.graphQuery = {
                ...EMPLOYEE_GRAPH_TEMPLATE,
                fromFilterQuery: filterGraphQuery,
                ...filterQuery?.length > 0 && { toFilterQuery: filterQuery },
            };
            _filters.take = -1;
        }
        else if (filterQuery?.length > 0)
        {
            _filters.filterQuery = filterQuery;
        }

        await this.getJobDataDebounced(_filters);

        if (isEmpty(_filters))
        {
            // prevent client fetch all data, force user to input at least one filter Condition
            this.fieldCounter = {};
            this.jobs = [];
            // this.jobTree = await this.buildTree([]);
            this.jobTree = [
                {
                    id: 'jobs',
                    child: [],
                    arrowVisible: false,
                    root: false,
                    expand: true,
                },
            ];
        }
    };

    clearFilter = () =>
    {
        this.currentFilter = {
            from: moment().startOf('date'),
            to: moment().endOf('date'),
            statuses: [],
        };
        this.searchKey = '';

        // this.setFilter();
    }

    setCurrentFilter = (filter) =>
    {
        if (filter)
        {
            const currentFilter = CommonHelper.clone(this.currentFilter);
            for (const key in filter)
            {
                switch (key)
                {
                    case 'sortDirection':
                    case 'sortField':
                    {
                        if (this.hasOwnProperty(key))
                        {
                            this[key] = filter[key];
                            delete filter[key];
                        }
                        break;
                    }
                    default:
                        if (!isEmpty(filter[key]))
                        {
                            currentFilter[key] = filter[key];
                        }
                        break;
                }
            }
            this.set('currentFilter', currentFilter);
        }
    };

    toggleFilterPanel = () =>
    {
        this.isFilterPanel = !this.isFilterPanel;
    };

    setLoading = (loading) =>
    {
        this.loading = loading;
    }
}

decorate(JobFilterStore, {
    jobFilter: observable,
    jobCompleteDate: observable,
    jobCompleteDateAfter: observable,
    jobCompleteDateBefore: observable,
    isJobFiltered: observable,
    jobDetailActive: observable,
    panStatus: observable.ref,
    jobConditions: observable,
    jobs: observable,
    jobTree: observable,
    employees: observable,
    currentFilter: observable,
    currentJob: observable,
    jobLayerInfo: observable,
    jobSwitcher: observable,

    set: action,
    getJobData: action,
    changeFromDate: action,
    changeToDate: action,
    addCondition: action,
    removeCondition: action,
    isFilterPanel: observable,
    toggleFilterPanel: action,

    loading: observable,
    sortDirection: observable,
    totalItem: observable,
    searchKey: observable,
    tempFilter: observable,
    setLoading: action,
    setCurrentFilter: action,

    fieldCounter: observable,
});
