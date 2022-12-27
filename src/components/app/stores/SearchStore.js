import { decorate, observable, action } from 'mobx';

import LayerService from 'services/layer.service';
import { LocationService } from 'services/location.service';
import TrackingService from 'services/tracking.service';

import { Constants } from 'constant/Constants';

export class SearchStore
{
    constructor(appStore, directionService)
    {
        this.appStore = appStore;
        this.directionService = directionService;

        this.locationService = new LocationService();
        this.layerService = new LayerService();
        this.trackingSvc = new TrackingService();

        this.mapStore = appStore.mapStore;
    }

    key = '';
    delayQuery = 400;
    isFromSearch = false;
    result = [];
    tempResult = [];
    selectedResult = null;

    whatHereData = {};
    whatHereLocation = null;

    whatHereLayers = ['ICS_PANORAMA', 'ICS_FIREHYDRANT', 'ICS_FIRESTATIONS', 'ICS_HOSPITAL', 'ICS_POLICESTATIONS', 'CAMERALPR', 'CAMERA_SU_VIEC', 'CAMERASTREAM'];
    geoFields = ['gps_position', 'snap_position', 'Location', 'COLLECTION', 'VI_TRI'];

    MY_LOCATION = observable({
        iconClass: 'ml-icon-location',
        name: 'Vị trí của bạn',
        id: 'MY_LOCATION',
        isMyLocation: true,
        favLocation: true,
        latitude: null,
        longitude: null,
        address: '',
    });

    defaultLocations = [this.MY_LOCATION];

    async getSearchTempResult(searchText)
    {
        this.key = searchText;

        this.coordinates = [];

        if (this.key.length >= 3)
        {
            const res = await this.directionService.searchAllDebounced(this.key, this.mapStore.bounds);
            if (res && res.docs && res.docs.length && this.key.length >= 3)
            {
                this.setSearchTempResult(res.docs);
            }
        }
        else
        {
            this.setSearchTempResult([...this.defaultLocations]);
        }
    }

    setSearchTempResult(tempResult)
    {
        this.tempResult.length = 0;
        this.tempResult.push(...tempResult);
    }

    clearSearch()
    {
        this.key = '';
        this.result = [];
        this.tempResult = [];
        this.selectedResult = null;
    }

    closeSuggest()
    {
        this.tempResult = [];
    }

    setSearchResult(name)
    {
        this.key = name;
    }

    setWhatHereData = (data) =>
    {
        this.whatHereData = data;
    };

    setWhatHereLocation = (location) =>
    {
        this.whatHereLocation = location;
    };

    setFromSearch = (isFromSearch) => (this.isFromSearch = isFromSearch);

    handleGetMultiData = async (layers, geoJson) =>
    {
        const multiPromise = [];

        layers.forEach((layer) =>
        {
            const promise = this.layerService
                .mapSearchMultiQuery({
                    layers: [layer],
                    geoJson,
                    count: 1,
                    isInTree: true,
                    ...(layer !== 'ICS_PANORAMA' && { distance: 500 }),
                    returnFields: ['*'],
                })
                .then((rs) =>
                {
                    if (rs?.data?.length)
                    {
                        return rs.data[0];
                    }
                });

            multiPromise.push(promise);
        });

        const data = await Promise.all(multiPromise);
        return data?.length ? data.filter((data) => data) : null;
    };

    getMultiLayerData = async ({ lng, lat }) =>
    {
        if (this.whatHereData?.latitude === lat && this.whatHereData.longitude === lng)
        {
            return this.whatHereData;
        }
        else
        {
            const geoJson = JSON.stringify({ type: 'Point', coordinates: [lng, lat] });

            const data = await this.handleGetMultiData(this.whatHereLayers, geoJson);
            if (data?.length)
            {
                return { data, longitude: lng, latitude: lat };
            }
            else
            {
                return null;
            }
        }
    };

    getLocationData = async ({ lng, lat }) =>
    {
        if (this.whatHereLocation?.latitude === lat && this.whatHereLocation?.longitude === lng)
        {
            return this.whatHereLocation;
        }
        else
        {
            const rs = await this.locationService.getLocationDataByGeo(lng, lat);

            if (rs?.data)
            {
                return { ...rs.data, longitude: lng, latitude: lat };
            }
            else
            {
                return { longitude: lng, latitude: lat };
            }
        }
    };

    handleCloseWhatHerePopup = () =>
    {
        this.whatHereLocation = null;
        this.appStore.markerPopupStore.remove(Constants.WHAT_HERE_POPUP_ID);
        this.appStore.popupStore.remove(Constants.WHAT_HERE_POPUP_ID);
    };

    showWhatHerePopup = (location, renderPopupContent, hasLayersData) =>
    {
        this.appStore.markerPopupStore.remove(Constants.WHAT_HERE_POPUP_ID);

        if (!hasLayersData && !this.isFromSearch)
        {
            this.setWhatHereLocation(location);
            this.appStore.markerPopupStore.add({
                id: Constants.WHAT_HERE_POPUP_ID,
                title: 'Chi tiết địa điểm',
                content: renderPopupContent,
                lng: location.longitude,
                lat: location.latitude,
                width: 350,
                height: 180,
                isActivate: true,
                onClose: this.handleCloseWhatHerePopup,
            });
        }
        else
        {
            this.appStore.popupStore.add({
                id: Constants.WHAT_HERE_POPUP_ID,
                title: 'Chi tiết địa điểm',
                content: renderPopupContent,
                width: hasLayersData ? '900px' : '600px',
                isShow: true,
                onClose: this.handleCloseWhatHerePopup,
            });
        }

        this.isFromSearch && this.setFromSearch(false);
    };

    contextMenuSetPointWhatHere = (latLng, renderPopupContent) =>
    {
        const { lat, lng } = latLng;

        this.getLocationData({ lng, lat }).then((locationData) =>
        {
            if (locationData.id)
            {
                this.getMultiLayerData({ lng, lat }).then((layersData) =>
                {
                    if (layersData)
                    {
                        this.setWhatHereData(layersData);

                        this.showWhatHerePopup(locationData, renderPopupContent(locationData, layersData?.data), layersData?.data?.length > 0);
                    }
                    else
                    {
                        this.showWhatHerePopup(locationData, renderPopupContent(locationData, null), false);
                    }
                });
            }
            else
            {
                this.showWhatHerePopup(locationData, renderPopupContent(locationData, null), false);
            }
        });
    };

    contextMenuSimpleWhatHere = (latLng, renderPopupContent) =>
    {
        this.getLocationData(latLng).then((locationData) =>
        {
            this.showWhatHerePopup(locationData, renderPopupContent(locationData, null), false);
        });
    };

    setSearchFocusing()
    {
        if (!this.key)
        {
            this.setSearchTempResult([...this.defaultLocations]);
        }
    }
}

decorate(SearchStore, {
    key: observable,
    result: observable,
    tempResult: observable,
    selectedResult: observable,
    whatHereLocation: observable,
    whatHereData: observable,
    geoFields: observable,
    getSearchTempResult: action,
    contextMenuSetPointWhatHere: action,
    setWhatHereData: action,
    setWhatHereLocation: action,
    setFromSearch: action,
    handleCloseWhatHerePopup: action,
});
