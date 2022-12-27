import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import {
    Expanded, EmptyButton, DateTimePicker,
    Row, AdvanceSelect, ClearableInput, FormControlLabel, FormGroup,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { isEmpty } from 'helper/data.helper';
import SelectOrInput from 'extends/ffms/components/SelectOrInput/SelectOrInput';

class JobFilterPanel extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    jobStore = this.props.fieldForceStore.jobStore;

    jobFilterRef = React.createRef();
    employeeRef = React.createRef();

    handleChangeFilter = (key, value, debounce) =>
    {
        this.jobStore.setFilterState(key, value);

        debounce ? this.onChangeFilterDebounced(key, value) : this.onChangeFilter(key, value);
    };

    onChangeFilter = (key, value) =>
    {
        let paramValue = `${isEmpty(value) ? '' : value}`;
        if (moment.isMoment(value))
        {
            paramValue = `${value.format('x') || ''}`;
        }
        
        if (typeof this.props.onFilterChange === 'function')
        {
            this.props.onFilterChange(key, paramValue);
        }
    };

    onChangeFilterDebounced = new AwesomeDebouncePromise(this.onChangeFilter.bind(this), 300);

    handleClearAllFilter = () =>
    {
        // Change new reset all filter
        this.jobStore.resetFilterState(this.jobStore.filterState.searchKey);

        const filter = {
            'Title': '',
            'job_type_id': '',
            'job_status_id': '',
            'job_assigned_time': '',
            'job_start_time': '',
            'job_completed_time': '',
            'job_assignee_guid': '',
        };
  
        RouterParamsHelper.setParams(this.jobStore.urlParams, this.props, filter);
    };

    handleTextChange = async (searchKey) =>
    {
        await this.jobStore.getEmpDataDebounced({ searchKey: `${searchKey}` });
    };

    render()
    {
        return (
            <>
                <FormGroup>
                    <FormControlLabel
                        label={'Tên công việc'}
                        control={
                            <ClearableInput
                                type={'input'}
                                className={'form-control'}
                                placeholder={'Nhập giá trị'}
                                value={this.jobStore.filterState.Title}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('Title', value, true);
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Loại công việc'}
                        control={
                            <SelectOrInput
                                placeholder={'Chọn một giá trị'}
                                options={this.props.jobTypeOptions}
                                value={this.jobStore.filterState.job_type_id}
                                multi
                                onChange={(value) =>
                                {
                                    if (isEmpty(value))
                                    {
                                        value = [];
                                    }
                                    this.handleChangeFilter('job_type_id', Array.isArray(value) ? value.map((v) => `${v}`) : [`${value}`]);
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Trạng thái'}
                        control={
                            <SelectOrInput
                                placeholder={'Chọn một giá trị'}
                                options={this.props.jobStatusOptions}
                                value={this.jobStore.filterState.job_status_id}
                                multi
                                onChange={(value) =>
                                {
                                    if (isEmpty(value))
                                    {
                                        value = [];
                                    }
                                    this.handleChangeFilter('job_status_id', Array.isArray(value) ? value.map((v) => `${v}`) : [`${value}`]);
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Phân công vào lúc'}
                        control={
                            <DateTimePicker
                                value={this.jobStore.filterState.job_assigned_time}
                                placeholder={'Chọn ngày phân công công việc'}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('job_assigned_time', value);
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Ngày bắt đầu'}
                        control={
                            <DateTimePicker
                                placeholder={'Chọn ngày bắt đầu công việc'}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('job_start_time', value);
                                }}
                                value={this.jobStore.filterState.job_start_time}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Ngày hoàn thành'}
                        control={
                            <DateTimePicker
                                placeholder={'Chọn ngày hoàn thành công việc'}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('job_completed_time', value);
                                }}
                                value={this.jobStore.filterState.job_completed_time}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Người được giao'}
                        control={
                            <AdvanceSelect
                                placeholder={'Chọn một nhân viên'}
                                options={this.props.employeeOptions}
                                selectedOptions={this.jobStore.selectedEmployeeOptions}
                                value={this.jobStore.filterState.job_assignee_guid}
                                hasSearch
                                multi
                                searchMode={'remote'}
                                onRemoteFetch={this.handleTextChange}
                                
                                ref={this.employeeRef}
                                onChange={(value) =>
                                {
                                    var values = Array.isArray(value) ? value : [value];
                                    if (!isEmpty(values))
                                    {
                                        this.jobStore.selectedEmployeeOptions = [
                                            ...this.jobStore.selectedEmployeeOptions?.filter((option) => option?.id && values.includes(option.id)),
                                            this.props.employeeOptions?.find((option) => option?.id && values.includes(option.id)),
                                        ];
                                    }

                                    this.handleChangeFilter('job_assignee_guid', values);
                                }}
                            />
                        }
                    />
                    <Row>
                        <Expanded />
                        <EmptyButton
                            color={'info'}
                            text={'Xóa tất cả bộ lọc'}
                            onClick={() =>
                            {
                                this.handleClearAllFilter();
                            }}
                        />
                    </Row>
                </FormGroup>
            </>
        );
    }
}
JobFilterPanel.propTypes = {
    onFilterChange: PropTypes.func,
};
JobFilterPanel = inject('appStore', 'fieldForceStore')(observer(JobFilterPanel));
JobFilterPanel = withRouter(JobFilterPanel);
export default JobFilterPanel;
