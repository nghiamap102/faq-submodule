import './JobReport.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { FormGroup } from '@vbd/vui';

import JobReportGallery from 'extends/ffms/views/JobInfoPopup/JobReportGallery';
import JobReportDetail from 'extends/ffms/views/JobInfoPopup/JobReportDetaiil';

export class JobReport extends Component
{
    render()
    {
        return (
            <FormGroup>
                <JobReportDetail data={this.props.data}/>
                <JobReportGallery data={this.props.data}/>
            </FormGroup>
        );
    }
}


JobReport = inject('appStore', 'fieldForceStore')(observer(JobReport));
export default JobReport;

