import 'extends/ffms/views/TabManager/ManagerPanel.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Redirect } from 'react-router-dom';
import * as Routers from 'extends/ffms/routes';

import {
    Column, PanelBody, Popup, NavigationMenu,
} from '@vbd/vui';

import JobPanel from 'extends/ffms/views/JobPanel/JobPanel';
import ImportManager from 'extends/ffms/components/Import/ImportManager';
import { RoleRoute } from 'extends/ffms/components/Role/RoleRoute';
import { withPermission } from 'extends/ffms/components/Role/Permission/withPermission';

export class JobManager extends Component
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
            name: 'Danh sách công việc',
            path: `${Routers.JOBS_MANAGER}/list`,
            content: <JobPanel />,
        },
        {
            id: 'import',
            feature: 'import',
            caseCheckPermissison: 'view',
            name: 'Nhập liệu',
            path: `${Routers.JOBS_MANAGER}/import`,
            content: <ImportManager layerName={'JOB'} />,
        },
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
                {
                    this.uploadStore.isShow &&
                    <Popup
                        title={'JOB UPLOAD MANAGEMENT'}
                        width={'90vw'}
                        height={'90vh'}
                        padding={'0'}
                        scroll={false}
                        onClose={() =>
                        {
                            this.uploadStore.togglePanel();
                        }}
                    >
                        <ImportManager />
                    </Popup>
                }
            </PanelBody>
        );
    }
}

JobManager = inject('appStore', 'fieldForceStore')(observer(JobManager));
JobManager = withPermission(withRouter(JobManager));
export default JobManager;
