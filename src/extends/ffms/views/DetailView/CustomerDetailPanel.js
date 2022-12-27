import './DetailView.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import {
    Button, Container,
    FAIcon, TB1, ProgressInProgressBar,
    T, withI18n, Row, withModal,
} from '@vbd/vui';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import { RouterParamsHelper } from 'helper/router.helper';
import { isEmpty } from 'helper/data.helper';

import TabBar from 'extends/ffms/pages/base/TabBar';
import Loading from 'extends/ffms/pages/base/Loading';

import DetailTreeView from 'extends/ffms/components/DetailTree/DetailTreeView';
import DisplayDetail from 'extends/ffms/views/DetailView/DisplayDetail';
import CustomerBasicInfo from 'extends/ffms/views/DetailView/ViewSection/CustomerBasicInfo';
import { JobAssigneeInfo } from 'extends/ffms/views/JobFilterView/JobAssigneeInfo';

class CustomerDetailPanel extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    relatedJobStore = this.props.fieldForceStore.relatedJobStore;
    
    match = [];
    state = {
        tabActive: 1,
        tabs: [],
    }

    async componentDidMount()
    {
        this.relatedJobStore.appStore = this.props.appStore;
        // Restore params & set to url
        if (this.relatedJobStore.urlParams && Object.values(this.relatedJobStore.urlParams).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.relatedJobStore.urlParams);
        }

        this.props.fieldForceStore.loadDataReferences('job-statuses').then((dataRefs) =>
        {
            this.relatedJobStore.jobStatuses = dataRefs['job-statuses'];
            // this.handleRefreshClick();
        });

        const { location } = this.props;

        this.setState({
            tabs: this.relatedJobStore.tabs.map((tab) => ({ ...tab, link: location.pathname + location.search + tab.hash })),
        });

        this.activeTab();
    }


    onChangeTab = (id) =>
    {
        this.setState({ tabActive: id });
        this.relatedJobStore.setMainTab(id);
    }

    activeTab = () =>
    {
        const tab = this.state.tabs.find(item => item.hash === this.relatedJobStore.hashParam.hash);
        if (tab)
        {
            this.setState({ tabActive: tab.id });
            this.relatedJobStore.setMainTab(tab.id);
        }
    }

    handleRefreshClick = async (sorter = null) =>
    {
        this.relatedJobStore.getJobData({ job_customer_guid: this.props.data['customer_guid'] }, sorter);
    }


    isEmptyDate = (date) =>
    {
        return !date || (date.toDateString && date.toDateString() === 'Mon Jan 01 0001');
    };

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
                                trigger={'hover'}
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
                                    trigger={['hover']}
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
        // else if (field === 'icon')
        // {
        //     return (
        //         <Button
        //             key={field}
        //             icon={node.treeNodeInfo[field].icon}
        //             iconType={node.treeNodeInfo[field].type || 'solid'}
        //             className={'action-btn'}
        //             text={node.treeNodeInfo[field].actionText}
        //             tooltip={node.treeNodeInfo[field].tooltip}
        //             onClick={node.treeNodeInfo[field].onClick}
        //             isDefault
        //         />
        //     );
        // }
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

    handleSelect = (node) =>
    {
        if (!node.child || node.child.length === 0)
        {
            window.open(`/ffms/jobs-manager/list?mode=detail&select=${node.Id}`); // temp for Job Detail in new tab action
        }
    };

    render()
    {
        const { tabs } = this.state;
        const { data } = this.props;
        return (
            <>
                {
                    !tabs || isEmpty(tabs) ? <Loading /> : <Container className={'detail-panel'}>
                        <TabBar
                            title=''
                            tabs={tabs}
                            defaultIndex={this.relatedJobStore.mainTab}
                            onChange={this.onChangeTab}
                            className={'detail-panel-tabs'}
                        />
                        <Container className='detail-panel-body'>
                            {
                                this.relatedJobStore.mainTab && this.relatedJobStore.mainTab === 1 &&
                                <DisplayDetail
                                    data={data}
                                    properties={this.props.properties}
                                    basicInfo={
                                        <CustomerBasicInfo data={data} />
                                    }
                                />
                            }
                            {
                                this.relatedJobStore.mainTab && this.relatedJobStore.mainTab === 2 &&
                                <DetailTreeView
                                    totalItem={this.relatedJobStore.totalItem}
                                    data={this.relatedJobStore.jobs}
                                    dataTree={this.relatedJobStore.jobsByCases}
                                    handleSelect={this.handleSelect}
                                    customItemFieldBuilder={this.buildCustomItemField}
                                    coloredItem
                                    setItemColor={this.props.fieldForceStore.getJobStatusColor}
                                    colorByField={'job_status_id'}
                                    handleRefresh={this.handleRefreshClick}
                                    sortField={'job_created'}
                                />
                            }
                        </Container>
                    </Container>
                }
            </>
        );
    }
}

CustomerDetailPanel.propTypes = {
    data: PropTypes.shape({
        activityLogs: PropTypes.array,
    }),
    properties: PropTypes.array,
};
CustomerDetailPanel.defaultProps = {
    properties: [],
};

CustomerDetailPanel = inject('appStore', 'fieldForceStore')(observer(CustomerDetailPanel));
CustomerDetailPanel = withModal(withI18n(withRouter(CustomerDetailPanel)));
export default CustomerDetailPanel;
