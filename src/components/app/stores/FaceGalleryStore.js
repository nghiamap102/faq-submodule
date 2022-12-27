import { action, decorate, observable } from 'mobx';

import { CommonHelper } from 'helper/common.helper';
import { IncidentService } from 'services/incident.service';
import { WatchListService } from 'services/watchList.service';

const Enum = require('constant/app-enum');

export class FaceGalleryStore
{
    appStore = null;

    incidentSvc = new IncidentService();
    watchListSvc = new WatchListService();

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    isCollapseSearch = false;
    searchState = {
        gender: '',
        fromAge: 0,
        toAge: 80,
        fromDateOfBirth: undefined,
        toDateOfBirth: undefined,
        country: '',
        watchlistIds: undefined,
    };

    currentPage = 1;
    pageSize = 10;
    isLast = false;
    loading = false;
    data = undefined;
    detailData = undefined;
    type = undefined;

    setSearchCollapse(isCollapseSearch)
    {
        this.isCollapseSearch = isCollapseSearch;
    }

    setSearchState(key, value)
    {
        this.searchState[key] = value;
    }

    getFullSearchState(page)
    {
        this.searchState.fromAge = typeof this.searchState.fromAge === 'string' ? parseInt(this.searchState.fromAge) : this.searchState.fromAge;
        this.searchState.toAge = typeof this.searchState.toAge === 'string' ? parseInt(this.searchState.toAge) : this.searchState.toAge;

        const searchState = CommonHelper.clone(this.searchState);
        searchState.skip = ((page || this.currentPage) - 1) * this.pageSize;
        searchState.limit = this.pageSize;

        return searchState;
    }

    setLoading(loading)
    {
        this.loading = loading;
    }

    setData(data)
    {
        this.loading = false;
        this.data = data;
    }

    updateData(data)
    {
        this.data = this.data.map((d) =>
        {
            if (d.id === data.id)
            {
                return data;
            }
            return d;
        });
    }

    setPaging(current, isLast = false, size = 10)
    {
        this.currentPage = current;
        this.pageSize = size;
        this.isLast = isLast;
    }

    setDetail(detail = undefined, type = undefined)
    {
        this.detailData = detail;
        this.type = type;

        // fill incident and watchlist name
        this.loadDataForGallery(this.detailData);
    }

    setDetailProperty(key, value)
    {
        if (this.type && this.detailData)
        {
            this.detailData[key] = value;

            if (key === 'watchList')
            {
                this.loadDataForGallery(this.detailData);
            }
        }
    }

    loadDataForGallery = (data) =>
    {
        // fill incident and watchlist name
        if (data && data.watchList)
        {
            this.incidentSvc.getByIds(data.watchList.incidentIds || []).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    data.watchList.incident = rs.data.map((i) => 'ICS-' + i.incidentId).join(', ');
                }
            });

            this.watchListSvc.getByIds(data.watchList.watchListIds || []).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    data.watchList.watchlist = rs.data.map((i) => i.name).join(', ');
                }
            });
        }
    };
}


decorate(FaceGalleryStore, {
    appStore: observable,
    isCollapseSearch: observable,
    searchState: observable,
    isLast: observable,
    currentPage: observable,
    pageSize: observable,
    loading: observable,
    data: observable,
    detailData: observable,
    type: observable,
    selectedId: observable,
    setSearchCollapse: action,
    setSearchState: action,
    setLoading: action,
    setData: action,
    updateData: action,
    setPaging: action,
    setDetail: action,
    setDetailProperty: action,
    loadDataForGallery: action,
});
