import 'extends/ffms/views/TabManager/ManagerPanel.scss';

import React, { Component } from 'react';

import { Column, PanelBody, NavigationMenu } from '@vbd/vui';

import EmployeePanel from 'extends/ffms/views/EmployeePanel/EmployeePanel';
import JobPanel from 'extends/ffms/views/JobPanel/JobPanel';
export class ManagerPanel extends Component
{
    state = {
        feature: 'manager-job',
    };

    menu = [
        {
            id: 'manager-job',
            name: 'Jobs',
        },
        {
            id: 'manager-employee',
            name: 'Employee',
        },
    ];

    handleMenuChange = (menu) =>
    {
        this.setState({ feature: menu });
    };

    render()
    {
        return (
            <PanelBody>
                <Column>
                    <NavigationMenu
                        menus={this.menu}
                        type='horizontal'
                        activeMenu={this.state.feature}
                        onChange={this.handleMenuChange}
                    />
                    {this.state.feature === 'manager-job' && <JobPanel/>}
                    {this.state.feature === 'manager-employee' && <EmployeePanel/>}
                </Column>
            </PanelBody>
        );
    }
}
