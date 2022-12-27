import 'extends/ffms/views/TabManager/ManagerPanel.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Redirect } from 'react-router-dom';
import * as Routers from 'extends/ffms/routes';

import {
    Column, Popup, PanelBody, NavigationMenu,
} from '@vbd/vui';

import CommonService from 'extends/ffms/services/CommonService';
import CustomerPanel from 'extends/ffms/views/CustomerPanel/CustomerPanel';
import ImportManager from 'extends/ffms/components/Import/ImportManager';
import { RoleRoute } from 'extends/ffms/components/Role/RoleRoute';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';

export class CustomerManager extends Component
{
    uploadStore = this.props.fieldForceStore.uploadStore;
    comSvc = new CommonService();

    getMenuAccsess = (menu) =>
    {
        const { pathPermission, hasPermissionNode } = this.props;

        return menu.filter(menuItem =>
        {
            const caseCheck = menuItem.feature === 'list' ? 'access' : 'view';
            return hasPermissionNode(pathPermission, menuItem.feature, 'some', caseCheck);
        });
    }

    state = {
        columns: [],
        feature: 'list',
        menuNaviation: [],
    };

    menu = [
        {
            id: 'list',
            name: 'Danh sách khách hàng',
            feature: 'list',
            caseCheckPermissison: 'access',
            path: `${Routers.CUSTOMER_MANAGER}/list`,
            content: <CustomerPanel />,
        },
        {
            id: 'import',
            name: 'Nhập liệu',
            feature: 'import',
            caseCheckPermissison: 'view',
            path: `${Routers.CUSTOMER_MANAGER}/import`,
            content: <ImportManager layerName={'CUSTOMER'} />,
        },
    ];

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
                {
                    this.uploadStore.isShow &&
                    <Popup
                        title={'CUSTOMER UPLOAD MANAGEMENT'}
                        width={'90vw'}
                        height={'90vh'}
                        padding={'0'}
                        scroll={false}
                        onClose={() =>
                        {
                            this.uploadStore.togglePanel();
                        }}
                    >
                        <ImportManager/>
                    </Popup>
                }
            </PanelBody>
        );
    }
}

CustomerManager = inject('appStore', 'fieldForceStore')(observer(CustomerManager));
CustomerManager = withPermission(withRouter(CustomerManager));
export default CustomerManager;
