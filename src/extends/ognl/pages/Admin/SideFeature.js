import './SideFeature.scss';

import React, { useContext, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, useRouteMatch, useHistory, Route, Redirect } from 'react-router-dom';

import {
    Container, Popup,
    FeatureBar, FeatureBarBottom, FeatureBarTop, FeatureItem, FeatureImage,
    TenantContext, useTenant, ThemeContext, ThemeIcon, themeList, useModal, HD6, BorderPanel,
} from '@vbd/vui';

import { FeatureLink } from 'extends/ffms/bases/FeatureBar/FeatureLink';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';
import * as Routers from 'extends/ognl/ONGLRoute';
import ChangePassword from 'extends/ffms/pages/Home/Contents/ChangePassword';
import PostManagerPanel from '../PostManager/PostManagerPanel';
import TagsManagerPanel from '../TagsManager/TagsManagerPanel';
import CategoriesManagerPanel from '../CategoriesManager/CategoriesManagerPanel';
import DocumentManager from '../DocumentManager';
import ConfigurationManager from '../ConfigurationManager';

function SideFeature(props) {
    const { profile } = props.appStore;
    // const { appConfigStore } = props.ognlStore;

    const { menu, confirm } = useModal();
    const tenantContext = useContext(TenantContext);

    const themes = tenantContext.config['themeList'] || themeList;

    const { url } = useRouteMatch();
    const [logoSrc, setLogoSrc] = useState();
    const context = useContext(ThemeContext);
    const history = useHistory();
    const tenantConfig = useTenant();
    // const { rootPermission, hasPermission } = usePermission();
    let { path } = useRouteMatch();
    let myRoutes = [
        {
            path: Routers.POSTS_MANAGER,
            // icon: 'tasks',
            icon: 'copy',
            title: 'Bài viết',
            content:
                <BorderPanel flex={1}>
                    <PostManagerPanel />
                </BorderPanel>,
        },
        {
            path: Routers.CATEGORIES_MANAGER,
            // icon: 'biking',
            icon: 'folder',
            title: 'Danh mục',
            content:
                <BorderPanel flex={1}>
                    <CategoriesManagerPanel />
                </BorderPanel>,
        },
        {
            path: Routers.TAGS_MANAGER,
            // icon: 'layer-group',
            icon: 'tags',
            title: 'Tag',
            content:
                <BorderPanel flex={1}>
                    <TagsManagerPanel />
                </BorderPanel>,
        },
        {
            path: Routers.DOCUMENTS_MANAGER,
            // icon: 'layer-group',
            icon: 'file-upload',
            title: 'Document',
            content:
                <BorderPanel flex={1}>
                    <DocumentManager />
                </BorderPanel>,
        },
        {
            path: Routers.CONFIGURATION_MANAGER,
            // icon: 'layer-group',
            icon: 'cogs',
            title: 'Configuration',
            content:
                <BorderPanel flex={1}>
                    <ConfigurationManager />
                </BorderPanel>,
        },
    ];
    const [visiblePopover, setVisiblePopover] = useState(false);

    React.useEffect(() => {
        if (tenantConfig && tenantConfig['logo']) {
            const name = tenantConfig['logo'];
            setLogoSrc(name.startsWith('/') ? name : `/api/media/logo?name=${name}`);
        }
    }, []);

    function avaStyle() {
        return profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : {};
    }

    const handleLogin = (social) => {
        history.push('auth/' + social);
    };

    const handleLogout = () => {
        props.appStore.logOut();
    };

    const handleTheme = (item, event) => {
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

    const handleGotoAdminPage = () => {
        history.push('/admin');
    };

    const handleUserInfo = (item, event) => {
        // check user is admin or not
        let adminAction = [];
        const iconStyle = { width: '2.25rem' };

        if (profile.roles?.Administrator) {
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

    const handleBeforeClose = () => {
        confirm({
            title: 'Thoát khỏi tính năng này?',
            message: <HD6>Bạn có thay đổi chưa lưu</HD6>,
            cancelText: 'Bỏ thay đổi',
            onCancel: closeMe,
            okText: 'Tiếp tục chỉnh sửa',
        });
    };

    const closeMe = () => {
        setVisiblePopover(false);
    };

    const handleOnClose = (value) => {
        setVisiblePopover(value);
    };

    const getFeatureLink = (prop) => {
        return (
            <PopperTooltip
                key={prop.key}
                placement={'right'}
                trigger={['hover']}
                hideArrow tooltip='' tag='' tagClassName='' className=''>
                <FeatureLink
                    to={prop.to}
                    icon={prop.icon}
                />
            </PopperTooltip>
        );
    };
    return (
        <>
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
                        myRoutes.map((r, index) => getFeatureLink({
                            // myRoutes.map((r, index) => getFeatureLink({
                            tooltip: r.title,
                            to: r.path,
                            icon: r.icon,
                            key: index,
                        }))
                    }
                </FeatureBarTop>

                <FeatureBarBottom>
                    <PopperTooltip
                        placement={'right'}
                        trigger={['hover']}
                        hideArrow
                        tooltip=''
                        tag=''
                        tagClassName=''
                        className=''
                    >
                        <FeatureItem
                            id="login"
                            icon="cogs"
                            onClick={() => history.push(Routers.APP_CONFIG)}
                        />
                    </PopperTooltip>
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
                        props?.appStore?.ensureLogin() ?
                            <PopperTooltip
                                placement={'right'}
                                trigger={['hover']}
                                hideArrow tooltip='' tag='' tagClassName='' className=''>
                                <FeatureImage
                                    id="login"
                                    src={profile.avatar}
                                    onClick={handleUserInfo}
                                />
                            </PopperTooltip> :
                            <PopperTooltip
                                placement={'right'}
                                trigger={['hover']}
                                hideArrow tooltip='' tag='' tagClassName='' className=''>
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
                <Switch>
                    {
                        myRoutes.map((r, index) => (
                            <Route
                                key={index}
                                path={r.path}
                                exact
                            // has get to lead path permission
                            // recursive={r.recursive}
                            >
                                {r.content}
                            </Route>
                        ))
                    }
                    <Redirect from="*" to={Routers.POSTS_MANAGER} />
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

export default inject('appStore', 'ognlStore')(observer(SideFeature));
