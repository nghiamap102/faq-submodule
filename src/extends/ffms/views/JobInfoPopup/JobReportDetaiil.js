import './JobReport.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Field, Label, CheckBox, Info,
    withI18n,
} from '@vbd/vui';

import LayerService from 'services/layer.service';
export class JobReportDetail extends Component
{
    layerSvc = new LayerService();
    comSvc = this.props.fieldForceStore.comSvc;
    
    layerInfo = {};

    propExcludes = ['CreatedDate', 'CreatedUserId', 'Description', 'Id', 'Title', 'Layer', 'Location', 'ModifiedDate', 'ModifiedUserId', 'Name', 'Path', 'Shape', 'Type', 'WKT', 'WorkflowStatus'];
    typeExcludes = [7];

    state = {
        loading: true,
        data: {},
    };

    componentDidMount = () =>
    {
        this.comSvc.getLayerConfig('JOBREPORT').then((result) =>
        {
            this.layerInfo = result;

            if (this.props.data && this.props.data.job_guid)
            {
                const jobGuid = this.props.data.job_guid;
    
                this.comSvc.queryData('job-reports', { job_guid: jobGuid, take: 1, skip: 0, sortBy: [{ Field: 'CreatedDate', Direction: 'DESC' }] }).then((res) =>
                {
                    this.setState({ data: res && res.data && res.data.length ? res.data[0] : {} });
                });
            }
        });
    };

    renderField = (fieldName) =>
    {
        if (this.propExcludes.includes(fieldName))
        {
            return null;
        }

        let displayName = fieldName;
        let fieldValue = this.state.data[fieldName];

        // TODO: reuse DynamicFormField
        if (this.layerInfo && this.layerInfo.Properties && this.layerInfo.Properties.length)
        {
            const propInfo = this.layerInfo.Properties.find((prop) => prop.ColumnName === fieldName);
            if (propInfo)
            {
                if (this.typeExcludes.includes(propInfo.DataType))
                {
                    return null;
                }

                if (propInfo.IsView === false)
                {
                    return null;
                }

                displayName = propInfo.DisplayName;

                if (propInfo.DataType === 1)
                {
                    fieldValue = (
                        <CheckBox
                            checked={fieldValue ? true : false}
                        />
                    );
                }
                else if (propInfo.DataType === 5)
                {
                    if (fieldValue === '0001-01-01T00:00:00')
                    {
                        fieldValue = 'Chưa xác định';
                    }
                }
            }
        }

        return (
            <Field key={fieldName}>
                <Label width={this.props.labelWidth}>{displayName}</Label>
                <Info>{fieldValue || 'Không có dữ liệu'}</Info>
            </Field>
        );
    };

    render()
    {
        return Object.keys(this.state.data).map(this.renderField);
    }
}


JobReportDetail = withI18n(inject('appStore', 'fieldForceStore')(observer(JobReportDetail)));
export default JobReportDetail;

