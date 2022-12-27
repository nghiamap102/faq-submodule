import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    Row, Container, TB1,
    withI18n,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import DataEnum from 'extends/ffms/constant/ffms-enum';
import { PlainListItem } from 'extends/ffms/components/ListItem/PlainListItem';

class JobBasicInfo extends Component
{
    comSvc = this.props.fieldForceStore.comSvc;

    state = {
        jobStatusOptions: [],
    };

    componentDidMount()
    {
        this.comSvc.getLayerListOptions('JOB', 'job_status_id').then((result) =>
        {
            this.setState({ jobStatusOptions: result });
        });
    }

    getTimeFormat = (first, second) =>
    {
        let dateFormat = 'L LT';
        const sameDay = first.isSame(second, 'day');
        const sameMonth = first.isSame(second, 'month');
        const sameYear = first.isSame(second, 'year');

        if (sameDay)
        {
            dateFormat = 'LT';
        }
        else if (sameMonth || sameYear)
        {
            dateFormat = 'L LT';
        }
        return dateFormat;
    };

    getEstimatedTimeString = (data) =>
    {
        const afterTime = moment(data.job_estimated_completed_after_time);
        const beforeTime = moment(data.job_estimated_completed_before_time);

        if (!afterTime && !beforeTime)
        {
            return 'Không có dữ liệu';
        }

        if (afterTime && beforeTime)
        {
            const afterTimeFormat = this.getTimeFormat(afterTime, moment());
            const beforeTimeFormat = this.getTimeFormat(beforeTime, afterTime);
            return `${afterTime.format(afterTimeFormat)} - ${beforeTime.format(beforeTimeFormat)}`;
        }
        else if (afterTime)
        {
            const dateFormat = this.getTimeFormat(afterTime, moment());
            return `${this.props.t('Sau')} ${afterTime.format(dateFormat)}`;
        }
        else
        {
            const dateFormat = this.getTimeFormat(beforeTime, moment());
            return `${this.props.t('Trước')} ${beforeTime.format(dateFormat)}`;
        }
    };

    render()
    {
        const { data } = this.props;

        const streetAddress = [
            data.job_destination_address_village ? data.job_destination_address_village : null,
            data.job_destination_address_tehsil ? data.job_destination_address_tehsil : null,
            data.job_destination_address_district ? data.job_destination_address_district : null,
            data.job_destination_address_state ? data.job_destination_address_state : null,
        ].filter((x) => x).join(', ');

        const buildingAddress = [
            data.job_destination_address_street ? data.job_destination_address_street : null,
        ].filter((x) => x).join(', ');
        const pincode = data.job_destination_address_pincode;
        const fullAddress = [streetAddress, pincode, buildingAddress].filter((x) => x).join(' ');

        const jobStatus = CommonHelper.toDictionary(this.state.jobStatusOptions, 'indexed', 'id');
        const className = 'splitter={false}';
        return (
            <>
                <PlainListItem
                    sub={
                        <>
                            <TB1>{data.job_assignee_guid || 'Không có dữ liệu'}</TB1>
                            <TB1>{data.employee?.employee_phone}</TB1>
                        </>
                    }
                    label={'Giao cho'}
                    iconClass={'user-tag'}
                />
                <PlainListItem
                    sub={
                        <>
                            <TB1>{data.job_destination_contact_name || 'Không có dữ liệu'}</TB1>
                            <TB1>{data.job_destination_contact_no}</TB1>
                        </>
                    }
                    label={'Khách hàng'}
                    iconClass={'user-circle'}
                />
                <PlainListItem
                    sub={buildingAddress && (streetAddress || pincode) ? <TB1>{streetAddress} {pincode}</TB1> : ''}
                    label={buildingAddress || fullAddress || 'Không có dữ liệu vị trí'}
                    iconClass={'map-marker'}
                />
                {
                    jobStatus[data.job_status_id] !== DataEnum.JOB_STATUS.done &&
                    <PlainListItem
                        sub={this.getEstimatedTimeString(data)}
                        label={'Thời gian dự kiến'}
                        iconClass={'clock'}
                    />
                }
                <PlainListItem
                    sub={data.job_note || 'Không có dữ liệu'}
                    label={'Ghi chú'}
                    iconClass={'pencil'}
                />
                {
                    jobStatus[data.job_status_id] === DataEnum.JOB_STATUS.done &&
                    <Row>
                        <Container
                            flex={1}
                        >
                            <PlainListItem
                                sub={data.job_duration}
                                label={'Thời gian thực hiện'}
                                iconClass={'clock'}
                            />
                        </Container>
                        <Container
                            flex={1}
                        >
                            <PlainListItem
                                sub={data.job_distance}
                                label={'Khoảng cách'}
                                iconClass={'ruler'}
                            />
                        </Container>
                    </Row>
                }
            </>
        );
    }
}

JobBasicInfo.propTypes = {
    data: PropTypes.shape({
        job_status_id: PropTypes.number,
        job_duration: PropTypes.number,
        job_distance: PropTypes.number,
        job_assignee_guid: PropTypes.string,
        job_destination_address_street: PropTypes.string,
        job_destination_address_village: PropTypes.string,
        job_destination_address_tehsil: PropTypes.string,
        job_destination_address_district: PropTypes.string,
        job_destination_address_state: PropTypes.string,
        job_destination_address_pincode: PropTypes.string,
    }),
};

JobBasicInfo = withI18n(inject('appStore', 'fieldForceStore')(observer(JobBasicInfo)));
export default JobBasicInfo;
