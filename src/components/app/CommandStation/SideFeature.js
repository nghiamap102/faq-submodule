import './SideFeature.scss';

import React, { lazy, Suspense, useContext } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import {
    TenantContext, useModal,
    Container,
    Loading,
    BorderPanel,
    FeatureBar, FeatureBarBottom, FeatureBarTop, FeatureItem, FeatureImage, FeatureLink,
    ThemeContext, themeList, ThemeIcon,
    SideBar,
} from '@vbd/vui';

import IncidentPanel from 'components/app/IncidentPanel/IncidentPanel';
import IncidentDetailPanel from 'components/app/IncidentPanel/IncidentDetailPanel';
import { LayerSwitcher } from 'components/app/LayerSwitcher/LayerSwitcher';
import { DirectionContainer } from 'components/app/Direction/DirectionContainer';
import { SearchContainer } from 'components/app/Search/SearchContainer';
import { ChatPanel } from 'components/app/ChatPanel/ChatPanel';
import BarrierManager from 'components/app/Direction/BarrierManager';
import EventPanel from 'components/app/EventPanel/EventPanel';
import EventDetailPanel from 'components/app/EventPanel/EventDetailPanel';
import { SketchMapDetail } from 'components/app/IncidentPanel/SketchMapDetail';

// Lazy load and code splitting
const Case = lazy(() => import('components/app/Case/Case'));
const PlateAlert = lazy(() => import('components/app/LPR/PlateAlert'));
const FaceAlert = lazy(() => import('components/app/FaceAlert/FaceAlert'));
const GeneralDetectionPage = React.lazy(() => import('components/app/GeneralDetection/GeneralDetectionPage'));
const SpaceRain = lazy(() => import('components/app/SpaceRain/SpaceRain'));

const CaseHandlingPanel = lazy(() => import('components/app/Case/Workflow/CaseHandlingPanel'));
const CaseSketchMapDetail = lazy(() => import('components/app/Case/Workflow/SketchMap/SketchMapDetail'));

import { MapContent } from 'components/app/CommandStation/MapContent';
import Guard from 'components/app/Authentication/Guard';
import { LanguageButton } from 'components/app/CommandStation/components/LanguageButton';
import { CaseProvider } from '../Case/CaseContext';

function SideFeature(props)
{
    const { featureBarStore, directionStore, incidentStore, eventStore, sketchMapStore, profile, caseHandlingStore } = props.appStore;

    const { path, url } = useRouteMatch();

    const tenantContext = useContext(TenantContext);
    const context = useContext(ThemeContext);
    const { menu } = useModal();

    const history = useHistory();

    const themes = tenantContext.config['themeList'] || themeList;
    const logo = tenantContext.config['logo'];

    const handleToggleChat = () =>
    {
        featureBarStore.showChat = !featureBarStore.showChat;
    };

    const handleLogin = (social) =>
    {
        history.push('auth/' + social);
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
                        color={'var(--primary-color)'}
                        className={`theme-${theme.base} ${theme.className}`}
                    />
                ),
                onClick: () => context.setTheme(theme),
            })),
        });
    };

    const handleUserInfo = (item, event) =>
    {
        // check user is admin or not
        let adminAction = [];

        if (profile.roles?.Administrator)
        {
            adminAction = [
                {
                    separator: true,
                },
                {
                    label: 'Thiết lập hệ thống',
                    icon: 'cog',
                    onClick: () => history.push('/admin'),
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
                    iconStyle: profile.avatar ? { backgroundImage: `url(${profile.avatar})` } : {},
                    onClick: () => window.location.href = '/auth/info',
                },
                ...adminAction,
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
        <>
            <FeatureBar>
                <FeatureBarTop>
                    {
                        logo && (
                            <FeatureImage
                                id="logo"
                                src={logo}
                                onClick={() => window.location.href = url}
                            />
                        )}
                    <Guard products={{ t4ch: 1 }}>
                        <FeatureLink
                            to={url + '/event'}
                            icon="bell"
                            tooltip={'Sự kiện'}
                            badgeCount={eventStore.events.length >= 99 ? '99+' : eventStore.events.length}
                        />
                        <FeatureLink
                            to={url + '/incident'}
                            tooltip={'Sự cố'}
                            icon="exclamation-triangle"
                            badgeCount={incidentStore.incidents.length >= 99 ? '99+' : incidentStore.incidents.length}
                        />
                        <FeatureLink
                            to={url + '/case'}
                            icon="briefcase"
                            tooltip={'Vụ việc'}
                        />
                        {
                            caseHandlingStore.handlingCase && (
                                <FeatureLink
                                    to={url + `/workflow/${caseHandlingStore.handlingCase.Id}`}
                                    icon="code-branch"
                                    tooltip={''}
                                />
                            )
                        }
                    </Guard>
                    <Guard>
                        <FeatureLink
                            to={url + '/layer'}
                            tooltip={'Tài nguyên và tính năng'}
                            icon="layer-group"
                            badgeCount={0}
                        />
                        <FeatureLink
                            to={url + '/search'}
                            tooltip={'Tìm kiếm vị trí'}
                            icon="search"
                        />
                        <FeatureLink
                            to={url + '/direction'}
                            tooltip={'Kế hoạch lộ trình'}
                            icon="directions"
                        />
                    </Guard>

                    <Guard products={{ t4ch: 1 }}>
                        <FeatureLink
                            to={url + '/face-alert'}
                            tooltip={'Nhận dạng gương mặt'}
                            icon="user-friends"
                        />
                        <FeatureLink
                            to={url + '/lpr'}
                            tooltip={'Nhận dạng biển số xe'}
                            icon={'credit-card-front'}
                        />
                    </Guard>

                    <Guard products={{ t4ch: 10 }}>
                        <FeatureLink
                            to={url + '/general-detection'}
                            tooltip={'Nhận dạng tổng hợp'}
                            icon={'expand'}
                        />
                        <FeatureLink
                            to={url + '/spacerain'}
                            tooltip={'SpaceRain'}
                            icon={'router'}
                        />
                    </Guard>
                </FeatureBarTop>

                <FeatureBarBottom>
                    <FeatureItem
                        id="chat"
                        tooltip={'Kênh liên lạc'}
                        icon="comment-alt-lines"
                        active={featureBarStore.showChat}
                        badgeCount={0}
                        onClick={handleToggleChat}
                    />

                    <LanguageButton />

                    <FeatureItem
                        id="theme"
                        tooltip={'Chủ đề'}
                        content={(
                            <ThemeIcon
                                type="solid"
                                icon="circle"
                                size="1.5rem"
                                color={'var(--primary-color)'}
                                className={`theme-${context.theme.base} ${context.theme.className}`}
                            />
                        )}
                        onClick={handleTheme}
                    />

                    {
                        props.appStore.ensureLogin()
                            ? (
                                    <FeatureImage
                                        id="login"
                                        tooltip={'Thông tin cá nhân'}
                                        src={profile.avatar}
                                        onClick={handleUserInfo}
                                    />
                                )
                            : (
                                    <FeatureItem
                                        id="login"
                                        tooltip={'Đăng nhập'}
                                        icon="user-circle"
                                        onClick={() => handleLogin('vietbando')}
                                    />
                                )
                    }
                </FeatureBarBottom>
            </FeatureBar>

            <Container className={'side-feature'}>

                <MapContent showLocateControl={false} />

                <CaseProvider>
                    <Suspense fallback={<Loading fullscreen />}>
                        <Switch>
                            <Route path={path + '/event'}>
                                <Guard products={{ t4ch: 1 }}>
                                    <SideBar width={'15rem'}>
                                        <EventPanel />
                                    </SideBar>

                                    {eventStore.isShowDetail && eventStore.event && (
                                        <SideBar width={'17rem'}>
                                            <EventDetailPanel />
                                        </SideBar>
                                    )}
                                </Guard>
                            </Route>

                            <Route path={path + '/incident'}>
                                <Guard products={{ t4ch: 1 }}>
                                    {incidentStore.isShowDetail && incidentStore.incident
                                        ? (
                                                <>
                                                    <SideBar width={'18rem'}>
                                                        <IncidentDetailPanel />
                                                    </SideBar>

                                                    {sketchMapStore.isShowDetail && (
                                                        <SideBar width={'20.625rem'}>
                                                            <SketchMapDetail
                                                                disabled={incidentStore.incident.headerInfo.readOnly}
                                                            />
                                                        </SideBar>
                                                    )}
                                                </>
                                            )
                                        : (
                                                <SideBar width={'15rem'}>
                                                    <IncidentPanel />
                                                </SideBar>
                                            )
                                    }
                                </Guard>
                            </Route>

                            <Route path={path + '/workflow/:id'}>
                                <Guard products={{ t4ch: 1 }}>
                                    <SideBar width={'32rem'}>
                                        <CaseHandlingPanel />
                                    </SideBar>

                                    {sketchMapStore.isShowDetail && (
                                        <SideBar width={'25.625rem'}>
                                            <CaseSketchMapDetail
                                                disabled={false}
                                            />
                                        </SideBar>
                                    )}
                                </Guard>
                            </Route>

                            <Route path={path + '/case'}>
                                <Guard products={{ t4ch: 1 }}>
                                    <BorderPanel>
                                        <Case />
                                    </BorderPanel>
                                </Guard>
                            </Route>

                            <Route path={path + '/layer'}>
                                <Guard>
                                    <SideBar width={'20rem'}>
                                        <LayerSwitcher />
                                    </SideBar>
                                </Guard>
                            </Route>

                            <Route path={path + '/search'}>
                                <Guard>
                                    <SideBar width={'20rem'}>
                                        <SearchContainer />
                                    </SideBar>
                                </Guard>
                            </Route>

                            <Route path={path + '/direction'}>
                                <Guard>
                                    <SideBar width={'20rem'}>
                                        <DirectionContainer />
                                    </SideBar>

                                    {directionStore.barrier.isOpen && (
                                        <SideBar width={'16rem'}>
                                            <BarrierManager />
                                        </SideBar>
                                    )}
                                </Guard>
                            </Route>

                            <Route path={path + '/face-alert'}>
                                <Guard products={{ t4ch: 1 }}>
                                    <BorderPanel
                                        flex={1}
                                    >
                                        <FaceAlert />
                                    </BorderPanel>
                                </Guard>
                            </Route>

                            <Route path={path + '/lpr'}>
                                <Guard products={{ t4ch: 1 }}>
                                    <BorderPanel
                                        flex={1}
                                    >
                                        <PlateAlert />
                                    </BorderPanel>
                                </Guard>
                            </Route>

                            <Route path={path + '/general-detection'}>
                                <Guard products={{ t4ch: 10 }}>
                                    <BorderPanel
                                        flex={1}
                                    >
                                        <GeneralDetectionPage />
                                    </BorderPanel>
                                </Guard>
                            </Route>

                            <Route path={path + '/spacerain'}>
                                <Guard products={{ t4ch: 10 }}>
                                    <BorderPanel
                                        flex={1}
                                    >
                                        <SpaceRain />
                                    </BorderPanel>
                                </Guard>
                            </Route>

                        </Switch>
                    </Suspense>
                </CaseProvider>
            </Container>

            <Container className={'right-panel'}>
                {
                    featureBarStore.showChat && (
                        <>
                            <SideBar width={'25rem'}>
                                <ChatPanel />
                            </SideBar>
                        </>
                    )}
            </Container>
        </>
    );
}

export default inject('appStore')(observer(SideFeature));
