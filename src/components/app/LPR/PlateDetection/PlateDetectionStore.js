import { decorate, observable } from 'mobx';
import { action } from 'mobx';
import mapboxgl from 'mapbox-gl';
import moment from 'moment';

import { CommonHelper } from 'helper/common.helper';

export class PlateDetectionStore
{
    plateAlertStore = null;
    viewDetail = false;

    spatialSearch = false;

    searchState = {
        cameraId: [],
        systemName: '',
        plateNumber: '',
        plateNumberSearch: '',
        accuracy: [80, 100],
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
        geoData: null,
    };

    viewMode = 'SPLIT'; // LIST, MAP, SPLIT
    totalItem = 100;
    pageSize = 25;
    currentPage = 1;

    data = undefined;
    detailData = undefined;
    selectedId = undefined;

    history = {
        totalItem: 0,
        pageSize: 25,
        currentPage: 1,

        plateNumber: null,
        data: undefined,
        detailData: undefined,
        selectedId: undefined,

        map: null,
        popups: [],
        virtualRoute: null,
    };

    constructor(plateAlertStore)
    {
        this.plateAlertStore = plateAlertStore;
    }

    setViewDetail = (show) =>
    {
        this.viewDetail = show;
    };
    formatData(data)
    {
        return data.map((d) =>
        {
            return {
                ...d,
                id: CommonHelper.uuid(),
                title: d.carNumber,
            };
        });
    }
    onHistoryDataLoaded = (rs, isSetCenter = true) =>
    {
        this.setHistory('data', this.formatData(rs.data.data));
        this.setHistoryPaging(rs.data.total, this.history.currentPage);
        if (isSetCenter)
        {
            this.setHistory('mapCenter', { lat: rs.data.data[0].x, lng: rs.data.data[0].y });
        }
    };

    setHistoryPaging = (total, current) =>
    {
        this.setHistory('totalItem', total);
        this.setHistory('currentPage', current);
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

    getHistoryIndex(history)
    {
        if (!history)
        {
            return -1;
        }

        for (let i = 0; i < this.history.data.length; i++)
        {
            if (this.history.data[i].eventID === history.eventID)
            {
                return i;
            }
        }

        return -1;
    }

    onMarkerPopupClose = (event) =>
    {
        this.removeHistoryPopup(event.id);
    };

    addHistoryPopup = (popupData) =>
    {
        if (this.history.popups.find((p) => p.id === popupData.evenID) === undefined)
        {
            const map = this.history.map;

            const popup = {
                id: popupData.eventID,
                title: popupData.carNumber,
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

    setSearchState(key, value)
    {
        this.searchState[key] = value;
    }

    setSpatialSearch(isSpatialSearch)
    {
        this.spatialSearch = isSpatialSearch;
    }

    fitBoundHistoryMap = (data) =>
    {
        if (this.history.map && data && data.length)
        {
            const bounds = new mapboxgl.LngLatBounds();

            for (const d of data)
            {
                bounds.extend([d.y, d.x]);
            }

            this.history.map.fitBounds(bounds, { maxZoom: 16 });
        }
    };

    getFullSearchState(geoData)
    {
        const searchState = CommonHelper.clone(this.searchState);
        searchState.plateNumber = searchState.plateNumberSearch.toUpperCase();
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

    setDataProperty(incrementId, key, value)
    {

        this.data = this.data.map((d) =>
        {
            if (d.incrementId === incrementId)
            {
                d[key] = value;
            }
            return d;
        });
    }

    setSelectedAllChange(value)
    {
        this.data = this.data.map((d) =>
        {
            d.isSelected = value;
            return d;
        });
    }

    setPaging(total, current, size = this.pageSize)
    {
        this.totalItem = total;
        this.currentPage = current;
        this.pageSize = size;
    }

    getDetailIndex(detail)
    {
        if (!detail)
        {
            return -1;
        }

        for (let i = 0; i < this.data.length; i++)
        {
            if (this.data[i].id === detail.id)
            {
                return i;
            }
        }

        return -1;
    }

    setDetail(detail = undefined)
    {
        this.detailData = detail;

        if (detail)
        {
            this.setSelected(detail.id);
        }
    }

    setSelected(selectedId = undefined)
    {
        this.selectedId = selectedId;
    }

    setViewMode = (viewMode) =>
    {
        this.viewMode = viewMode;
    };

    resetSearch = () =>
    {
        this.setData(null);
        this.setPaging(0, 1);
        this.setSelected();
    };
}

decorate(PlateDetectionStore, {
    isCollapseSearch: observable,
    searchState: observable,
    totalItem: observable,
    currentPage: observable,
    pageSize: observable,
    data: observable,
    detailData: observable,
    selectedId: observable,
    viewDetail: observable,
    viewHistory: observable,
    spatialSearch: observable,
    history: observable,
    setSearchCollapse: action,
    setSearchState: action,
    setData: action,
    setDetail: action,
    setPaging: action,
    setSelected: action,
    setViewDetail: action,
    viewMode: observable,

    setHistory: action,
    onHistoryDataLoaded: action,
    resetHistory: action,
    setHistoryPaging: action,
    addHistoryPopup: action,
    removeHistoryPopup: action,
    setSpatialSearch: action,
    resetSearch: action,
    setViewMode: action,
    setHistoryVirtualRoute: action,
    setDataProperty: action,
    setSelectedAllChange: action,
});
