import { useContext } from 'react';

import { TenantContext } from 'components/bases/Tenant/TenantContext';

export const useTenant = (): TenantContext['config'] =>
{
    const tenant = useContext(TenantContext);
    const tenantConfig = tenant?.config || {};

    return tenantConfig;
};
