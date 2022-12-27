import { decorate, observable } from 'mobx';
import { action } from 'mobx';

export class PlateWatchListStore
{
    appStore = null;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    isShowPopup = false;
    type = undefined;
    watchList = [];
    watchListDetail = undefined;
    addGalleryWatchListData = {};


    setWatchList(watchList)
    {
        this.watchList = watchList;
    }

    addToWatchList(watchList)
    {
        this.watchList.push(watchList);
    }

    updateWatchList(watchList)
    {
        this.watchList = this.watchList.map((wl) =>
        {
            if (wl.id === watchList.id)
            {
                return watchList;
            }
            else
            {
                return wl;
            }
        });
    }

    setWatchListDetail(detail = undefined)
    {
        this.watchListDetail = detail;
    }

    setWatchListDetailProperty(key, value)
    {
        if (this.watchListDetail)
        {
            this.watchListDetail[key] = value;
        }
    }

    setAddState(state = false, type = 'by-fsImageDetail')
    {
        this.isShowPopup = state;
        this.type = type;
        if (state)
        {
            this.addGalleryWatchListData = {};
        }
    }

    setUpdateState(state = false, data = {}, type = 'by-fsImageDetail')
    {
        this.isShowPopup = state;
        this.type = type;
        if (state)
        {
            this.addGalleryWatchListData = data;
        }
    }

    setAddProperty(key, value)
    {
        this.addGalleryWatchListData[key] = value;
    }
}


decorate(PlateWatchListStore, {
    appStore: observable,
    isShowPopup: observable,
    watchList: observable,
    watchListDetail: observable,
    addGalleryWatchListData: observable,
    setWatchList: action,
    addToWatchList: action,
    updateWatchList: action,
    setWatchListDetail: action,
    setWatchListDetailProperty: action,
    setAddState: action,
    setAddProperty: action
});
