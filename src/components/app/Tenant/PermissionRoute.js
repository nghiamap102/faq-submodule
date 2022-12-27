import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { useTenant } from '@vbd/vui';

import PrivateRoute from 'components/app/Authentication/PrivateRoute';
import PermissionService from 'extends/ffms/services/PermissionService';
import { TenantRoute } from 'components/app/Tenant/TenantRoute';

const PermissionGuard = (props) =>
{
    const tenantConfig = useTenant();
    const { sysId, status, product } = tenantConfig;

    const [canAccess, setCanAccess] = useState(null);

    const permissionSvc = new PermissionService();

    const { location, profile, component: Comp, ...rest } = props;

    useEffect(() =>
    {
        const checkAccess = async () =>
        {
            if (profile?.email)
            {
                const res = await permissionSvc.canPerformAction(`/root/vdms/tangthu/data${product ? '/' + product : '/ffms'}${sysId ? '/' + sysId : ''}`);

                setCanAccess(!!res);
            }
            else
            {
                setCanAccess(false);
            }
        };

        checkAccess();
    }, []);

    if (canAccess == null)
    {
        return <></>;
    }
    else if (canAccess)
    {
        return (
            <Comp
                profile={profile}
                tenantConfig={tenantConfig}
            />
        );
    }
    else
    {
        return <Redirect to={{ pathname: '/unauthorized', state: { from: location } }} />;
    }
};

const PermissionRoute = (props) =>
{
    const { component: Comp, ...rest } = props;

    return (
        <TenantRoute
            {...rest}
            component={(tProps) => (
                <PrivateRoute
                    {...tProps}
                    component={(pProps) => (
                        <PermissionGuard
                            {...pProps}
                            component={Comp}
                        />
                    )}
                />
            )}
        />
    );
};

export { PermissionRoute };

