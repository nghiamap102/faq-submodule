import withTracker from 'components/app/Tenant/withTracker';
import { lazy } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router';
import { Redirect } from 'react-router-dom';

let OGNLApp = () => {
    let { path } = useRouteMatch();

    return (
        <Switch>
            <Route
                path={`${path}/home`}
                component={withTracker(lazy(() => import('extends/ognl/pages/Home/OGNLHome')))} />

            <Route
                path={`${path}/admin`}
                component={withTracker(lazy(() => import('extends/ognl/pages/Admin/OGNLAdmin')))} />

            <Redirect from="*" to={`${path}/home`} />
        </Switch>
    );
};
// OGNLApp = inject('appStore')(observer(OGNLApp));
export default OGNLApp;
