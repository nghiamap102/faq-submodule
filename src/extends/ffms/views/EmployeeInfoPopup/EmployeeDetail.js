import './EmployeeDetail.scss';

import React, { Component } from 'react';
import {
    Container, Panel, T, FormControlLabel, FormGroup, Label,
} from '@vbd/vui';

import unknownFace from 'images/faceImage/unknown-face.jpg';
import { FileImage } from 'extends/ffms/pages/base/File/FileImage';

export class EmployeeDetail extends Component
{
    render()
    {
        const { data } = this.props;
        const noDataText = 'Không có dữ liệu';
        const noDataClass = 'no-data';

        return (
            <Panel className={'ed-panel'}>
                <Container className={'ed-image-container'}>
                    <FileImage
                        className={'ed-avatar'}
                        altSrc={unknownFace}
                        info={data.employee_image}
                    />
                </Container>
                <FormGroup className="ed-summary">
                    <FormControlLabel
                        label={''}
                        labelWidth={'8rem'}
                        className={`ed-full-name ${data.employee_username ? '' : noDataClass}`}
                        control={data.employee_full_name || <T>noDataText</T>}
                    />
                    <FormControlLabel
                        label={''}
                        labelWidth={'8rem'}
                        className={`ed-username ${data.employee_username ? '' : noDataClass}`}
                        control={data.employee_username || <T>noDataText</T>}
                    />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel
                        label={'Email'}
                        className={`ed-email ${data.employee_email ? '' : noDataClass}`}
                        control={
                            <Label>{data.employee_email || <T>noDataText</T>}</Label>
                        }
                    />
                    <FormControlLabel
                        label={'Điện thoại'}
                        className={`ed-phone ${data.employee_phone ? '' : noDataClass}`}
                        control={
                            <Label>{data.employee_phone || <T>noDataText</T>}</Label>
                        }
                    />
                    <FormControlLabel
                        label={'Kiểu'}
                        className={`ed-type ${data.employee_type_id ? '' : noDataClass}`}
                        control={
                            <Label>{data.employee_type_id || <T>noDataText</T>}</Label>
                        }
                    />
                    <FormControlLabel
                        label={'Đội'}
                        className={`ed-team ${data.employee_team_id ? '' : noDataClass}`}
                        control={
                            <Label>{data.team?.Title || data.employee_team_id || <T>noDataText</T>}</Label>
                        }
                    />
                    <FormControlLabel
                        label={'Tổ chức'}
                        className={`ed-organization ${data.employee_organization_id ? '' : noDataClass}`}
                        control={
                            <Label>{data.organization?.Title || data.employee_organization_id || <T>noDataText</T>}</Label>
                        }
                    />
                </FormGroup>
            </Panel>
        );
    }
}
