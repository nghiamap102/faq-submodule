import mapboxgl from 'mapbox-gl';

import { Constants } from 'constant/Constants';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter';
import { BufferOp } from 'jsts/org/locationtech/jts/operation/buffer';

class MapUtil
{
    sources = {};

    constructor(map)
    {
        this.map = map;
    }

    initBufferLayers = () =>
    {
        this.clearSourceData(Constants.LINES_BUFFER_LAYER_ID);
        this.clearSourceData(Constants.POINTS_BUFFER_LAYER_ID);
        this.initAdvanceSearchLinesBuffer();
        this.initAdvanceSearchPointsBuffer();
    };

    initGeofenceLayers = () =>
    {
        this.clearSourceData(Constants.GEOFENCE_LINES_BUFFER_LAYER_ID);
        this.clearSourceData(Constants.GEOFENCE_POINTS_BUFFER_LAYER_ID);
        this.initGeofenceLinesBuffer();
        this.initGeofencePointsBuffer();
    };

    initBlockadeLayers = () =>
    {
        this.clearSourceData(Constants.BLOCKADE_LINES_BUFFER_LAYER_ID);
        this.clearSourceData(Constants.BLOCKADE_POINTS_BUFFER_LAYER_ID);
        this.initBlockadeLinesBuffer();
        this.initBlockadePointsBuffer();
    };

    initAdvanceSearchLinesBuffer = () =>
    {
        this.initSource(Constants.LINES_BUFFER_LAYER_ID);

        this.addLayerBelowLabel({
            'id': Constants.LINES_BUFFER_LAYER_ID,
            'type': 'fill',
            'source': Constants.LINES_BUFFER_LAYER_ID,
            'layout': {},
            'paint': {
                'fill-color':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'color'], null], false],
                        ['feature-state', 'color'],
                        ['get', 'color']
                    ],
                'fill-opacity':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'polygonOpacity'], null], false],
                        ['feature-state', 'polygonOpacity'],
                        ['get', 'polygonOpacity']
                    ]
            }
        });
    };

    initAdvanceSearchPointsBuffer = () =>
    {
        this.initSource(Constants.POINTS_BUFFER_LAYER_ID);

        this.addLayerBelowLabel({
            'id': Constants.POINTS_BUFFER_LAYER_ID,
            'type': 'fill',
            'source': Constants.POINTS_BUFFER_LAYER_ID,
            'layout': {},
            'paint': {
                'fill-color':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'color'], null], false],
                        ['feature-state', 'color'],
                        ['get', 'color']
                    ],
                'fill-opacity':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'polygonOpacity'], null], false],
                        ['feature-state', 'polygonOpacity'],
                        ['get', 'polygonOpacity']
                    ]
            }
        });
    };

    // init layer Geofence
    initGeofenceLinesBuffer = () =>
    {
        this.initSource(Constants.GEOFENCE_LINES_BUFFER_LAYER_ID);

        this.addLayerBelowLabel({
            'id': Constants.GEOFENCE_LINES_BUFFER_LAYER_ID,
            'type': 'fill',
            'source': Constants.GEOFENCE_LINES_BUFFER_LAYER_ID,
            'layout': {},
            'paint': {
                'fill-color':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'color'], null], false],
                        ['feature-state', 'color'],
                        ['get', 'color']
                    ],
                'fill-opacity':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'polygonOpacity'], null], false],
                        ['feature-state', 'polygonOpacity'],
                        ['get', 'polygonOpacity']
                    ]
            }
        });
    };

    initGeofencePointsBuffer = () =>
    {
        this.initSource(Constants.GEOFENCE_POINTS_BUFFER_LAYER_ID);

        this.addLayerBelowLabel({
            'id': Constants.GEOFENCE_POINTS_BUFFER_LAYER_ID,
            'type': 'fill',
            'source': Constants.GEOFENCE_POINTS_BUFFER_LAYER_ID,
            'layout': {},
            'paint': {
                'fill-color':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'color'], null], false],
                        ['feature-state', 'color'],
                        ['get', 'color']
                    ],
                'fill-opacity':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'polygonOpacity'], null], false],
                        ['feature-state', 'polygonOpacity'],
                        ['get', 'polygonOpacity']
                    ]
            }
        });
    };

    // init layer Blockade
    initBlockadeLinesBuffer = () =>
    {
        this.initSource(Constants.BLOCKADE_LINES_BUFFER_LAYER_ID);

        this.addLayerBelowLabel({
            'id': Constants.BLOCKADE_LINES_BUFFER_LAYER_ID,
            'type': 'fill',
            'source': Constants.BLOCKADE_LINES_BUFFER_LAYER_ID,
            'layout': {},
            'paint': {
                'fill-color':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'color'], null], false],
                        ['feature-state', 'color'],
                        ['get', 'color']
                    ],
                'fill-opacity':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'polygonOpacity'], null], false],
                        ['feature-state', 'polygonOpacity'],
                        ['get', 'polygonOpacity']
                    ]
            }
        });
    };

    initBlockadePointsBuffer = () =>
    {
        this.initSource(Constants.BLOCKADE_POINTS_BUFFER_LAYER_ID);

        this.addLayerBelowLabel({
            'id': Constants.BLOCKADE_POINTS_BUFFER_LAYER_ID,
            'type': 'fill',
            'source': Constants.BLOCKADE_POINTS_BUFFER_LAYER_ID,
            'layout': {},
            'paint': {
                'fill-color':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'color'], null], false],
                        ['feature-state', 'color'],
                        ['get', 'color']
                    ],
                'fill-opacity':
                    ['case',
                        ['boolean', ['!=', ['feature-state', 'polygonOpacity'], null], false],
                        ['feature-state', 'polygonOpacity'],
                        ['get', 'polygonOpacity']
                    ]
            }
        });
    };


    drawMyMapOnDragObjectTypeLines = (coords, color) =>
    {
        const data = {
            'type': 'Feature',
            'properties': {
                'color': color
            },
            'geometry': {
                'type': 'LineString',
                'coordinates': coords
            }
        };

        this.setSourceData(Constants.DRAG_MAP_OBJECT_LINE_LAYER_ID, data);
    };

    drawMyMapObjectTypePolygons = (polygons) =>
    {
        if (polygons && polygons.length)
        {
            const features = [];

            for (const polygon of polygons)
            {
                const feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coords]
                    },
                    'properties': {
                        'mapObjectId': polygon.mapObject.id,
                        'color': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.color !== undefined) ?
                            polygon.mapObject.customStyle.color : Constants.MAP_OBJECT_POLYGON_COLOR,
                        'polygonOpacity': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.polygonOpacity !== undefined) ?
                            parseFloat(polygon.mapObject.customStyle.polygonOpacity) : Constants.MAP_OBJECT_POLYGON_OPACITY
                    }
                };

                features.push(feature);
            }

            const data = {
                'type': 'FeatureCollection',
                'features': features
            };

            this.setSourceData(Constants.MAP_OBJECT_POLYGONS_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.MAP_OBJECT_POLYGONS_LAYER_ID);
        }
    };

    drawMyMapObjectTypeGeofencePolygons = (polygons) =>
    {
        if (polygons && polygons.length)
        {
            const features = [];

            for (const polygon of polygons)
            {
                const feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coords]
                    },
                    'properties': {
                        'mapObjectId': polygon.mapObject.id,
                        'color': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.color !== undefined) ?
                            polygon.mapObject.customStyle.color : Constants.MAP_OBJECT.MAP_OBJECT_GEOFENCE_POLYGON_COLOR,
                        'polygonOpacity': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.polygonOpacity !== undefined) ?
                            parseFloat(polygon.mapObject.customStyle.polygonOpacity) : Constants.MAP_OBJECT_POLYGON_OPACITY
                    }
                };

                features.push(feature);
            }

            const data = {
                'type': 'FeatureCollection',
                'features': features
            };

            this.setSourceData(Constants.MAP_OBJECT_GEOFENCE_POLYGONS_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.MAP_OBJECT_GEOFENCE_POLYGONS_LAYER_ID);
        }
    };

    drawMapObjectTypeLinesBuffer = (polygons) =>
    {
        if (polygons && polygons.length)
        {
            const features = [];

            for (const polygon of polygons)
            {
                const feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coords]
                    },
                    'properties': {
                        'mapObjectId': polygon.mapObject.id,
                        'color': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.color !== undefined) ?
                            polygon.mapObject.customStyle.color : Constants.MAP_OBJECT_POLYGON_COLOR,
                        'polygonOpacity': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.polygonOpacity !== undefined) ?
                            parseFloat(polygon.mapObject.customStyle.polygonOpacity) : Constants.MAP_OBJECT_POLYGON_OPACITY
                    }
                };

                features.push(feature);
            }

            const data = {
                'type': 'FeatureCollection',
                'features': features
            };

            this.setSourceData(Constants.LINES_BUFFER_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.LINES_BUFFER_LAYER_ID);
        }
    };

    drawMapObjectTypePointsBuffer = (polygons) =>
    {
        if (polygons && polygons.length)
        {
            const features = [];

            for (const polygon of polygons)
            {
                const feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coords]
                    },
                    'properties': {
                        'mapObjectId': polygon.mapObject.id,
                        'color': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.color !== undefined) ?
                            polygon.mapObject.customStyle.color : Constants.MAP_OBJECT_POLYGON_COLOR,
                        'polygonOpacity': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.polygonOpacity !== undefined) ?
                            parseFloat(polygon.mapObject.customStyle.polygonOpacity) : Constants.MAP_OBJECT_POLYGON_OPACITY
                    }
                };

                features.push(feature);
            }

            const data = {
                'type': 'FeatureCollection',
                'features': features
            };

            this.setSourceData(Constants.POINTS_BUFFER_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.POINTS_BUFFER_LAYER_ID);
        }
    };

    // drawGeofence
    drawGeofenceLinesBuffer = (polygons) =>
    {
        if (polygons && polygons.length)
        {
            const features = [];

            for (const polygon of polygons)
            {
                const feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coords]
                    },
                    'properties': {
                        'mapObjectId': polygon.mapObject.id,
                        'color': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.color !== undefined) ?
                            polygon.mapObject.customStyle.color : Constants.MAP_OBJECT_GEOFENCE_POLYGON_COLOR,
                        'polygonOpacity': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.polygonOpacity !== undefined) ?
                            parseFloat(polygon.mapObject.customStyle.polygonOpacity) : Constants.MAP_OBJECT_POLYGON_OPACITY
                    }
                };

                features.push(feature);
            }

            const data = {
                'type': 'FeatureCollection',
                'features': features
            };

            this.setSourceData(Constants.GEOFENCE_LINES_BUFFER_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.GEOFENCE_LINES_BUFFER_LAYER_ID);
        }
    };

    drawGeofencePointsBuffer = (polygons) =>
    {
        if (polygons && polygons.length)
        {
            const features = [];

            for (const polygon of polygons)
            {
                const feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coords]
                    },
                    'properties': {
                        'mapObjectId': polygon.mapObject.id,
                        'color': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.color !== undefined) ?
                            polygon.mapObject.customStyle.color : Constants.MAP_OBJECT_GEOFENCE_POLYGON_COLOR,
                        'polygonOpacity': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.polygonOpacity !== undefined) ?
                            parseFloat(polygon.mapObject.customStyle.polygonOpacity) : Constants.MAP_OBJECT_POLYGON_OPACITY
                    }
                };

                features.push(feature);
            }

            const data = {
                'type': 'FeatureCollection',
                'features': features
            };

            this.setSourceData(Constants.GEOFENCE_POINTS_BUFFER_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.GEOFENCE_POINTS_BUFFER_LAYER_ID);
        }
    };

    // drawBlockade
    drawBlockadeLinesBuffer = (polygons) =>
    {
        if (polygons && polygons.length)
        {
            const features = [];

            for (const polygon of polygons)
            {
                const feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coords]
                    },
                    'properties': {
                        'mapObjectId': polygon.mapObject.id,
                        'color': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.color !== undefined) ?
                            polygon.mapObject.customStyle.color : Constants.MAP_OBJECT_BLOCKADE_POLYGON_COLOR,
                        'polygonOpacity': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.polygonOpacity !== undefined) ?
                            parseFloat(polygon.mapObject.customStyle.polygonOpacity) : Constants.MAP_OBJECT_BLOCKADE_POLYGON_OPACITY
                    }
                };

                features.push(feature);
            }

            const data = {
                'type': 'FeatureCollection',
                'features': features
            };

            this.setSourceData(Constants.BLOCKADE_LINES_BUFFER_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.BLOCKADE_LINES_BUFFER_LAYER_ID);
        }
    };

    drawBlockadePointsBuffer = (polygons) =>
    {
        if (polygons && polygons.length)
        {
            const features = [];

            for (const polygon of polygons)
            {
                const feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [polygon.coords]
                    },
                    'properties': {
                        'mapObjectId': polygon.mapObject.id,
                        'color': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.color !== undefined) ?
                            polygon.mapObject.customStyle.color : Constants.MAP_OBJECT_BLOCKADE_POLYGON_COLOR,
                        'polygonOpacity': (polygon.mapObject.customStyle && polygon.mapObject.customStyle.polygonOpacity !== undefined) ?
                            parseFloat(polygon.mapObject.customStyle.polygonOpacity) : Constants.MAP_OBJECT_BLOCKADE_POLYGON_OPACITY
                    }
                };

                features.push(feature);
            }

            const data = {
                'type': 'FeatureCollection',
                'features': features
            };

            this.setSourceData(Constants.BLOCKADE_POINTS_BUFFER_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.BLOCKADE_POINTS_BUFFER_LAYER_ID);
        }
    };

    drawMyMapDrawingObjectTypeLines = (coords) =>
    {
        const data = {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'LineString',
                'coordinates': coords
            }
        };

        this.setSourceData(Constants.DRAWING_MAP_OBJECT_LINE_LAYER_ID, data);
    };


    clearMapObjectPopup = (popup) =>
    {
        if (popup)
        {
            popup.remove();
        }

        return null;
    };

    initSource = (sourceId) =>
    {
        const source = this.map.getSource(sourceId);
        if (!source)
        {
            this.clearSourceData(sourceId);
        }
    };

    clearAllSourceExcept = (exceptSourceIds) =>
    {
        for (const sourceId in this.sources)
        {
            if (!exceptSourceIds || !exceptSourceIds.includes(sourceId))
            {
                this.clearSourceData(sourceId);
            }
        }
    };

    clearSourceData = (sourceId) =>
    {
        const emptyData = {
            'type': 'FeatureCollection',
            'features': []
        };
        this.setSourceData(sourceId, emptyData);
    };

    setSourceData = (sourceId, data) =>
    {
        const source = this.map.getSource(sourceId);
        if (!source)
        {
            this.map.addSource(sourceId, { 'type': 'geojson', 'data': data, 'generateId': true });
        }
        else
        {
            source.setData(data);
        }

        this.sources[sourceId] = data;
    };

    drawCircleSearchNearbyLayer = (centerCoords, radius) =>
    {
        if (centerCoords && centerCoords.length && radius)
        {
            const data = this.createGeoJSONCircle(centerCoords, radius);

            this.setSourceData(Constants.CIRCLE_SEARCH_NEAR_BY_LAYER_ID, data);
        }
        else
        {
            this.clearSourceData(Constants.CIRCLE_SEARCH_NEAR_BY_LAYER_ID);
        }
    };

    createGeoJSONCircle = (center, radiusInMeters, points) =>
    {
        if (!points)
        {
            points = 64;
        }

        const coords = {
            latitude: center[1],
            longitude: center[0]
        };

        const km = radiusInMeters / 1000;

        const ret = [];
        const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
        const distanceY = km / 110.574;

        let theta, x, y;
        for (let i = 0; i < points; i++)
        {
            theta = (i / points) * (2 * Math.PI);
            x = distanceX * Math.cos(theta);
            y = distanceY * Math.sin(theta);

            ret.push([coords.longitude + x, coords.latitude + y]);
        }
        ret.push(ret[0]);

        return {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [ret]
            }
        };
    };

    getBoundsPadding = (padding) =>
    {
        const bounds = this.map.getBounds();

        if (padding)
        {
            const tr = this.map.project(bounds._ne);
            const bl = this.map.project(bounds._sw);

            if (typeof padding === 'object')
            {
                tr.x -= padding.right;
                tr.y += padding.top;
                bl.x += padding.left;
                bl.y -= padding.bottom;
            }
            else
            {
                tr.x -= padding;
                tr.y += padding;
                bl.x += padding;
                bl.y -= padding;
            }

            bounds._ne = this.map.unproject(tr);
            bounds._sw = this.map.unproject(bl);
        }

        return bounds;
    };

    isPointInBounds = (point, padding) =>
    {
        const bounds = this.getBoundsPadding(padding);

        const lng = (point.lng - bounds._ne.lng) * (point.lng - bounds._sw.lng) < 0;
        const lat = (point.lat - bounds._ne.lat) * (point.lat - bounds._sw.lat) < 0;
        return lng && lat;
    };

    addLayerBelowLabel = (data) =>
    {
        const layers = this.map.getStyle().layers;

        // Find the index of the first symbol layer in the map style
        const symbolLayer = layers.find((l) => l.type === 'symbol');

        if (symbolLayer)
        {
            // Insert the layer beneath the first symbol layer.
            this.map.addLayer(data, symbolLayer.id);
        }
        else
        {
            this.map.addLayer(data);
        }
    };

    pointsToCoords(points)
    {
        return points.map((o) =>
        {
            return [o.longitude, o.latitude];
        });
    }

    getBufferCoords(obj, radius)
    {
        if (!radius)
        {
            radius = 100;
        }
        const reader = new GeoJSONReader();
        const writer = new GeoJSONWriter();

        const r = reader.read(obj);
        const bf = BufferOp.bufferOp(r, radius / 111128.0); // 1 degree of latitude = 111,128 meters -> convert radius from degree to meters
        const w = writer.write(bf);

        if (obj.type === Constants.MAP_OBJECT.MARKER)
        {
            return w.coordinates;
        }

        return w.coordinates[0];
    }

    getMapObjectType(geometry)
    {
        switch (geometry.type)
        {
            case 'Point':
                return Constants.MAP_OBJECT.MARKER;
            case 'Polygon':
                return Constants.MAP_OBJECT.POLYGON;
            case 'LineString':
                return Constants.MAP_OBJECT.LINES;
            default:
                return Constants.MAP_OBJECT.POINTER;
        }
    }

    getDistance({ X: lon1, Y: lat1 }, { X: lon2, Y: lat2 })
    {
        const R = 6371; // radius of earth, km (change this constant to get miles)
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.pow(Math.sin(dLat / 2), 2) +
            Math.pow(Math.cos(lat1 * Math.PI / 180), 2) *
            Math.pow(Math.sin(dLon / 2), 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d * 1000; // meters
    }

    getTotalDistanceWithCoordinates = (coords) =>
    {
        let distance = 0;
        if (coords && coords.length)
        {
            for (let i = 0; i < coords.length - 1; i++)
            {
                if (coords[i] && coords[i + 1])
                {
                    distance += this.getDistance(
                        {
                            X: coords[i].longitude,
                            Y: coords[i].latitude
                        },
                        {
                            X: coords[i + 1].longitude,
                            Y: coords[i + 1].latitude
                        });
                }
            }
        }

        return distance;
    };

    fitBound = (data) =>
    {
        if (this.map && data && data.length)
        {
            const bounds = new mapboxgl.LngLatBounds();

            for (const d of data)
            {
                bounds.extend([d.y, d.x]);
            }

            this.map.fitBounds(bounds, { maxZoom: 16 });
        }
    };
}

export { MapUtil };
