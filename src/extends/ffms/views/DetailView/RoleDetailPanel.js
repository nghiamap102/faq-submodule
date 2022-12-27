import './DetailView.scss';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {
    Container, HD5, Sub2,
    withI18n, withModal,
} from '@vbd/vui';

import { isEmpty } from 'helper/data.helper';
import TabBar from 'extends/ffms/pages/base/TabBar';
import Loading from 'extends/ffms/pages/base/Loading';
import PermissionTreeView from 'extends/ffms/components/Permission/PermissionTreeView';
import RoleAccount from 'extends/ffms/components/Permission/RoleAccount';
import PermissionService from 'extends/ffms/services/PermissionService';

let RoleDetailPanel = (props) =>
{
    const fieldForceStore = props.fieldForceStore;
    const permissionStore = fieldForceStore.permissionStore;
    const roleStore = props.fieldForceStore.roleStore;
    const permissionSvc = new PermissionService();
    const [recursive, setRecursive] = useState(false);

    const [tabs, setTabs] = useState([]);

    const [tabActive, setTabActive] = useState();
    const [canSetRole, setCanSetRole] = useState(false);
    const location = props.location;
    const qs = new URLSearchParams(location.search);
    const roleName = qs.get('select');
    const canEditRole = roleStore.isBasicRoles.includes(roleName);

    useEffect(() =>
    {
        permissionStore.init(roleName);
        
        permissionSvc.canPerformAction(`${roleStore.rolSvc.dataPath}/roles-manager/list/view`, permissionSvc.PERMISSION_LIST.SET_PERMISSION).then((hasPermission) =>
        {
            let tabs = [{ id: 2, title: 'Danh sách người dùng', hash: '#Users' }];
            if (hasPermission)
            {
                tabs = [{ id: 1, title: 'Quyền chức năng', hash: '#Permission' }, ...tabs];
            }
            setCanSetRole(hasPermission);
            setTabs(tabs.map((tab) => ({
                ...tab,
                link: location.pathname + location.search + tab.hash,
            })));
            activeTab(tabs[0].id);
        });
    }, []);

    const activeTab = () =>
    {
        const hash = location.hash;
        const tab = tabs.find(item => item.hash === hash);

        if (tab)
        {
            setTabActive(tab.id);
        }
        else
        {
            setTabActive(1);
        }
    };

    return (
        <>
            {
                !tabs || isEmpty(tabs) ? <Loading/> :
                    (
                        <Container className={'detail-panel'}>
                            <Container className='detail-panel-header' >
                                <HD5>{roleStore.currentRole.Name}</HD5>
                                <Sub2>{roleStore.currentRole.Title}</Sub2>
                            </Container>

                            <TabBar
                                title=''
                                tabs={tabs}
                                defaultIndex={tabActive}
                                onChange={(id) => setTabActive(id)}
                                className={'detail-panel-tabs'}
                            />

                            <Container className='detail-panel-body'>
                                {
                                    // TODO: map to multi section
                                    tabActive === 1 && canSetRole &&
                                    (
                                        !isEmpty(permissionStore.permissions) ?
                                            <PermissionTreeView
                                                data={permissionStore.permissions}
                                                recursive={recursive}
                                                onChangeRecursive={setRecursive}
                                                readOnly={canEditRole}
                                            /> :
                                            <Loading />
                                    )
                                }
                                {
                                    (tabActive === 2 || !canSetRole) &&
                                    <RoleAccount />
                                }
                            </Container>
                        </Container>
                    )
            }
        </>
    );
};

RoleDetailPanel = inject('appStore', 'fieldForceStore')(observer(RoleDetailPanel));
RoleDetailPanel = withModal(withI18n(withRouter(RoleDetailPanel)));
export default RoleDetailPanel;
