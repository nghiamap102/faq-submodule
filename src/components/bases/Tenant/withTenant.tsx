import { ComponentType } from 'react';

import { useTenant } from 'components/bases/Tenant/useTenant';

export const withTenant = <P extends Record<string, unknown>>(Component: ComponentType<P>) =>
{
    // eslint-disable-next-line react/display-name
    return (props: P): JSX.Element =>
    {
        const tenantConfig = useTenant();
        return (
            <Component
                tenantConfig={tenantConfig}
                {...props}
            />
        );
    };

};

