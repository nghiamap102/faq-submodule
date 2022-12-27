import { decorate, observable, action, computed } from 'mobx';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import Promise from 'bluebird';
import _findIndex from 'lodash/findIndex';
import _pick from 'lodash/pick';
import _uniq from 'lodash/uniq';
import _groupBy from 'lodash/groupBy';
import _omit from 'lodash/omit';
import moment from 'moment';

import { LAYERS } from 'extends/ffms/constant/models';
import HistoryService from 'extends/ffms/views/TrackingHistory/HistoryService';

export class WorkerStore
{
    appStore = null;
    currentFilter = null;
    selectedEmps = [];
    statuses = null;

    trailings = [];
    maxTails = 0; // maximum number of tail segments

    trackingWorkerData = {};
    isDataLoaded = false;
    workers = [];
    displayWorkers = [];

    totalCount = 0;
    totalItem = 0;
    pageSize = 20;
    currentPage = 1;
    toggleWorkersData = true;
    togglePinnedList = true;

    isLoading = false;
    filterState = {};
    urlParams = {};

    // biến dùng lưu danh sách pinned trackers (tracker theo dõi)
    // dùng chung cho pinned List
    pinnedTrackers = [
        // {
        //     driver: 'vinhtk',
        //     date: new Date(2020, 11, 14, 18, 0, 0),
        //     empType: 1,
        //     heading: 0,
        //     jobStatus: 4,
        //     lat: 10.778842,
        //     lng: 106.6553794,
        //     orgId: 1,
        //     trackerId: '1e7c30e868a724d58',
        //     pinned: true
        // },
        // {
        //     driver: 'ngocphan',
        //     date: new Date(2021, 0, 1, 7, 15, 0),
        //     empType: 1,
        //     heading: 0,
        //     jobStatus: 4,
        //     lat: 10.778842,
        //     lng: 106.6553794,
        //     orgId: 1,
        //     trackerId: '2e7c30e868a724d58',
        //     pinned: true
        // },
        // {
        //     driver: 'hangntt2',
        //     date: new Date(2020, 11, 20),
        //     empType: 1,
        //     heading: 0,
        //     jobStatus: 4,
        //     lat: 10.778842,
        //     lng: 106.6553794,
        //     orgId: 1,
        //     trackerId: '3se7c30e868a724d58',
        //     pinned: true
        // }
    ];
    pinnedConfig = {
        intervalTime: 30 * 1000, // 30s in milliseconds
        maxDuration: 60 * 60 * 1000 // 60min in milliseconds
    };

    filterFields = [] // based on loaded config

    trackingLayers = []; //tracking layers loaded from config

    trackerFilter = [];

    constructor(fieldForceStore)
    {
        this.appStore = fieldForceStore?.appStore;

        this.comSvc = fieldForceStore?.comSvc;
        this.trackingSvc = fieldForceStore?.trackingSvc;
        this.historySvc = new HistoryService(this.trackingSvc);

        this.workers = [];
        this.displayWorkers = [];
        this.toggleWorkersData = true;

        this.currentFilter = {
            start_time: moment().startOf('date').format('X'),
            end_time: moment().endOf('date').format('X'),
        };

        this.maxTails = this.pinnedConfig.maxDuration / this.pinnedConfig.intervalTime;
        // this.trackerFilter = [7, 7, [1,2]]; // fake tracking configuration
        this.toggleDataOn = true;
        
        fieldForceStore.loadDataReferences(['employee-types', 'device-statuses']).then((dataRefs) =>
        {
            this.empTypes = dataRefs['employee-types'];
            this.statuses = dataRefs['device-statuses'];
        });
    }

    changeInterval = (interval) => this.pinnedConfig.intervalTime = interval;

    changeDuration = (duration) => this.pinnedConfig.maxDuration = duration;

    togglePinnedTracker = (worker) =>
    {
        if (!worker)
        {
            return;
        }

        const toggle = !worker.pinned;
        const trackWorker = this.pinnedTrackers.filter((w) => w.trackerId === worker.trackerId)[0];
    
        if (!trackWorker || !worker.pinned)
        {
            worker.pinned = toggle;
            this.pinnedTrackers.push(worker);
        } 
        else 
        {
            const pinnedIndex = _findIndex(this.pinnedTrackers, (w) => w.trackerId === worker.trackerId);
            this.pinnedTrackers.splice(pinnedIndex, 1);
        }

        if (this.workers && this.workers.length > 0)
        {
            const workerIndex = _findIndex(this.workers, (w) => w.trackerId === worker.trackerId);
            if (workerIndex > -1)
            {
                this.workers[workerIndex].pinned = toggle;
            }
        }
    }

    getTrackingData = async (viewport, filter) =>
    {
        if (!viewport || !this.toggleDataOn)
        {
            return;
        }

        if (!filter)
        {
            filter = this.getFullFilter();
        }
        const selectedFilter = _pick(filter, this.filterFields);
        const requestFilter = {};
        Object.keys(selectedFilter).forEach((f) => {
            requestFilter[f] = _uniq(selectedFilter[f]);
        })

        const rs = await this.trackingSvc.getTrackingData(
            requestFilter,
            viewport,
            { page: this.currentPage, pageSize: this.pageSize, searchKey: filter.searchKey || '' }
        );

        return rs;
    };
    getTrackingDataDebounced = new AwesomeDebouncePromise(this.getTrackingData.bind(this), 300);

    fillTrackingSwitchers = async () =>
    {
        this.filterFields = [];
        this.isDataLoaded = true;
        const filterConfig = this.trackingSvc?.TRACKING_CONFIG ? this.trackingSvc.TRACKING_CONFIG : await this.trackingSvc.initTracking();
        if (filterConfig) 
        {
            const defaultCheck = 1;
            const trackingData =
            {
                // Id: filterConfig.layer,
                Id: 'TRACKING',
                Title: 'Giám sát hành trình',
                checkingType: 1,
                childes: []
            };
    
            for (let i = 0; i < filterConfig.filters.length; i++)
            {
                const item = filterConfig.filters[i];
                const paramName = item.field_name || item.name;
                this.filterFields.push(item.field_name);
    
                const trackingItem = {
                    Id: item.name,
                    Title: item.name,
                    checkingType: defaultCheck,
                    Type: 'folder',
                    Path: '',
                    paramName: paramName,
                    valueType: item.value_type,
                    expanded: true
                };
    
                let filterData = [];
    
                if (item.type === 'tracking')
                {
                    // bind n checkbox
                    filterData = item.data?.map((d) =>
                    {
                        const display = d.display;
                        const value = d.value;
                        const icon = d.icon;
                        const color = d.color;
                        const id = `${paramName}-${value}`;
    
                        this.setFilterState(paramName, value, { type: item.value_type, checked: defaultCheck === 1 });
    
                        return {
                            Id: id,
                            Title: display,
                            checkingType: defaultCheck,
                            [paramName]: value,
                            iconName: icon,
                            paramName: paramName,
                            valueType: item.value_type,
                            iconColor: color
                        };
                    });
                }
                else if (item.type === 'layer')
                {
                    const model = LAYERS[item.layer_name] || item.layer_name;
                    const data = await this.comSvc.getLayerData(model);
                    if(Array.isArray(data))
                    {
                        filterData = data?.map((d) =>
                        {
                            const display = d[item.display_field];
                            const value = d[item.value_field];
                            const icon = d[item.icon_field];
                            const color = d[item.color_field];
                            const id = `${paramName}-${value}`;
        
                            this.setFilterState(paramName, value, { type: item.value_type, checked: defaultCheck === 1 });
                            const filterLayerItem = {
                                Id: id,
                                Title: display,
                                checkingType: defaultCheck,
                                [paramName]: value,
                                iconName: icon,
                                paramName: paramName,
                                valueType: item.value_type,
                                iconColor: color
                            };
                            this.trackingLayers.push(filterLayerItem);
        
                            return filterLayerItem;
                        });
                    }
                }
    
                trackingItem.childes = filterData;
    
                trackingData.childes.push(trackingItem);
            }
    
            return trackingData;
        }
    };

    setTrackingWorkerData = (data) =>
    {
        this.trackingWorkerData = data;
    };

    setPaging = (total, page, size = 50) =>
    {
        this.totalItem = total;
        this.currentPage = page;
        this.pageSize = size;
    };

    setLoading = (isLoading) =>
    {
        this.isLoading = isLoading;
    }

    buildWorkerGroup = (trackers) => 
    {
        const workerTrackers = _groupBy(trackers, t => t.driver);

        const groupWorker = [];
        Object.keys(workerTrackers).forEach((workerName) => 
        {
            let worker = workerTrackers[workerName].filter(r => r.isActive)[0];
            
            if (!worker) 
            {
                workerTrackers[workerName][0].isActive = true;
                worker = workerTrackers[workerName][0];
            }

            worker.trackerIds = workerTrackers[workerName].map((tracker) => _omit(tracker,  ['driver', 'employee_organization_id', 'employee_team_id', 'employee_type_id', 'trackerIds']));

            groupWorker.push(worker);
        });
        this.displayWorkers = groupWorker;

        return groupWorker;
    }

    getWorkerData = async () =>
    {
        if (this.toggleDataOn) 
        {
            this.setLoading(true);
            const filterState = this.toggleWorkersData ? this.getFullFilter() : {};

            const selectedFilter = _pick(filterState, this.filterFields);
            const requestFilter = {};
            Object.keys(selectedFilter).forEach((filter) => {
                requestFilter[filter] = _uniq(selectedFilter[filter]);
            })

            // Pass whole filterState to params
            const rs = await this.trackingSvc.getWorkerData(
                requestFilter,
                { page: this.currentPage, pageSize: this.pageSize, searchKey: filterState.searchKey || '' }
            );
            this.setLoading(false);

            if (rs && rs.status && rs.status.success)
            {
                if (Array.isArray(rs.data.trackers))
                {
                    this.workers = rs.data.trackers;
                    
                    // this.displayWorkers = this.buildWorkerGroup(rs.data.trackers);
                    this.buildWorkerGroup(rs.data.trackers);

                    this.totalItem = rs.data.total || rs.data.trackers.length;
                    return this.displayWorkers;
                }
            }
        }
        this.workers = [];
        this.displayWorkers = [];
        this.totalItem = 0;
        return this.displayWorkers;
    };

    getDataDebounced = new AwesomeDebouncePromise(this.getWorkerData.bind(this), 300);

    setFilterState = (key, value, opts) =>
    {
        const { type, checked } = opts || {};
        switch (type)
        {
            case 'bit':
                if (checked)
                {
                    this.filterState[key] = (this.filterState[key] || 0) | value;
                }
                else
                {
                    this.filterState[key] ^= value;
                }
                break;
            case 'array':
                if (!Array.isArray(this.filterState[key]))
                {
                    this.filterState[key] = [];
                }
                if (checked)
                {
                    this.filterState[key] = this.filterState[key].concat([value]);
                }
                else if (this.filterState[key] && this.filterState[key].length)
                {
                    this.filterState[key] = this.filterState[key].filter((f) => f !== value);
                }
                break;
            case 'object': 
                break;
            case 'single':
            default:
                this.filterState[key] = value;
        }
    };

    getFullFilter = () =>
    {
        return this.filterState || {};
    };

    setToggleWorkersData = () =>
    {
        this.toggleWorkersData = !this.toggleWorkersData;
    };

    getTrackingStatus = (statusId) =>
    {
        return this.statuses?.filter((x) => x.status_id === statusId)[0] ?? {
            status_color: 'darkgray',
            status_icon: 'circle',
            status_name: 'None',
            status_id: 0
        };
    }

    setStatuses = (statuses) =>
    {
        this.statuses = statuses;
    }
    
    // Đây là hàm backend get tracker logs realtime sẽ thay thế sau này
    getLogs = async (driver, from, to) =>
    {
        const rs = await this.historySvc.getHistoryDataByDriver(
            driver,
            from,
            to
        );

        if (rs && rs.status && rs.status.success)
        {
            return rs.data;
        }
    };

    _loadTrailings = async () =>
    {
        if (this.pinnedTrackers && this.pinnedTrackers.length > 0)
        {
            // from, to là 10 min gần đây
            const to = moment();
            const from = to.clone().subtract(this.pinnedConfig.intervalTime, 'ms');

            Promise.mapSeries(this.pinnedTrackers, async (tracker) =>
            {
                // hard-code to test, comment this in production and uncomment the from, to at the beginning
                // const to = moment(moment(tracker.date).format('MM/DD/YYYY') + ' ' + moment(new Date(0, 0, 0, 10, moment().format('mm'), moment().format('ss'))).format('HH:mm:ss'));
                // const from = to.clone().subtract(this.pinnedConfig.intervalTime, 'milliseconds');
                //= = end hard-code

                await this._buildTrailings(tracker, from.format('X'), to.format('X'));
            });
        }

        setTimeout(this._loadTrailings, this.pinnedConfig.intervalTime);
    };

    _buildTrailings = async (tracker, from, to) =>
    {
        const trackerTail = {
            driver: tracker.driver,
            trailings: []
        };
        const currentTracker = _findIndex(this.trailings, e => e.driver === tracker.driver);
        const data = await this.getLogs(tracker.driver, from, to);
        if (data)
        {
            data.forEach((d) =>
            {
                const status = this.getTrackingStatus(d[this.trackingSvc.TRACKING_FIELD]);
                d.statusColor = status.status_color;
            });

            if (currentTracker > -1)
            {
                this.trailings[currentTracker].trailings.push(data);
                if (this.trailings[currentTracker].trailings.length > this.maxTails)
                {
                    this.trailings[currentTracker].trailings.splice(0, 1);
                }
            }
            else
            {
                trackerTail.trailings.push(data);
                this.trailings.push(trackerTail);
            }
        }
        else
        {
            if (currentTracker > -1)
            {
                if (this.trailings[currentTracker].trailings.length > this.maxTails)
                {
                    this.trailings[currentTracker].trailings.splice(0, 1);
                }
                this.trailings[currentTracker].trailings.push([]);
            }
            else
            {
                trackerTail.trailings.push([]);
                this.trailings.push(trackerTail);
            }
        }

    }
}

decorate(WorkerStore, {
    isLoading: observable,
    trackingWorkerData: observable,
    selectedEmps: observable,
    trailings: observable,
    trackerFilter: observable,
    setLoading: action,
    workers: observable,
    displayWorkers: observable,
    getWorkerData: action,
    buildWorkerGroup: action,
    setPaging: action,
    filterState: observable,
    setFilterState: action,
    getFullFilterState: action,
    toggleWorkersData: observable,
    setToggleWorkersData: action,
    loadTrailings: action,
    getTrackingData: action,

    totalItem: observable,
    togglePinnedList: observable,
    pinnedTrackers: observable,
    pinnedConfig: observable,
    _loadTrailings: action,
    _buildTrailings: action,

    setTrackingWorkerData: action,
    getTrackingStatus: action,
    togglePinnedTracker: action,
    setStatuses: action,

    filterFields: observable,
    trackingField: observable,
    trackingLayers: observable,
    toggleDataOn: observable
});
