import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import moment from 'moment';

import {
    Expanded, Row, FormControlLabel, FormGroup,
    EmptyButton,
    ClearableInput,
} from '@vbd/vui';
import { RouterParamsHelper } from 'helper/router.helper';
import { isEmpty } from 'helper/data.helper';
import SelectOrInput from 'extends/ffms/components/SelectOrInput/SelectOrInput';

class CustomerFilterPanel extends Component
{
    fieldForceStore = this.props.fieldForceStore;
    customerStore = this.props.fieldForceStore.customerStore;

    handleChangeFilter = (key, value, debounce) =>
    {
        this.customerStore.setFilterState(key, value);
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
        this.customerStore.resetFilterState(this.customerStore.filterState.searchKey);
        
        const filter = {
            'customer_fullname': '',
            'customer_contact_no': '',
            'customer_type_id': '',
        };
  
        RouterParamsHelper.setParams(this.customerStore.urlParams, this.props, filter);
    };

    render()
    {
        return (
            <>
                <FormGroup>
                    <FormControlLabel
                        label={'Tên khách hàng'}
                        control={
                            <ClearableInput
                                type={'input'}
                                className={'form-control'}
                                placeholder={'Nhập giá trị'}
                                value={this.customerStore.filterState.customer_fullname}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('customer_fullname', value, true);
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Điện thoại'}
                        control={
                            <ClearableInput
                                className={'form-control'}
                                placeholder={'Nhập giá trị'}
                                value={this.customerStore.filterState.customer_contact_no}
                                clearable
                                onChange={(value) =>
                                {
                                    this.handleChangeFilter('customer_contact_no', value, true);
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label={'Loại khách hàng'}
                        control={
                            <SelectOrInput
                                placeholder={'Chọn một giá trị'}
                                options={this.props.customerTypeOptions}
                                value={this.customerStore.filterState.customer_type_id}
                                multi
                                onChange={(value) =>
                                {
                                    if (isEmpty(value))
                                    {
                                        value = [];
                                    }
                                    this.handleChangeFilter('customer_type_id', Array.isArray(value) ? value : [value]);
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
CustomerFilterPanel.propTypes = {
    onFilterChange: PropTypes.func,
};
CustomerFilterPanel = inject('appStore', 'fieldForceStore')(observer(CustomerFilterPanel));
CustomerFilterPanel = withRouter(CustomerFilterPanel);
export default CustomerFilterPanel;
