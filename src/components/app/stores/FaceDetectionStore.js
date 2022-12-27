import { decorate, observable } from 'mobx';
import { action } from 'mobx';
import mapboxgl from 'mapbox-gl';
import moment from 'moment';

import { CommonHelper } from 'helper/common.helper';

export class FaceDetectionStore
{
    appStore = null;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    spatialSearch = false;

    isLoading = false;
    searchState = {
        cameraId: [],
        fullName: '',
        accuracy: [0.5, 1],
        mask: [0, 1],
        showData: [
            {
                id: 0,
                isActivate: false,
                data: undefined,
            },
            {
                id: 1,
                isActivate: false,
                data: {
                    from: moment().add(-1, 'months').toDate(),
                    to: moment().endOf('date').toDate(),
                },
            },
            {
                id: 2,
                isActivate: true,
                data: 168,
            },
        ],
    };

    viewMode = 'SPLIT';

    totalItem = 100;
    pageSize = 25;
    currentPage = 1;

    data = undefined;
    detailData = undefined;
    selectedId = undefined;


    history = {
        totalItem: 0,
        pageSize: 25,
        currentPage: 0,

        plateNumber: null,
        data: undefined,
        detailData: undefined,
        selectedId: undefined,

        map: null,
        popups: [],
        virtualRoute: null,
    };

    popups = [];

    setViewMode = (viewMode) =>
    {
        this.viewMode = viewMode;
    };

    onHistoryDataLoaded = (rs) =>
    {
        this.setHistory('data', rs.data.data);
        this.setHistoryPaging(rs.data.total, this.history.currentPage);
        this.setHistory('mapCenter', { lat: rs.data.data[0].x, lng: rs.data.data[0].y });
    };

    setHistoryPaging = (total, current, size = this.history.pageSize) =>
    {
        this.setHistory('totalItem', total);
        this.setHistory('currentPage', current);
        this.setHistory('pageSize', size);
    };

    resetHistory = () =>
    {
        this.setHistoryPaging(0, 1);
        this.setHistory('data', null);
    };

    setHistory = (field, value) =>
    {
        this.history[field] = value;
    };

    onMarkerPopupClose = (event) =>
    {
        this.removeHistoryPopup(event.id);
    };

    addHistoryPopup = (popupData) =>
    {
        if (this.history.popups.find((p) => p.id === popupData.id) === undefined)
        {
            const map = this.history.map;

            const popup = {
                id: popupData.id,
                title: popupData.title,
                sub: popupData.sub,
                lng: popupData.y,
                lat: popupData.x,
                width: 350,
                height: 300,
                isActivate: true,
                onClose: this.onMarkerPopupClose,
                location: 'top',
                data: popupData,
            };

            this.history.popups.clear();
            this.history.popups.push(popup);

            if (map)
            {
                map.panTo({ lat: popupData.x, lng: popupData.y });
            }
        }
    };

    removeHistoryPopup = (id) =>
    {
        this.history.popups = this.history.popups.filter((p) => p.id !== id);
    };

    setHistoryVirtualRoute = (route) =>
    {
        this.history.virtualRoute = route;
    };

    fitBoundHistoryMap = (data) =>
    {
        if (this.history.map && data && data.length)
        {
            const bounds = new mapboxgl.LngLatBounds();

            for (const d of data)
            {
                bounds.extend([d.mapInfo.longitude, d.mapInfo.latitude]);
            }

            this.history.map.fitBounds(bounds, { maxZoom: 16 });
        }
    };

    setIsLoading(val)
    {
        this.isLoading = val;
    }
    setSpatialSearch(val)
    {
        this.spatialSearch = val;
    }

    setSearchState(key, value)
    {
        this.searchState[key] = value;
    }

    getFullSearchState(geoData)
    {
        const searchState = CommonHelper.clone(this.searchState);
        searchState.skip = (this.currentPage - 1) * this.pageSize;
        searchState.limit = this.pageSize;
        if (geoData)
        {
            searchState.geoData = geoData;
        }
        return searchState;
    }

    setData(data)
    {
        this.data = data;
    }

    setPaging(total, current, size = this.pageSize)
    {
        this.totalItem = total;
        this.currentPage = current;
        this.pageSize = size;
    }

    setDetail(detail = undefined)
    {
        this.detailData = detail;
    }

    setSelected(id)
    {
        this.selectedId = id;
        if (Array.isArray(this.data))
        {
            this.data = this.data.map((d) =>
            {
                if (d.id === id)
                {
                    d.isSelected = !d.isSelected;
                }
                return d;
            });
        }
    }

    setAllSelected(isAll)
    {
        if (Array.isArray(this.data))
        {
            this.data = this.data.map((d) =>
            {
                d.isSelected = !isAll;
                return d;
            });
        }
    }

    setSelectedId = (id) =>
    {
        this.selectedId = id;
    };
}

decorate(FaceDetectionStore, {
    appStore: observable,
    spatialSearch: observable,
    viewMode: observable,
    isCollapseSearch: observable,
    searchState: observable,
    totalItem: observable,
    currentPage: observable,
    pageSize: observable,
    data: observable,
    detailData: observable,
    history: observable,
    selectedId: observable,
    isLoading: observable,
    setSearchCollapse: action,
    setSearchState: action,
    setData: action,
    setDetail: action,
    setPaging: action,
    setSelected: action,
    setAllSelected: action,
    setSpatialSearch: action,
    setViewMode: action,
    setSelectedId: action,
    setIsLoading: action,
});
