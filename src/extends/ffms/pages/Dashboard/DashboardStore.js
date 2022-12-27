import { action, decorate, observable } from 'mobx';
import * as _ from 'lodash';
import { GROUP_BY_MODE, TAB } from 'extends/ffms/services/DashboardService/constants';
import { getDetailCharts } from 'extends/ffms/services/DashboardService/util';
export class DashboardStore
{
    appStore = null;
    layers = [];
    apiOutput = [];
    detailCharts = [];
    employees = [];
    currentDetail = [];
    masterIndex = 0;
    // 0: full, 1: data
    showMode = false;
    displayLegend = false;
    refreshInterval = true;
    interval = 5;

    groupByMode = 'DAY';
    lastUpdate = null;

    // Paging
    paging = {
        pageIndex: 1,
        limit: 20
    }
    config = null;
    tabs= null;
    loading =true;
    configStore={};
    paras = ()=> new URLSearchParams(window.location.search);

    constructor(appStore)
    {
        this.appStore = appStore;

        if (window.localStorage)
        {
            try
            {
                this.interval = window.localStorage.getItem('interval') ?? this.interval;
                this.refreshInterval = window.localStorage.getItem('refreshInterval') == 'false' ? false : true;
                this.showMode = window.localStorage.getItem('showMode') == 'true' ? true : false;
                this.displayLegend = window.localStorage.getItem('displayLegend') == 'true' ? true : false;
            }
            catch (ex)
            {
                console.error('filter',ex);
            }
        }

        if (window && window.location)
        {
            const group = this.paras().get('groupby')?.toUpperCase();
            if (group)
            {
                this.groupByMode = _.clone(group);
            }
            this.masterIndex = (this.paras().get('master') ?? 0) * 1;
        }
    }

    setLayers(layers, lastUpdate)
    {
        this.layers = layers;
        this.lastUpdate = lastUpdate;
        this.loading = false;
    }

    setApiOutput(apiOutput)
    {
        this.apiOutput = apiOutput;
    }

    setDetailCharts(detailCharts)
    {
        this.detailCharts = _.cloneDeep(detailCharts);
        this.loading = false;
    }

    setFilter(filter)
    {
        this.filter = filter;
    }

    setCurrentDetail(index)
    {
        this.masterIndex = index;
        this.currentDetail = this.layers[this.index];
    }

    setGroupMode(id)
    {
        this.groupByMode = id;
    }

    setShowMode(showMode)
    {
        this.loading = true;
        this.showMode = showMode;
        window.localStorage && window.localStorage.setItem('showMode', showMode);
    }

    setDisplayLegend(displayLegend)
    {
        this.displayLegend = displayLegend;
        window.localStorage && window.localStorage.setItem('displayLegend', displayLegend);
    }
    setRefreshInterval(refreshInterval)
    {
        this.refreshInterval = refreshInterval;
        window.localStorage && window.localStorage.setItem('refreshInterval', refreshInterval);
    }
    setInterval(interval)
    {
        this.interval = interval;
        window.localStorage && window.localStorage.setItem('interval', interval);
    }
    setPaging(page)
    {
        this.paging = page;
    }
    setDashboardConfig(config, tab, clearDetail = false)
    {
        this.config = config;
        tab?.layerName && (this.configStore[tab?.layerName] = config);
        if (config)
        {
            if (config.code !== TAB.EMPLOYEE)
            {
                const detailCharts = getDetailCharts(config,this.masterIndex);
                const detailChart = _.find(detailCharts, item=> _.toLower(item.key) === _.toLower(this.groupByMode)) ?? _.get(detailCharts,0);
                this.groupByMode = _.toUpper(detailChart?.key);
            }
            else
            {
                this.groupByMode = this.paras().get('groupby')?.toUpperCase() ?? _.toUpper(GROUP_BY_MODE.DAY.key);
            }
            if (clearDetail)
            {
                this.detailCharts = [];
                this.masterIndex = (this.paras().get('master') ?? 0) * 1;
            }
        }
    }
    setTabs(tabs)
    {
        this.config = null;
        this.tabs = tabs;
    }

    setLoading(loading)
    {
        this.loading = loading;
    }

    setPickTabs(pickTabs)
    {
        this.pickTabs = pickTabs;
    }

    setFilters(filters)
    {
        this.filters = filters;
    }

    setPeriodCompares(periodCompares)
    {
        this.loading = true;
        this.periodCompares = periodCompares;
    }
}

decorate(DashboardStore, {
    appStore: observable,
    mainTab: observable,
    layers: observable,
    apiOutput: observable,
    detailCharts: observable,
    currentDetail: observable,
    groupByMode: observable,
    masterIndex: observable,
    timeOptionId: observable,
    filter: observable,
    showMode: observable,
    displayLegend: observable,
    refreshInterval: observable,
    interval: observable,
    paging: observable,
    config: observable,
    tabs: observable,
    loading: observable,
    pickTabs: observable,
    filters: observable,
    periodCompares: observable,
    setLayers: action,
    setCurrentDetail: action,
    setGroupMode: action,
    setFilter: action,
    setPaging: action,
    setDashboardConfig: action,
    setTabs: action,
    setLoading: action
});
