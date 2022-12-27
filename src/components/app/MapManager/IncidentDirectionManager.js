import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layer, Source } from 'react-mapbox-gl';

import { Container } from '@vbd/vui';

import { Constants } from 'constant/Constants';

class IncidentDirectionManager extends Component
{
    incidentStore = this.props.appStore.incidentStore;

    render()
    {
        let routes = {};

        if (this.incidentStore.incidentDirection !== undefined)
        {
            routes = this.incidentStore.incidentDirection.routes;
        }

        return (
            <>
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
                    id={Constants.INCIDENT_DIRECTION_DASH_PATH_LAYER_ID}
                    sourceId={Constants.INCIDENT_DIRECTION_DASH_PATH_LAYER_ID}
                />
                {/* direction route */}
                {
                    Object.keys(routes).map((routeName, i) =>
                    {
                        return routes[routeName]
                            ? (
                                    <Container key={routeName}>
                                        <Source
                                            id={`${Constants.INCIDENT_DIRECTION_LAYER_ID}_${i}`}
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
                                            before={'symbol-marker-label'}
                                            paint={{
                                                'line-color': `${i !== 0 ? Constants.PATH_SECONDARY_BORDER_COLOR : Constants.INCIDENT_PATH_PRIMARY_BORDER_COLOR}`,
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
                                            id={`${Constants.INCIDENT_DIRECTION_LAYER_ID}_${i}-border`}
                                            sourceId={`${Constants.INCIDENT_DIRECTION_LAYER_ID}_${i}`}
                                        />
                                        {/* route body */}
                                        <Layer
                                            type="line"
                                            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                                            before={'symbol-marker-label'}
                                            paint={{
                                                'line-color': `${i !== 0 ? Constants.PATH_SECONDARY_COLOR : Constants.INCIDENT_PATH_PRIMARY_COLOR}`,
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
                                            id={`${Constants.INCIDENT_DIRECTION_LAYER_ID}_${i}-body`}
                                            sourceId={`${Constants.INCIDENT_DIRECTION_LAYER_ID}_${i}`}
                                        />
                                    </Container>
                                )
                            : <Container key={routeName} />;
                    })
                }
            </>
        );
    }
}

IncidentDirectionManager = inject('appStore')(observer(IncidentDirectionManager));
export default IncidentDirectionManager;
