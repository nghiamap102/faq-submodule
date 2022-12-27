import './JobDetail.scss';

import React, { Component } from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Row, Container, Section, TB1, withI18n,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { isEmpty } from 'helper/data.helper';
import DataEnum from 'extends/ffms/constant/ffms-enum';
import { PlainListItem } from 'extends/ffms/components/ListItem/PlainListItem';

export class JobDetail extends Component
{
    comSvc = this.props.fieldForceStore.comSvc;

    state = {
        jobStatusOptions: [],
        jobDetailProperties: [],
    };

    componentDidMount()
    {
        this.comSvc.getLayerListOptions('JOB', 'job_status_id').then((result) =>
        {
            this.setState({ jobStatusOptions: result });
        });

        this.comSvc.getLayerProperties('JOB').then((results) =>
        {
            results.forEach((prop) =>
            {
                const config = prop.Config ? (typeof (prop.Config) === 'string' ? JSON.parse(prop.Config) : prop.Config) : { custom: { isID: false, isSystem: false } };
                if (config && config.custom && config.custom.isSystem)
                {
                    prop.IsSystem = true;
                }
            });

            this.setState({
                jobDetailProperties: results.filter((p) => p.ColumnName && !p.IsSystem),
            });
        });
    }

    getTimeFormat = (first, second) =>
    {
        let dateFormat = 'L HH:mm A';
        const sameDay = first.isSame(second, 'day');
        const sameMonth = first.isSame(second, 'month');
        const sameYear = first.isSame(second, 'year');

        if (sameDay)
        {
            dateFormat = 'HH:mm A';
        }
        else if (sameMonth || sameYear)
        {
            dateFormat = 'DD/MM HH:mm A';
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

    getIconByDataType = (dataType) =>
    {
        switch (dataType)
        {
            case 1: // Checkbox
                return 'data-checkbox';
            case 2: // Number
                return 'data-number';
            case 3: // Textbox
                return 'data-string';
            case 4: // Float/Double
                return 'data-decimal';
            case 5: // Datetime
                return 'data-date-time';
            case 6: // Area field
                return 'data-text-area';
            case 7: // Map
                return 'route-map';
            case 8: // Rich Text
                return 'data-rich-text';
            case 10: // Combobox
                return 'data-combo-box';
            default:
                return 'info-circle';
        }
    }

    renderProperties = (prop, data) =>
    {
        const { DisplayName, ColumnName, DataType } = prop;

        let value = `${data[ColumnName]}`;
        if (isEmpty(data[ColumnName]))
        {
            value = 'Không có dữ liệu';
        }
        else if (DataType === 5)
        {
            value = <Moment format={'L LTS'}>{moment(value)}</Moment>;
        }

        return (
            DataType !== 7 &&
            <PlainListItem
                sub={value}
                label={DisplayName || 'Ghi chú'}
                iconClass={this.getIconByDataType(DataType)}
                iconTypeSvg
            />
        );
    }

    render()
    {
        const { data = {} } = this.props;
        const { jobDetailProperties } = this.state;

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
        
        return (
            <Container>
                <Section header={'Thông tin công việc'}>
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
                </Section>
                {
                    jobDetailProperties && jobDetailProperties.length > 0 &&
                    <Section header={'Thông tin khác'}>
                        { jobDetailProperties?.map((prop) => this.renderProperties(prop, data)) }
                    </Section>
                }
            </Container>
        );
    }
}

JobDetail.propTypes = {
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

        activityLogs: PropTypes.arrayOf(PropTypes.object),
        jobReports: PropTypes.arrayOf(PropTypes.object),
        assignee: PropTypes.shape({
            employee_full_name: PropTypes.string,
        }),
        customer: PropTypes.shape({
            customer_fullname: PropTypes.string,
        }),
    }),
};

JobDetail = withI18n(inject('appStore', 'fieldForceStore')(observer(JobDetail)));
