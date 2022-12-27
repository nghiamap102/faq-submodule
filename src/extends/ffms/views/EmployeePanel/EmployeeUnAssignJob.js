import './EmployeeUnAssignJob.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _findIndex from 'lodash/findIndex';
import PropTypes from 'prop-types';

import {
    FlexPanel, PopupFooter, SearchBox,
    EmptyButton, Spacer,
    withI18n, Row, AdvanceSelect, withModal, Button, DataGrid,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { DataUtils } from 'extends/ffms/services/Utils';

class EmployeeUnAssignJob extends Component
{
    empStore = this.props.fieldForceStore.empStore;
    jobStore = this.props.fieldForceStore.jobStore;
    comSvc = this.props.fieldForceStore.comSvc;

    state={
        data: [],
        jobStatusOptions: [],
        searchKey: '',
        sorters: [],
    }

    componentDidMount = async () =>
    {
        const { data = [] } = this.props;

        const res = await this.comSvc.getLayerListOptions('JOB', 'job_status_id');
        const jobStatusOptions = res.map((opt) =>
        {
            return {
                ...opt,
                color: this.props.fieldForceStore.getJobStatusColor(opt.id),
                textStyle: { color: 'var(--button-color)' },
            };
        });
        await this.bindDataGridColumns(jobStatusOptions);

        this.setState({
            data: data.map((job)=>
            {
                if (!job.hasOwnProperty('new_job_status_id'))
                {
                    job['new_job_status_id'] = 1;
                }
                return job;
            }),
            jobStatusOptions,
        });
    }
 
    bindDataGridColumns = async (jobStatusOptions) =>
    {
        const showColumns = [
            'Title',
            'job_assignee_guid',
            'job_status_id',
            'job_type_id',
            'job_assigned_time',
        ];
        const columns = await this.comSvc.getDataGridColumns('jobs',[]).then((cols) =>
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
                c.freeze = ['Title'].indexOf(c.id) > -1;
                c.width = 150;
                return c;
            });
            
        });

        const _columns = columns.filter((col) => showColumns.indexOf(col.ColumnName) > -1);

        const findPos = _findIndex(_columns, (j) => j.id === 'job_status_id');
        _columns.splice(findPos, 0, {
            id: 'job_destination_address',
            displayAsText: 'Địa chỉ',
            width: 200,
            isSortable: true,
        });

        const columnSorters = _columns.filter((col) => col.isSortable).map((col) =>
        {
            return {
                id: col.id,
                direction: undefined,
            };
        });

        this.setState({
            columns: _columns,
            sorters: columnSorters,
        });
    }

    searchEmployees = (searchKey) =>
    {
        this.setState({ searchKey });
    };

    onColumnSort = (columns) =>
    {
        if (columns && columns.length)
        {
            DataUtils.sortBy(this.state.data, columns[0]?.id, columns[0]?.direction);
            this.setState({
                sorters: columns,
            });
        }
    };

    Actions = (row, index) =>
    {
        const statusIcon = row.errorMessage ? 'times-octagon' : 'check-circle';
        const statusColor = row.errorMessage ? 'var(--danger-color)' : 'var(--success-color)';

        return (
            <Row
                itemMargin={'sm'}
                crossAxisAlignment={'start'}
            >
                <AdvanceSelect
                    disabled={row.loading || (row.updated && !row.errorMessage)}
                    options={[
                        { id: 1, label: 'Bỏ phân công' }, // New
                        { id: 5, label: 'Hủy công việc' }, // Cancel
                    ]}
                    value={row['new_job_status_id']}
                    onChange={(value) => this.handleStatusChange('new_job_status_id', value, index)}
                />
                {
                    (row.loading || row.updated) && (
                        <EmptyButton
                            className={'unassign-loading-btn'}
                            iconType={'solid'}
                            isLoading={row.loading}
                            icon={row.loading ? '' : statusIcon}
                            iconColor={row.loading ? 'var(--primary-color)' : statusColor}
                            tooltip={row.errorMessage}
                            onlyIcon
                        />
                    )}
            </Row>
        );
    };

    handleStatusChange = (key, value, index) =>
    {
        const data = this.state.data;

        if (data[index])
        {
            data[index][key] = value;
        }

        this.setState({
            data: data,
        });

    };

    handleSetAllJob = (action) =>
    {
        const data = this.state.data;
        let statusId;
        if (action === 'unassign')
        {
            statusId = 1; // new
        }
        if (action === 'cancel')
        {
            statusId = 5; // cancel
        }

        data.forEach((d) =>
        {
            d['new_job_status_id'] = statusId;
        });

        this.setState({
            data: data,
        });
    }

    handleApplyClick = async () =>
    {
        const { data } = this.state;

        const dataToUpdate = data.filter((x) => !x.updated || x.errorMessage);
        for (const job of dataToUpdate)
        {
            this.editJob(job);
        }
    };
    
    editJob = (job) =>
    {
        job.loading = true;
        job.updated = false;
        job.errorMessage = '';

        this.setState({
            data: this.state.data.map((d) => d.Id === job.Id ? job : d),
        });

        this.jobStore.edit(
            job.job_guid, {
                Title: job.Title,
                job_guid: job.job_guid,
                job_status_id: job['new_job_status_id'],
                job_assignee_guid: job['new_job_status_id'] === 1 ? '' : job.job_assignee_guid,
            },
        ).then((result) =>
        {
            const statusDict = CommonHelper.toDictionary(this.state.jobStatusOptions, 'id', 'indexed');

            job.updated = true;
            job.loading = false;
         
            // This is for error test only
            // if (job['new_job_status_id'] === 5)
            // {
            //     result.errorMessage = 'Test error';
            // }

            if (result)
            {
                if (!result || result.errorMessage)
                {
                    job.errorMessage = result.errorMessage || '';
                }
                else
                {
                    job.job_status_id = statusDict[job['new_job_status_id']];
                    job.errorMessage = '';
                }
            }

            this.setState({
                data: this.state.data.map((d) => d.Id === job.Id ? job : d),
            });

            const checkUpdated = this.state.data.every((x) => x.updated === true);
            if (checkUpdated)
            {
                this.empStore.setUnassignDone(true);
            }

        });
    };

    render()
    {
        const { data, columns, searchKey } = this.state;

        const lowerSearchCase = searchKey.toLowerCase();
        const _data = data.filter((job) =>
            job.Title?.toLowerCase().includes(lowerSearchCase) ||
            job.job_destination_address?.toLowerCase().includes(lowerSearchCase) ||
            job.job_type_id?.toLowerCase().includes(lowerSearchCase) ||
            job.job_assigned_time?.toLowerCase().includes(lowerSearchCase),
        );

        return (
            <FlexPanel>
                <Row
                    itemMargin={'md'}
                    crossAxisSize={'min'}
                >
                    <SearchBox
                        flex="0"
                        width={'25rem'}
                        placeholder="Nhập từ khóa để tìm kiếm"
                        value={this.state.searchKey}
                        onChange={this.searchEmployees}
                    />

                    <Spacer
                        style={{ marginLeft: 'auto' }}
                        size={'1.5rem'}
                    />

                    <Button
                        color={'success'}
                        className={'btn-add'}
                        text={'Bỏ phân công toàn bộ'}
                        onClick={()=>this.handleSetAllJob('unassign')}
                    />

                    <Button
                        color={'success'}
                        text={'Hủy công việc toàn bộ'}
                        onClick={()=>this.handleSetAllJob('cancel')}
                    />
                </Row>
                    
                <DataGrid
                    rowKey={'Id'}
                    columns={columns}
                    items={_data}
                    total={data.length}
                    externalPaginationRow={false}
                    trailingControlColumns={[
                        {
                            width: 180,
                            headerCellRender: 'Thao tác',
                            rowCellRender: this.Actions,
                            freezeEnd: true,
                        },
                    ]}
                    sorting={{
                        columns: this.state.sorters,
                        isSingleSort: true,
                        onSort: this.onColumnSort,
                    }}
                    isFixedHeader
                    rowNumber
                />
                <PopupFooter>
                    <Row
                        mainAxisAlignment={'center'}
                        itemMargin={'md'}
                    >
                        <Button
                            color={'primary-color'}
                            icon={'save'}
                            text={'Áp dụng'}
                            disabled={this.empStore.unassignDone}
                            onClick={this.handleApplyClick}
                        />
                        {
                            this.empStore.disableCurrentStep <= 1 && (
                                <Button
                                    color={'primary-color'}
                                    text={'Tiếp tục'}
                                    disabled={!this.empStore.unassignDone}
                                    onClick={() =>
                                    {
                                        this.empStore.setDisableEmployeeStep(this.empStore.disableCurrentStep + 1);
                                    }}
                                />
                            )}
                    </Row>
                </PopupFooter>
            </FlexPanel>
        );
    }
}
EmployeeUnAssignJob.propTypes = {
    data: PropTypes.array, // array of jobs
};

EmployeeUnAssignJob = withModal(withI18n(inject('appStore', 'fieldForceStore')(observer(EmployeeUnAssignJob))));
export default EmployeeUnAssignJob;
