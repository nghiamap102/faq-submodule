import './JobFeatureView.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import {
    Row, PanelHeader, PanelBody, SearchBox,
    HD3, T, Container, ToggleButton, Column,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { DataTypes } from 'helper/data.helper';

import { JobTreeView } from 'extends/ffms/views/JobFilterView/JobTreeView';


// layerName : type_name => typeName
const convertLayersToJobName = (layerName) =>
{
    if (layerName)
    {
        let [type, name ] = layerName.split('-');
        name = name ? (name?.charAt(0).toUpperCase() + name.slice(1)) : '';
        return type + name;
    }
    return null;
};


const jobNameLayer = ['job-statuses', 'job-types','employee-types', 'teams'];
const jobName_id = {
    'job-statuses': 'jobstatus_id',
    'job-types': 'jobtype_id',
    'employee-types': 'employeetype_id',
    'teams': 'team_id',
};

class JobFeatureView extends Component
{
    featureBarStore = this.props.appStore.featureBarStore;
    jobFilterStore = this.props.fieldForceStore.jobFilterStore;
    commonService = this.jobFilterStore.comSvc;

    statuses = [];

    state ={
        initData: false,
    }

    componentDidMount()
    {
        // Restore params & set to url
        if (this.jobFilterStore.urlParams && Object.values(this.jobFilterStore.urlParams).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.jobFilterStore.urlParams);
        }
        const promise = [
            this.commonService.getLayerListOptions('JOB', 'job_status_id'),
            this.commonService.getLayerListOptions('JOB', 'job_type_id'),
            this.commonService.getLayerListOptions('EMPLOYEE','employee_type_id'),
            this.commonService.getLayerListOptions('EMPLOYEE', 'employee_team_id'),
        ];

        Promise.all(promise).then(dataRefs =>
        {
            let currentFilter = {};

            dataRefs.forEach((data, index) =>
            {
                if (data?.length > 0)
                {
                    const layer = jobNameLayer[index];
                    const jobName = convertLayersToJobName(layer);
                    this.jobFilterStore[jobName] = data;

                    currentFilter = { ...currentFilter, [jobName]: data.map(x => (parseInt(x[jobName_id[layer]]))) };
                }
            });

            this.jobFilterStore.set('currentFilter', { ...currentFilter });

            this.loadParams();

            this.setState({ initData: true });
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

    loadParams = () =>
    {
        const qs = RouterParamsHelper.getParams(this.props.location.search, {
            intFilters: ['jobStatuses', 'jobTypes', 'employeeTypes', 'teams'],
            stringFilters: [ 'order', 'orderBy'],
            from: DataTypes.Number,
            to: DataTypes.Number,
            searchKey: DataTypes.String,
            advanceOn: DataTypes.Boolean,
            timeOn: DataTypes.Boolean,
        });

        const { jobTypes, jobStatuses,employeeTypes,teams, order, orderBy, from, to, searchKey, advanceOn, timeOn } = qs;

        this.jobFilterStore.urlParams = { ...this.jobFilterStore.urlParams,...qs };
        this.jobFilterStore.searchKey = searchKey ?? '';

        this.jobFilterStore.set('jobSwitcher', {
            dateTime: timeOn === undefined ? true : timeOn,
            advanceFilter: advanceOn === undefined ? true : advanceOn,
        });

        const filters = {
            sortDirection: order || 'ASC',
            sortField: orderBy || 'job_created',

            from: from ? moment(from) : moment().startOf('date'),
            to: to ? moment(to) : moment().endOf('date') ,

            jobStatuses: jobStatuses ? [...jobStatuses] : null,
            jobTypes: jobTypes ? [...jobTypes] : null,
            employeeTypes: employeeTypes ? [...employeeTypes] : null,
            teams: teams ? [...teams] : null,
        };

        this.jobFilterStore.setFilter(filters);
    };

    loadParamsDebounced = new AwesomeDebouncePromise(this.loadParams.bind(this), 200);

    handleClose = () =>
    {
        this.props.history.push('/' + this.props.history.location.pathname.split('/')[1]);
    };

    handleFilterJobBtnClick = () =>
    {
        this.jobFilterStore.toggleFilterPanel();
    };

    handleKeyword = (searchKey) =>
    {
        this.jobFilterStore.searchKey = searchKey;
        // this.handleJobLoad();
        RouterParamsHelper.setParams(this.jobFilterStore.urlParams, this.props, { searchKey });

    };
    // handleSortClick = (direction) =>
    // {
    //     // this.handleJobLoad({ sortDirection: direction === this.jobFilterStore.sortDirection ? undefined : direction });
    //     RouterParamsHelper.setParams(this.jobFilterStore.urlParams, this.props, { order: direction });

    // };


    render()
    {
        const filterString = this.jobFilterStore.filterTime ? `(${moment(this.jobFilterStore.currentFilter.from).format('L')})` : '';
        return (
            <>
                <PanelHeader
                    actions={[
                        { icon: 'times', onClick: this.handleClose },
                    ]}
                >
                    <T>CÔNG VIỆC VÀO</T> {filterString}
                </PanelHeader>

                <PanelBody className={'job_feature_view'}>
                    <Column height={'100%'}>
                        <Row
                            itemMargin={'md'}
                            crossAxisSize={'min'}
                            flex={0}
                        >
                            <SearchBox
                                placeholder={'Nhập từ khóa để tìm kiếm'}
                                value={this.jobFilterStore.searchKey}
                                onChange={this.handleKeyword}
                            />
                            <ToggleButton
                                icon={'filter'}
                                pressed={this.jobFilterStore.isFilterPanel}
                                disabled={!this.state.initData}
                                className={`btn-filter ${this.jobFilterStore.isFilterPanel ? 'active' : ''}`}
                                onlyIcon
                                onClick={this.handleFilterJobBtnClick}
                            />
                        </Row>

                        {/* <Container
                        height={'fit-content'}
                    >
                        <Row
                            itemMargin={'sm'}
                            crossAxisAlignment={'start'}
                        >
                            <Label width={'10rem'}><T>Danh sách công việc</T> ({this.jobFilterStore.jobs.length}{this.jobFilterStore.totalItem > this.jobFilterStore.jobs.length ? '+' : ''})</Label>
                            <Expanded />
                            <ToggleButton
                                className={'btn-sort-up'}
                                icon={'long-arrow-up'}
                                pressed={this.jobFilterStore.sortDirection === 'ASC'}
                                onlyIcon
                                onClick={() => this.handleSortClick('ASC')}
                            />
                            <ToggleButton
                                className={'btn-sort-down'}
                                icon={'long-arrow-down'}
                                pressed={this.jobFilterStore.sortDirection === 'DESC'}
                                onlyIcon
                                onClick={() => this.handleSortClick('DESC')}
                            />
                            <EmptyButton
                                icon={'redo-alt'}
                                isLoading={this.jobFilterStore.loading}
                                onlyIcon
                                onClick={this.handleRefreshClick}
                            />
                        </Row>
                    </Container> */}
                        <JobTreeView />
                    </Column>
                </PanelBody>
            </>
        );
    }
}

JobFeatureView = inject('appStore', 'fieldForceStore')(observer(JobFeatureView));
JobFeatureView = withRouter(JobFeatureView);
export { JobFeatureView };
