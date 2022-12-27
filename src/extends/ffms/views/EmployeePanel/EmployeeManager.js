import 'extends/ffms/views/TabManager/ManagerPanel.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Redirect } from 'react-router-dom';
import * as Routers from 'extends/ffms/routes';

import { Column, PanelBody, NavigationMenu } from '@vbd/vui';

import EmployeePanel from 'extends/ffms/views/EmployeePanel/EmployeePanel';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';
import { RoleRoute } from 'extends/ffms/components/Role/RoleRoute';
// import ImportManager from 'extends/ffms/components/Import/ImportManager';

export class EmployeeManager extends Component
{
    uploadStore = this.props.fieldForceStore.uploadStore;

    getMenuAccsess = (menu) =>
    {
        const { pathPermission, hasPermissionNode } = this.props;

        return menu.filter(menuItem =>
        {
            const caseCheck = menuItem.feature === 'list' ? 'access' : 'view';
            return hasPermissionNode(pathPermission, menuItem.feature, 'some', caseCheck);
        });
    }


    menu = [
        {
            id: 'list',
            feature: 'list',
            caseCheckPermissison: 'access',
            name: 'Nhân viên',
            path: `${Routers.EMPLOYEES_MANAGER}/list`,
            content: <EmployeePanel />,
        },
        // {
        //     id: 'import',
        //     feature: 'import',
        //     name: 'Nhập liệu',
        //     path: `${Routers.EMPLOYEES_MANAGER}/import`,
        //     content: <ImportManager layerName={'EMPLOYEE'} />,
        // },
    ]

    menuNavigation = this.getMenuAccsess(this.menu)
    

    handleMenuChange = (menu) =>
    {
        this.props.history.push(menu);
    };

    render()
    {
        return (
            <PanelBody>
                <Column>
                    <NavigationMenu
                        menus={this.menuNavigation}
                        type='horizontal'
                        activeMenu={this.props.history.location.pathname.split('/').slice(-1)[0]}
                        onChange={this.handleMenuChange}
                    />
                    <Switch>
                        {
                            this.menu.map(menuItem =>
                            {
                                const { id, path, caseCheckPermissison } = menuItem;
                                return (
                                    <RoleRoute
                                        key = {id}
                                        {...{ path, caseCheckPermissison }}
                                    >
                                        {menuItem.content}
                                    </RoleRoute>
                                );
                            })
                        }
                        
                        {
                            this.menuNavigation?.length > 0 &&
                            <Redirect to={this.menuNavigation[0].path} />
                        }
                    </Switch>
                </Column>
            </PanelBody>
        );
    }
}

EmployeeManager = inject('appStore', 'fieldForceStore')(observer(EmployeeManager));
EmployeeManager = withRouter(withPermission(EmployeeManager));
export default EmployeeManager;
