import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { action, autorun } from 'mobx';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import {
    Container, ProgressInProgressBar,
    FAIcon, EmptyData, TB1, T, Row, Button,
} from '@vbd/vui';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import { CommonHelper } from 'helper/common.helper';
import { DataTypes } from 'helper/data.helper';
import { RouterParamsHelper } from 'helper/router.helper';

import { JobAssigneeInfo } from 'extends/ffms/views/JobFilterView/JobAssigneeInfo';
import DetailTreeView from 'extends/ffms/components/DetailTree/DetailTreeView';

export class JobTreeView extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    jobFilterStore = this.props.fieldForceStore.jobFilterStore;
    markerPopupStore = this.props.appStore.markerPopupStore;
    overlayPopupStore = this.props.fieldForceStore.overlayPopupStore;
    empStore = this.fieldForceStore.empStore;
    mapStore = this.props.appStore.mapStore;

    lastMarker = null;

    state = {
        highlightId: null,
    }

    async componentDidMount ()
    {
        this.jobFilterStore.appStore = this.props.appStore;

        const timestamps = new Date().getTime();
        this.props.appStore.layerStore.add({
            id: 'vJOB',
            Id: timestamps,
            Layer: 'CONTAINER',
            Caption: 'JOB',
            LayerName: 'vJOB',
            LayerStyle: null, // LayerStyle must be null to prevent LayerManager draw this overlay
            LayerType: 'OVERLAY',
        });
        this.drawMarkers(this.jobFilterStore.jobs);
    }

    handleSelectActive = (jobGuid) =>
    {
        if (this.lastMarker)
        {
            this.props.appStore.markerStore.updateProps(this.lastMarker, {
                active: false,
                icon: 'job-marker',
            });
            this.lastMarker = null;
        }

        if (this.mapStore.map !== undefined)
        {
            const marker = this.props.appStore.markerStore.getPopup(jobGuid);
            if (marker)
            {
                this.lastMarker = marker;
                this.props.appStore.markerStore.updateProps(marker, {
                    active: true,
                    icon: 'job-marker-active',
                });
            }
        }
    }

    handleClickMarker = async (marker) =>
    {
        this.handleSelectActive(marker.id);
        const data = marker.Data;
        await this.jobFilterStore.showJobDetailPopup(data);
    };

    drawMarkers = action((jobs = []) =>
    {
        const markers = [];
        const jobStatus = CommonHelper.toDictionary(this.jobFilterStore.jobStatuses || [], 'jobstatus_name', 'jobstatus_id');
        for (const job of jobs)
        {
            if (job.job_destination_location)
            {
                if (typeof (job.job_destination_location) === 'string')
                {
                    job.job_destination_location = JSON.parse(job.job_destination_location);
                }
                const marker = this.props.appStore.markerStore.getPopup(
                    job.job_guid,
                );
                const longitude = job.job_destination_location.coordinates[0];
                const latitude = job.job_destination_location.coordinates[1];

                markers.push({
                    id: job.job_guid,
                    layer: 'vJOB',
                    icon: 'job-marker',
                    size: 30,
                    anchor: 'bottom',
                    color: this.fieldForceStore.getJobStatusColor(jobStatus[job.job_status_id] || job.job_status_id),
                    lng: longitude,
                    lat: latitude,
                    draw: 'point',
                    title: job.Title,
                    Data: job,
                    onClick: this.handleClickMarker,
                });
            }
        }

        const removeList = [];
        for (const marker of this.props.appStore.markerStore.markers)
        {
            const found = jobs.length ? jobs.find((d) => marker.id === d.job_guid) : null;
            if (!found && marker.layer === 'vJOB')
            {
                removeList.push(marker);
            }
        }

        this.props.appStore.markerStore.modify(markers, removeList);
    });

    autoRenderMarkerJob = autorun(() =>
    {
        this.drawMarkers(this.jobFilterStore.jobs);
    });

    handleExpand = (node, expand) =>
    {
        node.expand = expand;
    };

    handleSelect = (node) =>
    {
        const coords = node.job_destination_location ? node.job_destination_location.coordinates : null;

        if (coords)
        {
            this.handleSelectActive(node.job_guid);

            // go to location
            const marker = this.lastMarker;
            this.mapStore.map.flyTo({
                center: [marker.lng, marker.lat],
                zoom: 15,
            });
        }

        const currentPanStatus = {
            isPanned: !this.jobFilterStore.isPanned,
            panEntry: node.Id,
        };
        this.jobFilterStore.panStatus = currentPanStatus;
        this.setState({ highlightId: node.Id });
    };

    // renderTreeItem(node)
    // {
    //     // const panned = this.jobFilterStore.panStatus.isPanned;
    //     // const panEntry = this.jobFilterStore.panStatus.panEntry;
    //     const jobStatus = CommonHelper.toDictionary(this.jobFilterStore.jobStatuses || [], 'jobstatus_name', 'jobstatus_id');
    //     const jobStatusId = jobStatus[node.job_status_id] || node.job_status_id;
    //     let icon = undefined;

    //     const entryView =
    //         node.treeNodeInfo &&
    //         Object.keys(node.treeNodeInfo).map((field) =>
    //         {
    //             // if (field === 'date')
    //             // {
    //             //     return (
    //             //         <React.Fragment key={field}>
    //             //             <p>{node.treeNodeInfo[field]}</p>
    //             //         </React.Fragment>
    //             //     );
    //             // }

    //             if (field === 'Assignee')
    //             {
    //                 return (
    //                     <JobAssigneeInfo
    //                         key={field}
    //                         node={node}
    //                         label={node.treeNodeInfo[field]}
    //                     />
    //                 );
    //             }
    //             else if (field === 'time')
    //             {
    //                 const unKnownTime = '??:??';
    //                 let strEstimatedDate = '';
    //                 let strRealDate = '';
    //                 const { start, completed, estimated } = node.treeNodeInfo[field];
    //                 let { estimatedStarted, estimatedCompleted, realStarted, realCompleted } = '';
    //                 estimatedStarted = `${estimated.start ? moment(estimated.start).format('L LT') : unKnownTime}`;
    //                 estimatedCompleted = `${estimated.completed ? moment(estimated.completed).format('L LT') : unKnownTime}`;
    //                 realStarted = `${start ? moment(start).format('L LT') : unKnownTime}`;
    //                 realCompleted = `${completed ? moment(completed).format('L LT') : unKnownTime}`;

    //                 if (this.isEmptyDate(estimated?.start) && this.isEmptyDate(estimated?.completed))
    //                 {
    //                     strEstimatedDate = 'Chưa có thời gian dự kiến';
    //                 }
    //                 else
    //                 {
    //                     strEstimatedDate = `${this.isEmptyDate(estimated?.start) ? unKnownTime : moment(estimated.start).format('HH:mm')} - ${this.isEmptyDate(estimated?.completed) ? unKnownTime : moment(estimated.completed).format('HH:mm')}`;
    //                 }

    //                 if (!this.isEmptyDate(start) || !this.isEmptyDate(completed))
    //                 {
    //                     strRealDate = `${this.isEmptyDate(start) ? unKnownTime : moment(start).format('HH:mm')} - ${this.isEmptyDate(completed) ? unKnownTime : moment(completed).format('HH:mm')}`;
    //                 }
    //                 return (
    //                     <React.Fragment key={field}>
    //                         <Row mainAxisAlignment={'space-between'}>
    //                             <Container className="time-job">
    //                                 <FAIcon
    //                                     icon={'clock'}
    //                                     size={'1rem'}
    //                                     color={'#bb99f7'}
    //                                     type={'solid'}
    //                                 />
    //                                 <PopperTooltip
    //                                     tooltip={
    //                                         <>
    //                                             <TB1><T>Từ</T>: {estimatedStarted}</TB1>
    //                                             <TB1><T>Đến</T>: {estimatedCompleted}</TB1>
    //                                         </>
    //                                     }
    //                                     placement={'top'}
    //                                     trigger={'click'}
    //                                 >
    //                                     <T>{strEstimatedDate}</T>
    //                                 </PopperTooltip>
    //                             </Container>
    //                             {
    //                                 strRealDate &&
    //                                 <Container className="time-job">
    //                                     <FAIcon
    //                                         icon={'clock'}
    //                                         size={'1rem'}
    //                                         color={this.fieldForceStore.getJobStatusColor(jobStatusId)}
    //                                         type={'solid'}
    //                                     />
    //                                     <PopperTooltip
    //                                         tooltip={
    //                                             <>
    //                                                 <TB1><T>Từ</T>: {realStarted}</TB1>
    //                                                 <TB1><T>Đến</T>: {realCompleted}</TB1>
    //                                             </>
    //                                         }
    //                                         placement={'top'}
    //                                         trigger={['click']}
    //                                     >
    //                                         <T>{strRealDate} </T>
    //                                     </PopperTooltip>
    //                                 </Container>
    //                             }
    //                         </Row>

    //                         <ProgressInProgressBar
    //                             startTime={
    //                                 node.treeNodeInfo[field].start ?
    //                                     (node.treeNodeInfo[
    //                                         field
    //                                     ].start.getHours() + node.treeNodeInfo[
    //                                         field
    //                                     ].start.getMinutes() / 60) :
    //                                     node.treeNodeInfo[field].start
    //                             }
    //                             endTime={
    //                                 node.treeNodeInfo[field].completed ?
    //                                     (node.treeNodeInfo[
    //                                         field
    //                                     ].completed.getHours() + node.treeNodeInfo[
    //                                         field
    //                                     ].completed.getMinutes() / 60) :
    //                                     node.treeNodeInfo[field].completed
    //                             }
    //                             middleStart={
    //                                 node.treeNodeInfo[field].estimated.start ?
    //                                     (node.treeNodeInfo[
    //                                         field
    //                                     ].estimated.start.getHours() + node.treeNodeInfo[
    //                                         field
    //                                     ].estimated.start.getMinutes() / 60) :
    //                                     node.treeNodeInfo[field].estimated.start
    //                             }
    //                             middleEnd={
    //                                 node.treeNodeInfo[field].estimated.completed ?
    //                                     (node.treeNodeInfo[
    //                                         field
    //                                     ].estimated.completed.getHours() + node.treeNodeInfo[
    //                                         field
    //                                     ].estimated.completed.getMinutes() / 60) :
    //                                     node.treeNodeInfo[field].estimated.completed
    //                             }
    //                         />
    //                         {/* <Row /> */}
    //                     </React.Fragment>
    //                 );
    //             }
    //             else if (field === 'address')
    //             {
    //                 const { state, district, tehsil } = node.treeNodeInfo[field];
    //                 const address = [tehsil, district, state].filter((x) => x).join(', ');

    //                 return (
    //                     <Container className={'address'}>
    //                         <FAIcon
    //                             icon={'map-marker-alt'}
    //                             size={'1rem'}
    //                             type={'solid'}
    //                         />
    //                         {address || <T>Không có địa chỉ</T>}
    //                     </Container>
    //                 );
    //             }
    //             else if (field === 'icon')
    //             {
    //                 icon = (
    //                     <PopperTooltip
    //                         placement={'top'}
    //                         trigger={['hover']}
    //                         hideArrow
    //                         tooltip={node.treeNodeInfo[field].tooltip}
    //                     >
    //                         <FAIcon
    //                             icon={node.treeNodeInfo[field].icon}
    //                             size={'1rem'}
    //                             type={'solid'}
    //                             // className={'action-btn'}
    //                             onClick={node.treeNodeInfo[field].onClick}
    //                         />
    //                     </PopperTooltip>
    //                 );
    //                 return undefined;
    //             }
    //             else if (field !== 'action')
    //             {
    //                 return (
    //                     <React.Fragment key={field}>
    //                         <p>
    //                             {field}: {node.treeNodeInfo[field]}
    //                         </p>
    //                     </React.Fragment>
    //                 );
    //             }
    //             return undefined;
    //         });

    //     return (
    //         node.visible !== false && (
    //             <TreeListItem
    //                 key={node.id}
    //                 node={node}
    //                 customInfo
    //                 entryView={entryView}
    //                 onExpand={this.handleExpand}
    //                 onSelect={this.handleSelect}
    //                 panned={this.jobFilterStore.panStatus.isPanned}
    //                 panEntry={this.jobFilterStore.panStatus.panEntry}
    //                 color={node.job_status_id ? this.fieldForceStore.getJobStatusColor(jobStatusId) : ''}
    //                 arrowVisible={node.arrowVisible}
    //                 root={node.root}
    //                 highlight={this.state.highlightId === node.job_guid}
    //                 icon={icon}
    //             >
    //                 {node.expand &&
    //                 node.child &&
    //                 node.child.map((child) => this.renderTreeItem(child))}
    //             </TreeListItem>
    //         )
    //     );
    // }

    buildCustomItemField = (field, node) =>
    {
        if (field === 'Assignee')
        {
            return (
                <JobAssigneeInfo
                    key={field}
                    node={node}
                    label={node.treeNodeInfo[field]}
                />
            );
        }
        else if (field === 'job_created')
        {
            const jobCreatedDate = node.treeNodeInfo[field];
            return (
                <Container>
                    <Button
                        className={'job-created'}
                        icon={'calendar'}
                        type={'light'}
                        iconLocation={'left'}
                        text={<T params={[moment(jobCreatedDate).format('L LTS')]}>{jobCreatedDate ? 'Tạo ngày %0%' : 'Không có dữ liệu'}</T>}
                    />
                </Container>
            );
        }
        else if (field === 'time')
        {
            const unKnownTime = '??:??';
            let strEstimatedDate = '';
            let strRealDate = '';
            const { start, completed, estimated } = node.treeNodeInfo[field];
            let { estimatedStarted, estimatedCompleted, realStarted, realCompleted } = '';
            estimatedStarted = `${estimated.start ? moment(estimated.start).format('L LT') : unKnownTime}`;
            estimatedCompleted = `${estimated.completed ? moment(estimated.completed).format('L LT') : unKnownTime}`;
            realStarted = `${start ? moment(start).format('L LT') : unKnownTime}`;
            realCompleted = `${completed ? moment(completed).format('L LT') : unKnownTime}`;

            if (this.isEmptyDate(estimated?.start) && this.isEmptyDate(estimated?.completed))
            {
                strEstimatedDate = 'Chưa có thời gian dự kiến';
            }
            else
            {
                strEstimatedDate = `${this.isEmptyDate(estimated?.start) ? unKnownTime : moment(estimated.start).format('HH:mm')} - ${this.isEmptyDate(estimated?.completed) ? unKnownTime : moment(estimated.completed).format('HH:mm')}`;
            }

            if (!this.isEmptyDate(start) || !this.isEmptyDate(completed))
            {
                strRealDate = `${this.isEmptyDate(start) ? unKnownTime : moment(start).format('HH:mm')} - ${this.isEmptyDate(completed) ? unKnownTime : moment(completed).format('HH:mm')}`;
            }
            return (
                <React.Fragment key={field}>
                    <Row mainAxisAlignment={'space-between'}>
                        <Container className="time-job">
                            <FAIcon
                                icon={'clock'}
                                size={'1rem'}
                                color={'#bb99f7'}
                                type={'solid'}
                            />
                            <PopperTooltip
                                tooltip={
                                    <>
                                        <TB1><T>Từ</T>: {estimatedStarted}</TB1>
                                        <TB1><T>Đến</T>: {estimatedCompleted}</TB1>
                                    </>
                                }
                                placement={'top'}
                                trigger={'click'}
                            >
                                <T>{strEstimatedDate}</T>
                            </PopperTooltip>
                        </Container>
                        {
                            strRealDate &&
                            <Container className="time-job">
                                <FAIcon
                                    icon={'clock'}
                                    size={'1rem'}
                                    color={this.props.fieldForceStore.getJobStatusColor(node.job_status_id)}
                                    type={'solid'}
                                />
                                <PopperTooltip
                                    tooltip={
                                        <>
                                            <TB1><T>Từ</T>: {realStarted}</TB1>
                                            <TB1><T>Đến</T>: {realCompleted}</TB1>
                                        </>
                                    }
                                    placement={'top'}
                                    trigger={['click']}
                                >
                                    <T>{strRealDate} </T>
                                </PopperTooltip>
                            </Container>
                        }
                    </Row>

                    <ProgressInProgressBar
                        startTime={
                            node.treeNodeInfo[field].start ?
                                (node.treeNodeInfo[
                                    field
                                ].start.getHours() + node.treeNodeInfo[
                                    field
                                ].start.getMinutes() / 60) :
                                node.treeNodeInfo[field].start
                        }
                        endTime={
                            node.treeNodeInfo[field].completed ?
                                (node.treeNodeInfo[
                                    field
                                ].completed.getHours() + node.treeNodeInfo[
                                    field
                                ].completed.getMinutes() / 60) :
                                node.treeNodeInfo[field].completed
                        }
                        middleStart={
                            node.treeNodeInfo[field].estimated.start ?
                                (node.treeNodeInfo[
                                    field
                                ].estimated.start.getHours() + node.treeNodeInfo[
                                    field
                                ].estimated.start.getMinutes() / 60) :
                                node.treeNodeInfo[field].estimated.start
                        }
                        middleEnd={
                            node.treeNodeInfo[field].estimated.completed ?
                                (node.treeNodeInfo[
                                    field
                                ].estimated.completed.getHours() + node.treeNodeInfo[
                                    field
                                ].estimated.completed.getMinutes() / 60) :
                                node.treeNodeInfo[field].estimated.completed
                        }
                    />
                    {/* <Row /> */}
                </React.Fragment>
            );
        }
        else if (field === 'address')
        {
            const { state, district, tehsil } = node.treeNodeInfo[field];
            const address = [tehsil, district, state].filter((x) => x).join(', ');

            return (
                <Container className={'address'}>
                    <FAIcon
                        icon={'map-marker-alt'}
                        size={'1rem'}
                        type={'solid'}
                    />
                    {address || <T>Không có địa chỉ</T>}
                </Container>
            );
        }
        else if (field === 'icon')
        {
            return (
                <FAIcon
                    icon={node.treeNodeInfo[field].icon}
                    size={'1rem'}
                    type={'solid'}
                    className={'action-btn'}
                    tooltip={node.treeNodeInfo[field].tooltip}
                    onClick={node.treeNodeInfo[field].onClick}
                />
            );
        }
        else if (field === 'icon')
        {
            return (
                <Button
                    key={field}
                    icon={node.treeNodeInfo[field].icon}
                    iconType={node.treeNodeInfo[field].type || 'solid'}
                    className={'action-btn'}
                    text={node.treeNodeInfo[field].actionText}
                    tooltip={node.treeNodeInfo[field].tooltip}
                    onClick={node.treeNodeInfo[field].onClick}
                    isDefault
                />
            );
        }
        else if (field !== 'action')
        {
            return (
                <React.Fragment key={field}>
                    <p>
                        {field}: {node.treeNodeInfo[field]}
                    </p>
                </React.Fragment>
            );
        }
        return undefined;
    }

    loadParams = (sorter = null) =>
    {
        const qs = RouterParamsHelper.getParams(this.props.location.search, {
            intFilters: ['jobStatuses', 'jobTypes', 'employeeTypes', 'teams'],
            stringFilters: ['order', 'orderBy'],
            from: DataTypes.Number,
            to: DataTypes.Number,
            searchKey: DataTypes.String,
            advanceOn: DataTypes.Boolean,
            timeOn: DataTypes.Boolean,
        });

        const { jobTypes, jobStatuses, employeeTypes, teams, order, orderBy, from, to, searchKey, advanceOn, timeOn } = qs;

        this.jobFilterStore.urlParams = { ...this.jobFilterStore.urlParams, ...qs };
        this.jobFilterStore.searchKey = searchKey ?? '';

        this.jobFilterStore.set('jobSwitcher', {
            dateTime: timeOn === undefined ? true : timeOn,
            advanceFilter: advanceOn === undefined ? true : advanceOn,
        });

        const filters = {
            sortDirection: order || (sorter ? sorter.sortDirection : 'ASC'),
            sortField: orderBy || (sorter ? sorter.sortField : 'job_created'),

            from: from ? moment(from) : moment().startOf('date'),
            to: to ? moment(to) : moment().endOf('date'),

            jobStatuses: jobStatuses ? [...jobStatuses] : null,
            jobTypes: jobTypes ? [...jobTypes] : null,
            employeeTypes: employeeTypes ? [...employeeTypes] : null,
            teams: teams ? [...teams] : null,
        };

        this.jobFilterStore.setFilter(filters);
    };

    handleRefreshClick = async (sorter = null) =>
    {
        // this.jobFilterStore.getJobData({ job_customer_guid: this.props.data['customer_guid'] }, sorter);
        this.loadParams(sorter);
    }

    handleSort = (dir) =>
    {
        RouterParamsHelper.setParams(this.jobFilterStore.urlParams, this.props, { order: dir });
    }

    isEmptyDate = (date) =>
    {
        return !date || (date.toDateString && date.toDateString() === 'Mon Jan 01 0001');
    }
    render()
    {
        return (
            <>
                {this.jobFilterStore.jobs?.length === 0 && <EmptyData />}
                {
                    this.jobFilterStore.jobs?.length > 0 &&
                    <DetailTreeView
                        totalItem={this.jobFilterStore.totalItem}
                        data={this.jobFilterStore.jobs}
                        dataTree={this.jobFilterStore.jobTree}
                        handleSelect={this.handleSelect}
                        customItemFieldBuilder={this.buildCustomItemField}
                        coloredItem
                        setItemColor={this.props.fieldForceStore.getJobStatusColor}
                        colorByField={'job_status_id'}
                        handleRefresh={this.handleRefreshClick}
                        handleSort={this.handleSort}
                        sortField={'job_created'}
                        arrowVisible={false}
                        selected={this.state.highlightId}
                    />
                }
            </>
        );
    }
}

JobTreeView = inject('appStore', 'fieldForceStore')(observer(JobTreeView));
JobTreeView = withRouter(JobTreeView);
