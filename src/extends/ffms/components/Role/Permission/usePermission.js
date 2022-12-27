import { useContext } from 'react';
import { PermissionContext } from 'extends/ffms/components/Role/Permission/PermissionContext';

export const usePermission = () =>
{
    const permission = useContext(PermissionContext);

    return permission;
};
