import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layer, Source, Image } from 'react-mapbox-gl';

import { Container } from '@vbd/vui';

import { Constants } from 'constant/Constants';

import DIRECTION_ARROW_IMG from 'images/direction-arrow.png';
import DIRECTION_ARROW_WHITE_IMG from 'images/direction-arrow-white.png';

const IMAGES = {
    DIRECTION_ARROW: { name: 'direction-arrow', src: DIRECTION_ARROW_IMG },
    DIRECTION_ARROW_WHITE: { name: 'direction-arrow-white', src: DIRECTION_ARROW_WHITE_IMG },
};

class DirectionManager extends Component
{
    directionStore = this.props.appStore.directionStore;

    renderArrow = () =>
    {
        return (
            <>
                {this.directionStore.direction.arrow.coords.length && (
                    <>
                        <Image
                            id={IMAGES.DIRECTION_ARROW_WHITE.name}
                            url={IMAGES.DIRECTION_ARROW_WHITE.src}
                        />
                        <Image
                            id={IMAGES.DIRECTION_ARROW.name}
                            url={IMAGES.DIRECTION_ARROW.src}
                        />
                    </>
                )}

                {/* direction arrow source */}
                <Source
                    id={Constants.DIRECTION_ARROW_BODY_LAYER_ID}
                    geoJsonSource={{
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'geometry': {
                                'coordinates': this.directionStore.direction.arrow.coords,
                                'type': 'LineString',
                            },
                        },
                    }}
                />
                <Source
                    id={Constants.DIRECTION_ARROW_HEAD_LAYER_ID}
                    geoJsonSource={{
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {
                                'angle': this.directionStore.direction.arrow.angle,
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': this.directionStore.direction.arrow.des,
                            },
                        },
                    }}
                />

                {/* arrow body border */}
                <Layer
                    type="line"
                    layout={{
                        'line-join': 'round',
                        'line-cap': 'round',
                    }}
                    minzoom={14}
                    paint={{
                        'line-width': {
                            'base': 1,
                            'stops': [
                                [14, 10],
                                [15, 11],
                                [16, 12],
                                [17, 13],
                                [18, 14],
                                [19, 15],
                                [20, 16],
                            ],
                        },
                        'line-color': Constants.ARROW_BORDER_COLOR,
                    }}
                    id={Constants.DIRECTION_ARROW_BODY_LAYER_ID + '-border'}
                    sourceId={Constants.DIRECTION_ARROW_BODY_LAYER_ID}
                />
                {/* arrow head border */}
                <Layer
                    type="symbol"
                    layout={{
                        'icon-image': IMAGES.DIRECTION_ARROW.name,
                        'icon-size': {
                            'base': 1,
                            'stops': [
                                [14, 0.2],
                                [15, 0.25],
                                [16, 0.3],
                                [17, 0.35],
                                [18, 0.4],
                                [19, 0.45],
                                [20, 0.5],
                            ],
                        },
                        'icon-allow-overlap': true,
                        'icon-rotate': ['get', 'angle'],
                        'icon-rotation-alignment': 'map',
                    }}
                    minzoom={14}
                    id={Constants.DIRECTION_ARROW_HEAD_LAYER_ID + '-border'}
                    sourceId={Constants.DIRECTION_ARROW_HEAD_LAYER_ID}
                />
                {/* arrow body */}
                <Layer
                    type="line"
                    layout={{
                        'line-join': 'round',
                        'line-cap': 'round',
                    }}
                    minzoom={14}
                    paint={{
                        'line-color': '#fff',
                        'line-width': {
                            'base': 1,
                            'stops': [
                                [14, 6],
                                [15, 7],
                                [16, 8],
                                [17, 7],
                                [18, 10],
                                [19, 11],
                                [20, 12],
                            ],
                        },
                    }}
                    id={Constants.DIRECTION_ARROW_BODY_LAYER_ID}
                    sourceId={Constants.DIRECTION_ARROW_BODY_LAYER_ID}
                />
                {/* arrow head */}
                <Layer
                    type="symbol"
                    layout={{
                        'icon-image': IMAGES.DIRECTION_ARROW_WHITE.name,
                        'icon-size': {
                            'base': 0.8,
                            'stops': [
                                [14, 0.13],
                                [15, 0.2],
                                [16, 0.24],
                                [17, 0.27],
                                [18, 0.32],
                                [19, 0.36],
                                [20, 0.38],
                            ],
                        },
                        'icon-allow-overlap': true,
                        'icon-rotate': ['get', 'angle'],
                        'icon-rotation-alignment': 'map',
                    }}
                    minzoom={14}
                    id={Constants.DIRECTION_ARROW_HEAD_LAYER_ID}
                    sourceId={Constants.DIRECTION_ARROW_HEAD_LAYER_ID}
                />
            </>
        );
    };

    renderDashPath = () =>
    {
        return (
            <>
                {/* direction dash path source */}
                <Source
                    id={Constants.DIRECTION_DASH_PATH_LAYER_ID}
                    geoJsonSource={{
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [
                                {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'LineString',
                                        'coordinates': this.directionStore.direction.dashPath.coordsStart,
                                    },
                                },
                                {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'LineString',
                                        'coordinates': this.directionStore.direction.dashPath.coordsEnd,
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
                    id={Constants.DIRECTION_DASH_PATH_LAYER_ID}
                    sourceId={Constants.DIRECTION_DASH_PATH_LAYER_ID}
                />
            </>
        );
    };

    renderDirectionPath = () =>
    {
        const routes = this.directionStore.direction.routes;

        return (
            <>
                {/* direction route */}
                {
                    Object.keys(routes).map((routeName, i) =>
                    {
                        return routes[routeName]
                            ? (
                                    <Container key={routeName}>
                                        <Source
                                            id={`${Constants.DIRECTION_LAYER_ID}_${i}`}
                                            geoJsonSource={{
                                                'type': 'geojson',
                                                'data': {
                                                    'type': 'Feature',
                                                    'geometry': {
                                                        'type': 'LineString',
                                                        'coordinates': [...routes[routeName].Geometry],
                                                    },
                                                },
                                            }}
                                        />

                                        {/* route border */}
                                        <Layer
                                            type="line"
                                            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                                            before={Constants.DIRECTION_ARROW_BODY_LAYER_ID + '-border'}
                                            paint={{
                                                'line-color': `${i !== 0 ? Constants.PATH_SECONDARY_BORDER_COLOR : Constants.PATH_PRIMARY_BORDER_COLOR}`,
                                                'line-width': {
                                                    'base': 1,
                                                    'stops': [
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
                                            id={`${Constants.DIRECTION_LAYER_ID}_${i}-border`}
                                            sourceId={`${Constants.DIRECTION_LAYER_ID}_${i}`}
                                        />
                                        {/* route body */}
                                        <Layer
                                            type="line"
                                            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                                            before={Constants.DIRECTION_ARROW_BODY_LAYER_ID + '-border'}
                                            paint={{
                                                'line-color': `${i !== 0 ? Constants.PATH_SECONDARY_COLOR : Constants.PATH_PRIMARY_COLOR}`,
                                                'line-width': {
                                                    'base': 1,
                                                    'stops': [
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
                                            id={`${Constants.DIRECTION_LAYER_ID}_${i}-body`}
                                            sourceId={`${Constants.DIRECTION_LAYER_ID}_${i}`}
                                        />
                                    </Container>
                                )
                            : <Container key={routeName} />;
                    })
                }
            </>
        );
    };

    render()
    {
        return (
            <>
                {this.renderArrow()}

                {this.renderDashPath()}

                {this.renderDirectionPath()}
            </>
        );
    }
}

DirectionManager = inject('appStore')(observer(DirectionManager));
export default DirectionManager;
