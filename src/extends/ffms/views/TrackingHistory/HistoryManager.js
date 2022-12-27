import './HistoryMarker.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import { Layer, Source, Image, Marker as MapMarker, Marker } from 'react-mapbox-gl';

import { Container, FAIcon, Row, TrackingMarker } from '@vbd/vui';

import { Constants } from 'constant/Constants';
import { MapUtil } from 'components/app/Map/MapUtil';

import DIRECTION_ARROW_IMG from 'images/direction-arrow.png';
import DIRECTION_ARROW_WHITE_IMG from 'images/direction-arrow-white.png';
import GeocodeService from 'extends/ffms/services/GeocodeService';
import { HistoryPopup } from 'extends/ffms/views/TrackingHistory/HistoryPopup';

function closestPoint(number, pointArr)
{
    return pointArr.reduce((a, b) =>
    {
        return Math.abs(b.ts - number) < Math.abs(a.ts - number) ? b : a;
    });
}

function roundToHour(timestamp)
{
    const p = 60 * 60; // milliseconds in an hour

    return Math.round(timestamp / p) * p;
}

class HistoryManager extends Component
{
    state = {
        showPopup: false,
    }

    historyStore = this.props.fieldForceStore.historyStore;
    mapStore = this.props.appStore.mapStore;
    geocodeSvc = new GeocodeService();
    mapUtil = new MapUtil(this.mapStore.map);

    empTypes = undefined;
    statuses = undefined;

    handleClickMarker = async (feature, index, event) =>
    {
        const geocodeResult = await this.geocodeSvc.reverseGeocode([[feature.lng, feature.lat]]);
        const status = this.historyStore.getTrackingStatus(feature[this.historyStore.trackingSvc.TRACKING_FIELD]);
        let address = '';
        if (geocodeResult && geocodeResult.status && geocodeResult.status.code === 200 && !geocodeResult.status.message)
        {
            const { State , District , Tehsil, PinCode, Road } = geocodeResult.data[0];
            address = [State, District, Tehsil, PinCode].filter((x) => x).join(', ');
        }

        this.showPopup(index, {
            datetime: feature.ts,
            status: status,
            direction: feature.heading,
            speed: feature.speed,
            trackerId: feature.trackerId,
            coordinates: [feature.lng, feature.lat],
            address,
        });
    };

    showPopup = (index, point = null, segment = null) =>
    {
        if (!point && !segment)
        {
            return;
        }

        this.popupList = this.popupList || [];

        if (point)
        {
            // const placeholder = document.createElement('div');
            // ReactDOM.render(
            //     <HistoryPopup
            //         datetime={point.datetime}
            //         status={point.status === 1 ? 'On-duty' : 'Off-duty'}
            //         direction={point.direction}
            //         speed={point.speed}
            //         trackerId={point.trackerId}
            //         username={this.historyStore.selectedEmp.employee_username}
            //         distance={0}
            //         index={index}
            //     />, placeholder);

            // new mapboxgl.Popup({
            //     closeOnClick: true,
            //     index: index
            // })
            //     .setLngLat([point.coordinates[0], point.coordinates[1]])
            //     .setDOMContent(placeholder)
            //     .addTo(this.mapStore.map);
            this.historyStore.setCurrentSelectedPoint({ ...point, index });

            this.setState({
                showPopup: !this.state.showPopup,
            });
        }
        else if (segment)
        {
            let middlePoint;
            if (this.selectedEntry.routes && this.selectedEntry.routes.length > 0)
            {
                middlePoint = this.selectedEntry.routes[Math.round(this.selectedEntry.routes.length / 2)];
            }

            if (middlePoint && middlePoint[0] && middlePoint[1])
            {
                /* Commented this, haven't figured out the logic behind segment seperation yet. */

                // const distance = segment.distance;
                // const duration = segment.duration;

                // new mapboxgl.Popup({
                //     closeOnClick: false,
                //     index: index
                // })
                //     .setLngLat([middlePoint[0], middlePoint[1]]) // middlePoint not work
                //     .setHTML(`<div id="history-popup-segment-${index}"
                //                 class="popup-route ${index === 1 ? 'active' : ''}"
                //                 atr-route-index="${index}">
                //                 <div class="popup-route-header">
                //                     <div class="ml-icon ml-icon-car"></div>
                //                     <span class="popup-marker-duration">${this.getFormatDuration(duration, false)}</span>
                //                 </div>
                //                 <div class="popup-route-detail">
                //                     ${this.getFormatDistance(distance)}
                //                 </div>
                //             </div>`)
                //     .addTo(this.mapStore.map);
            }
        }

    };

    render()
    {
        const { selectedEntry, sliderHandle } = this.historyStore;
        const routes = selectedEntry.routes;
        const displayData = selectedEntry.displayData;
        let separatedRoutes = [];
        const dashPoints = [];
        let routeHourPoints = [];
        let handleMarker = null;
        // const lastPoint = displayData[displayData.length - 1];

        // Separate paths that have idle time between them
        if (displayData && displayData.length > 0)
        {
            separatedRoutes = [[[displayData[0].lng, displayData[0].lat]]];
            const rawHourPoints = [[displayData[0]]];
            let currentRoute = separatedRoutes[0];
            let currentHourSegment = rawHourPoints[0];
            for (let i = 1; i < displayData.length; i += 1)
            {
                const distanceBetween = this.mapUtil.getDistance({ X: displayData[i].lng, Y: displayData[i].lat }, { X: displayData[i - 1].lng, Y: displayData[i - 1].lat });
                const timeBetween = Math.abs(displayData[i].ts - displayData[i - 1].ts);

                if ((distanceBetween / timeBetween) > 80 || timeBetween > 301)
                {
                    const newLength = separatedRoutes.push([[displayData[i].lng, displayData[i].lat]]);
                    currentHourSegment.push(displayData[i - 1]);
                    const newSegment = rawHourPoints.push([displayData[i]]);
                    currentRoute = separatedRoutes[newLength - 1];
                    currentHourSegment = rawHourPoints[newSegment - 1];
                    dashPoints.push([
                        [displayData[i - 1].lng, displayData[i - 1].lat],
                        [displayData[i].lng, displayData[i].lat],
                    ]);
                }
                else
                {
                    currentRoute.push([displayData[i].lng, displayData[i].lat]);
                    currentHourSegment.push(displayData[i]);
                }
            }
            // hourPoints.push(lastPoint);

            // Now, build the o'clock mark points on individual routes.
            const hourPoints = [];
            rawHourPoints.forEach(segment =>
            {
                const firstPoint = segment[0];
                const lastPoint = segment[segment.length - 1];

                const points = [firstPoint];

                let nearestOClock = roundToHour(firstPoint.ts);
                while (nearestOClock <= lastPoint.ts)
                {
                    const nextPoint = closestPoint(nearestOClock, displayData);
                    if (nextPoint.ts === firstPoint.ts)
                    {
                        nearestOClock += 3600;
                    }
                    else
                    {
                        // nextPoint.oClockTime = nearestOClock;
                        points.push(nextPoint);

                        nearestOClock += 3600;
                    }
                }
                points.push(lastPoint);
                hourPoints.push(points);
            });
            routeHourPoints = hourPoints;

            // console.log(routeHourPoints);
            // console.log(separatedRoutes);
            // console.log(dashPoints);


            // Load handle information into the path simulation marker
            if (sliderHandle)
            {
                // Find the location of the time-series position of the current marker.

                const point = closestPoint(sliderHandle.valueOf() / 1000, displayData);

                // console.log(moment(sliderHandle.valueOf()).format('DD/MM/YYYY HH:mm:ss'), moment(point.ts * 1000).format('DD/MM/YYYY HH:mm:ss'));
                handleMarker = {
                    id: 'history-sim-marker',
                    icon: point.trackerTypeIcon || 'user',
                    color: point.statusColor || 'darkgray',
                    size: 30,
                    heading: point.heading,
                    isNotify: false,
                    lng: point.lng,
                    lat: point.lat,
                    typeMarker: 'solid',
                };
                this.historyStore.handlePoint = point;
            }
        }

        // Mark 1-hour increment points on the route
        // let routeHourPoints = [];
        // const firstPoint = displayData[0];
        // const lastPoint = displayData[displayData.length - 1];
        // if (firstPoint && lastPoint)
        // {
        //     const points = [firstPoint];

        //     let nearestOClock = roundToHour(firstPoint.ts);
        //     while (nearestOClock <= lastPoint.ts)
        //     {
        //         const nextPoint = closestPoint(nearestOClock, displayData);
        //         nextPoint.ts = nearestOClock;
        //         points.push(nextPoint);

        //         nearestOClock += 3600;
        //         console.log(nearestOClock);
        //     }
        //     points.push(lastPoint);
        //     routeHourPoints = points;
        // }
        // console.log(routeHourPoints);

        const IMAGES = {
            DIRECTION_ARROW: {
                name: 'direction-arrow',
                src: DIRECTION_ARROW_IMG,
            },
            DIRECTION_ARROW_WHITE: {
                name: 'direction-arrow-white',
                src: DIRECTION_ARROW_WHITE_IMG,
            },
        };

        const features = [];

        const trackerPath = routeHourPoints.reduce((all, segment, i) =>
        {
            const segmentMarkers = [];
            segment.forEach((feature, j) =>
            {
                const nearestOClock = roundToHour(feature.ts);
                let segmentStartClass = '';
                let segmentEndClass = '';
                if (j === 0)
                {
                    segmentStartClass = i === 0 ? 'start-route' : 'start';
                }
                if (j === segment.length - 1)
                {
                    segmentEndClass = i === routeHourPoints.length - 1 ? 'end-route' : 'end';
                }

                segmentMarkers.push(
                    <MapMarker
                        key={`history-marker-${i}-${j}`}
                        style={{ cursor: 'hand' }}
                        coordinates={[feature.lng, feature.lat]}
                        anchor="bottom"
                        onClick={(e) => this.handleClickMarker(feature, `${i + 1}-${j + 1}`, e)}
                    >
                        <Container
                            className={`tracking-stop-marker ${segmentStartClass}  ${segmentEndClass}`}
                        >
                            <Row
                                itemMargin={'sm'}
                                crossAxisAlignment={'center'}
                            >
                                <FAIcon
                                    icon={'circle'}
                                    size={'0.5rem'}
                                    type={'solid'}
                                    color={feature.statusColor}
                                />
                                {
                                    (j === 0 || j === segment.length - 1) ? moment(feature.ts * 1000).format('HH:mm') : moment(nearestOClock * 1000).format('HH:mm')
                                }
                            </Row>
                        </Container>
                    </MapMarker>,

                );
            });
            all.push(...segmentMarkers);
            return all;
        }, []);
        features.push(...trackerPath);

        const currentPoint = this.historyStore.currentSelectedPoint;

        return (
            <>
                <Image
                    id={IMAGES.DIRECTION_ARROW_WHITE.name}
                    url={IMAGES.DIRECTION_ARROW_WHITE.src}
                />
                <Image
                    id={IMAGES.DIRECTION_ARROW.name}
                    url={IMAGES.DIRECTION_ARROW.src}
                />

                {/* direction arrow source */}
                <Source
                    id={Constants.DIRECTION_ARROW_BODY_LAYER_ID}
                    geoJsonSource={{
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                coordinates: this.historyStore.selectedEntry.arrow.coords,
                                type: 'LineString',
                            },
                        },
                    }}
                />
                <Source
                    id={Constants.DIRECTION_ARROW_HEAD_LAYER_ID}
                    geoJsonSource={{
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {
                                angle: this.historyStore.selectedEntry.arrow.angle,
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: this.historyStore.selectedEntry
                                    .arrow.des,
                            },
                        },
                    }}
                />
                {/* direction dash path source */}
                {
                    dashPoints.length > 0 &&
                    dashPoints.map((dashPath, i) =>
                    {
                        return (<Container key={`dash-path-${i}`}>
                            <Source
                                id={`${Constants.DIRECTION_DASH_PATH_LAYER_ID}-${i}`}
                                geoJsonSource={{
                                    'type': 'geojson',
                                    'data': {
                                        'type': 'FeatureCollection',
                                        'features': [
                                            {
                                                'type': 'Feature',
                                                'geometry': {
                                                    'type': 'LineString',
                                                    'coordinates': dashPath,
                                                },
                                            },
                                        ],
                                    },
                                }}
                            />
                            {/* direction dash path */}
                            <Layer
                                type="line"
                                layout={{
                                    'line-join': 'round',
                                    'line-cap': 'square',
                                }}
                                paint={{
                                    'line-color': Constants.DASH_PATH_COLOR,
                                    'line-width': 5,
                                    'line-dasharray': [0.8, 0.6],
                                }}
                                id={`${Constants.DIRECTION_DASH_PATH_LAYER_ID}-${i}`}
                                sourceId={`${Constants.DIRECTION_DASH_PATH_LAYER_ID}-${i}`}
                            />
                        </Container>);
                    })
                }
                {/* direction route */}
                {
                    routes &&
                    separatedRoutes.map((route, i) =>
                    {
                        return (
                            <Container key={`history-route-${i}`}>
                                <Source
                                    id={`${Constants.DIRECTION_LAYER_ID}-${i}`}
                                    geoJsonSource={{
                                        type: 'geojson',
                                        data: {
                                            type: 'Feature',
                                            geometry: {
                                                type: 'LineString',
                                                coordinates: [...route],
                                            },
                                        },
                                    }}
                                />

                                {/* route border */}
                                <Layer
                                    type="line"
                                    layout={{
                                        'line-cap': 'round',
                                        'line-join': 'round',
                                    }}
                                    before={
                                        Constants.DIRECTION_ARROW_BODY_LAYER_ID +
                                    '-border'
                                    }
                                    paint={{
                                        'line-color': `${Constants.PATH_PRIMARY_BORDER_COLOR}`,
                                        'line-width': {
                                            base: 1,
                                            stops: [
                                                [13, 8],
                                                [14, 9],
                                                [15, 10],
                                                [16, 11],
                                                [17, 12],
                                                [18, 13],
                                                [19, 14],
                                                [20, 15],
                                            ],
                                        },
                                    }}
                                    id={`${Constants.DIRECTION_LAYER_ID}-border-${i}`}
                                    sourceId={`${Constants.DIRECTION_LAYER_ID}-${i}`}
                                />
                                {/* route body */}
                                <Layer
                                    type="line"
                                    layout={{
                                        'line-cap': 'round',
                                        'line-join': 'round',
                                    }}
                                    before={
                                        Constants.DIRECTION_ARROW_BODY_LAYER_ID +
                                    '-border'
                                    }
                                    paint={{
                                        'line-color': `${Constants.PATH_PRIMARY_COLOR}`,
                                        'line-width': {
                                            base: 1,
                                            stops: [
                                                [13, 5],
                                                [14, 6],
                                                [15, 7],
                                                [16, 8],
                                                [17, 9],
                                                [18, 10],
                                                [19, 11],
                                                [20, 12],
                                            ],
                                        },
                                    }}
                                    id={`${Constants.DIRECTION_LAYER_ID}-body-${i}`}
                                    sourceId={`${Constants.DIRECTION_LAYER_ID}-${i}`}
                                />
                            </Container>
                        );
                    })
                }
                {/* Route points */}
                {features}

                {
                    this.state.showPopup && this.historyStore.currentSelectedPoint && (
                        <HistoryPopup
                            timestamp={currentPoint.datetime}
                            status={currentPoint.status}
                            direction={currentPoint.direction}
                            speed={currentPoint.speed}
                            trackerId={currentPoint.trackerId}
                            username={this.historyStore.selectedEmp.employee_username}
                            distance={0}
                            address={currentPoint.address}
                            coordinates={[currentPoint.coordinates[0], currentPoint.coordinates[1]]}
                            index={currentPoint.index}
                        />
                    )
                }

                {/* Tracking handle - use for simulation */}
                {
                    handleMarker &&
                    <Marker
                        key={'history-sim-marker'}
                        coordinates={[handleMarker.lng, handleMarker.lat]}
                        offset={[0, (handleMarker.size || 48) / 2]}
                        anchor="bottom"
                    >
                        <TrackingMarker
                            {...handleMarker}
                        />
                    </Marker>
                }
            </>
        );
    }
}

HistoryManager = inject('fieldForceStore', 'appStore')(observer(HistoryManager));
export default HistoryManager;
