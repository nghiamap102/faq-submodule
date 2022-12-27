import './RoleManager.scss';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';

import { Column, PanelBody, NavigationMenu } from '@vbd/vui';

import * as Routers from 'extends/ffms/routes';
import RolePanel from 'extends/ffms/views/RolePanel/RolePanel';
import { RoleRoute } from 'extends/ffms/components/Role/RoleRoute';


class RoleManager extends Component
{
    menu = [
        {
            id: 'list',
            name: 'Quản lý vai trò',
        },
    ];

    render()
    {
        return (
            <PanelBody>
                <Column>
                    <NavigationMenu
                        menus={this.menu}
                        type='horizontal'
                        activeMenu={this.props.history.location.pathname.split('/').slice(-1)[0]}
                        onChange={this.handleMenuChange}
                    />
                    <Switch>
                        <RoleRoute path={`${Routers.ROLES_MANAGER}/list`}><RolePanel /></RoleRoute>
                        <Redirect to={`${Routers.ROLES_MANAGER}/list`} />
                    </Switch>
                </Column>
            </PanelBody>
        );
    }
}

RoleManager = inject('appStore', 'fieldForceStore')(observer(RoleManager));
RoleManager = withRouter(RoleManager);
export default RoleManager;
