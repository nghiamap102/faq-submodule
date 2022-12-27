import { decorate, observable, action, runInAction } from 'mobx';
import mapboxgl from 'mapbox-gl';
import moment from 'moment';
import range from 'lodash/range';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { MapStore } from 'components/app/stores/MapStore';

import EmployeeService from 'extends/ffms/services/EmployeeService';
import HistoryService from 'extends/ffms/views/TrackingHistory/HistoryService';

export class HistoryStore
{
    appStore = null;
    empStt = [];
    panStatus = {};
    currentFilter = null;
    entries = [];
    entryMap = [];
    popupList = null;
    empMap = {};
    selectedEntry = null;
    selectedEmp = null;
    selectedId = '';
    searchKey = '';
    isData = 0;
    highlightDays = [];
    isTimePanel = true;

    chartDataByMinute = [];
    chartEntry = [];

    // time series limits
    sliderFrom = null;
    sliderTo = null;
    sliderHandle = null;
    sliderValues = [0, 24];
    currentSelectedPoint = null;
    handlePoint = null;
    loadedFromParams = false;

    // toggle simulation
    defaultSimulationSpeed = 4;
    speedStates = [];
    simulate = false;
    isSliding = false;
    simulation = null;
    focusOn = true;
    urlParams = {}; // store the urlParams when switching tabs

    constructor(fieldForceStore)
    {
        this.appStore = fieldForceStore?.appStore;
        this.i18n = fieldForceStore?.appStore?.contexts?.i18n;
        this.modalContext = fieldForceStore?.appStore?.contexts?.modal;

        this.comSvc = fieldForceStore?.comSvc;
        this.trackingSvc = fieldForceStore?.trackingSvc;
        this.empSvc = new EmployeeService(fieldForceStore?.appStore?.contexts);
        this.trackingSvc = fieldForceStore?.trackingSvc;
        this.historySvc = new HistoryService(this.trackingSvc);

        this.mapStore = this.appStore && this.appStore.mapStore ? this.appStore.mapStore : new MapStore(this.appStore);
        this.panStatus = {
            isPanned: false,
            panEntry: '',
        };
        this.speedStates = [1, 2, 4, 8, 16, 32, 64, 128];
        this.isData = 0;
        this.currentFilter = {
            start_time: moment().startOf('date').format('X'),
            end_time: moment().endOf('date').format('X'),
            firstDay: moment().startOf('date').format('X'),
            lastDay: moment().endOf('date').format('X'),
        };
        this.employees = [];
        this.entryMap = [];
        this.popupList = [];
        this.searchKey = '';
        this.selectedEntry = {
            routes: [],
            rawData: [],
            displayData: [],
            arrow: {
                coords: [],
                angle: [],
                des: [],
            },
        };
        this.highlightDays = [];
        this.isTimePanel = true;
    }

    setStatuses = (statuses) =>
    {
        this.statuses = statuses;
    };
    
    setEmpTypes = (types) =>
    {
        this.empTypes = types;
    };

    clampDateTime = (data) =>
    {
        if (!this.isSliding)
        {
            this.selectedEntry.displayData = data?.filter(o => o.ts * 1000 <= this.sliderTo.valueOf() && o.ts * 1000 >= this.sliderFrom.valueOf()) || [];
            this.selectedEntry.routes = this.selectedEntry.displayData.map((point) => [point.lng, point.lat]) || [];
        }
    }

    changeSliderTime = () =>
    {
        let timeFrom, timeTo, timeHandle;
        if (this.currentFilter.from || this.currentFilter.to)
        {
            if (this.currentFilter.from)
            {
                timeFrom = this.currentFilter.from;
            }
            else
            {
                timeFrom = moment(this.sliderFrom);
            }
            if (this.currentFilter.to)
            {
                timeTo = this.currentFilter.to;
            }
            else
            {
                timeTo = moment(this.sliderTo);
            }
            timeHandle = moment(timeFrom).add(10, 'minutes');
        }
        else
        {
            timeFrom = moment(this.sliderFrom);
            timeTo = moment(this.sliderTo);
            timeHandle = moment(this.sliderHandle);
        }
        this.sliderValues = [moment.duration(timeFrom.format('HH:mm')).asHours(), moment.duration(timeHandle.format('HH:mm')).asHours(), moment.duration(timeTo.format('HH:mm')).asHours()];
    }

    changeSliderHandle = (newValue) =>
    {
        this.sliderHandle = newValue;

        // Jake's note: Because the handle moves too quickly on higher speed, disabling of the map pan functionality is recommended.
        // Comment out the lines of code dealing with zoom conditioning if you don't want to enable this feature.
        if (this.focusOn && this.appStore.mapStore !== undefined && this.handlePoint)
        {
            // go to location
            this.appStore.mapStore.map.panTo(
                [this.handlePoint.lng, this.handlePoint.lat],
                {
                    padding: { top: 20, bottom: 320, left: 320, right: 80 },
                },
            );
        }
    }

    setSliding = (value) =>
    {
        this.isSliding = value;
    }

    playSimulation = (playSpeed = 1) =>
    {
        if (!this.selectedEntry || !this.selectedEntry.displayData || !this.selectedEntry.displayData.length)
        {
            return;
        }

        const freqLogTime = 30000; // 30s
        const timePerTick = 1000; // 1s
        const delta = playSpeed * freqLogTime / timePerTick;
        const timeInterval = timePerTick / playSpeed;

        this.simulate = !this.simulate;
        if (!this.sliderHandle)
        {
            this.sliderHandle = moment(this.selectedEntry.displayData[0].ts * 1000);
        }

        if (this.simulation)
        {
            clearInterval(this.simulation);
        }

        if (this.simulate)
        {
            this.simulation = setInterval(() =>
            {
                if (!this.isSliding)
                {
                    // stop simulate if this.simulate === false
                    if (!this.simulate)
                    {
                        if (this.simulation)
                        {
                            clearInterval(this.simulation);
                        }
                    }
                    else
                    {
                        const lastPoint = this.selectedEntry.displayData[this.selectedEntry.displayData.length - 1];
                    
                        if (lastPoint && this.sliderHandle.isBefore(moment(lastPoint.ts * 1000)))
                        {
                            this.changeSliderHandle(this.sliderHandle.clone().add(delta, 's'));
                        // console.log(this.sliderHandle.format('DD/MM/YYYY HH:mm'));
                        }
                        else if (this.selectedEntry.displayData && this.selectedEntry.displayData[0])
                        {
                            this.changeSliderHandle(moment(this.selectedEntry.displayData[0].ts * 1000));
                        }
                    }
                }
            }, timeInterval);
        }
    };

    setSimulate = (value) =>
    {
        this.simulate = value;
    }

    setCurrentSelectedPoint = (point) =>
    {
        this.currentSelectedPoint = point;
    }

    getTrackingStatus = (statusId) =>
    {
        const statuses = !Array.isArray(this.statuses) ? [] : this.statuses;
        return statuses.filter((x) => x.status_id === statusId)[0] ?? {
            status_color: 'darkgray' ,
            status_icon: 'circle',
            status_name: 'None',
            status_id: 0,
        };
    };

    getEmpType = (typeId) =>
    {
        const empTypes = !Array.isArray(this.empTypes) ? [] : this.empTypes;
        return empTypes.filter((x) => x.employeetype_id === typeId)[0] ?? {
            employeetype_color: 'darkgray' ,
            employeetype_icon: 'user',
            employeetype_id: 0,
        };
    };

    isLoadingFromParams = (boolValue) =>
    {
        this.loadedFromParams = boolValue;
    }

    // TO DO: Find a way to pre-load the trackingField to selectHistory when called. For now there is no neat solution yet without editing existing code too much.
    selectHistory = async (tracker) =>
    {
        this.simulate = false;
        
        let trackerId = tracker;
        if (this.currentFilter && this.currentFilter.start_time && this.currentFilter.end_time)
        {
            let historyData = null;
            this.isData = 2;
            if (trackerId || (this.selectedEmp && this.selectedEmp.employee_username))
            {
                if (trackerId)
                {
                    historyData = await this.historySvc.getHistoryDataByTracker(
                        trackerId,
                        this.currentFilter.start_time,
                        this.currentFilter.end_time,
                    );
                }
                else
                {
                    trackerId = this.selectedEmp.employee_username;
                    historyData = await this.historySvc.getHistoryDataByDriver(
                        trackerId,
                        this.currentFilter.start_time,
                        this.currentFilter.end_time,
                    );
                }
                runInAction(() =>
                {
                    if (historyData && historyData.data && historyData.data.length > 0)
                    {
                    /* Old groupByTracker codes, kept for future potential use */
                    // const routesGroupByTracker = _groupBy(historyData.data, 'trackerId');
    
                        // Object.keys(routesGroupByTracker).forEach((routeName) =>
                        // {
                        //     this.selectedEntry.routes[routeName] = routesGroupByTracker[routeName].map((point) => [
                        //         point.lng,
                        //         point.lat,
                        //     ]);
                        // });
                        // console.log(routesGroupByTracker);
    
                        // this.sliderFrom = this.currentFilter.from;
                        // this.sliderTo = this.currentFilter.to;
                        // console.log(this.currentFilter);
                        this.currentFilter['from'] = moment(historyData.data[0].ts * 1000);
                        this.currentFilter['to'] = moment(historyData.data[historyData.data.length - 1].ts * 1000);
                        // this.isLoadingFromParams(false);
    
                        this.sliderFrom = this.currentFilter['from'];
                        this.sliderTo = this.currentFilter['to'];
                        this.sliderHandle = moment(this.sliderFrom);

                        let empType = null;
                        if (this.selectedEmp)
                        {
                            empType = this.getEmpType(this.selectedEmp.employee_type_id);
                        }
                        historyData.data.forEach((d) =>
                        {
                            const status = this.getTrackingStatus(d[this.trackingSvc.TRACKING_FIELD]);
                            d.statusColor = status.status_color;
    
                            if (empType)
                            {
                                d.trackerTypeIcon = empType.employeetype_icon;
                            }
                        });
                        // console.log(this.selectedEntry.rawData);
    
                        this.selectedEntry.rawData = historyData.data || [];
    
                        // this.selectedEntry.routes = this.selectedEntry.rawData.map((point) => [point.lng, point.lat]);
                        this.clampDateTime(historyData.data);
    
                        this.isData = 1;
    
                        if (this.selectedEntry.routes && this.selectedEntry.routes.length > 0)
                        {
                            const coords = this.selectedEntry.routes[0];
                            if (this.appStore.mapStore.map !== undefined && coords)
                            {
                            /* Fit bounds instead of zooming in the first point for small paths */
                                var bounds = this.selectedEntry.routes.reduce((bounds, coord) =>
                                {
                                    return bounds.extend(coord);
                                }, new mapboxgl.LngLatBounds(coords, coords));
    
                                // go to location
                                this.appStore.mapStore.map.fitBounds(bounds, {
                                    padding: { top: 20, bottom: 320, left: 320, right: 80 },
                                });
                            }
                        }
                    }
                    else
                    {
                        this.selectedEntry = {
                            routes: [],
                            rawData: [],
                            displayData: [],
                            arrow: {
                                coords: [],
                                angle: [],
                                des: [],
                            },
                        };
                        this.isData = 0;
                        const strDate = `${moment(this.currentFilter.from).format('L')}`;
                        const strTime = `${moment(this.currentFilter.from).format('HH:mm')} - ${moment(this.currentFilter.to).format('HH:mm')}`;
                        const strFilterInfo = `${trackerId} on ${strDate} (${strTime})`;
    
                        this.modalContext.toast({ type: 'info', message: `${this.i18n.t('Không tìm thấy dữ liệu lịch sử cho')} ${strFilterInfo}.` });
                    }
                });
            }
        }
    };
    selectHistoryDebounced = AwesomeDebouncePromise(this.selectHistory.bind(this), 300);

    getEmpData = async (filter = { }) =>
    {
        const result = await this.empSvc.search({
            skip: 0,
            take: 50,
            employee_username: { 'like': '*' },
            ...filter,
        });

        this.entries = result.data;

        if (this.entries && this.entries.length > 0)
        {
            this.empMap = this.entries.reduce((all, emp) =>
            {
                all[emp.employee_guid] = emp;
                return all;
            }, {});

            this.entryMap = this.entries.map((entry) =>
            {
                let display = `${entry.employee_full_name} (${entry.employee_username})`;
                if (!entry.employee_username && !entry.employee_full_name)
                {
                    display = entry.employee_email;
                }

                return {
                    id: entry.employee_guid,
                    label: display || '-- Empty name --',
                    color: '#f5dca1',
                    ...entry,
                };
            });
        }
        else
        {
            this.entryMap = [];
        }
    };

    getEmpDataDebounced = AwesomeDebouncePromise(this.getEmpData.bind(this), 300);

    getGPSLogByDay = async (date = moment(), driver) =>
    {
        if (driver)
        {
            date = moment(date);
            const d1 = date.clone().subtract(1, 'month').endOf('month').date();
            const d2 = date.clone().date(1).day();
            const d3 = date.clone().endOf('month').date();
            const days = [].concat(
                range(d1 - d2 + 1, d1 + 1),
                range(1, d3 + 1),
                range(1, 42 - d3 - d2 + 1),
            );

            // TRICK: fix for case: first date of current month view === first date of current month
            let firstMonth = date.month() - 1;
            if (days[0] < days[days.length - 1])
            {
                firstMonth = date.month();
            }

            const firstDay = new Date(date.year(), firstMonth, days[0]);
            const lastDay = new Date(date.year(), date.month() + 1, days[days.length - 1]);

            const firstDayTime = parseInt(moment(firstDay).startOf('date').format('X'));
            const lastDayTime = parseInt(moment(lastDay).endOf('date').format('X'));

            const result = await this.historySvc.getHistoryDataByDriverSummary(driver, firstDayTime, lastDayTime);
            this.highlightDays = result?.data?.map((x) => moment(new Date(x?.timestamp * 1000)));
        }
        else
        {
            this.highlightDays = [];
        }
    };

    setHighlightDays = (value) =>
    {
        this.highlightDays = value;
    };

    setFilter = (filter) =>
    {
        if (!filter)
        {
            filter = {};
        }
        if (filter.employee)
        {
            this.selectedEmp = filter.employee;
        }
        if (filter.from)
        {
            this.currentFilter['from'] = moment(filter.from);
        }
        if (filter.start_time)
        {
            this.currentFilter['start_time'] = moment(filter.from).format('X');
        }
        if (filter.to)
        {
            this.currentFilter['to'] = moment(filter.to);
        }
        if (filter.end_time)
        {
            this.currentFilter['end_time'] = moment(filter.to).format('X');
        }
    };

    setFilters = async (username, from, to) =>
    {
        if (username && (!this.selectedEmp || this.selectedEmp.employee_username !== username))
        {
            const emp = await this.empSvc.gets({ employee_username: username });
            if (emp && emp.length)
            {
                this.selectedEmp = emp[0];
            }
            // this.selectedEmp = { employee_username: username };
        }
        if (from)
        {
            this.currentFilter['from'] = moment(from);
            this.currentFilter['start_time'] = moment(from).startOf('day').format('X');
        }
        if (to)
        {
            this.currentFilter['to'] = moment(to);
            this.currentFilter['end_time'] = moment(to).endOf('day').format('X');
        }
    };

    historyTimePanel = () =>
    {
        this.isTimePanel = !this.isTimePanel;
    };

    setFocusOn = (value) =>
    {
        this.focusOn = value;
    }
}

decorate(HistoryStore, {
    panStatus: observable.ref,
    currentFilter: observable,
    empStt: observable,
    entries: observable,
    entryMap: observable,
    empMap: observable.ref,
    getEmpData: action,
    toggleFilterPanel: action,
    searchKey: observable,
    selectedEntry: observable,
    selectedEmp: observable,
    selectedId: observable,
    isData: observable,
    highlightDays: observable,
    selectHistory: action,
    setFilters: action,
    setFilter: action,
    getGPSLogByDay: action,
    isTimePanel: observable,
    historyTimePanel: action,

    chartDataByMinute: observable,
    chartEntry: observable,

    sliderFrom: observable,
    sliderTo: observable,
    sliderValues: observable,
    changeSliderTime: action,
    loadedFromParams: observable,
    isLoadingFromParams: action,
    
    currentSelectedPoint: observable,
    setCurrentSelectedPoint: action,
    sliderHandle: observable,
    handlePoint: observable,

    defaultSimulationSpeed: observable,
    simulate: observable,
    changeSliderHandle: action,
    isSliding: observable,
    setSliding: action,
    focusOn: observable,
    setSimulate: action,
    setStatuses: action,
    setEmpTypes: action,
    clampDateTime: action,
});
