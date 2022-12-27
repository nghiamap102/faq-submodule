import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Loading, NotFoundPage, TenantContext, useI18n } from '@vbd/vui';

import { Login } from 'components/app/Login/Login';
import { TenantRoute } from 'components/app/Tenant/TenantRoute';
import { PermissionRoute } from 'components/app/Tenant/PermissionRoute';
import PrivateRoute from 'components/app/Authentication/PrivateRoute';

import UnauthorizedPage from 'extends/ffms/components/CommonPage/UnauthorizedPage';
import UnderConstructionPage from 'extends/ffms/components/CommonPage/UnderConstructionPage';
import UnavailablePage from 'extends/ffms/components/CommonPage/UnavailablePage';

import * as Routers from 'extends/ffms/routes';
import withTracker from './Tenant/withTracker';

// import withTracker from './Tenant/withTracker';

const queryClient = new QueryClient();

const App = (props) => {
    const { setLocale } = useI18n();
    useEffect(() => {
        setLocale();
    }, []);

    return (

        <QueryClientProvider client={queryClient}>
            <TenantContext.Consumer>
                {({ config }) => (
                    <Suspense fallback={<Loading fullscreen />}>
                        {config && config['favicon'] && (
                            <Helmet>
                                <link
                                    rel="shortcut icon"
                                    href={config['favicon'].startsWith('/') ? config['favicon'] : `/api/media/favicon?name=${config['favicon']}&mimeType=image/x-icon`}
                                />
                                <link
                                    rel="icon"
                                    sizes="175x175"
                                    href={config['favicon'].startsWith('/') ? config['favicon'] : `/api/media/favicon?name=${config['favicon']}&mimeType=image/x-icon`}
                                />
                            </Helmet>
                        )}
                        <Router>
                            <Switch>
                                <Route
                                    path="/login"
                                    component={Login}
                                />

                                <Route
                                    path="/"
                                    render={() => <Redirect to={config['home']} />}
                                    exact
                                />

                                <TenantRoute
                                    path={Routers.INVITE_PAGE}
                                    component={lazy(() => import('extends/ffms/pages/Invite/InvitePage'))}
                                    exact
                                />

                                <TenantRoute
                                    path={Routers.USER_LOGIN}
                                    component={lazy(() => import('extends/ffms/views/RegisterUser/WelcomePage'))}
                                    exact
                                />

                                <PermissionRoute
                                    path={Routers.WELCOME_PAGE}
                                    component={lazy(() => import('extends/ffms/pages/Config/ConfigPage'))}
                                    exact
                                />

                                <PermissionRoute
                                    path={Routers.APP_CONFIG}
                                    component={lazy(() => import('extends/ffms/pages/AppConfig/AppConfigPage'))}
                                />

                                <PermissionRoute
                                    path={Routers.FFMS}
                                    component={lazy(() => import('extends/ffms/pages/Home/Home'))}
                                />

                                <PrivateRoute
                                    path="/station"
                                    component={lazy(() => import('components/app/CommandStation/CommandStation'))}
                                />

                                <Route
                                    path="/cameras-wall"
                                    component={lazy(() => import('components/app/CameraWall/CameraWall'))}
                                />

                                <Route
                                    path="/wall"
                                    component={lazy(() => import('components/app/CommandWall/CommandWall'))}
                                />

                                <Route
                                    path="/console/:page"
                                    component={lazy(() => import('components/app/CommandConsole/CommandConsole'))}
                                />

                                <PrivateRoute
                                    path="/admin"
                                    component={lazy(() => import('components/app/AdminPage/AdminPage'))}
                                />

                                <Route path="/console">
                                    <div>Console</div>
                                </Route>

                                {/* <Route
                                    path="/ogis"
                                    component={withTracker(lazy(() => import('extends/ogis/Home')))}
                                />

                                <PrivateRoute
                                    path="/nlis"
                                    component={withTracker(lazy(() => import('extends/nlis/NlisApp')))}
                                /> */}

                                <Route
                                    path="/unauthorized"
                                    component={UnauthorizedPage}
                                />

                                <Route
                                    path="/under-construction"
                                    component={UnderConstructionPage}
                                />

                                <Route
                                    path="/unavailable"
                                    component={UnavailablePage}
                                />
                                <Route
                                    path="/vbdlisfaq"
                                    component={withTracker(lazy(() => import('extends/vbdlis_faq/VBDLISFAQApp')))}
                                />

                                <Route component={NotFoundPage} />

                            </Switch>
                        </Router>
                    </Suspense>
                )}
            </TenantContext.Consumer>
        </QueryClientProvider>
    );
};

export default App;
