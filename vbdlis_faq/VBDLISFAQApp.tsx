import withTracker from 'components/app/Tenant/withTracker';
import { AuthHelper } from 'helper/auth.helper';
import Cookies from 'js-cookie';
import { lazy, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Redirect } from 'react-router-dom';
import { AuthService } from 'services/auth.service';

const VBDLISFAQApp = () => {
    const { path } = useRouteMatch();
    const authService = new AuthService();
    useEffect(() => {
        getAccessToken()
    }, [])
    const getAccessToken = async () => {
        if (!AuthHelper.getVDMSToken()) {
            const res = await authService.getPublicAccessToken();
            res['access_token'] && Cookies.set('access_token', res['access_token']);
            res['refresh_token'] && Cookies.set('refresh_token', res['refresh_token']);
        }
    }

    return (
        <Switch>
            <Route
                path={`${path}/home`}
                component={withTracker(lazy(() => import('extends/vbdlis_faq/pages/User')))}
            />

            <Route
                path={`${path}/admin`}
                component={withTracker(lazy(() => import('extends/vbdlis_faq/pages/Admin')))}
            />
            <Route
                path={`${path}`}
                component={withTracker(lazy(() => import('extends/vbdlis_faq/pages/Userv2')))}
            />
            <Redirect
                from="*"
                to={`${path}/home`}
            />
        </Switch>
    );
};
// OGNLApp = inject('appStore')(observer(OGNLApp));
export default VBDLISFAQApp;
