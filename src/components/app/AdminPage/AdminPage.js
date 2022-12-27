import './AdminPage.scss';

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
    PageTitle,
    BorderPanel, FlexPanel, PanelBody, ContainerPanel,
    useI18n, useModal,
} from '@vbd/vui';

import AdminPageMenu from 'components/app/AdminPage/AdminPageMenu';
import AdminPageInfo from 'components/app/AdminPage/AdminPageInfo';
import CameraMonitoring from 'components/app/CameraMonitoring/CameraMonitoring';
import DeviceSignalMonitoring from 'components/app/DeviceSignalMonitoring/DeviceSignalMonitoring';
import { ActivityLogs } from 'components/app/ActivityLogs/ActivityLogs';

import SystemLogs from '../SystemLogs/SystemLogs';

import { UserSettings } from './components/UserSettings';
import { EnvironmentSettings } from './components/EnvironmentSettings';

export default inject('appStore')(observer((props) =>
{
    const history = useHistory();
    const { t } = useI18n();
    const { menu } = useModal();

    const handleInfoClick = (event) =>
    {
        menu({
            id: 'map-context-menu',
            isTopLeft: true,
            position: { x: event.clientX, y: event.clientY },
            actions: [
                {
                    label: 'Trang chủ',
                    icon: 'home',
                    onClick: () => history.push('/'),
                },
                {
                    separator: true,
                },
                {
                    label: 'Đăng xuất',
                    icon: 'sign-out',
                    onClick: () => props.appStore.logOut(),
                },
            ],
        });
    };

    return (
        <ContainerPanel className={'admin'}>
            <Helmet>
                <title>{t('Thiết lập hệ thống')}</title>
                <meta
                    name="application-name"
                    content={t('Thiết lập hệ thống')}
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content={t('Thiết lập hệ thống')}
                />
            </Helmet>

            <FlexPanel width={'20rem'}>
                <PanelBody className={'admin-left-menu'}>
                    <AdminPageInfo onClick={handleInfoClick} />
                    <AdminPageMenu />
                </PanelBody>
            </FlexPanel>

            <BorderPanel
                className={'face-alert-content'}
                flex={1}
            >
                <Switch>
                    <Route path="/admin/user">
                        <PageTitle>Người dùng</PageTitle>
                        <PanelBody scroll>
                            <UserSettings />
                        </PanelBody>
                    </Route>

                    <Route path="/admin/environment">
                        <PageTitle>Môi trường</PageTitle>
                        <PanelBody scroll>
                            <EnvironmentSettings />
                        </PanelBody>
                    </Route>

                    <Route path="/admin/camera-monitoring">
                        <PanelBody>
                            <PageTitle>Giám sát camera</PageTitle>
                            <CameraMonitoring />
                        </PanelBody>
                    </Route>

                    <Route path="/admin/device-signal-monitoring">
                        <PageTitle>Giám sát thiết bị</PageTitle>
                        <PanelBody>
                            <DeviceSignalMonitoring />
                        </PanelBody>
                    </Route>

                    <Route path="/admin/system-logs">
                        <PageTitle>Logs hệ thống</PageTitle>
                        <PanelBody>
                            <SystemLogs />
                        </PanelBody>
                    </Route>

                    <Route path="/admin/activity-logs">
                        <PageTitle>Nhật ký hoạt động</PageTitle>
                        <PanelBody>
                            <ActivityLogs />
                        </PanelBody>
                    </Route>

                    <Redirect to="/admin/user" />
                </Switch>
            </BorderPanel>
        </ContainerPanel>
    );
}));

