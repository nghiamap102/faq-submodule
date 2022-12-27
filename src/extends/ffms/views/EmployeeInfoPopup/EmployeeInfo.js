import './EmployeeInfo.scss';

import React, { Component } from 'react';

import {
    FormControlLabel, FormGroup, SectionHeader, Label,
} from '@vbd/vui';

import TeamService from 'extends/ffms/services/TeamService';

class EmployeeInfo extends Component
{
    teamService = new TeamService();

    state = {
        team: null,
    };

    async componentDidMount()
    {
        const { data } = this.props;
        const team = await this.teamService.get(data.employee_team_id);
        this.setState({ team });
    }

    render()
    {
        const { data } = this.props;

        return (
            <div className="emp-container">

                <div className="container profile">
                    <div className="image-outer-container">
                        <div className="image-inter-container">
                            <img
                                src={require('extends/ffms/images/faceImage1.png')}
                            />
                        </div>
                        <FormGroup>
                            <Label><h1 className="fullname">{data?.employee_full_name}</h1></Label>
                            <Label><h1 className="username">{data?.employee_username}</h1></Label>
                        </FormGroup>
                    </div>
                </div>
                <div className="emp-data-container">
                    <div className="emp-container emp-Info-body">
                        <SectionHeader>Profile</SectionHeader>
                        <FormGroup>
                            <FormControlLabel
                                iconName={'calendar-alt'}
                                iconClassName={'icon-styles'}
                                iconSize={'21px'}
                                control={
                                    <Label>{data?.employee_dob}</Label>
                                }
                            />

                            <FormControlLabel
                                iconName={'motorcycle'}
                                iconClassName={'icon-styles'}
                                iconSize={'21px'}
                                control={
                                    <Label>{data?.employee_vehicle_id}</Label>
                                }
                            />
                            <FormControlLabel
                                iconName={'tablet'}
                                iconClassName={'icon-styles'}
                                iconSize={'21px'}
                                control={
                                    <Label>{data?.employee_device_id}</Label>
                                }
                            />
                            <FormControlLabel
                                iconName={'phone'}
                                iconClassName={'icon-styles'}
                                iconSize={'21px'}
                                control={
                                    <Label>{data?.employee_phone}</Label>
                                }
                            />
                            <FormControlLabel
                                iconName={'envelope'}
                                iconClassName={'icon-styles'}
                                iconSize={'21px'}
                                control={
                                    <Label>{data?.employee_email}</Label>
                                }
                            />
                        </FormGroup>
                    </div>
                    <div className="emp-container emp-Info-body">
                        <SectionHeader>Team</SectionHeader>
                        <FormGroup>
                            <FormControlLabel
                                label={'Guid'}
                                control={
                                    <Label>{data?.employee_guid}</Label>
                                }
                            />

                            <FormControlLabel
                                label={'Code'}
                                control={
                                    <Label>{data?.employee_code}</Label>
                                }
                            />
                            <FormControlLabel
                                label={'Type'}
                                control={
                                    <Label>{data?.employee_type_id}</Label>
                                }
                            />
                            <FormControlLabel
                                label={'Shift'}
                                control={
                                    <Label>{data?.employee_shift_id}</Label>
                                }
                            />
                            <FormControlLabel
                                label={'Team'}
                                control={
                                    <Label>{this.state.team?.Title || data?.employee_team_id}</Label>
                                }
                            />
                        </FormGroup>
                    </div>
                </div>

            </div>
        );
    }
}

export default EmployeeInfo;
