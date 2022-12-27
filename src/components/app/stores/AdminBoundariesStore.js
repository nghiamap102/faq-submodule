import mapboxgl from 'mapbox-gl';
import { decorate, observable, action, autorun, computed } from 'mobx';

import { MapUtil } from 'components/app/Map/MapUtil';

import { AdministrativeService } from 'services/administrative.service';
import LayerService from 'services/layer.service';

import { Constants } from 'constant/Constants';

export class AdminBoundariesStore
{
    selectedPath = [];
    currentChild = [];
    area = { data: [], type: 'Polygon' };
    actions = {};
    countryRegion = [];

    constructor(appStore)
    {
        this.mapUtil = new MapUtil(appStore.mapStore.map);
        this.mapStore = appStore.mapStore;
        this.administrativeSvc = new AdministrativeService();
        this.layerSvc = new LayerService();
    }

    init = () =>
    {
        this.initRegion();
    };

    initRegion = () =>
    {
        return this.administrativeSvc.getRegion(Constants.TYPE_PROVINCE, 0).then((data) =>
        {
            this.countryRegion = data;
            return data;
        });
    }

    get lastSelected()
    {
        if (this.selectedPath && this.selectedPath.length)
        {
            // not return ward if selected
            return this.selectedPath[Math.min(2, this.selectedPath.length - 1)];
        }
        else
        {
            return null;
        }
    }

    get breadcrumbString()
    {
        return this.selectedPath.filter((s) => s.level > 0).map((s) => s.admin.FullName).reverse().join(', ');
    }

    reset = () =>
    {
        this.area = { data: [], type: 'Polygon' };
        this.actions = [];
        this.selectedPath = [];

        this.mapUtil.clearSourceData(Constants.ADMINISTRATIVE_BOUNDARIES_LAYER_ID);
    };

    setBreadcrumb = (level, admin) =>
    {
        this.selectedPath.length = level;
        this.selectedPath.push({
            level: level,
            admin: admin
        });
    };

    setActions = (actions) => this.actions = actions;

    getAdminArea = async (typeRegion, administrativeID) =>
    {
        const collection = await this.administrativeSvc.getAreaByAdminId(typeRegion, administrativeID);

        if (collection)
        {
            this.area = {
                data: collection.coordinates,
                type: collection.type
            };
        }
        else
        {
            this.area = {};
        }
    };

    getChildByParentId = async (type, administrativeID) =>
    {
        if (administrativeID === 0 && this.countryRegion)
        {
            return this.countryRegion;
        }
        else
        {
            return await this.administrativeSvc.getRegion(type, administrativeID);
        }
    };

    autoFitBound = autorun(() =>
    {
        // this will auto call when area change
        if (this.area.data?.length > 0)
        {
            const bounds = new mapboxgl.LngLatBounds();

            this.area.data.forEach((coordinates) =>
            {
                coordinates = this.area.type === 'Polygon' ? coordinates : coordinates[0];

                coordinates.forEach((coordinate) =>
                {
                    bounds.extend(coordinate);
                });
            });

            this.mapStore.map.fitBounds(bounds, {
                padding: 50,
                maxZoom: 16
            });
        }
    });
}

decorate(AdminBoundariesStore, {
    selectedPath: observable,
    currentChild: observable,
    area: observable,
    actions: observable,

    lastSelected: computed,
    breadcrumbString: computed,

    init: action,
    reset: action,
    toggleABHandle: action,
    setBreadcrumb: action,
    getChildByParentId: action,
    resetABStore: action,
    setActions: action
});
