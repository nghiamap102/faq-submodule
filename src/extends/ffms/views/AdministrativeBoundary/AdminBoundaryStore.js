import mapboxgl from 'mapbox-gl';
import { decorate, observable, action, autorun, computed } from 'mobx';

import { MapUtil } from 'components/app/Map/MapUtil';

import { AdministrativeService } from 'services/administrative.service';
import LayerService from 'services/layer.service';

import { Constants } from 'extends/ffms/constant/Constants';
import CommonService from 'extends/ffms/services/CommonService';


export class AdminBoundaryStore
{
    selectedPath = [];
    currentChild = [];
    mainArea = { data: [], type: 'Polygon' };
    wardArea = { data: [], type: 'Polygon' }
    postals = [];
    postalsSelected = [];
    enablePostal = true;
    actions = {};
    countryRegion = [];

    constructor(store)
    {
        this.mapUtil = new MapUtil(store.appStore.mapStore.map);
        this.mapStore = store.appStore.mapStore;
        this.administrativeSvc = new AdministrativeService();
        this.layerSvc = new LayerService();
        this.commonSvc = new CommonService();
    }

    set(key, data)
    {
        if (key && this.hasOwnProperty(key))
        {
            if (this.key !== data)
            {
                this[key] = data;
            }
        }
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
        this.mainArea = { data: [], type: 'Polygon' };
        this.actions = [];
        this.selectedPath = [];

        this.mapUtil.clearSourceData(Constants.ADMINISTRATIVE_BOUNDARIES_LAYER_ID);
    };

    resetPostal =() =>
    {
        this.postals = [];
        this.postalsSelected = [];
    }

    setBreadcrumb = (level, admin) =>
    {
        if (level < 3)
        {
            this.selectedPath.length = level;
            this.selectedPath.push({
                level: level,
                admin: admin,
            });
        }
       
    };

    setActions = (actions) => this.actions = actions;

    getAdminArea = async (typeRegion, administrativeID) =>
    {
        const collection = await this.administrativeSvc.getAreaByAdminId(typeRegion, administrativeID);

        if (collection)
        {
            if (typeRegion === Constants.TYPE_WARD)
            {
                this.wardArea = {
                    data: collection.coordinates,
                    type: collection.type,
                };
            }
            else
            {
                this.mainArea = {
                    data: collection.coordinates,
                    type: collection.type,
                };
            }
        }
        else
        {
            this.mainArea = {};
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

    getPostals = async (type, AdminID, otherFilter = {}) =>
    {
        const fieldName = Constants.POSTAL_VBD_CODE[type];
      
        if (fieldName)
        {
            if (fieldName !== Constants.POSTAL_VBD_CODE[Constants.TYPE_WARD])
            {
                const filter = { ...otherFilter, [fieldName]: AdminID , take: 20 };
                const rs = await this.commonSvc.queryData('postal-code', filter);
    
                if (rs?.data?.length > 0)
                {
                    this.set('postals', rs.data);
                    return rs.data;
                }
            }
            else
            {
                return this.postals;
            }
            
        }
        else
        {
            this.set('postals', []);
            return [];
        }
    }

    autoFitBound = autorun(() =>
    {
        const coordinates = [];

        // this will auto call when mainArea change
        if (this.mainArea.data?.length > 0)
        {
            this.mainArea.data.forEach((item) =>
            {
                const coords = this.mainArea.type === 'Polygon' ? item : item[0];
                coordinates.push(...coords);
            });
        }

        if (this.postalsSelected?.length > 0)
        {
            this.postalsSelected.forEach((item) =>
            {
                try
                {
                    const data = typeof item.Shape === 'string' ? JSON.parse(item.Shape) : item.Shape;
                    if (data)
                    {
                        const getCoords = (data, item) => ([...data,...item]);
                        const coords = data.coordinates.reduce(getCoords, []);
                        coordinates.push(...coords);
                    }
                }
                catch (error)
                {
                    console.error(error);
                }
            });
        }
     
        if (this.mapStore?.map && coordinates?.length > 0)
        {
            const bounds = new mapboxgl.LngLatBounds();

            coordinates.forEach((coordinate) =>
            {
                bounds.extend(coordinate);
            });
            this.mapStore.map.fitBounds(bounds, {
                padding: { top: 20, bottom: 20, left: 20, right: 500 },
                maxZoom: 16,
            });
        }
    });

}

decorate(AdminBoundaryStore, {
    selectedPath: observable,
    currentChild: observable,
    mainArea: observable,
    wardArea: observable,
    actions: observable,
    countryRegion: observable,
    postals: observable,
    postalsSelected: observable,
    enablePostal: observable,

    lastSelected: computed,
    breadcrumbString: computed,

    set: action,
    init: action,
    reset: action,
    resetPostal: action,
    toggleABHandle: action,
    setBreadcrumb: action,
    getChildByParentId: action,
    resetABStore: action,
    setActions: action,
    getPostals: action,
});
