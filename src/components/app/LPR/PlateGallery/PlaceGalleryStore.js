import { action, decorate, observable } from 'mobx';

import { CommonHelper } from 'helper/common.helper';
import { PlateWatchListService } from 'services/plate-watch-list.service';

const Enum = require('constant/app-enum');

export class PlaceGalleryStore
{
    appStore = null;

    watchListSvc = new PlateWatchListService();

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    searchState = {
        plateNumber: '',
        color: '',
        type: '',
    };

    totalItem = 100;
    pageSize = 20;
    currentPage = 1;
    loading = false;
    data = undefined;
    detailData = undefined;
    type = undefined;

    setSearchState(key, value)
    {
        this.searchState[key] = value;
    }

    getFullSearchState()
    {
        const searchState = CommonHelper.clone(this.searchState);
        searchState.skip = (this.currentPage - 1) * this.pageSize;
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

    setPaging(total, current, size)
    {
        this.totalItem = total;
        this.currentPage = current;
        this.pageSize = size || this.pageSize;
    }

    setDetail(detail = undefined, type = undefined)
    {
        this.detailData = detail;
        this.type = type;

        // fill watchlist name
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
        // Watchlist name
        if (data && data.watchList)
        {
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


decorate(PlaceGalleryStore, {
    appStore: observable,
    searchState: observable,
    totalItem: observable,
    currentPage: observable,
    pageSize: observable,
    loading: observable,
    data: observable,
    detailData: observable,
    type: observable,
    selectedId: observable,
    setSearchState: action,
    setData: action,
    updateData: action,
    setPaging: action,
    setDetail: action,
    setDetailProperty: action,
    loadDataForGallery: action,
});
