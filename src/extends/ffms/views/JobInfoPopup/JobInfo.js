import './JobInfo.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Row, Container, Section, withI18n,
} from '@vbd/vui';

import JobBasicInfo from 'extends/ffms/views/DetailView/ViewSection/JobBasicInfo';
import PropertiesInfo from 'extends/ffms/views/DetailView/ViewSection/PropertiesInfo';
import { LocationViewer } from 'extends/ffms/components/MiniMap/LocationViewer';
import { JobTimeline } from 'extends/ffms/views/JobInfoPopup/JobTimeline';
import { DataTypes, isEmpty } from 'helper/data.helper';

export class JobInfo extends Component
{
    comSvc = this.props.fieldForceStore.comSvc;

    state = {
        data: undefined,
        properties: [],
    };

    componentDidMount()
    {
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
                properties: results.filter((p) => p.ColumnName),
            });
        });

        const data = this.props.data || {};
        
        this.setState({ data: data });
        if (data && data.job_guid)
        {
            this.comSvc.queryData('activity-logs', { activitylog_job_guid: this.props.data.job_guid, sortBy: [{ Field: 'activitylog_created_time', Direction: 'ASC' }] }).then((rs) =>
            {
                data.activityLogs = rs?.data || [];
                this.setState({ data: data });
            });
        }

    }

    render()
    {
        const { properties, data = {} } = this.state;

        return (
            <Container className='job-container'>
                <Row>
                    <Container className='job-info-body job-info-left'>
                        <Section header={'Thông tin cơ bản'} >
                            <JobBasicInfo
                                data={data}
                            />
                        </Section>
                        <Section header={'Thông tin khác'}>
                            <PropertiesInfo
                                data={data}
                                properties={properties.filter((p) => !p.IsSystem)}
                            />
                        </Section>
                    </Container>

                    <Container className='job-info-body job-info-right'>
                        {
                            !isEmpty(data) &&
                            <LocationViewer
                                data={data}
                                layer={'JOB'}
                                properties={properties.filter((p) => p.DataType === DataTypes.Map || p.DataType === DataTypes.MapVN2000)}
                            />
                        }
                        <JobTimeline
                            data={data.activityLogs || []}
                        />
                    </Container>
                </Row>
            </Container>
        );
    }
}

JobInfo.propTypes = {
    data: PropTypes.shape({
        jobReport: PropTypes.object,
        activityLogs: PropTypes.array,
    }),
};

JobInfo.defaultProps = {
    data: {
        jobReport: {},
        activityLogs: [],
    },
};

JobInfo = withI18n(inject('appStore', 'fieldForceStore')(observer(JobInfo)));
