import './SideFeature.scss';

import React, { useContext, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';

import {
    Container, BorderPanel, Popup,
    FeatureBar, FeatureBarBottom, FeatureBarTop, FeatureItem, FeatureImage,
    TenantContext, useTenant, withI18n, ThemeContext, ThemeIcon, themeList, useModal, HD6,
} from '@vbd/vui';

import { FeatureLink } from 'extends/ffms/bases/FeatureBar/FeatureLink';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import { CommonHelper } from 'helper/common.helper';
import { isEmpty } from 'helper/data.helper';
import { RouterParamsHelper } from 'helper/router.helper';

import { LanguageButton } from 'components/app/CommandStation/components/LanguageButton';
import BarrierManager from 'components/app/Direction/BarrierManager';
import { DirectionContainer } from 'components/app/Direction/DirectionContainer';
import { SearchContainer } from 'components/app/Search/SearchContainer';

import { TENANT_STATUS } from 'extends/ffms/constant/ffms-enum';
import * as Routers from 'extends/ffms/routes';
import { QRCodeViewer } from 'extends/ffms/components/QRCodeViewer/QRCodeViewer';
import Dashboard from 'extends/ffms/pages/Dashboard/Dashboard';
import ManagerLayerData from 'extends/ffms/pages/Layerdata/ManagerLayerData';
import Report from 'extends/ffms/pages/Report';
import CustomerManager from 'extends/ffms/views/CustomerPanel/CustomerManager';
import { EmployeeManager } from 'extends/ffms/views/EmployeePanel/EmployeeManager';
import { JobFeatureView } from 'extends/ffms/views/JobFilterView/JobFeatureView';
import { JobFilter } from 'extends/ffms/views/JobFilterView/JobFilter';
import { JobManager } from 'extends/ffms/views/JobPanel/JobManager';
import { LayerSwitcher } from 'extends/ffms/views/LayerSwitcher/LayerSwitcher';
import RoleManager from 'extends/ffms/views/RolePanel/RoleManager';
import { HistoryFeatureView } from 'extends/ffms/views/TrackingHistory/HistoryFeatureView';
import { HistoryTimeSeries } from 'extends/ffms/views/TrackingHistory/TimeSeries/HistoryTimeSeries';
import { WorkerFeatureView } from 'extends/ffms/views/TrackingWorker/WorkerFeatureView';
import MapContent from 'extends/ffms/pages/Home/Contents/MapContent';
import ChangePassword from 'extends/ffms/pages/Home/Contents/ChangePassword';
import { usePermission } from 'extends/ffms/components/Role/Permission/usePermission';
import { RoleRoute } from 'extends/ffms/components/Role/RoleRoute';

function SideFeature(props)
{
    const { directionStore, profile } = props.appStore;
    const { jobFilterStore, historyStore, appConfigStore } = props.fieldForceStore;

    const { menu, confirm } = useModal();
    const tenantContext = useContext(TenantContext);

    const themes = tenantContext.config['themeList'] || themeList;

    const { url } = useRouteMatch();

    const [qrOpen, setQROpen] = useState(false);
    const [logoSrc, setLogoSrc] = useState();

    const context = useContext(ThemeContext);
    const history = useHistory();
    const tenantConfig = useTenant();
    const { rootPermission, hasPermission } = usePermission();

    let myRoutes = [];
    const [visiblePopover, setVisiblePopover] = useState(false);

    React.useEffect(() =>
    {
        if (tenantConfig && tenantConfig['logo'])
        {
            const name = tenantConfig['logo'];
            setLogoSrc(name.startsWith('/') ? name : `/api/media/logo?name=${name}`);
        }
    },[]);

    if (tenantConfig.status < TENANT_STATUS.ready)
    {
        history.push(Routers.MANAGER_LAYER_DATA);
    }
    else
    {
        myRoutes = myRoutes.concat([
            {
                path: Routers.JOBS,
                // icon: 'tasks',
                icon: 'job-ondate',
                title: 'Công việc theo ngày',
                content: <>
                    <BorderPanel width={'20rem'}>
                        <JobFeatureView />
                    </BorderPanel>
                    {
                        jobFilterStore.isFilterPanel && (
                            <BorderPanel width={'18rem'}>
                                <JobFilter />
                            </BorderPanel>
                        )
                    }
                         </>,
            },
            {
                path: Routers.WORKER,
                // icon: 'biking',
                icon: 'worker-tracking',
                title: 'Lịch trình nhân viên',
                content: <>
                    <WorkerFeatureView />
                         </>,
            },
            {
                path: Routers.MAPLAYERS,
                // icon: 'layer-group',
                icon: 'map-layer',
                title: 'Lớp dữ liệu trên bản đồ',
                content: <>
                    <BorderPanel width={'20rem'}>
                        <LayerSwitcher />
                    </BorderPanel>
                         </>,
            },
            {
                path: Routers.JOBS_MANAGER,
                // icon: 'list-alt',
                icon: 'job-management',
                title: 'Quản lý công việc',
                content: <>
                    <BorderPanel flex={1}>
                        <JobManager />
                    </BorderPanel>
                         </>,
            },
            {
                path: Routers.SEARCH,
                // icon: 'search-location',
                icon: 'search-location',
                title: 'Tìm kiếm vị trí',
                content: <>
                    <BorderPanel width={'20rem'}>
                        <SearchContainer
                            isProvider // isProvider will display type on layout
                            isSimpleContent
                        />
                    </BorderPanel>
                         </>,
            },
            {
                path: Routers.ROUTE_PLANNING,
                // icon: 'directions',
                icon: 'route',
                title: 'Kế hoạch lộ trình',
                content: <>
                    <BorderPanel width={'20rem'}>
                        <DirectionContainer isProvider />
                    </BorderPanel>
                    {
                        directionStore.barrier.isOpen && (
                            <BorderPanel width={'16rem'}>
                                <BarrierManager />
                            </BorderPanel>
                        )
                    }
                         </>,
            },
            {
                path: Routers.DASHBOARD,
                // icon: 'chart-pie-alt',
                icon: 'dashboard',
                title: 'Bảng tổng quan',
                content: <Dashboard />,
            },
            {
                path: Routers.REPORT,
                // icon: 'chart-bar',
                icon: 'report',
                title: 'Báo cáo',
                content: <Report />,
            },
            {
                path: Routers.HISTORY,
                // icon: 'route',
                icon: 'tracking-history',
                title: 'Lịch sử di chuyển',
                content: <>
                    <BorderPanel width={'20rem'} className={'history'}>
                        <HistoryFeatureView onFilterChange={handleHistoryFilterChange} />
                    </BorderPanel>
                    <BorderPanel flex={1} className={'history-timeseries'}>
                        <HistoryTimeSeries />
                    </BorderPanel>
                         </>,
            },
            {
                path: Routers.CUSTOMER_MANAGER,
                // icon: 'house-user',
                icon: 'customer-management',
                title: 'Quản lý khách hàng',
                content: <>
                    <BorderPanel flex={1}>
                        <CustomerManager />
                    </BorderPanel>
                         </>,
            },
            {
                path: Routers.EMPLOYEES_MANAGER,
                // icon: 'users-cog',
                icon: 'employee-management',
                title: 'Quản lý nhân viên',
                content: (
                    <BorderPanel flex={1}>
                        <EmployeeManager />
                    </BorderPanel>
                ),
            },
            {
                path: Routers.ROLES_MANAGER,
                icon: 'user-role',
                title: 'Quản lý vai trò',
                content: (
                    <BorderPanel flex={1}>
                        <RoleManager />
                    </BorderPanel>
                ),
            },
        ]);
    }

    function avaStyle()
    {
        return profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : {};
    }

    const handleLogin = (social) =>
    {
        history.push('auth/' + social);
    };

    const handleLogout = () =>
    {
        props.appStore.logOut();
    };

    const handleTheme = (item, event) =>
    {
        menu({
            id: 'theme-menu',
            isTopLeft: true,
            position: { x: event.clientX, y: event.clientY },
            actions: themes.map((theme) => ({
                label: theme.name,
                icon: (
                    <ThemeIcon
                        type="solid"
                        icon="circle"
                        size="1.5rem"
                        color={'var(--primary)'}
                        className={`theme-${theme.base} ${theme.className}`}
                    />
                ),
                onClick: () => context.setTheme(theme),
            })),
        });
    };

    const handleGotoAdminPage = () =>
    {
        history.push('/admin');
    };

    const handleQRCodePopup = () =>
    {
        setQROpen(!qrOpen);
    };

    const handleUserInfo = (item, event) =>
    {
        // check user is admin or not
        let adminAction = [];
        const iconStyle = { width: '2.25rem' };

        if (profile.roles?.Administrator)
        {
            adminAction = [
                {
                    label: '-',
                },
                {
                    label: 'Thiết lập hệ thống',
                    icon: 'cog',
                    iconStyle,
                    onClick: handleGotoAdminPage,
                },
            ];
        }

        menu({
            id: 'map-context-menu',
            isTopLeft: true,
            position: { x: event.clientX, y: event.clientY },
            actions: [
                {
                    label: profile.displayName,
                    sub: profile.email,
                    iconClassName: 'action-avatar',
                    iconStyle: { ...avaStyle(), ...iconStyle },
                },
                {
                    label: 'Truy cập bằng mã QR',
                    icon: 'qrcode',
                    iconStyle,
                    onClick: handleQRCodePopup,
                },
                {
                    label: 'Đổi mật khẩu',
                    icon: 'key-skeleton',
                    iconStyle,
                    onClick: () => setVisiblePopover(true),
                },
                ...adminAction,
                {
                    label: '-',
                },
                {
                    label: 'Đăng xuất',
                    icon: 'sign-out',
                    iconStyle,
                    onClick: handleLogout,
                },
            ],
        });
    };

    const handleBeforeClose = () =>
    {
        confirm({
            title: 'Thoát khỏi tính năng này?',
            message: <HD6>Bạn có thay đổi chưa lưu</HD6>,
            cancelText: 'Bỏ thay đổi',
            onCancel: closeMe,
            okText: 'Tiếp tục chỉnh sửa',
        });
    };

    const closeMe = () =>
    {
        setVisiblePopover(false);
    };

    const handleOnClose = (value) =>
    {
        setVisiblePopover(value);
    };

    const handleHistoryFilterChange = async (filter) =>
    {
        if (filter)
        {
            historyStore.setFilter(filter);
        }

        await historyStore.selectHistoryDebounced();
    };

    const getFeatureLink = (prop) =>
    {
        return (
            <PopperTooltip
                key={prop.key}
                placement={'right'}
                trigger={['hover']}
                hideArrow
                tooltip={prop.tooltip}
            >
                <FeatureLink
                    to={prop.to}
                    icon={prop.icon}
                    iconType={'svg'}
                />
            </PopperTooltip>
        );
    };

    const getPermissionRoute = (features) =>
    {
        if (isEmpty(rootPermission))
        {
            return ;
        }

        const permissionObj = CommonHelper.toDictionary(rootPermission,'Path');

        const permissionFeatures = features.filter(feature =>
        {
            let permission = false;
            const permPath = RouterParamsHelper.getRouteFeature(feature.path, Routers.baseUrl);
            
            if (permissionObj[permPath])
            {
                permission = permissionObj[permPath].CanView;
            }
            // else if (feature.path === Routers.ROLES_MANAGER)
            // {
            //     hasPermission = true;
            // }
            return permission;
        });

        return permissionFeatures;
    };


    return (
        <>
            {
                qrOpen &&
                <QRCodeViewer text={window.location.origin} handleQRCodePopup={handleQRCodePopup} />
            }
            <FeatureBar>
                <FeatureBarTop>
                    {
                        logoSrc &&
                            <FeatureImage
                                id="logo"
                                src={logoSrc}
                                onClick={() => window.location.href = url}
                                className={'logo'}
                            />
                    }
                    {
                        getPermissionRoute(myRoutes)?.map((r, index) => getFeatureLink({
                        // myRoutes.map((r, index) => getFeatureLink({
                            tooltip: r.title,
                            to: r.path,
                            icon: r.icon,
                            key: index,
                        }))
                    }
                </FeatureBarTop>
    
                <FeatureBarBottom>

                    {
                        appConfigStore?.canAppConfigView(rootPermission) &&
                        (
                            <PopperTooltip
                                placement={'right'}
                                trigger={['hover']}
                                hideArrow
                                tooltip={'Quản lý thiết lập'}
                            >
                                <FeatureItem
                                    id="login"
                                    icon="cogs"
                                    onClick={() => history.push(Routers.APP_CONFIG)}
                                />
                            </PopperTooltip>
                        )
                    }
                    

                    <LanguageButton />
    
                    <FeatureItem
                        id="theme"
                        onClick={handleTheme}
                        content={
                            <ThemeIcon
                                type="solid"
                                icon="circle"
                                size="1.5rem"
                                color={'var(--primary)'}
                                className={`theme-${context.theme.base} ${context.theme.className}`}
                            />
                        }
                    />
    
                    {
                        props.appStore.ensureLogin() ?
                                    <PopperTooltip
                                        placement={'right'}
                                        trigger={['hover']}
                                hideArrow
                                        tooltip={'Thông tin tài khoản'}
                                    >
                                        <FeatureImage
                                            id="login"
                                            src={profile.avatar}
                                            onClick={handleUserInfo}
                                        />
                            </PopperTooltip> :
                                    <PopperTooltip
                                        placement={'right'}
                                        trigger={['hover']}
                                hideArrow
                                        tooltip={'Đăng nhập'}
                                    >
                                        <FeatureItem
                                            id="login"
                                            icon="user-circle"
                                            onClick={() => handleLogin('vietbando')}
                                        />
                                    </PopperTooltip>
                    }

                   
                </FeatureBarBottom>
            </FeatureBar>
            <Container className={'side-feature'}>
                <MapContent />
                <Switch>
                    {
                        myRoutes.map((r, index) => (
                            <RoleRoute
                                key={index}
                                path={r.path}
                                // has get to lead path permission
                                recursive={r.recursive}
                            >
                                {r.content}
                            </RoleRoute>
                        ))
                    }
                </Switch>
    
            </Container>
    
            {
                visiblePopover && (
                    <Popup
                        title={'Đổi mật khẩu'}
                        width={'32rem'}
                        padding={'0'}
                        className={'change-password-popup'}
                        onClose={closeMe}
                        onBeforeClose={handleBeforeClose}
                    >
                        <ChangePassword onClose={handleOnClose} />
                    </Popup>
                )
            }
    
        </>
    );
   

}

export default withI18n(inject('appStore', 'fieldForceStore')(observer(SideFeature)));
