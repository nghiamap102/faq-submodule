import React, { createContext, useEffect } from 'react';
import RoleService from 'extends/ffms/services/RoleService';

import { CommonHelper } from 'helper/common.helper';
import { useMergeState } from 'extends/ffms/pages/hooks/useMergeState';

const roleService = new RoleService();
const PermissionContext = createContext();


const PermissionProvider = (props) =>
{
    const initState = {
        rootPermission: null,
        pathPermission: {},
        loading: true,
    };

    const [state, setState] = useMergeState(initState);
    const { rootPermission, pathPermission, currentPath, secondFeature, loading } = state;

    useEffect(() =>
    {
        const recursive = false;
        roleService.getRolePermissionMe(recursive).then((config) =>
        {
            let data = [];
            if (config?.data && config?.data.Children)
            {
                data = config?.data.Children;
            }
            setState({ rootPermission: data, loading: false });
        });
    }, []);

    const loadPathPermission = async (path, recursive = true) =>
    {
        const config = await roleService.getRolePermissionMe(recursive, path);
        // console.log('Call  permission me path service');

        const data = config?.data ? config?.data : [];
        return data;
    };

    // getPermissionsWithPath path-parentPath levelNode =1 is root
    const getPermissionsWithPath = (path, nodePermission, levelNode = 1) =>
    {
        levelNode++;
        const arrPath = path.split('/');
        const nodePath = arrPath.slice(0, levelNode).join('/');
        const permissionObj = CommonHelper.toDictionary(nodePermission,'Path');

        if (permissionObj[nodePath])
        {
            if (levelNode === arrPath.length)
            {
                return permissionObj[nodePath];
            }
            else if (permissionObj[nodePath].Children?.length > 0)
            {
                return getPermissionsWithPath(path, permissionObj[nodePath].Children, levelNode);
            }
            else
            {
                return null;
            }
        }
        else
        {
            return null;
        }
    };

    // typecheck [some, every] some:more one, every: all -> access
    const hasPermissionNode = (node, features, typeCheck = 'some', caseCheckPermission = 'view') =>
    {
        features = typeof features === 'string' ? [features] : features;
        let caseCheck = 'CanView';

        if (!node || !(node.Children && node.Children?.length > 0) ||
            !(features && features.length > 0) || !['some', 'every'].includes(typeCheck))
        {
            return false;
        }

        if (['view','access'].includes(caseCheckPermission))
        {
            caseCheck = caseCheckPermission === 'view' ? 'CanView' : 'CanAccess';
        }
        
        const paths = features.map(feature => node.Path + '/' + feature);
        const permissionObj = CommonHelper.toDictionary(node.Children, 'Path');

        const checkPermission = (path) =>
        {
            if (permissionObj[path])
            {
                const childNode = permissionObj[path];
                return childNode.Type === 'feature' ? childNode.CanAccess : childNode[caseCheck];
            }
            return false;
        };
         
        return typeCheck === 'some' ? paths.some(checkPermission) : paths.every(checkPermission);
    };

    const setPathPermission = (pathPermission)=> setState({ pathPermission });
    const setCurrentPath = (currentPath)=> setState({ currentPath });
    const setSecondFeature = (secondFeature)=> setState({ secondFeature });
    const setLoading = (loading)=> setState({ loading });

    return (
        <PermissionContext.Provider
            value={{
                loading,
                rootPermission,
                pathPermission,
                currentPath,
                secondFeature,

                setPathPermission,
                setCurrentPath,
                setSecondFeature,
                setLoading,

                loadPathPermission,
                getPermissionsWithPath,
                hasPermissionNode,
            }}
        >
            {props.children}
        </PermissionContext.Provider>
    );
};

export { PermissionProvider, PermissionContext };
