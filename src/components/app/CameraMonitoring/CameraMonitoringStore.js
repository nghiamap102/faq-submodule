import { decorate, observable, action, autorun } from 'mobx';
import mapboxgl from 'mapbox-gl';
import { CommonHelper } from 'helper/common.helper';

export class CameraMonitoringStore
{
    allData = [];
    data = [];
    total = 0;
    count = 20;
    page = 1;
    searchKey = '';
    sorters = [{
        id: 'CameraName',
        direction: 'desc'
    }];
    map = null;
    popups = [];

    setData()
    {
        if (this.allData && this.allData.length)
        {
            const end = this.count * this.page;
            const start = this.count * (this.page - 1);
            const dt = [];
            let allData = CommonHelper.clone(this.allData);

            // search
            if (!this.searchKey)
            {
                allData = CommonHelper.clone(this.allData);
            }
            else
            {
                allData = allData.filter(d => d.CameraName.toLowerCase().indexOf(this.searchKey.toLowerCase()) !== -1);
            }

            // sort
            if (this.sorters)
            {
                allData = this.sort(allData, this.sorters[0]);
            }

            // paging
            for (let i = start; i < end; i++)
            {
                if (i === allData.length)
                {
                    break;
                }

                dt.push({
                    ...allData[i],
                    Id: CommonHelper.uuid()
                });
            }

            this.total = allData.length;
            this.data = dt;
        }
    }

    sort = (arr, sorter) =>
    {
        const compare = (a, b) =>
        {
            const valA = a[sorter.id] ? a[sorter.id].toString().toLowerCase() : '';
            const valB = b[sorter.id] ? b[sorter.id].toString().toLowerCase() : '';
            if (valA < valB)
            {
                return sorter.direction === 'asc' ? -1 : 1;
            }
            if (valA > valB)
            {
                return sorter.direction === 'asc' ? 1 : -1;
            }
            return 0;
        };
        return arr.sort(compare);
    };

    setAllData(data)
    {
        this.allData = data;
    }

    initData = (allData) =>
    {
        this.setAllData(allData);
        this.setTotal(allData.length);
        this.setData();
    };

    addMapPopup = (popupData) =>
    {
        if (!popupData.x || !popupData.y)
        {
            return;
        }

        if (this.popups.find((p) => p.id === popupData.Id) === undefined)
        {
            const map = this.map;

            const popup = {
                id: popupData.Id,
                title: popupData.CameraName,
                sub: popupData.sub,
                lng: popupData.y,
                lat: popupData.x,
                width: 350,
                height: 180,
                isActivate: true,
                onClose: this.onMarkerPopupClose,
                data: popupData
            };

            this.popups.clear();
            this.popups.push(popup);

            if (map)
            {
                map.panTo({ lat: popupData.x, lng: popupData.y });
            }
        }
    };

    onMarkerPopupClose = (event) =>
    {
        this.removeMapPopup(event.id);
    };

    removeMapPopup = (id) =>
    {
        this.popups = this.popups.filter((p) => p.id !== id);
    };

    fitBound = () =>
    {
        if (this.map && this.data.cameras && this.data.cameras.length)
        {
            const bounds = new mapboxgl.LngLatBounds();

            for (const d of this.data.cameras)
            {
                bounds.extend([d.y, d.x]);
            }

            this.map.fitBounds(bounds, { maxZoom: 16 });
        }
    };

    onDataChange = autorun(() =>
    {
        if (this.data && this.data.cameras)
        {
            this.fitBound();
        }
    });

    setTotal(total)
    {
        this.total = total;
    }

    setPage(page)
    {
        this.page = page;
    }

    setCount(count)
    {
        this.count = count;
    }

    setSearchKey(key)
    {
        this.searchKey = key;
    }

    setSorter(sorters)
    {
        this.sorters = sorters;
    }
}

decorate(CameraMonitoringStore, {
    allData: observable,
    data: observable,
    popups: observable,
    total: observable,
    page: observable,
    count: observable,
    searchKey: observable,
    sorters: observable,
    addMapPopup: action,
    initData: action,
    setData: action,
    setAllData: action,
    setCount: action,
    setTotal: action,
    setPage: action,
    setSearchKey: action,
    setSorters: action
});
