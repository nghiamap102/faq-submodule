import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import {
    Expanded, EmptyButton,
    AdvanceSelect, Row, ClearableInput, FormControlLabel, FormGroup,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { isEmpty } from 'helper/data.helper';

import SelectOrInput from 'extends/ffms/components/SelectOrInput/SelectOrInput';

class EmployeeFilterPanel extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    empStore = this.props.fieldForceStore.empStore;
    employeeTypeOptions = this.props.employeeTypeOptions;
    teamOptions = this.props.teamOptions;
    orgOptions=this.props.orgOptions;

    handleChangeFilter = (key, value, debounce) =>
    {
        this.empStore.setFilterState(key, value);
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
        this.empStore.resetFilterState(this.empStore.filterState.searchKey);
        const filter = {
            'Title': '',
            'employee_full_name': '',
            'employee_username': '',
            'employee_phone': '',
            'employee_email': '',
            'employee_status': '',
            'employee_organization_id': '',
            'employee_team_id': '',
            'employee_type_id': '',
        };
        RouterParamsHelper.setParams(this.empStore.urlParams, this.props, filter);
    };

    render()
    {
        return (
            <>
                <FormGroup>
                    <FormControlLabel
                        label={'Tên nhân viên'}
                        control={(
                            <ClearableInput
                                type={'input'}
                                className={'form-control'}
                                placeholder={'Nhập giá trị'}
                                value={this.empStore.filterState.employee_full_name}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('employee_full_name', value, true);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Tên người dùng'}
                        control={(
                            <ClearableInput
                                type={'input'}
                                className={'form-control'}
                                placeholder={'Nhập giá trị'}
                                value={this.empStore.filterState.employee_username}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('employee_username', value, true);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Số điện thoại'}
                        control={(
                            <ClearableInput
                                className={'form-control'}
                                placeholder={'Nhập giá trị'}
                                value={this.empStore.filterState.employee_phone}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('employee_phone', value, true);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Email'}
                        control={(
                            <ClearableInput
                                type={'input'}
                                className={'form-control'}
                                placeholder={'Nhập giá trị'}
                                value={this.empStore.filterState.employee_email}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('employee_email', value, true);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Loại nhân viên'}
                        control={(
                            <SelectOrInput
                                placeholder={'Chọn một giá trị'}
                                options={this.props.employeeTypeOptions}
                                value={this.empStore.filterState.employee_type_id}
                                multi
                                clearable
                                onChange={(value) =>
                                {
                                    if (isEmpty(value))
                                    {
                                        value = [];
                                    }
                                    this.handleChangeFilter('employee_type_id', Array.isArray(value) ? value : [value]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Tổ chức'}
                        control={(
                            <AdvanceSelect
                                placeholder={'Chọn một giá trị'}
                                options={this.props.orgOptions}
                                value={this.empStore.filterState.employee_organization_id}
                                multi
                                clearable
                                onChange={(value) =>
                                {
                                    if (isEmpty(value))
                                    {
                                        value = [];
                                    }
                                    this.handleChangeFilter('employee_organization_id', Array.isArray(value) ? value : [value]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Nhóm'}
                        control={(
                            <SelectOrInput
                                placeholder={'Chọn một giá trị'}
                                options={this.props.teamOptions}
                                value={this.empStore.filterState.employee_team_id}
                                multi
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('employee_team_id', Array.isArray(value) ? value : [value]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Trạng thái nhân viên'}
                        control={(
                            <SelectOrInput
                                placeholder={'Chọn một giá trị'}
                                options={this.props.statusOptions}
                                value={this.empStore.filterState.employee_status}
                                multi
                                clearable
                                onChange={(value) =>
                                {
                                    if (isEmpty(value))
                                    {
                                        value = [];
                                    }
                                    this.handleChangeFilter('employee_status', Array.isArray(value) ? value : [value]);
                                }}
                            />
                        )}
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
EmployeeFilterPanel.propTypes = {
    onFilterChange: PropTypes.func,
};
EmployeeFilterPanel = inject('appStore', 'fieldForceStore')(observer(EmployeeFilterPanel));
EmployeeFilterPanel = withRouter(EmployeeFilterPanel);
export default EmployeeFilterPanel;
