import React, { useCallback } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useTenant } from '@vbd/vui';

import { TENANT_STATUS } from 'extends/ffms/constant/ffms-enum';

const TenantGuard = (props) =>
{
    const tenantConfig = useTenant();
    const { sysId, status, product } = tenantConfig;

    const { location, component: Comp, ...rest } = props;

    if (sysId)
    {
        if (status < TENANT_STATUS.readyToConfig)
        {
            return <Redirect to={{ pathname: '/under-construction', state: { from: location } }} />;
        }
        else if (status < TENANT_STATUS.ready)
        {
            if (location.pathname === '/' || location.pathname === `/${product ? product : 'ffms'}`)
            {
                return <Redirect to={{ pathname: `/${product ? product : 'ffms'}/start`, state: { from: location } }} />;
            }
        }

        return (
            <Comp
                tenantConfig={tenantConfig}
                {...rest}
            />
        );
    }
    else
    {
        return <Redirect to={{ pathname: '/unavailable', state: { from: location } }} />;
    }
};

const TenantRoute = (props) =>
{
    const { component: Comp, ...rest } = props;

    const onRouteRender = useCallback((router) =>
    {
        return <TenantGuard {...props} />;
    }, [props.path]);

    return (
        <Route
            {...rest}
            component={onRouteRender}
        />
    );
};

export { TenantRoute };
