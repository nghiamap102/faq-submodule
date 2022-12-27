import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { withI18n, TB1 } from '@vbd/vui';

import { isEmpty } from 'helper/data.helper';
import { PlainListItem } from 'extends/ffms/components/ListItem/PlainListItem';

class CustomerBasicInfo extends Component
{
    render()
    {
        const { data } = this.props;
        const buildingAddress = [
            data.customer_address_street ? data.customer_address_street : null,
        ].filter((x) => x).join(', ');
        const streetAddress = [
            data.customer_address_village ? data.customer_address_village : null,
            data.customer_address_tehsil ? data.customer_address_tehsil : null,
            data.customer_address_district ? data.customer_address_district : null,
            data.customer_address_state ? data.customer_address_state : null,
        ].filter((x) => x).join(', ');
        const pincode = data.customer_address_pincode;

        const fullAddress = [streetAddress, pincode, buildingAddress].filter((x) => x).join(' ');
        return (
            <>
                <PlainListItem
                    sub={
                        <TB1>{data.customer_fullname || 'Không có dữ liệu'}</TB1>
                    }
                    label={'Tên khách hàng'}
                    iconClass={'user-circle'}
                />
              
                <PlainListItem
                    sub={
                        <TB1>{!isEmpty(data.customer_dob) ? moment(data.customer_dob).format('L') : 'Không có dữ liệu'}</TB1>
                    }
                    label={'Ngày sinh'}
                    iconClass={'calendar-alt'}
                />
                <PlainListItem
                    sub={
                        <TB1>{data.customer_contact_no || 'Không có dữ liệu'}</TB1>
                    }
                    label={'Điện thoại'}
                    iconClass={'phone-alt'}
                />
                <PlainListItem
                    sub={buildingAddress && (streetAddress || pincode) ? <TB1>{streetAddress} {pincode}</TB1> : ''}
                    label={buildingAddress || fullAddress || 'Không có dữ liệu vị trí'}
                    iconClass={'map-marker'}
                />
                <PlainListItem
                    sub={
                        <TB1>{data.customer_type_id || 'Không có dữ liệu'}</TB1>
                    }
                    label={'Kiểu'}
                    iconClass={'user-tag'}
                />
            </>
        );
    }
}

CustomerBasicInfo.propTypes = {
    data: PropTypes.object,
};

CustomerBasicInfo = withI18n(inject('appStore', 'fieldForceStore')(observer(CustomerBasicInfo)));
export default CustomerBasicInfo;
