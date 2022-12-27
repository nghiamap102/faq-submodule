import React from 'react';
import { usePermission } from './usePermission';

export const withPermission = (Component) =>
{
    return (props) =>
    {
        const permission = usePermission();

        return <Component {...permission} {...props} />;
    };
};
