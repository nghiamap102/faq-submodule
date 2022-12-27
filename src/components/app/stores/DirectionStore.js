import { computed, decorate, observable, autorun } from 'mobx';
import AwesomeDebouncePromise from 'awesome-debounce-promise/dist/index';
import mapboxgl from 'mapbox-gl';
import { action } from 'mobx';

import Address from 'data/address';
import DirectionV3 from 'data/direction-v3';
import { Constants } from 'constant/Constants';

export class DirectionStore
{
    constructor(appStore, directionService)
    {
        this.appStore = appStore;
        this.directionService = directionService;
        this.mapStore = appStore.mapStore;
    }

    appStore = null;
    screen = {
        isLarge: true,
    };

    language = {
        code: 'V',
    };

    TRAVEL_MODE = [
        {
            val: 0,
            name: 'walk',
        },
        {
            val: 2,
            name: '2w',
        },
        {
            val: 3,
            name: 'car',
        },
        {
            val: 5,
            name: 'transit',
        },
    ];

    ROUTE_CRITERIA = [
        {
            val: 0,
            name: 'Nhanh nhất',
        },
        {
            val: 1,
            name: 'Ngắn nhất',
        },
        // {
        //     val: 2,
        //     name: 'Tránh cản'
        // }
    ];

    MY_LOCATION = observable({
        iconClass: 'ml-icon-location',
        name: 'Vị trí của bạn',
        id: 'MY_LOCATION',
        isMyLocation: true,
        favLocation: true,
        latitude: null,
        longitude: null,
    });

    MIDDLE_LOCATION = {
        placeHolder: 'Chọn điểm đi qua',
        key: '',
        result: [],
        tempResult: [],
        selectedResult: null,
    };

    // show suggest location when not type anything in search input
    defaultLocations = [
        this.MY_LOCATION,
        // this.MY_HOME,
        // this.MY_WORK_PLACE
    ];

    direction = {
        isShowDirectionControl: false,
        isShowDirectionPreviewControl: false,
        isShowDirectionPreviewArrow: false,
        isMarkerDraging: false,
        travelMode: this.TRAVEL_MODE[1],
        routeCriteria: this.ROUTE_CRITERIA[0],
        // travelMode: Common.getLocalStorage(Constants.MY_LAST_TRAVEL_MODE) ? this.TRAVEL_MODE.find(o => o.name === Common.getLocalStorage(Constants.MY_LAST_TRAVEL_MODE)) || this.TRAVEL_MODE[1] : this.TRAVEL_MODE[1],
        // routeCriteria: Common.getLocalStorage(Constants.MY_LAST_ROUTE_CRITERIA) ? this.ROUTE_CRITERIA.find(o => o.val === Common.getLocalStorage(Constants.MY_LAST_ROUTE_CRITERIA)) || this.ROUTE_CRITERIA[0] : this.TRAVEL_MODE[0],
        locations: [
            // array of all locations of direction, very first item is start point, the last is end point, add more middle point later
            {
                placeHolder: 'Chọn điểm xuất phát',
                key: '',
                result: [],
                tempResult: [],
                selectedResult: null,
            },
            {
                placeHolder: 'Chọn điểm đến',
                key: '',
                result: [],
                tempResult: [],
                selectedResult: null,
            },
        ],
        activeLocations: [],
        maxLocations: 5,
        locationFocusing: null,
        primaryRouteInfo: {
            distance: 0,
            duration: 0,
        },
        routes: {
            // result of direction guide VietBanDo API
            route_1: {
                Geometry: [],
                Steps: {
                    Indices: [],
                    Names: [],
                    Distances: [],
                    Turns: [],
                },
                Via_Distances: [],
                Via_Durations: [],
                Via_Indices: [],
            },
            route_2: {
                Geometry: [],
                Steps: {
                    Indices: [],
                    Names: [],
                    Distances: [],
                    Turns: [],
                },
                Via_Distances: [],
                Via_Durations: [],
                Via_Indices: [],
            },
            route_3: {
                Geometry: [],
                Steps: {
                    Indices: [],
                    Names: [],
                    Distances: [],
                    Turns: [],
                },
                Via_Distances: [],
                Via_Durations: [],
                Via_Indices: [],
            },
        },
        dashPath: {
            coordsStart: [],
            coordsEnd: [],
        },
        arrow: {
            coords: [],
            angle: [],
            des: [],
        },
        routesOrder: [],
        previewStep: 0, // step is previewing from direction guide
    };

    autoLocate = false;

    updateDashPath(coordsStart, coordsEnd)
    {
        this.direction.dashPath = {
            coordsStart: coordsStart,
            coordsEnd: coordsEnd,
        };
    }

    clearDirect = () =>
    {
        this.clearDirection();

        if (this.barrier.isOpen)
        {
            const draw = this.barrier.barrierDrawTool;
            this.removeBarrierFromServer(true);
            this.findDirectionShortestPath(false);

            if (draw)
            {
                draw.deleteAll();
            }
            this.barrierPanelToggle();
            this.onToggleBarrierManager();
        }
    };

    clearDashPath()
    {
        this.updateDashPath([], []);
    }

    setDirectionTravelMode(travelName)
    {
        const travelMode = this.TRAVEL_MODE.find((o) => o.name === travelName);
        this.direction.travelMode = travelMode;
        // Common.setLocalStorage(Constants.MY_LAST_TRAVEL_MODE, travelMode.name);

        this.findDirectionShortestPath();
    }

    setDirectionRouteCriteria(routeCriteriaVal)
    {
        const routeCriteria = this.ROUTE_CRITERIA.find((o) => o.val === routeCriteriaVal);
        this.direction.routeCriteria = routeCriteria;
        // Common.setLocalStorage(Constants.MY_LAST_ROUTE_CRITERIA, routeCriteria.val);

        this.findDirectionShortestPath();
    }

    get isShowDirectionRouteGuide()
    {
        return this.direction.isShowDirectionControl &&
            this.direction.locationFocusing == null &&
            !this.direction.isShowDirectionPreviewControl &&
            this.direction.routes; // to can trigger computed when change any options in routes
    }

    adminBoundaries = {
        selectedPath: [],
        currentChild: [],
        area: {},
        get lastSelected()
        {
            if (this.selectedPath && this.selectedPath.length)
            {
                // not return ward if selected
                return this.selectedPath[Math.min(2, this.selectedPath.length - 1)];
            }
            else
            {
                return null;
            }
        },
        get breadcrumbString()
        {
            return this.selectedPath.filter((s) => s.level > 0).map((s) => s.admin.FullName).reverse().join(', ');
        },
    };

    showDirectionPreviewArrow()
    {
        this.direction.isShowDirectionPreviewArrow = true;
    }

    showDirectionPreviewControl()
    {
        this.direction.isShowDirectionPreviewControl = true;

        // preview control only show on mobile mode,
        // when preview control show, auto enable show arrow on path
        this.showDirectionPreviewArrow();
    }

    getAddressText(addressText, lanCode)
    {
        if (!addressText)
        {
            return addressText;
        }

        if (lanCode === 'V')
        {
            return addressText;
        }

        for (const tran of Address.Data)
        {
            if (addressText.includes(tran.V))
            {
                if (tran.keepPosition)
                {
                    addressText = addressText.replace(tran.V, tran.E);
                }
                else
                {
                    addressText = addressText.replace(tran.V, '');
                    addressText += ` ${tran.E}`;
                }
            }
        }

        return this.removeAccents(addressText);
    }

    getFormatDuration(seconds, isGetSecond = true)
    {
        const hText = ` ${this.appStore.contexts.i18n?.t('g')} `;
        const mText = ` ${this.appStore.contexts.i18n?.t('ph')} `;
        const sText = ` ${this.appStore.contexts.i18n?.t('gi')} `;

        if (seconds != null)
        {
            seconds = Number(seconds);

            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor((seconds % 3600) % 60);

            const hDisplay = h > 0 ? h + hText : '';
            const mDisplay = m > 0 ? m + mText : '';
            const sDisplay = s > 0 ? s + sText : '';

            let res = hDisplay + mDisplay + (isGetSecond ? sDisplay : '');
            if (!res)
            {
                res = sDisplay;
            }

            return res;
        }

        return '';
    }

    getFormatDistance(meter, fixed)
    {
        if (meter != null)
        {
            if (meter >= 1000)
            {
                meter = meter / 1000;
                return meter.toFixed(fixed || 1) + ' km';
            }

            return meter.toFixed(fixed || 1) + ' m';
        }

        return '';
    }

    getDirectionIconV3(dir)
    {
        switch (parseInt(dir))
        {
            case 0:
                return 'direction_continue'; // "Không rẽ";
            case 1:
                return 'direction_continue_straight'; // "Đi thẳng";
            case 2:
                return 'direction_turn_slight_right'; // "Hướng sang phải";
            case 3:
                return 'direction_turn_right'; // "Rẽ phải";
            case 4:
                return 'direction_turn_sharp_right'; // "Vòng sang phải";
            case 5:
                return 'direction_uturn'; // "Quay đầu";
            case 6:
                return 'direction_turn_sharp_left'; // "Vòng sang trái";
            case 7:
                return 'direction_turn_left'; // "Rẽ trái";
            case 8:
                return 'direction_turn_slight_left'; // "Hướng sang trái";
            case 9:
                return 'direction_arrive_straight'; // "Đến điểm trung gian";
            case 10:
                return 'direction_turn_straight'; // "Đi vào";
            case 11:
                return 'direction_roundabout'; // "Vào vòng xoay";
            case 12:
                return 'direction_depart_straight'; // "Rời vòng xoay";
            case 13:
                return 'direction_rotary'; // "Bám vòng xoay";
            case 14:
                return 'direction_turn_straight'; // "Đi từ cuối đường";
            case 15:
                return 'direction_arrive'; // "Đến đích";
            default:
                return '';
        }
    }

    translateDirectionV3(dir)
    {
        dir = parseInt(dir);
        const direction = DirectionV3.Data.find((o) => o.code === dir);
        return direction ? direction[this.appStore.contexts.i18n?.language] : '';
    }

    async getDirectionSearchTempResult(index, searchText)
    {
        const loc = this.direction.locations[index];

        loc.key = searchText;
        if (searchText.length >= 3)
        {
            const res = await this.directionService.searchAllDebounced(searchText, this.mapStore.bounds);

            if (res.docs)
            {
                // get current valuee of search key to make sure return not override result in case user clear search text
                const loc = this.direction.locations[index];
                if (loc && loc.key && loc.key.length >= 3)
                {
                    this.setDirectionSearchTempResult(index, res.docs);
                }
            }
        }
        else if (!searchText.length)
        {
            // user clear all search text
            // this.setDirectionSearchTempResult(index, [...this.defaultLocations, ...this.placesHistory.places]);
            this.setDirectionSearchTempResult(index, [...this.defaultLocations]);
        }
    }

    setDirectionSearchTempResult(index, tempResult)
    {
        const loc = this.direction.locations[index];
        if (loc)
        {
            loc.tempResult.length = 0;
            loc.tempResult.push(...tempResult);
        }
    }

    setDirectionLocationFocusing(index)
    {
        this.direction.locationFocusing = index;

        this.direction.locations.forEach((loc, i) =>
        {
            if (index !== i)
            {
                this.clearDirectionSearchTempResult(i);
            }
        });

        if (this.direction.locations[index] && !this.direction.locations[index].key)
        {
            // this.setDirectionSearchTempResult(index, [...this.defaultLocations, ...this.placesHistory.places]);
            this.setDirectionSearchTempResult(index, [...this.defaultLocations]);
        }
    }

    clearDirectionSearchResult(index)
    {
        const search = this.direction.locations[index];
        if (search)
        {
            search.key = '';
        }
    }

    setDirectionSearchResult(index, result)
    {
        const search = this.direction.locations[index];
        if (search)
        {
            search.result.length = 0;
            search.result.push(...result);
        }
    }

    clearDirectionSearchTempResult(i)
    {
        const loc = this.direction.locations[i];
        if (loc)
        {
            loc.key = loc.selectedResult ? loc.selectedResult.name : '';
            loc.tempResult = [];
        }
    }

    clearDirectionSearchText(i)
    {
        const loc = this.direction.locations[i];
        if (loc)
        {
            loc.key = '';
        }
    }

    async setDirectionLocation(index, location, isMarkerDraging)
    {

        // we need to clone the location here
        // we don't need location change affect our shortest path result
        location = Object.assign({}, location);

        // if the location is my location and it not locate yet, call browser to get it
        if (location.id === 'MY_LOCATION' && (location.latitude === null || location.longitude === null))
        {
            location = { ...location, ...(await this.refreshMyLocation()) };
        }
        // this.search.hideSearchResult();

        let keepCopyActiveLocations = null;
        if (location)
        {
            keepCopyActiveLocations = JSON.stringify(this.direction.locations.filter((o) => o && o.selectedResult));
        }

        // index of locations in array locations
        let loc = null;
        if (index < this.direction.locations.length)
        {
            loc = this.direction.locations[index];
        }

        if (loc)
        {
            loc.key = location.name;
            loc.selectedResult = location;
            loc.result = (loc.tempResult && loc.tempResult.length) ? loc.tempResult : loc.result;
        }
        else // add new
        {
            const newLocation = {
                placeHolder: 'Chọn điểm đến',
                key: location.name,
                result: [],
                tempResult: [],
                selectedResult: location,
            };

            this.direction.locations.push(newLocation);
        }

        this.findDirectionShortestPath(isMarkerDraging);

        const currentActiveLocations = this.direction.locations.filter((o) => o && o.selectedResult);
        if (keepCopyActiveLocations !== JSON.stringify(currentActiveLocations))
        {
            this.setDirectionActiveLocations(currentActiveLocations);
        }
    }

    async findDirectionShortestPath(isMarkerDraging)
    {
        // reset
        // this.setDirectionGuide(null);
        this.hideDirectionPreviewArrow(); // reset map view as full path
        // this.search.turnOffSearchNearBy();
        this.clearAdminBoundaries();

        // call find routing default direction
        const start = this.direction.locations[0];
        const end = this.direction.locations[this.direction.locations.length - 1];

        if (start && start.selectedResult && end && end.selectedResult)
        {
            const points = [];
            for (const loc of this.direction.locations)
            {
                if (loc && loc.selectedResult)
                {
                    if (loc.selectedResult.longitude && loc.selectedResult.latitude)
                    {
                        points.push({
                            Longitude: loc.selectedResult.longitude,
                            Latitude: loc.selectedResult.latitude,
                        });
                    }
                }
            }

            if (points.length > 1)
            {
                const isAvoidBarrier = this.barrier.isOpen && this.barrier.listBarrier.length;
                const routes = await this.directionService.getRouteAvoidBarrier(
                    points,
                    this.direction.travelMode.val,
                    this.direction.routeCriteria.val,
                    this.appStore.profile.email || Constants.BARRIER_ID_TEST,
                    isAvoidBarrier,
                    isMarkerDraging ? 0 : 1,
                );

                if (routes)
                {
                    const formatRoutes = {
                        route_1: routes[0],
                        route_2: routes[1] ? routes[1] : null,
                        route_3: routes[2] ? routes[2] : null,
                    };

                    if (formatRoutes.route_1?.Via_Distances && formatRoutes.route_1?.Via_Durations)
                    {
                        this.direction.primaryRouteInfo = {
                            distance: formatRoutes.route_1.Via_Distances[formatRoutes.route_1.Via_Distances.length - 1],
                            duration: formatRoutes.route_1.Via_Durations[formatRoutes.route_1.Via_Durations.length - 1],
                        };
                    }

                    this.setDirectionRoutes(formatRoutes);
                }
                else // case not found direction
                {
                    this.resetDirectionRoutes();
                }
            }
            else
            {
                // invalid list selected place
                this.resetDirectionRoutes();
            }
        }
    }

    async refreshMyLocation()
    {
        const myLoc = await this.getMyLocation();

        if (myLoc && myLoc.longitude && myLoc.latitude)
        {
            await this.setMyLocation(myLoc.longitude, myLoc.latitude);
        }

        return myLoc;
    }

    async getMyLocation()
    {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };

        if (this.autoLocate)
        {
            options.maximumAge = Infinity;
        }

        return new Promise((resolve) =>
        {
            if (navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition(
                    (myLocation) =>
                    {
                        return resolve({
                            longitude: myLocation.coords.longitude,
                            latitude: myLocation.coords.latitude,
                        });
                    },
                    (error) => // timeout or not accept request browser location
                    {
                        console.log('error navigator.geolocation: ', error);
                        return resolve(null);
                    },
                    options);
            }
            else /// browser not support
            {
                return resolve(null);
            }
        });
    }

    async contextMenuSetDirectionAtHere(isStartPoint, point)
    {
        if (point)
        {
            const here = await this.directionService.reverseGeocode(point.lng, point.lat);
            if (isStartPoint)
            {
                // set start from here
                this.setDirectionFrom(here);
                // must be make sure clear search, if not clear, old search result of another keyword would show
                this.setDirectionSearchResult(0, []);
            }
            else // set end from here
            {
                // if not exist start point, set as my location
                if (!this.direction.locations[0].selectedResult)
                {
                    await this.refreshMyLocation();
                    this.setDirectionLocation(0, this.MY_LOCATION);
                }

                const currentEnd = this.direction.locations[this.direction.locations.length - 1];

                if (currentEnd && currentEnd.selectedResult && this.direction.locations.length < this.direction.maxLocations)
                {
                    // push new end point
                    this.setDirectionLocation(this.direction.locations.length, here);
                    // remove focusing location
                    this.setDirectionSearchResult(this.direction.locations.length - 1, []);
                }
                else
                {
                    this.setDirectionTo(here);
                    // must be make sure clear search too
                    this.setDirectionSearchResult(this.direction.locations.length - 1, []);
                }
            }
        }
        this.setDirectionLocationFocusing(null);
        return null;
    }

    setDirectionFrom(loc)
    {
        this.showDirectionControl();
        this.setDirectionLocation(0, loc);
    }

    setDirectionTo(loc)
    {
        this.showDirectionControl();
        this.setDirectionLocation(this.direction.locations.length - 1, loc);
    }

    showDirectionControl()
    {
        this.direction.isShowDirectionControl = true;
        // this.search.hideButtonSearchArea();
    }

    hideDirectionPreviewArrow()
    {
        this.direction.isShowDirectionPreviewArrow = false;
    }

    clearAdminBoundaries()
    {
        this.adminBoundaries.selectedPath.length = 0;
        this.adminBoundaries.area = {};
    }

    setDirectionActiveLocations(activeLocations)
    {
        this.direction.activeLocations = activeLocations;
    }

    resetDirectionRoutes()
    {
        const formatRoutes = {
            route_1: null,
            route_2: null,
            route_3: null,
        };

        this.setDirectionRoutes(formatRoutes);
    }

    setDirectionRoutes(routes)
    {
        this.direction.routes = routes;
        this.setDirectionRoutesOrder();
        this.setPreviewStep(0);
        this.hideDirectionPreviewArrow(); // reset map view as full path
    }

    setDirectionRoutesOrder()
    {
        const routes = this.direction.routes;

        if (routes && Object.keys(routes).length)
        {
            const routesOrder = [];
            let curOrder = 1;

            if (routes && Object.keys(routes).length)
            {
                while (curOrder <= Object.keys(routes).length)
                {
                    for (const routeName of Object.keys(routes))
                    {
                        if (routes[routeName] && routes[routeName].oriOrder === curOrder)
                        {
                            routesOrder.push(parseInt(routeName[routeName.length - 1]));
                        }
                    }

                    curOrder++;
                }
            }

            this.direction.routesOrder = routesOrder;
        }
    }

    setPreviewStep(i)
    {
        this.direction.previewStep = i;
    }

    async setMyLocation(lng, lat)
    {
        this.MY_LOCATION.longitude = lng;
        this.MY_LOCATION.latitude = lat;

        const here = await this.directionService.reverseGeocode(lng, lat);

        if (here)
        {
            this.setMyLocationId(here.id);
        }
    }

    setMyLocationId(id)
    {
        this.MY_LOCATION.id = id;
    }

    clearRoutePopups = (popups) =>
    {
        if (popups)
        {
            for (const m of popups)
            {
                if (m)
                {
                    m.remove();
                }
            }

            popups = null;
        }

        return [];
    };

    renderDirectionPath = autorun(() =>
    {
        // if (this.mapUtil)
        // {
        //     this.mapUtil.clearSourceData(`${Constants.DIRECTION_LAYER_ID}_1`);
        //     this.mapUtil.clearSourceData(`${Constants.DIRECTION_LAYER_ID}_2`);
        //     this.mapUtil.clearSourceData(`${Constants.DIRECTION_LAYER_ID}_3`);
        //     this.mapUtil.clearSourceData(Constants.DIRECTION_DASH_PATH_LAYER_ID);
        //     this.mapUtil.clearSourceData(Constants.DIRECTION_ARROW_BODY_LAYER_ID);
        //     this.mapUtil.clearSourceData(Constants.DIRECTION_ARROW_HEAD_LAYER_ID);
        //     this.routePopups = this.mapUtil.clearRoutePopups(this.routePopups);
        // }

        this.clearRoutePopups(this.routePopups);

        const route = this.direction.routes.route_1;

        if (route && route.Geometry && route.Geometry.length)
        {
            // found direction guide
            const newBounds = new mapboxgl.LngLatBounds();

            route.Geometry.reduce(function (bounds, coord)
            {
                return bounds.extend([parseFloat(coord[0]), parseFloat(coord[1])]);
            }, newBounds);

            const map = this.mapStore.map;

            if (map)
            {
                // let boundPadding = this.isLarge ? {
                //     left: 360 + 8 + 50,
                //     top: 50,
                //     right: 50,
                //     bottom: 50
                // } : {
                //     left: 50,
                //     top: 200,
                //     right: 50,
                //     bottom: 50
                // };

                // if (!this.direction.isMarkerDraging)
                // {
                //     map.fitBounds(newBounds, {padding: boundPadding, maxZoom: 18});
                // }

                const activeLocations = this.direction.activeLocations;
                if (activeLocations && activeLocations.length)
                {
                    const markers = [];
                    for (const loc of activeLocations)
                    {
                        markers.push(loc.selectedResult);
                    }

                    const start = markers[0];
                    const coordsStart = [[start.longitude, start.latitude], route.Geometry[0]];

                    const end = markers[markers.length - 1];
                    const coordsEnd = [[end.longitude, end.latitude], route.Geometry[route.Geometry.length - 1]];

                    this.updateDashPath(coordsStart, coordsEnd);

                    // must be render popup for primary route last, to overlay all popups of secondary routes
                    this.showRoutePopup(route, 1);
                }
            }
        }
    });

    showRoutePopup = (route, index) =>
    {
        if (!route || !route.Geometry || !route.Via_Distances || !route.Via_Durations)
        {
            return;
        }

        this.routePopups = this.routePopups || [];
        // popups overlay, required more work on this point

        let middlePoint;
        if (route.Via_Distances && route.Via_Distances.length)
        {
            middlePoint = this.getMiddlePoint(route.Geometry, route.Via_Distances[route.Via_Distances.length - 1] / 2);
        }

        if (middlePoint && middlePoint[0] && middlePoint[1])
        {
            const distance = route.Via_Distances[route.Via_Distances.length - 1];
            const duration = route.Via_Durations[route.Via_Durations.length - 1];
            const iconTravel = this.direction.travelMode.name;

            this.routePopups.push(
                new mapboxgl.Popup({
                    closeOnClick: false,
                    index: index,
                })
                    .setLngLat([middlePoint[0], middlePoint[1]]) // middlePoint not work
                    .setHTML(
                        `<div id="popup-route-${index}"
                            class="popup-route ${index === 1 ? 'active' : ''}"
                            atr-route-index="${index}">
							<div class="popup-route-header">
								<div class="ml-icon ml-icon-${iconTravel}"></div>
								<span class="popup-marker-duration">${this.getFormatDuration(duration, false)}</span>
							</div>
							<div class="popup-route-detail">
								${this.getFormatDistance(distance)}
							</div>
                        </div>`,
                    )
                    .addTo(this.mapStore.map),
            );

            const me = this;
            document.getElementById(`popup-route-${index}`).addEventListener('click', function ()
            {
                let routeIndex = this.getAttribute('atr-route-index');
                routeIndex = parseInt(routeIndex);
                if (routeIndex > 1)
                {
                    me.setDirectionPrimaryRoute(routeIndex);
                }
            });

            // wait until dom for popup complete render
            setTimeout(() =>
            {
                const overlap = (rectA, rectB) =>
                {
                    const offset = 15;

                    return !(
                        rectA.right + offset < rectB.left - offset ||
                        rectA.left - offset > rectB.right + offset ||
                        rectA.bottom + offset < rectB.top - offset ||
                        rectA.top - offset > rectB.bottom + offset
                    );
                };

                const rePosPopups = (popA, rouA, indA, popB, rouB, indB) =>
                {
                    let times = 0;
                    const maxTimes = 40;

                    do
                    {
                        times++;

                        popB = Math.floor(rouB.length * (0.5 - times / (2 * maxTimes)));
                        const pa2 = rouB[popB <= 0 ? 1 : popB];
                        if (pa2)
                        {
                            const mrp2 = this.routePopups.find((r) => r && r.options && r.options.index === indB);
                            mrp2.setLngLat([pa2[0], pa2[1]]);
                            popB = document.getElementById(`popup-route-${indB}`) ? document.getElementById(`popup-route-${indB}`).getBoundingClientRect() : null;
                        }

                        if (overlap(popA, popB))
                        {
                            popA = Math.floor(rouA.length * (0.5 + times / (2 * maxTimes)));
                            const pa1 = rouA[popA >= rouA.length ? rouA.length - 2 : popA];
                            if (pa1)
                            {
                                const mrp1 = this.routePopups.find((r) => r && r.options && r.options.index === indA);
                                mrp1.setLngLat([pa1[0], pa1[1]]);
                                popA = document.getElementById(`popup-route-${indA}`) ? document.getElementById(`popup-route-${indA}`).getBoundingClientRect() : null;
                            }
                        }
                    }
                    while (overlap(popA, popB) && times <= maxTimes);
                };

                const p1 = document.getElementById('popup-route-1') ? document.getElementById('popup-route-1').getBoundingClientRect() : null;
                const p2 = document.getElementById('popup-route-2') ? document.getElementById('popup-route-2').getBoundingClientRect() : null;
                const p3 = document.getElementById('popup-route-3') ? document.getElementById('popup-route-3').getBoundingClientRect() : null;

                const r1 = this.direction.routes.route_1 && this.direction.routes.route_1.Geometry ? this.direction.routes.route_1.Geometry : null;
                const r2 = this.direction.routes.route_2 && this.direction.routes.route_2.Geometry ? this.direction.routes.route_2.Geometry : null;
                const r3 = this.direction.routes.route_3 && this.direction.routes.route_3.Geometry ? this.direction.routes.route_3.Geometry : null;

                // order is important, proority keep position of primary route popup
                if (p2 && p3 && overlap(p2, p3))
                {
                    rePosPopups(p2, r2, 2, p3, r3, 3);
                }

                if (p1 && p2 && overlap(p1, p2))
                {
                    rePosPopups(p1, r1, 1, p2, r2, 2);
                }

                if (p1 && p3 && overlap(p1, p3))
                {
                    rePosPopups(p1, r1, 1, p3, r3, 3);
                }
            }, 50);
        }
    };
    getMiddlePoint = (arrCoordinates, reqLength) =>
    {
        const arrCoords = this.getArrayCoordinatesWithLength(arrCoordinates, reqLength);
        if (arrCoords && arrCoords.length)
        {
            return arrCoords[arrCoords.length - 1];
        }

        return null;
    };
    getCoordinateBetweenTwoCoordinatesWithDistance = ({ X: startX, Y: startY }, { X: endX, Y: endY }, length) =>
    {
        const xDist = endX - startX;
        const yDist = endY - startY;
        const dist = this.getDistance({ X: startX, Y: startY }, { X: endX, Y: endY });
        const fractionOfTotal = length / dist;

        return {
            X: startX + xDist * fractionOfTotal,
            Y: startY + yDist * fractionOfTotal,
        };
    };

    getDistance({ X: lon1, Y: lat1 }, { X: lon2, Y: lat2 })
    {
        const R = 6371; // radius of earth, km (change this constant to get miles)
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.cos((lat1 * Math.PI) / 180), 2) * Math.pow(Math.sin(dLon / 2), 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d * 1000; // meters
    }

    getArrayCoordinatesWithLength = (arrCoordinates, reqLength, reverse) =>
    {
        let resCoordinates = [];

        if (arrCoordinates && arrCoordinates.length)
        {
            let curLength = 0;
            if (reverse)
            {
                arrCoordinates = JSON.parse(JSON.stringify(arrCoordinates)).reverse(); // need reverse because length we want is distance to end point
            }

            let lastCoord = arrCoordinates[0];
            resCoordinates.push(lastCoord);

            for (let i = 1; i < arrCoordinates.length; i++)
            {
                if (arrCoordinates[i])
                {
                    const start = { X: lastCoord[0], Y: lastCoord[1] };
                    const end = { X: arrCoordinates[i][0], Y: arrCoordinates[i][1] };

                    const lengthOfThisStep = this.getDistance(start, end);

                    if (curLength + lengthOfThisStep > reqLength)
                    {
                        const lengthOfThisStepShouldAdd = reqLength - curLength;

                        const middleCoord = this.getCoordinateBetweenTwoCoordinatesWithDistance(start, end, lengthOfThisStepShouldAdd);

                        // push middle coordinate instead of end point to limit length of path
                        resCoordinates.push([middleCoord.X, middleCoord.Y]);
                        break;
                    }
                    else // length of path still not enough required
                    {
                        lastCoord = arrCoordinates[i];
                        curLength += lengthOfThisStep;
                        resCoordinates.push(arrCoordinates[i]);
                    }
                }
            }
        }

        if (reverse)
        {
            resCoordinates = resCoordinates.reverse();
        }

        return resCoordinates;
    };
    setDirectionLocationAtHereDebounced = AwesomeDebouncePromise(this.setDirectionLocationAtHere.bind(this), 30);

    setDirectionisMarkerDraging(isDrag)
    {
        this.direction.isMarkerDraging = isDrag;
    }

    clearMarkers = (markers) =>
    {
        if (markers)
        {
            for (const m of markers)
            {
                if (m)
                {
                    m.remove();
                }
            }

            markers = null;
        }

        return markers;
    };

    renderDirectionMarkers = autorun(() =>
    {
        if (this.direction.isMarkerDraging)
        {
            return;
        }
        // add direction markers
        let activeLocations = this.direction.activeLocations;

        if (this.mapStore && this.mapStore.map)
        {
            const map = this.mapStore.map;
            this.clearMarkers(this.markers);

            if (activeLocations && activeLocations.length)
            {
                activeLocations = activeLocations.map((o) => o && o.selectedResult);

                this.markers = [];

                for (let i = 0; i < activeLocations.length; i++)
                {
                    const loc = activeLocations[i];
                    if (!loc)
                    {
                        continue;
                    }
                    const el = document.createElement('div');

                    if (i === 0)
                    {
                        // start location
                        // el.className = 'marker-direction marker-start';
                        el.className = 'marker marker-start';
                        el.innerHTML = `<i class="vbd cat-${loc.categoryCode || 1000}"></i>`;
                    }
                    else if (i === activeLocations.length - 1)
                    {
                        // end location
                        el.className = 'marker';
                        el.innerHTML = `<i class="vbd cat-${loc.categoryCode || 1000}"></i>`;
                    }
                    else // middle location
                    {
                        el.className = 'marker marker-';
                        el.innerHTML = `<i class="vbd cat-${loc.categoryCode || 1000}"></i>`;
                    }

                    const marker = new mapboxgl.Marker(el, { offset: [0, -16], draggable: true }).setLngLat([loc.longitude, loc.latitude]).addTo(map);
                    marker.locationIndex = i;
                    this.markers.push(marker);

                    marker.on('dragstart', () =>
                    {
                        this.setDirectionisMarkerDraging(true);
                    });

                    marker.on('drag', () =>
                    {
                        const lngLat = marker.getLngLat();
                        this.setDirectionLocationAtHereDebounced(marker.locationIndex, lngLat, true /* isMarkerDraging */);
                    });

                    marker.on('dragend', () =>
                    {
                        this.setDirectionisMarkerDraging(false);
                        setImmediate(() =>
                        {
                            const lngLat = marker.getLngLat();
                            this.setDirectionLocationAtHereDebounced(marker.locationIndex, lngLat, false /* isMarkerDraging */);
                        });
                    });
                }

                // map fly to first marker
                // which two active location will fit bound at updateDashPath() function
                if (activeLocations.length === 1)
                {
                    const bounds = new mapboxgl.LngLatBounds();
                    bounds.extend([activeLocations[0].longitude, activeLocations[0].latitude]);

                    this.mapStore.map.fitBounds(bounds, {
                        padding: { top: 10, bottom: 10, left: 360, right: 10 },
                        maxZoom: this.mapStore.map.getZoom(),
                    });
                }
            }
        }
    });

    async setDirectionLocationAtHere(locationIndex, point, isMarkerDraging)
    {
        if (point && point.lng && point.lat)
        {
            if (isMarkerDraging)
            {
                this.setDirectionLocation(locationIndex, {
                    latitude: point.lat,
                    longitude: point.lng,
                }, isMarkerDraging);
            }
            else
            {
                const here = await this.directionService.reverseGeocode(point.lng, point.lat);

                if (here)
                {
                    this.setDirectionLocation(locationIndex, here, isMarkerDraging);
                }
            }
        }
    }

    setDirectionPrimaryRoute(index)
    {
        const routes = this.direction.routes;
        if (routes && routes[`route_${index}`])
        {
            // swap
            const temp = routes.route_1;
            routes.route_1 = routes[`route_${index}`];
            routes[`route_${index}`] = temp;

            if (routes.route_1.Via_Distances && routes.route_1.Via_Durations)
            {
                this.direction.primaryRouteInfo = {
                    distance: routes.route_1.Via_Distances[routes.route_1.Via_Distances.length - 1],
                    duration: routes.route_1.Via_Durations[routes.route_1.Via_Durations.length - 1],
                };
            }

            this.setDirectionRoutes(routes);
        }
    }

    async reverseDirection()
    {
        if (this.direction.locations && this.direction.locations.length)
        {
            // reverse locations
            this.direction.locations = this.direction.locations.reverse();
            await this.findDirectionShortestPath();
            this.setDirectionActiveLocations(this.direction.locations);
        }
    }

    addMiddleDirectionLocation()
    {
        // always add to before destination location
        const indexAddMiddleLocation = this.direction.locations.length - 1;
        this.direction.locations.splice(indexAddMiddleLocation, 0, this.MIDDLE_LOCATION);

        // remove focusing location
        this.setDirectionLocationFocusing(null);
    }

    async removeMiddleDirectionLocation(index)
    {
        const removeLocation = this.direction.locations[index];

        // remove focusing location
        this.setDirectionLocationFocusing(null);

        // if removed location has been determined location, need recalculate shorted path
        if (removeLocation && removeLocation.selectedResult)
        {
            const keepCopyActiveLocations = JSON.stringify(this.direction.locations.filter((o) => o && o.selectedResult));

            this.direction.locations.splice(index, 1);

            const start = this.direction.locations[0];
            const end = this.direction.locations[this.direction.locations.length - 1];

            if (start && start.selectedResult && end && end.selectedResult)
            {
                await this.findDirectionShortestPath();
            }

            const currentActiveLocations = this.direction.locations.filter((o) => o && o.selectedResult);
            if (keepCopyActiveLocations !== JSON.stringify(currentActiveLocations))
            {
                this.setDirectionActiveLocations(currentActiveLocations);
            }
        }
        else
        {
            this.direction.locations.splice(index, 1);
        }
    }

    clearDirection(index = null)
    {
        // this.hideDirectionControl();

        this.setDirectionActiveLocations(null);

        this.direction.isShowDirectionControl = false;

        this.direction.locations.splice(1, this.direction.locations.length - 2); // keep start and end locations structure

        if (index === 0 || index === null)
        {
            this.clearDirectionSearchResult(0);

            if (this.direction.locations[0])
            {
                this.direction.locations[0].selectedResult = null;
                // this.direction.locations[0].selectedResult = this.MY_LOCATION;
            }
        }

        if (index === 1 || index === null)
        {
            this.clearDirectionSearchResult(1);

            if (this.direction.locations[1])
            {
                this.direction.locations[1].selectedResult = null;
            }
        }

        // this.setDirectionGuide(null);
        this.resetDirectionRoutes();
        this.clearDashPath();
        this.clearDirectionArrow();
        // this.search.showSearchResult();
    }

    renderDirectionArrow = autorun(() =>
    {
        const previewStep = this.direction.previewStep;

        const route = this.direction.routes.route_1 ? this.direction.routes.route_1 : null;

        if (route && route.Steps && route.Geometry && route.Geometry.length)
        {
            // found direction guide
            let step = null;
            if (previewStep <= route.Steps.Indices.length - 1)
            {
                step = {
                    name: route.Steps.Names[previewStep],
                    turn: route.Steps.Turns[previewStep],
                    start: route.Steps.Indices[previewStep],
                    lng: route.Geometry[route.Steps.Indices[previewStep]][0],
                    lat: route.Geometry[route.Steps.Indices[previewStep]][1],
                };
            }
            else // end point
            {
                const locations = this.direction.locations;
                const endPoint = locations[locations.length - 1] ? locations[locations.length - 1].selectedResult : null;
                if (endPoint)
                {
                    endPoint.turn = 15; // arrive icon
                    endPoint.lng = endPoint.longitude;
                    endPoint.lat = endPoint.latitude;
                    endPoint.start = -1; // destination
                    step = endPoint;
                }
            }

            if (step)
            {
                const map = this.mapStore.map;
                if (map)
                {
                    const isShowDirectionPreviewArrow = this.direction.isShowDirectionPreviewArrow;

                    if (isShowDirectionPreviewArrow)
                    {
                        // draw arrow direction
                        const fullPathCoords = this.direction.routes.route_1.Geometry;
                        this.drawDirectionArrow(fullPathCoords, step);
                        map.flyTo({ center: [step.lng, step.lat], zoom: 16 }); // need to calculate this coords, be cause center of screen need no include control UI
                    }
                    else
                    {
                        this.clearDirectionArrow();
                    }
                }
            }
        }
    });

    drawDirectionArrow = (fullPathCoords, step) =>
    {
        let arrowCoords = [];

        // start calculate array coordinates for arrow of this step
        if (step.start !== -1)
        {
            const leftCoordinates = fullPathCoords.slice(Math.max(0, step.start - 20), step.start + 1);
            const rightCoordinates = fullPathCoords.slice(step.start, Math.min(step.start + 20, fullPathCoords.length));

            // let point = rightCoordinates[0];
            // new mapboxgl.Marker().setLngLat([point[0], point[1]]).addTo(map);

            let left = 50;
            let right = 50;

            if (step.start < 5)
            {
                left = 0;
                right = 100;
            }

            const leftArrowCoordinates = this.getArrayCoordinatesWithLength(leftCoordinates, left, true /* side left */);
            const rightArrowCoordinates = this.getArrayCoordinatesWithLength(rightCoordinates, right, false /* side right */);

            arrowCoords = [...leftArrowCoordinates, ...rightArrowCoordinates];
        }
        else // destination point
        {
            // let fullPathCoords = fullPathCoords[fullPathCoords.length - 1];
            const arrCoordinates = fullPathCoords.slice(fullPathCoords.length - 40, fullPathCoords.length + 1);

            arrowCoords = this.getArrayCoordinatesWithLength(arrCoordinates, 100, 1 /* side left */);
        }

        this.drawArrow(arrowCoords);
    };

    drawArrow(coords)
    {
        const des = coords[coords.length - 1];
        const ori = coords[coords.length - 2];

        const dLon = des[0] - ori[0];
        const dLat = des[1] - ori[1];
        const angle = 180 + (Math.atan2(dLon, dLat) * 180) / Math.PI;

        this.direction.arrow = {
            coords: coords,
            angle: angle,
            des: des,
        };
    }

    clearDirectionArrow()
    {
        this.direction.arrow = {
            coords: [],
            angle: [],
            des: [],
        };
    }

    travelModeControl = {
        isOptionMenuExpand: false,
        isBarrierPanelExpand: false,
    };

    optionMenuToggle()
    {
        this.travelModeControl.isOptionMenuExpand = !this.travelModeControl.isOptionMenuExpand;
    }

    barrierPanelToggle()
    {
        this.travelModeControl.isBarrierPanelExpand = !this.travelModeControl.isBarrierPanelExpand;
    }

    // ---------------------------- barrier -------------------------- //

    barrier = {
        isOpen: false,
        listBarrier: [],
        barrierDrawTool: null,
    };

    setSelectedBarrier(i, id)
    {
        this.barrier.activeIndex = i;

        // Not support Point
        // if(this.barrier.barrierDrawTool)
        // this.barrier.barrierDrawTool.changeMode('direct_select',{featureId:id});
    }

    async addBarrier(barr)
    {
        const isExist = this.barrier.listBarrier.filter((b) => b.id === barr.id)[0];
        if (isExist)
        {
            return;
        }
        this.barrier.listBarrier.push(barr);
        await this.addBarriersToServer([barr]);
    }

    async addBarriersToServer(barrs)
    {
        for (let k = 0; k < barrs.length; k++)
        {
            const barr = barrs[k];
            let type = barr.type;
            const locs = barr.coords;
            let copyLocs = JSON.parse(JSON.stringify(locs));
            switch (type)
            {
                case 'Point':
                    type = 'point';
                    copyLocs = copyLocs.reverse().join(',');
                    break;
                case 'Polygon':
                    type = 'area';
                    for (let i = 0; i < copyLocs[0].length; i++)
                    {
                        copyLocs[0][i] = copyLocs[0][i].reverse().join(',');
                    }
                    copyLocs = copyLocs[0].join('|');
                    break;
                case 'LineString':
                    type = 'line';
                    for (let j = 0; j < copyLocs.length; j++)
                    {
                        copyLocs[j] = copyLocs[j].reverse().join(',');
                    }
                    copyLocs = copyLocs.join('|');
                    break;
                default:
            }

            await this.directionService.addBarrier(this.appStore.profile.email || Constants.BARRIER_ID_TEST, type, copyLocs);
        }
    }

    async updateBarrier(barr)
    {
        await this.removeBarrierFromServer(false).then();
        this.removeBarrier(barr.id);
        this.addBarrier(barr);
        await this.addBarriersToServer(this.barrier.listBarrier);
    }

    async removeSingleBarrier(id)
    {
        if (this.barrier.barrierDrawTool)
        {
            this.barrier.barrierDrawTool.delete(id);
        }
        await this.removeBarrierFromServer(false);
        this.removeBarrier(id);
        await this.addBarriersToServer(this.barrier.listBarrier);
    }

    async removeBarrierFromServer(isRemoveLocal)
    {
        await this.directionService.removeBarrier(this.appStore.profile.email || Constants.BARRIER_ID_TEST);
        if (isRemoveLocal)
        {
            this.barrier.listBarrier.splice(0, this.barrier.listBarrier.length);
        }
    }

    removeBarrier(id)
    {
        const list = this.barrier.listBarrier;
        const barrs = list.filter((barr) =>
        {
            return barr.id === id;
        });
        for (let i = 0; i < barrs.length; i++)
        {
            if (list.indexOf(barrs[i]) !== -1)
            {
                list.splice(list.indexOf(barrs[i]), 1);
            }
        }
        this.barrier.listBarrier = list;
    }

    onToggleBarrierManager()
    {
        this.barrier.isOpen = !this.barrier.isOpen;
        if (!this.barrier.isOpen)
        {
            this.removeBarrierFromServer();
        }
        this.barrier.listBarrier.splice(0, this.barrier.listBarrier.length);
    }
}

decorate(DirectionStore, {
    appStore: observable,
    direction: observable,
    language: observable,
    travelModeControl: observable,
    isShowDirectionRouteGuide: computed,
    adminBoundaries: observable,
    getDirectionSearchTempResult: action,
    setDirectionSearchTempResult: action,
    setDirectionLocationFocusing: action,
    clearDirectionSearchResult: action,
    clearDirect: action,
    setDirectionSearchResult: action,
    clearDirectionSearchTempResult: action,
    clearDirectionSearchText: action,
    setDirectionLocation: action,
    hideDirectionPreviewArrow: action,
    clearAdminBoundaries: action,
    setDirectionActiveLocations: action,
    resetDirectionRoutes: action,
    setDirectionRoutes: action,
    setDirectionRoutesOrder: action,
    setPreviewStep: action,
    setMyLocation: action,
    setMyLocationId: action,
    contextMenuSetDirectionAtHere: action,
    setDirectionFrom: action,
    setDirectionTo: action,
    showDirectionControl: action,
    setDirectionisMarkerDraging: action,
    setDirectionLocationAtHere: action,
    setDirectionPrimaryRoute: action,
    setDirectionLocationAtHereOnDrag: action,
    updateDashPath: action,
    setDirectionTravelMode: action,
    setDirectionRouteCriteria: action,
    showDirectionPreviewArrow: action,
    showDirectionPreviewControl: action,
    reverseDirection: action,
    removeMiddleDirectionLocation: action,
    addMiddleDirectionLocation: action,
    clearDirection: action,
    drawArrow: action,
    clearDirectionArrow: action,

    barrier: observable,
    onToggleBarrierManager: action,
    addBarrier: action,
    removeBarrier: action,
    setSelectedBarrier: action,
    optionMenuToggle: action,
    barrierPanelToggle: action,
});
