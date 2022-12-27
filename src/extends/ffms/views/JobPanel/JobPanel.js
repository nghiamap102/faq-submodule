import './JobPanel.scss';

import React, { Component } from 'react';
import { Provider, inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import _findIndex from 'lodash/findIndex';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import moment from 'moment';

import {
    PanelBody, SearchBox,
    Spacer, T,
    withI18n, Row, withModal,
    Drawer, PopOver, Button, DataGrid, withTenant, IconButton,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { RouterParamsHelper } from 'helper/router.helper';
import { DataTypes } from 'helper/data.helper';

import AssignJobPanel from 'extends/ffms/views/JobPanel/AssignJobPanel';
import JobForm from 'extends/ffms/views/JobPanel/JobForm';
import JobFilterPanel from 'extends/ffms/views/JobPanel/JobFilterPanel';
import { JOB_STATUS, MAP_OPTIONS } from 'extends/ffms/constant/ffms-enum';
import { FFMSCommonHelper } from 'extends/ffms/helper/common-helper';
import JobDetailPanel from 'extends/ffms/views/DetailView/JobDetailPanel';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';

const jobDetailTabs = [{
    id: 1,
    title: 'Thông tin chi tiết',
    hash: '#detail',
}, {
    id: 2,
    title: 'Công việc liên quan',
    hash: '#viewrelativejob',
    // link: add Route
}];
class JobPanel extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    jobStore = this.props.fieldForceStore.jobStore;
    relatedJobStore = this.props.fieldForceStore.relatedJobStore;

    comSvc = this.props.fieldForceStore.comSvc;

    jobFilterRef = React.createRef();
    jobAssignedButtonRef = React.createRef();
    mapOptions = this.props.tenantConfig.mapOptions ? this.props.tenantConfig.mapOptions : MAP_OPTIONS;

    state = {
        isEnableAssignButton: true,
        selectedRows: [],
        columns: [],
        sorters: [],
        formErrors: {},
        isShowMapPopup: false,
        triggerCustomerCreate: false,
        assignableEmployees: [],
        filterPanelActive: false,
        openPopupAssignee: false,
        currentJobLocation: {
            longitude: this.jobStore.currentJob['job_destination_location'] ? this.jobStore.currentJob['job_destination_location'].coordinates[0] : this.mapOptions.longitude,
            latitude: this.jobStore.currentJob['job_destination_location'] ? this.jobStore.currentJob['job_destination_location'].coordinates[1] : this.mapOptions.latitude,
        },
        editingJobId: '',
        tooltipAssignButton: '',
        deletingJobId: '',

        jobTypeOptions: [],
        jobStatusOptions: [],
        teamOptions: [],
        employeeTypeOptions: [],

        jobDetail: {},
        isRowActiveId: null,
        detailJobId: '',
    };

    async componentDidMount()
    {
        this.jobStore.appStore = this.props.appStore;
        
        // Restore params & set to url
        {
            if (this.jobStore.urlParams && Object.values(this.jobStore.urlParams).length !== 0)
            {
                RouterParamsHelper.setParams(null, this.props, this.jobStore.urlParams);
            }
        }

        // Must load first
        const res = await this.comSvc.getLayerListOptions('JOB', 'job_status_id');
        const jobStatusOptions = res.map((opt) =>
        {
            return {
                ...opt,
                color: this.fieldForceStore.getJobStatusColor(opt.id),
                textStyle: { color: 'var(--button-color)' },
            };
        });

        // Prepare grid columns
        await this.bindDataGridColumns(jobStatusOptions);

        this.setState({
            jobStatusOptions,
            location: this.props.location,
        });

        const filterFields = ['job_type_id'];
        const results = await Promise.all(filterFields.map((field) => this.comSvc.getLayerListOptions('JOB', field)));
        this.setState({
            jobTypeOptions: results[0],
        });

        // Load params
        await this.loadParams();

        const models = ['employee_team_id', 'employee_type_id'];
        Promise.all(models.map((field) => this.comSvc.getLayerListOptions('EMPLOYEE', field))).then((results) =>
        {
            this.setState({
                teamOptions: results[0],
                employeeTypeOptions: results[1],
            });
        });
    }
    

    componentDidUpdate = (prevProps) =>
    {
        const locationSearch = RouterParamsHelper.shouldLocationChanged(this.props.location, prevProps.location);
        if (locationSearch)
        {
            this.loadParams(locationSearch);
        }
    };

    loadParams = async (search) =>
    {
        const { pathPermission, hasPermissionNode, setSecondFeture, location, history, toast, t } = this.props;

        // init tabs
        const tabsJobDetail = jobDetailTabs.filter(tab =>
        {
            const feature = tab.hash.substring(1);
            const isAcess = hasPermissionNode(pathPermission, feature);
            return isAcess;
        });
        this.relatedJobStore.setTabs(tabsJobDetail);

        const params = {
            arrayFilters: ['job_type_id', 'job_status_id'],
            stringFilters: ['job_assignee_guid', 'Title', 'mode', 'select', 'page', 'pageSize', 'order', 'orderBy'],
            dateFilters: ['job_assigned_time', 'job_start_time', 'job_completed_time'],
            searchKey: DataTypes.String,
        };

        const searchParams = new URLSearchParams(this.props.location.search);

        const qs = RouterParamsHelper.getParams(this.props.location.search, params);

        for (const key in qs)
        {
            this.jobStore.urlParams[key] = qs[key];
        }

        const { mode, select, page, pageSize, order, orderBy, ...filterState } = qs;


        if (searchParams.get('job_assignee_guid'))
        {
            const job_assignee_guid = searchParams.get('job_assignee_guid');
            const guids = job_assignee_guid.split(',');
            const employees = await this.jobStore.getEmployeesData({
                skip: 0,
                take: guids.length,
                employee_guid: { inq: guids },
                includeRelations: false,
            });
            this.jobStore.selectedEmployeeOptions = employees;
            filterState['job_assignee_guid'] = guids;
        }
        this.jobStore.setAllFilterState(filterState, true);

        if (order && orderBy)
        {
            const sortColumns = [{ id: orderBy, direction: order }];
            this.setState({ sorters: sortColumns });
            this.jobStore.setSorters(sortColumns);
        }
        
        this.jobStore.setPaging(page ? Number(page) : 1, pageSize ? Number(pageSize) : 20);
        this.jobStore.setJobFormState(false, '');
          
        const shouldLoad = FFMSCommonHelper.shouldHandlePageLoad(search, params);
        if (shouldLoad && hasPermissionNode(pathPermission, 'view'))
        {
            this.handlePageLoad().then(() =>
            {
                if (this.jobStore.data && Array.isArray(this.jobStore.data))
                {
                    const index = this.jobStore.data.findIndex((d) => d.Id === select);
                    if (index > -1)
                    {
                        this.setState({
                            jobDetail: { ...this.jobStore.data[index] } ?? {},
                        });
                    }
                }
            });
        }
        
        if (mode && !this.checkMode_initTab(mode))
        {
            RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { mode: '', select: '', index: '' });
            return null;
        }

        if (mode === 'create')
        {
            this.jobStore.setJob();
            this.jobStore.setJobFormState(true, 'create');
        }
        else if (select && mode === 'edit')
        {
            this.setState({ editingJobId: select });
            const job = await this.jobStore.getJob(select);
            this.jobStore.setJobFormState(true, 'update');
            this.setState({ editingJobId: '' });
    
            if (job)
            {
                this.setState({
                    currentJobLocation: {
                        longitude: this.jobStore.currentJob['job_destination_location'] ? this.jobStore.currentJob['job_destination_location'].coordinates[0] : this.mapOptions.longitude,
                        latitude: this.jobStore.currentJob['job_destination_location'] ? this.jobStore.currentJob['job_destination_location'].coordinates[1] : this.mapOptions.latitude,
                    },
                });
            }
        }
        else if (select && mode === 'detail')
        {
            if (this.relatedJobStore.tabs.length !== 0)
            {
                this.setState({
                    detailJobId: select,
                    isRowActiveId: select,
                });
             
                this.jobStore.jobSvc.search({ Id: select, take: 1 }).then((result) =>
                {
                    this.setState({ detailJobId: '' });
                    this.jobStore.setDrawer(true);

                    if (result && result.data)
                    {
                        const job = Array.isArray(result.data) ? result.data[0] : result.data;
                        this.setState({ jobDetail: job });
                        if (job)
                        {
                            if (job['job_case_guid'])
                            {
                                this.relatedJobStore.getJobData({ job_case_guid: job['job_case_guid'], job_guid: { neq: job['job_guid'] } });
                            }
                            
                            this.fieldForceStore.comSvc.queryData('activity-logs', { activitylog_job_guid: job.job_guid, sortBy: [{ Field: 'activitylog_created_time', Direction: 'ASC' }] }).then((rs) =>
                            {
                                job.activityLogs = rs?.data || [];
                                this.setState({ jobDetail: job });
                            });
                        }
                    }
                });
            }
        }
    }

    // handle check permission and intit tab with role
    checkMode_initTab = (mode)=>
    {
        const { pathPermission, hasPermissionNode, location,setSecondFeature } = this.props;
        const feature = RouterParamsHelper.getModeAction(location);
        let isAccess = true;

        // check permission
        if (mode === 'detail')
        {
            this.relatedJobStore.initPermissionDetailTabs(location, (tab, isPermit) =>
            {
                setSecondFeature(tab && tab.hash ? tab?.hash.substring(1) : feature);

                if (!isPermit)
                {
                    isAccess = false;
                }
            });
        }
        else
        {
            setSecondFeature(feature);
            if (!hasPermissionNode(pathPermission, feature))
            {
                isAccess = false;
            }
        }
        return isAccess;
    }

    bindDataGridColumns = async (jobStatusOptions) =>
    {
        // will remove this
        const hiddenColumns = [
            'job_case_guid',
            'job_case_order',
            'job_jobsheet_guid',
            'job_jobsheet_order',
            'job_created_by',
            'job_guid',
            'job_before',
            'job_estimated_depart_time',
            'job_estimated_start_time',
            'job_estimated_completed_before_time',
            'job_estimated_completed_after_time',
            'job_depart_time',
            'job_customer_guid',
            'job_destination_location',
            'job_destination_address_street',
            'job_destination_address_state',
            'job_destination_address_district',
            'job_destination_address_tehsil',
            'job_destination_address_village',
            'job_destination_address_pincode',
            'job_estimated_duration',
            'job_estimated_distance',
        ];
        const columns = await this.comSvc.getDataGridColumns('jobs', hiddenColumns).then((cols) =>
        {
            return cols.map((c) =>
            {
                if (c.id === 'job_status_id')
                {
                    c.options = jobStatusOptions.map((opt) =>
                    {
                        return {
                            ...opt,
                            id: opt.indexed,
                        };
                    });
                }

                c.freeze = ['Title', 'job_assignee_guid'].indexOf(c.id) > -1;
                return c;
            });

        });

        const findPos = _findIndex(columns, (j) => j.id === 'job_customer_guid');
        columns.splice(findPos, 0, {
            hidden: false,
            id: 'job_destination_address',
            displayAsText: 'Địa chỉ',
            width: 600,
            isSortable: true,
        });

        const columnSorters = columns.filter((col) => col.isSortable).map((col) =>
        {
            return {
                id: col.id,
                direction: undefined,
            };
        });

        this.jobStore.properties = columns;
        this.setState({
            isNewJob: true,
            columns: columns,
            sorters: columnSorters,
        });
    }

    handleSearch = async (keyword) =>
    {
        const params = {
            searchKey: keyword,
            page: 1,
        };
        RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, params);
    };
    handleSearchDebounce = new AwesomeDebouncePromise(this.handleSearch.bind(this), 300);

    handleAssignJobClick = async () =>
    {
        const jobs = this.state.selectedRows;

        if (!this.isAssignable(jobs))
        {
            return;
        }

        if (jobs.length === 0)
        {
            this.props.toast({ type: 'error', message: 'Vui lòng chọn ít nhất một công việc để thực hiện phân công công việc' });
        }
        else
        {
            const jobTypes = CommonHelper.toDictionary(this.state.jobTypeOptions, 'indexed', 'id');

            const options = await this.jobStore.getAssignableEmployeeOptions(jobs.map((j) => jobTypes[j.job_type_id]));
            this.setState({
                assignableEmployees: options,
                openPopupAssignee: true,
            });
            if (!options || !options.length)
            {
                await this.jobStore.setAssign(false);
                this.setState({
                    openPopupAssignee: false,
                });
                this.props.toast({ type: 'error', message: 'Không có nhân viên nào đủ điều kiện nhập công việc này' });
            }
            else
            {
                await this.jobStore.setAssign(true);
            }
        }

    };

    isAssignable = (jobs) =>
    {
        if (!jobs || jobs.length === 0)
        {
            return false;
        }

        const jobStatus = CommonHelper.toDictionary(this.state.jobStatusOptions, 'indexed', 'id');

        let flag = true;
        for (let index = 0; index < jobs.length; index++)
        {
            const job = jobs[index];
            if (jobStatus[job.job_status_id] + '' !== `${JOB_STATUS.new}` || job.job_type_id === 0)
            {
                flag = false;
                break;
            }
        }
        return flag;
    };

    changeSelected = (checked, data) =>
    {
        let selectedRows = this.state.selectedRows;

        if (checked)
        {
            selectedRows.push(data);
        }
        else
        {
            // remove
            selectedRows = selectedRows.filter((x) => x.job_guid !== data.job_guid);
        }

        this.setState({
            selectedRows: selectedRows,
            isEnableAssignButton: this.isAssignable(selectedRows),
        });

        this.setShowTooltipAssignButton(checked);
    };

    changeAllSelected = (checked, data) =>
    {
        let selectedRows = this.state.selectedRows;
        selectedRows = checked ? data : [];

        this.setState({
            selectedRows: selectedRows,
            isEnableAssignButton: this.isAssignable(selectedRows),
        });
    }

    setShowTooltipAssignButton = (checked) =>
    {
        let tooltip = '';
        const isEnable = this.state.selectedRows.every((row) =>
        {
            if (row.job_status_id !== 1)
            {
                tooltip += this.props.t('Công việc %0% có trạng thái không phù hợp \n', [row.Title]);
            }
            return row.job_status_id === 1;
        });
        tooltip = tooltip || 'Lựa chọn không hợp lệ. Loại công việc phải là duy nhất.';
        if (checked === true && isEnable === false)
        {
            this.setState({
                tooltipAssignButton: tooltip,
            });
        }
        else
        {
            this.setState({
                tooltipAssignButton: '',
            });
        }
    }

    handlePageLoad = async (page, debounce) =>
    {
        this.jobStore.setLoading(true);
        page = page || this.jobStore.currentPage;
        this.jobStore.setPaging(page, this.jobStore.pageSize);

        const data = debounce ? await this.jobStore.getDataDebounced(null, true) : await this.jobStore.getData(null, true);

        this.jobStore.setData(data);

        this.setState({
            selectedRows: [],
            isEnableAssignButton: false,
            tooltipAssignButton: this.state.selectedRows.length === 0
                ? 'Chọn danh sách công việc với trạng thái mới khi giao cho nhân viên'
                : '',
        });
        this.jobStore.setLoading(false);
    };

    Actions = (row, index) =>
    {
        const jobStatus = CommonHelper.toDictionary(this.state.jobStatusOptions, 'indexed', 'id');
        const { pathPermission, hasPermissionNode } = this.props;


        return (
            <Row
                itemMargin={'sm'}
                crossAxisAlignment={'start'}
            >
                <Button
                    disabled = {!hasPermissionNode(pathPermission, 'edit')}
                    icon={'edit'}
                    type={'default'}
                    isLoading={row.Id === this.state.editingJobId}
                    onlyIcon
                    onClick={() =>
                    {
                        RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { mode: 'edit', select: row.Id });
                    }}
                />
                <Button
                    disabled = {this.relatedJobStore.tabs.length === 0}
                    icon={'info-square'}
                    type={'default'}
                    isLoading={row.Id === this.state.detailJobId}
                    onlyIcon
                    onClick={() => this.handleRowSelected(row)}
                />
                <Button
                    icon={'trash-alt'}
                    isLoading={row.Id === this.state.deletingJobId}
                    type={'default'}
                    title={'Chức năng chỉ dành cho công việc chưa phân công'}
                    disabled={(`${jobStatus[`${row.job_status_id}`]}` !== `${JOB_STATUS.new}`) ||
                                !hasPermissionNode(pathPermission, 'delete')}
                    onlyIcon
                    onClick={() => this.props.confirm({
                        message: `${this.props.t('Bạn có chắc chắn muốn xóa công việc "%0%" không?', [row.Title])}`,
                        onOk: async () =>
                        {
                            this.setState({ deletingJobId: row.Id });
                            await this.jobStore.delete(row.job_guid);
                            this.setState({ deletingJobId: '' });

                            if (this.jobStore.data.length === 0)
                            {
                                if (this.jobStore.currentPage * this.jobStore.pageSize < this.jobStore.totalItem)
                                {
                                    this.handlePageLoad();
                                }
                                else
                                {
                                    RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { page: Math.max(this.jobStore.currentPage - 1, 1) });
                                }
                            }
                            else if (this.jobStore.data.length < this.jobStore.pageSize)
                            {
                                const totalPages = Math.ceil(this.jobStore.totalItem / this.jobStore.pageSize);
                                if (this.jobStore.currentPage !== totalPages)
                                {
                                    this.handlePageLoad();
                                }
                            }
                        },
                    })}
                />
            </Row>
        );
    };

    handleRowSelected = (row, col, hash) =>
    {
        if (this.relatedJobStore.tabs.length === 0)
        {
            return;
        }

        if (!hash)
        {
            this.props.location.hash = '#detail';
        }
        else
        {
            this.props.location.hash = hash;
        }
        RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { mode: 'detail', select: row.Id });
    };

    closeDrawer = () =>
    {
        this.jobStore.setDrawer(false);
        this.setState({
            isRowActiveId: null,
        });
        RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { mode: '', select: '', index: '' });
    }

    handleCloseChange = () =>
    {
        this.setState({ openPopupAssignee: false });

        const selectedJobIds = this.state.selectedRows.map((job) => job.job_guid);

        const selectedJobs = this.jobStore.data.filter((job) => selectedJobIds.includes(job.job_guid));

        this.setState({ selectedRows: selectedJobs, isEnableAssignButton: this.isAssignable(selectedJobs) });
    };

    handleExportFile = async () =>
    {
        const { filterState } = this.jobStore;
        const queryFile = {
            sortInfo: [],
            searchKey: '',
            filterQuery: [],
            count: -1,
        };
        // loading button export
        this.jobStore.setDownloading(true);
        // get filter
        if (filterState)
        {
            queryFile.sortInfo = this.state.sorters?.filter((x) => x.direction !== undefined)
                .map((col) =>
                {
                    return {
                        Field: col.id,
                        Direction: col.direction.toUpperCase(),
                    };
                });
            const filters = [];
            const dictionary = {
                job_status_id: CommonHelper.toDictionary(this.state.jobStatusOptions, 'indexed', 'id'),
                job_type_id: CommonHelper.toDictionary(this.state.jobTypeOptions, 'indexed', 'id'),
                job_assignee_guid: this.jobStore.selectedEmployeeOptions,
            };

            const mappings = {
                job_status_id: [],
                job_type_id: [],
                job_assignee_guid: [],
            };


            for (const f in filterState)
            {
                if (filterState.hasOwnProperty(f) && filterState[f])
                {
                    switch (f)
                    {
                        case 'Title':
                            filters.push(`${f}:(${filterState[f]}*)`);
                            break;
                        case 'job_assigned_time':
                        case 'job_start_time':
                        case 'job_completed_time':
                            // (job_start_time:[2021-02-28T17:00:00.000Z TO *]) AND (job_start_time:[* TO 2021-03-01T16:59:59.999Z])
                            filters.push(`(${f}:[${moment(filterState[f]).startOf('date').toISOString()} TO *]) AND (${f}:[* TO ${moment(filterState[f]).endOf('date').toISOString()}])`);
                            break;
                        case 'searchKey':
                            queryFile.searchKey = filterState?.searchKey;
                            break;
                        default:
                            if (Array.isArray(filterState[f]) && filterState[f].length > 0)
                            {
                                const field = `${f}_sfacet`;

                                filterState[f].map((value) =>
                                {
                                    if (f === 'job_assignee_guid')
                                    {
                                        dictionary[f].forEach((emp) =>
                                        {
                                            if (emp?.id === value)
                                            {
                                            // get username
                                                mappings[f].push(`(${emp.label.match(/\((.*)\)/).pop()})`);
                                            }
                                        });
                                    }
                                    else
                                    {
                                        for (const t in dictionary[f])
                                        {
                                            if (dictionary[f][t] === value)
                                            {
                                                mappings[f].push(`${field}:("${t}")`);
                                            }
                                        }
                                    }
                                });

                                if (mappings[f] && mappings[f].length > 0)
                                {
                                    filters.push(mappings[f].length === 1 ? mappings[f] : `(${mappings[f].join(' OR ')})`);
                                }
                            }
                            break;
                    }
                }
            }

            queryFile.filterQuery = [`${filters.join(' AND ')}`];
        }
        // Download
        await this.comSvc.getExportQueryFile('JOB', queryFile);
        this.jobStore.setDownloading(false);
        // end loading button export
    };

    render()
    {
        const { currentJob, jobFormAction } = this.jobStore;
        const { columns, selectedRows, isEnableAssignButton, tooltipAssignButton } = this.state;
        const { pathPermission, hasPermissionNode } = this.props;

        const items = this.jobStore.data && this.jobStore.data.length && this.jobStore.data.map((j) =>
        {
            const dataEntry = Object.assign({}, j);
            dataEntry.isSelected = this.state.selectedRows.some((row) => row.job_guid === j.job_guid);

            return dataEntry;
        });

        return (
            <Provider>
                <PanelBody className='job-manager'>
                    <Row
                        itemMargin={'md'}
                        crossAxisSize={'min'}
                        flex={0}
                    >
                        <Button
                            disabled = {!hasPermissionNode(pathPermission, 'create')}
                            type={'success'}
                            className={'btn-add ellipsis'}
                            text={'Tạo công việc mới'}
                            onClick={() => RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { mode: 'create' })}
                        />

                        <Button
                            type={'success'}
                            className={'btn-assign ellipsis'}
                            text={<T params={[selectedRows.length]}>PHÂN CÔNG (%0%)</T>}
                            disabled={!isEnableAssignButton || !hasPermissionNode(pathPermission, 'assign')}
                            tooltip={tooltipAssignButton}
                            innerRef={this.jobAssignedButtonRef}
                            onClick={this.handleAssignJobClick}
                        />

                        {
                            this.state.openPopupAssignee && (
                                <PopOver
                                    width={'25rem'}
                                    anchorEl={this.jobAssignedButtonRef}
                                    onBackgroundClick={() =>
                                    {
                                        this.setState({ openPopupAssignee: false });
                                    }}
                                >
                                    <AssignJobPanel
                                        employeeOptions={this.state.assignableEmployees}
                                        jobSelectedOptions={this.state.selectedRows}
                                        teamOptions={this.teamOptions}
                                        employeeTypeOptions={this.employeeTypeOptions}
                                        onClose={this.handleCloseChange}
                                    />
                                </PopOver>
                            )}

                        <Spacer
                            style={{ marginLeft: 'auto' }}
                            size={'1.5rem'}
                        />
                      

                        {
                            hasPermissionNode(pathPermission, 'view') && (
                                <>
                                    <Button
                                        type={'default'}
                                        className={`btn-filter ${this.state.isShowfilterPopup ? 'active' : ''} ellipsis`}
                                        icon={'filter'}
                                        text={'Lọc dữ liệu'}
                                        innerRef={this.jobFilterRef}
                                        onClick={() =>
                                        {
                                            this.setState({ filterPanelActive: true });
                                        }}
                                    />
                                    {
                                        this.state.filterPanelActive && (
                                            <PopOver
                                                width={'25rem'}
                                                anchorEl={this.jobFilterRef}
                                                onBackgroundClick={() =>
                                                {
                                                    this.setState({ filterPanelActive: false });
                                                }}
                                            >
                                                <JobFilterPanel
                                                    jobStatusOptions={this.state.jobStatusOptions}
                                                    jobTypeOptions={this.state.jobTypeOptions}
                                                    employeeOptions={this.jobStore.employees}
                                                    onFilterChange={(key, value) => RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { [key]: value, page: 1 })}
                                                />
                                            </PopOver>
                                        )}

                                    <SearchBox
                                        width={'25rem'}
                                        flex="0"
                                        placeholder="Nhập từ khóa để tìm kiếm"
                                        value={this.jobStore.filterState.searchKey}
                                        onChange={(keyword) =>
                                        {
                                            this.jobStore.setFilterState('searchKey', keyword);
                                            this.handleSearchDebounce(keyword);
                                        }}
                                    />
                                </>
                            )}
                    </Row>

                    {
                        hasPermissionNode(pathPermission, 'view') && (
                            <DataGrid
                                columns={columns}
                                items={items || []}
                                rowKey={'Id'}
                                pagination={{
                                    pageIndex: this.jobStore.currentPage,
                                    pageSize: this.jobStore.pageSize,
                                    pageSizeOptions: [10, 20, 50, 100],
                                    onChangePage: (pageIndex) => RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { page: pageIndex }),
                                    onChangeItemsPerPage: (pageSize) => RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { page: 1, pageSize }),
                                }}
                                total={this.jobStore.totalItem}
                                toolbarVisibility={{ showColumnSelector: true, showReloadButton: true }}
                                toolbarActions={(
                                    <IconButton
                                        tooltip="Tải tập tin này"
                                        icon="download"
                                        variant="fade"
                                        isRound={false}
                                        isLoading={this.jobStore.isDownloading}
                                        onClick={() => this.handleExportFile()}
                                    />
                                )}
                                trailingControlColumns={[
                                    {
                                        width: 140,
                                        headerCellRender: 'Thao tác',
                                        rowCellRender: this.Actions,
                                        freezeEnd: true,
                                    },
                                ]}
                                sorting={{
                                    columns: this.state.sorters,
                                    isSingleSort: true,
                                    onSort: (columns) =>
                                    {
                                        this.setState({ sorters: columns });
                                        RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, { sort: columns });
                                    },
                                }}
                                loading={this.jobStore.isLoading}
                                isFixedHeader
                                rowNumber
                                selectRows={{
                                    onChange: this.changeSelected,
                                    onChangeAll: this.changeAllSelected,
                                }}
                                onCellDoubleClick={(e, row, col) => this.handleRowSelected(row, col)}
                                onReload={() => this.handlePageLoad()}
                            />
                        )}
                </PanelBody>
                {
                    this.jobStore.isShowJobForm && (
                        <JobForm
                            formData={currentJob}
                            formAction={jobFormAction}
                            properties={columns}
                        />
                    )}
                {
                    this.jobStore.isDrawer && (
                        <Drawer
                            position={'right'}
                            width={'25rem'}
                            animationIn={'slideInRight'}
                            animationOut={'slideOutRight'}
                            onClose={this.closeDrawer}
                        >
                            <JobDetailPanel
                                data={this.state.jobDetail}
                                properties={columns}
                            />
                        </Drawer>
                    )}
            </Provider>
        );
    }
}

JobPanel = inject('appStore', 'fieldForceStore')(observer(JobPanel));
JobPanel = withTenant(withModal(withI18n(withPermission(withRouter(JobPanel)))));
export default JobPanel;
