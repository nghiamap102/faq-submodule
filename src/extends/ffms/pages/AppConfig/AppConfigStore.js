import React from 'react';
import { decorate, observable, action, autorun, computed } from 'mobx';
import * as Routers from 'extends/ffms/routes';
import ManagerLayerData from 'extends/ffms/pages/Layerdata/ManagerLayerData';
import TenantConfig from './TenantConfig/TenantConfig';
import { CommonHelper } from 'helper/common.helper';
import { RouterParamsHelper } from 'helper/router.helper';


export class AppConfigStore
{
    MenuDefaults = [
        {
            id: Routers.TENANT_INFO,
            className: 'root-item',
            title: 'Thông tin ứng dụng',
            icon: 'sliders-h',
            path: Routers.TENANT_INFO,
            component: <TenantConfig />,
        },{
            id: Routers.MANAGER_LAYER_DATA,
            className: 'root-item',
            title: 'Quản lý dữ liệu',
            icon: 'app-config',
            iconType: 'svg',
            path: Routers.MANAGER_LAYER_DATA,
            component: <ManagerLayerData />,
        },
    ];
     
    menu = this.MenuDefaults;

    tenantConfig = {};

    constructor(store)
    {
        this.tenantConfig = store.appStore.contexts?.tenant;
    }

    eachMenuPermission = (rootPermission, cb) =>
    {
        if (rootPermission?.length > 0)
        {
            const permissionObj = CommonHelper.toDictionary(rootPermission,'Path');

            this.menu.forEach(feature =>
            {
                const permPath = RouterParamsHelper.getRouteFeature(feature.path, Routers.APP_CONFIG);
                
                cb && cb(permissionObj[permPath], feature);
            });
        }
    }

    init = (rootPermission, history, location) =>
    {
        const menuUpdate = this.filterView(rootPermission);

        if (menuUpdate?.length === 0)
        {
            this.backHome(history);
        }
        else
        {
            const { getRouteFeature } = RouterParamsHelper;
            if (!getRouteFeature(location.pathname, Routers.APP_CONFIG))
            {
                history.push(menuUpdate[0].path);
            }
        }

        if (menuUpdate.length !== this.menu.length)
        {
            this.menu = menuUpdate;
        }
    }

    set(key, data)
    {
        if (key && this.hasOwnProperty(key))
        {
            this[key] = data;
        }
    }
   
    filterAccess = (rootPermission)=>
    {
        const permissionFeatures = [];
        this.eachMenuPermission(rootPermission, (perData, menuItem)=>
        {
            if (perData?.CanAccess)
            {
                permissionFeatures.push(menuItem);
            }
        });

        return permissionFeatures;
    }


    filterView = (rootPermission)=>
    {
        const permissionFeatures = [];
        this.eachMenuPermission(rootPermission, (perData, menuItem)=>
        {
            if (perData?.CanView)
            {
                permissionFeatures.push(menuItem);
            }
        });

        return permissionFeatures;
    }

    canAppConfigView = (rootPermission) =>
    {
        let isView = false;

        if (rootPermission?.length > 0)
        {
            this.eachMenuPermission(rootPermission, (perData)=>
            {
                perData?.CanView && (isView = true);
            });

        }
        
        return isView;
    }

    canAppConfigAccess = (rootPermission) =>
    {
        let isAccess = false;

        if (rootPermission?.length > 0)
        {

            this.eachMenuPermission(rootPermission, (perData)=>
            {
                perData?.CanAccess && (isAccess = true);
            });
        }

        return isAccess;
    }
  

    backHome = (history) =>
    {
        history.push(Routers.baseUrl);
    }
}

decorate(AppConfigStore, {
    menu: observable,
    tenantConfig: observable,

    init: action,
    set: action,
});
