import './HistoryMarker.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layer, Source, Image } from 'react-mapbox-gl';

import { Container } from '@vbd/vui';
import { Constants } from 'constant/Constants';

import DIRECTION_ARROW_IMG from 'images/direction-arrow.png';
import DIRECTION_ARROW_WHITE_IMG from 'images/direction-arrow-white.png';

class TrackingManager extends Component
{
    state = {
        showPopup: false
    }

    workerStore = this.props.fieldForceStore.workerStore;

    render()
    {
        const { trailings } = this.workerStore;

        // build the points from the trailings
        const trailingPoints = [];
        trailings.forEach((tracker) =>
        {
            if (!tracker || tracker.trailings.length === 0)
            {
                return;
            }

            const trail = [];
            const trailSegment = {
                color: '',
                segment: []
            };
            tracker.trailings.forEach((tp) =>
            {
                if (tp.length > 0)
                {
                    trailSegment.color = tp[0].statusColor;
                    tp.forEach(point =>
                    {
                        trailSegment.segment.push([point.lng, point.lat]);
                    });
                    trail.push(trailSegment);
                }
            });

            if (trail.length > 0)
            {
                trailingPoints.push(trail);
            }


        });

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
                {/* <Source
                    id={Constants.DIRECTION_ARROW_BODY_LAYER_ID}
                    geoJsonSource={{
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                coordinates: this.workerStore.selectedEntry.arrow.coords,
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
                                angle: this.workerStore.selectedEntry.arrow.angle,
                            },
                            geometry: {
                                type: 'Point',
                                coordinates: this.workerStore.selectedEntry
                                    .arrow.des,
                            },
                        },
                    }}
                /> */}
                {/* direction route */}
                {
                    trailings && trailingPoints &&
                    trailingPoints.map((tail, i) =>
                    {
                        return tail.map((segment, j) =>
                        {
                            return (
                                <Container key={`tracking-tail-${i}-${j}`}>
                                    <Source
                                        id={`${Constants.DIRECTION_LAYER_ID}-${i}-${j}`}
                                        geoJsonSource={{
                                            type: 'geojson',
                                            data: {
                                                type: 'Feature',
                                                geometry: {
                                                    type: 'LineString',
                                                    coordinates: [...segment.segment],
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
                                            'line-color': `${segment.color}`,
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
                                        id={`${Constants.DIRECTION_LAYER_ID}-border-${i}-${j}`}
                                        sourceId={`${Constants.DIRECTION_LAYER_ID}-${i}-${j}`}
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
                                            // 'line-color': `${Constants.PATH_PRIMARY_COLOR}`,
                                            'line-color': `${segment.color}`,
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
                                        id={`${Constants.DIRECTION_LAYER_ID}-body-${i}-${j}`}
                                        sourceId={`${Constants.DIRECTION_LAYER_ID}-${i}-${j}`}
                                    />
                                </Container>
                            );
                        });

                    })
                }
            </>
        );
    }
}

TrackingManager = inject('fieldForceStore', 'appStore')(observer(TrackingManager));
export { TrackingManager };
