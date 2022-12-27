import { decorate, observable } from 'mobx';
import { action } from 'mobx';
import moment from 'moment';
import { CommonHelper } from 'helper/common.helper';
import { SpatialSearchStore } from 'components/app/SpatialSearch/SpatialSearchStore';

export class SpaceRainSearchStore
{
    appStore = null;

    viewMode = 'SPLIT'; // LIST, MAP, SPLIT

    searchState = {
        // value: '',
        value: '51F90080',
        startDate: moment().add(-21, 'days').toDate(),
        endDate: moment().endOf('date'),
        mode: 'init-by-plate',
        matches: 3
    };

    rootValue = '';
    expandedNodes = {};
    data = [];

    constructor(appStore)
    {
        this.appStore = appStore;
        this.spatialSearchStore = new SpatialSearchStore();
    }

    setViewMode = (viewMode) =>
    {
        this.viewMode = viewMode;
    };

    setSearchState(key, value)
    {
        if (this.searchState)
        {
            this.searchState[key] = value;
        }
    }

    setData(data)
    {
        if (data)
        {
            this.data = data = data.map(d => ({
                ...d,
                id: d.wap ? `wap.${d.mac}-${d.wap}` : `plate.${d.mac}-${d.plate}`
            }));

            this.resetExpanded();

            this.setExpanded(`${this.searchState.mode}.${this.searchState.value}`, true);

            if (this.searchState.mode === 'init-by-plate')
            {
                this.setExpanded(`plate.${this.searchState.value}`, true);

                const plateData = data.filter((d) => d.plate === this.searchState.value);
                plateData.forEach((p) => this.setExpanded(`mac.${p.mac}`, true));
            }

            this.setRootValue(this.searchState.value);

            this.spatialSearchStore.setData(this.buildMapData(data));
        }
        else
        {
            this.data = [];
            this.spatialSearchStore.setData([]);
        }
    }

    addData(data)
    {
        data = data.map(d => ({
            ...d,
            id: d.wap ? `wap.${d.mac}-${d.wap}` : `plate.${d.mac}-${d.plate}`
        }));

        for (const d of data)
        {
            const existed = this.data.find(row => row.id === d.id);
            if (!existed)
            {
                this.data.push(d);
            }
        }

        this.spatialSearchStore.addData(this.buildMapData(data));
    }

    colors = {
        plate: '#228B22',
        mac: '#FF7F50',
        wap: 'red'
    };

    buildMapData(data)
    {
        const mapData = [];

        data.forEach((d) =>
        {
            if (d.matchInfo)
            {
                d.matchInfo.forEach(info =>
                {
                    const marker = {};

                    marker.width = 350;
                    marker.height = 280;
                    marker.x = info.lat;
                    marker.y = info.lon;

                    marker.id = d.id;
                    marker.mac = d.mac;
                    marker.plate = d.plate;
                    marker.wap = d.wap;
                    marker.sys = info.sys;
                    marker.capturedAt = info.capturedAt;

                    if (d.wap)
                    {
                        marker.title = [d.ssid, d.wap].join(' - ');
                        marker.sub = d.wap;

                        marker.text = 'WAP: ' + (d.ssid || d.wap) + '\n' + 'MAC: ' + d.mac;
                        marker.iconText = CommonHelper.getFontAwesomeStringFromClassName('wifi');
                        marker.color = this.colors['wap'];
                    }
                    else
                    {
                        marker.title = [d.plate, d.mac].join(' - ');

                        marker.text = d.plate + '\n' + 'MAC: ' + d.mac;
                        marker.iconText = CommonHelper.getFontAwesomeStringFromClassName('credit-card-front');
                        marker.color = this.colors['plate'];
                    }

                    marker.fontSize = 16;
                    marker.background = '#fff';
                    marker.halo = '#966500';

                    mapData.push(marker);
                });
            }
        });

        return mapData;
    }

    setRootValue(value)
    {
        this.rootValue = value;
    }

    setExpanded(objectId, state = true)
    {
        this.expandedNodes[objectId] = state;
    }

    resetExpanded()
    {
        this.expandedNodes = {};
    }
}

decorate(SpaceRainSearchStore, {
    appStore: observable,
    viewMode: observable,
    searchState: observable,
    rootValue: observable,
    data: observable,
    expandedNodes: observable,
    setSearchData: action,
    setData: action,
    addData: action,
    setRootValue: action,
    setExpanded: action,
    resetExpanded: action
});
