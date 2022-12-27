
import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useI18n, useModal } from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';
import { isEmpty } from 'helper/data.helper';
import { usePermission } from './Permission/usePermission';
import { LoadingPermission } from './LoadingPermission';
import * as Routers from 'extends/ffms/routes';

let RoleRoute = (props) =>
{
    const { children, path, key, location, pathPermLink, setLoading, exact, caseCheckPermissison } = props;

    const { toast } = useModal();
    const { t } = useI18n();

    const perContext = usePermission();
    const [viewData, setViewData] = useState(null);
    const [isAlertError, setAlertError] = useState(false);
    const [hasSecondPermit, setSecondPermit] = useState(false);

    useEffect(() =>
    {
        if (perContext.rootPermission)
        {
            if (!pathPermLink)
            {
                perContext.setPathPermission(null);
                setLoading(false);
            }
            else
            {
                onLoadPathPermissions(pathPermLink);
            }
        }

        perContext.setCurrentPath(path);
        perContext.setSecondFeature(null);

        return () =>
        {
            setAlertError(false);
        };
    },[perContext.rootPermission]);

    // useEffect(()=>
    // {
    //     if (!props.loading)
    //     {
    //         checkViewData(perContext.pathPermission);
    //     }
    // }, [location?.search]);

    useEffect(() =>
    {
        const { pathPermission , secondFeature, hasPermissionNode } = perContext;

        if (!isEmpty(secondFeature) && !isEmpty(pathPermission?.Children))
        {
            const hasPermission = hasPermissionNode(pathPermission, secondFeature);

            !isAlertError && setAlertError(!hasPermission);

            setSecondPermit(hasPermission);
        }
    }, [perContext.secondFeature]);

    useEffect(() =>
    {
        if (isAlertError)
        {
            const pathError = location.pathname + location.search + location.hash;
            toast({ message: t('Bạn chưa được phân quyền để truy cập url %0%', [pathError]), type: 'error' });

            setAlertError(false);
            if (perContext.secondFeature && !hasSecondPermit)
            {
                perContext.setSecondFeature(null);
            }
        }
    }, [isAlertError]);
    

    const onLoadPathPermissions = (pathPermLink) =>
    {
        const onAfterLoad = (pathChildData) =>
        {
            const { setPathPermission } = perContext;
          
            if (!isEmpty(pathChildData))
            {
                pathChildData.Children = pathChildData.Children || [];
                
                checkViewData(pathChildData);
                setPathPermission(pathChildData);
            }
            setLoading(false);
        };
        
        perContext.loadPathPermission(pathPermLink, false).then(onAfterLoad);
    };

    const checkViewData = (pathPerData) =>
    {
        let viewData = false;
        const { secondFeature } = perContext;
        const { CanAccess, CanView } = pathPerData;

        if (location?.search)
        {
            viewData = CanAccess;
        }
        else if (pathPerData)
        {
            if (pathPerData.Type === 'feature')
            {
                viewData = pathPerData.CanAccess;
            }
            else
            {
                
                viewData = caseCheckPermissison === 'view' ? CanView : CanAccess;
            }
        }

        setViewData(viewData);

        if (!isAlertError)
        {
            if (!secondFeature || (secondFeature && !hasSecondPermit))
            {
                setAlertError(!viewData);
            }
        }
    };
    

    return (()=>
    {
        const parentPath = RouterParamsHelper.getPreviousPath(path);

        if (props.loading)
        {
            return <></>;
        }
       
        if (viewData === false)
        {
            return <Redirect to={{ pathname: parentPath, state: { from: props.location } }} />;
        }

        return (
            <Route
                key={key}
                path={path}
                exact={exact}
            >
                {children}
            </Route>
        );
    })();
};
RoleRoute.prototype = {
    // acess hasOne Feature
    caseCheckPermissison: PropTypes.oneOf(['view','access']),
    baseUrl: PropTypes.string,
};

RoleRoute.defaultProps = {
    exact: false,
    caseCheckPermissison: 'view',
    baseUrl: '/ffms',
};

const withRoleRouter = Component =>
{
    return function Wrapper(props)
    {
        const [loading, setLoading] = useState(true);
        const perContext = usePermission();
        let { path, baseUrl } = props;
        baseUrl = baseUrl || Routers.baseUrl;

        return (
            <React.Fragment>
                {
                    (loading || perContext.loading) && <LoadingPermission />
                }
                <Component
                    {...props}
                    pathPermLink={RouterParamsHelper.getRouteFeature(path, baseUrl)}
                    loading={loading}
                    setLoading={setLoading}
                />
            </React.Fragment>
        );
    };
};


RoleRoute = withRoleRouter(RoleRoute);
export { RoleRoute };

