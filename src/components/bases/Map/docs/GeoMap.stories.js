import React from 'react';

import { GeoMap } from 'components/bases/Map/GeoMap';
import { GeoJSONLayer } from 'react-mapbox-gl';
import HCM from '../Boundaries/hcm.json';

export default {
    title: 'Display/Map',
    component: GeoMap,
};

const Template = (args) =>
{
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <GeoMap
                center={{ lng: 106.6029738547868, lat: 10.754634350198572 }}
                zoomLevel={[10]}
            >
                <GeoJSONLayer
                    id={'hcm'}
                    data={{
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': HCM.GeoJSON,
                            },
                        ],
                    }}
                    linePaint={{
                        'line-width': 2,
                        'line-color': '#a53b53',
                    }}
                    fillPaint={{
                        'fill-color': '#fff',
                        'fill-opacity': 0.3,
                    }}
                />
            </GeoMap>
        </div>
    );
};

export const Geo = Template.bind({});
Geo.args = {};
