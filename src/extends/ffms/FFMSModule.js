import React, { lazy } from 'react';

import * as Routers from 'extends/ffms/routes';
import { TenantRoute } from 'components/app/Tenant/TenantRoute';

const FFMSModule = (props) =>
{
    return (
        <>
            <TenantRoute
                exact
                path={Routers.REGISTER}
                component={lazy(() => import('extends/ffms/views/RegisterUser/NewUserManager'))}
            />

            <TenantRoute
                exact
                path={Routers.USER_LOGIN}
                component={lazy(() => import('extends/ffms/views/RegisterUser/WelcomePage'))}
            />

            <TenantRoute
                exact
                path={Routers.WELCOME_PAGE}
                component={lazy(() => import('extends/ffms/pages/Config/ConfigPage'))}
            />

            <TenantRoute
                exact
                path={Routers.INVITE_PAGE}
                component={lazy(() => import('components/app/G-invite/GInvite'))}
            />
        
            <TenantRoute
                path={Routers.FFMS}
                component={lazy(() => import('extends/ffms/pages/Home/Home'))}
            />
        </>
    );
};

export { FFMSModule };
