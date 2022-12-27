import './JobTimeline.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
    Container, ScrollView, Section,
    T, withI18n,
} from '@vbd/vui';

import { PlainListItem } from 'extends/ffms/components/ListItem/PlainListItem';
export class JobTimeline extends Component
{
    fieldForceStore = this.props.fieldForceStore;

    getTimeFormat = (first, second) =>
    {
        if (!first || !second)
        {
            return 'L HH:mm:ss';
        }

        const sameDay = moment(first).isSame(moment(second), 'day');
        const sameMonth = moment(first).isSame(moment(second), 'month');
        const sameYear = moment(first).isSame(moment(second), 'year');
        if (sameDay)
        {
            return 'HH:mm:ss';
        }
        else if (sameMonth || sameYear)
        {
            return 'L HH:mm:ss';
        }
        else
        {
            return 'L HH:mm:ss';
        }
    };

    render()
    {
        const { data } = this.props;
        const items = data && data.map((log, index) =>
        {
            return (
                <PlainListItem
                    key={index}
                    sub={
                        <>
                            {
                                log.activitylog_created_time && moment(log.activitylog_created_time).format('L HH:mm:ss')
                            }
                            {
                                // log.activitylog_status_id === 1 && log.activitylog_created_by &&
                                ` ${this.props.t('bởi')} ${log.activitylog_created_by}`
                            }
                        </>
                    }
                    label={log.Title}
                    iconClass={'circle'}
                    iconColor={this.fieldForceStore.getJobStatusColor(log.activitylog_status_id)}
                    iconType={'solid'}
                />
            );
        });

        return (
            <>
                {
                    items && items.length > 0 &&
                    <Section
                        header={<T>Mốc thời gian</T>}
                    >
                        <ScrollView>
                            <Container className="timeline-centered">
                                {items}
                            </Container>
                        </ScrollView>
                    </Section>
                }
            </>
        );
    }
}

JobTimeline.propTypes = {
    data: PropTypes.array,
};
JobTimeline.defaultProps = {
    data: [],
};

JobTimeline = withI18n(inject('appStore', 'fieldForceStore')(observer(JobTimeline)));
export default JobTimeline;
