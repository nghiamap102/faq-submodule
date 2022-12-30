import withTracker from 'components/app/Tenant/withTracker';
import { AuthHelper } from 'helper/auth.helper';
import Cookies from 'js-cookie';
import { lazy, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Redirect } from 'react-router-dom';
import { AuthService } from 'services/auth.service';
import { Loading } from '@vbd/vui';

const VBDLISFAQApp = () => {
    const { path } = useRouteMatch();
    const authService = new AuthService();
    const [accessToken, setAccessToken] = useState(Cookies.get('access_token') || undefined)

    useEffect(() => { getAccessToken(); }, [])

    useEffect(() => {

        if (Cookies.get('expires_in')) {
            setInterval(() => {
                const newDate = new Date().getTime()
                if (newDate > parseInt(Cookies.get('expires_in')) + 84000) {
                    refreshToken();
                }
            }, 5000);
        }

    }, [accessToken])

    const refreshToken = async () => {
        const res = await authService.refreshToken(Cookies.get('refresh_token'));
        saveAuthen(res);
    }

    const getAccessToken = async () => {
        if (!AuthHelper.getVDMSToken()) {
            setTimeout(async () => {
                const res = await authService.getPublicAccessToken();
                saveAuthen(res);
                setAccessToken(res['access_token']);
            }, 2000);
        }
    }

    const saveAuthen = (res: any) =>
    {
        res['access_token'] && Cookies.set('access_token', res['access_token']);
        res['refresh_token'] && Cookies.set('refresh_token', res['refresh_token']);
        res['expires_in'] && Cookies.set('expires_in', (new Date().getTime() + parseInt(res['expires_in']) * 1000).toString());
    };

    const renderWithAccessToken = () => {
        if (accessToken) {
            return (
                <Switch>
                    <Route
                        path={`${path}/home`}
                        component={withTracker(lazy(() => import('extends/vbdlis_faq/pages/User')))}
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
            )
        }
        else {
            return (
                <Loading fullscreen />
            )
        }
    }

    return (
        <Switch>
            <Route
                path={`${path}/admin`}
                component={withTracker(lazy(() => import('extends/vbdlis_faq/pages/Admin')))}
            />
            {renderWithAccessToken()}
        </Switch>
    );
};
// OGNLApp = inject('appStore')(observer(OGNLApp));
export default VBDLISFAQApp;
