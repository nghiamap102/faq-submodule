import React from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import { Constants } from 'extends/ffms/constant/Constants';

let AdministrativeLayers = props =>
{
    const abStore = props.fieldForceStore.adminBoundaryStore;

    const buildGeoPostal = () =>
    {
        if (!abStore.enablePostal)
        {
            return [];
        }

        const selected = abStore.postalsSelected;
        const getShow = (item) => !item.hide;
        const reduceGetGeo = (coords, postal) =>
        {
            try
            {
                const coordData = JSON.parse(postal.Shape);

                if (coordData)
                {
                    const coordinates = coordData.type === 'Polygon' ?
                        [coordData.coordinates] : coordData.coordinates;
                    return [...coords, ...coordinates];
                }
            }
            catch (error)
            {
                console.error(error);
            }
        
        };
        
        const coordinates = selected.filter(getShow).reduce(reduceGetGeo, []);
        return coordinates;
    };
    
    return (
        <>
            <GeoJSONLayer
                id={Constants.ADMINISTRATIVE_BOUNDARIES_LAYER_ID}
                data={{
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': abStore.mainArea?.type || 'Polygon',
                                'coordinates': abStore.mainArea?.data || [],
                            },
                        },
                    ],
                }}
                linePaint={{
                    'line-width': Constants.ADMINISTRATIVE_BOUNDARIES_OUTLINE_WIDTH,
                    'line-color': Constants.ADMINISTRATIVE_BOUNDARIES_OUTLINE_COLOR,
                }}
                fillPaint={{
                    'fill-color': Constants.ADMINISTRATIVE_BOUNDARIES_POLYGON_COLOR,
                    'fill-opacity': Constants.ADMINISTRATIVE_BOUNDARIES_POLYGON_OPACITY,
                }}
            />

          
            <GeoJSONLayer
                id={Constants.WARD_BOUNDARIES_LAYER_ID}
                data={{
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': abStore.wardArea?.type || 'Polygon',
                                'coordinates': abStore.wardArea?.data || [],
                            },
                        },
                    ],
                }}
                linePaint={{
                    'line-width': Constants.WARD_BOUNDARIES_OUTLINE_WIDTH,
                    'line-color': Constants.WARD_BOUNDARIES_OUTLINE_COLOR,
                }}
                fillPaint={{
                    'fill-color': Constants.WARD_BOUNDARIES_POLYGON_COLOR,
                    'fill-opacity': Constants.WARD_BOUNDARIES_POLYGON_OPACITY,
                }}
            />

            <GeoJSONLayer
                id={Constants.POSTAL_CODE_BOUNDARIES_LAYER_ID}
                data={{
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'MultiPolygon',
                                'coordinates': buildGeoPostal() || [],
                            },
                        },
                    ],
                }}
                linePaint={{
                    'line-width': Constants.POSTAL_CODE_BOUNDARIES_OUTLINE_WIDTH,
                    'line-color': Constants.POSTAL_CODE_BOUNDARIES_POLYGON_COLOR,
                }}
                fillPaint={{
                    'fill-color': Constants.POSTAL_CODE_BOUNDARIES_OUTLINE_COLOR,
                    'fill-opacity': Constants.POSTAL_CODE_BOUNDARIES_POLYGON_OPACITY,
                }}
            />
        </>
    );
};

AdministrativeLayers.prototype = {
    map: PropTypes.any,
    areaMain: PropTypes.object,
    areaPostal: PropTypes.object,

};

AdministrativeLayers = inject('appStore', 'fieldForceStore')(observer(AdministrativeLayers));
export default AdministrativeLayers;
