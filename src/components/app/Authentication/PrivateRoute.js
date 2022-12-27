import React, { useCallback, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';

import { AutoLogout } from '@vbd/vui';

import { Constants } from 'constant/Constants';

let PrivateRoute = (props) =>
{
    const { component: Comp, appStore, ...rest } = props;
    const { profile } = appStore;

    useEffect(() =>
    {
        appStore.loadProfile();
    }, []);

    const onLogout = () =>
    {
        appStore.logOut();
    };

    const onRouteRender = useCallback((router) =>
    {
        const { location } = router;

        if (profile?.isAuthorized && profile?.email)
        {
            return (
                <AutoLogout
                    minutes={Constants.INACTIVE_USER_TIMEOUT}
                    onLogout={onLogout}
                >
                    <Comp
                        {...router}
                        profile={profile}
                    />
                </AutoLogout>
            );
        }

        return <Redirect to={{ pathname: '/login', search: '?redirect=' + window.location.href, state: { from: location } }} />;
    }, [rest.path]);

    return (
        profile?.isAuthorized == null
            ? <></>
            : (
                    <Route
                        {...rest}
                        component={onRouteRender}
                    />
                )
    );
};

PrivateRoute = inject('appStore')(observer(PrivateRoute));
export default PrivateRoute;

