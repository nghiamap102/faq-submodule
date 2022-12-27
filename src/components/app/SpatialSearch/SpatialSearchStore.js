import React from 'react';
import { autorun, decorate, observable } from 'mobx';
import { action } from 'mobx';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import StaticMode from '@mapbox/mapbox-gl-draw-static-mode';

import { Container } from '@vbd/vui';

import { MapUtil } from 'components/app/Map/MapUtil';
import { Constants } from 'constant/Constants';

export class SpatialSearchStore
{
    constructor()
    {
        const modes = MapboxDraw.modes;
        modes.static = StaticMode;

        this.drawTool = new MapboxDraw({
            modes: modes,
            clickBuffer: 3,
            displayControlsDefault: false,
            controls: { point: true, line_string: true, polygon: true, trash: true }, // trash: true
        });
    }

    popupContent = <Container />;
    data = [];
    isLockedDrawTool = false;
    map = null;
    mapUtil = new MapUtil(this.map);
    drawTool = null;
    drawObj = null;
    drawConfig = {
        type: '',
        radius: 1000,
        bufferCoords: null,
        color: Constants.MAP_OBJECT_POLYGON_COLOR,
        opacity: Constants.MAP_OBJECT_POLYGON_OPACITY,
    };
    popups = [];

    setData(data)
    {
        this.data = data;
        this.fitBound(this.data);
    }

    addData(data)
    {
        this.data = this.data.concat(data);
        this.fitBound(this.data);
    }

    lockDrawTool = (isLock) =>
    {
        this.isLockedDrawTool = isLock;
        if (isLock)
        {
            this.drawTool.changeMode('static');
        }
        else if (this.drawObj)
        {
            this.drawTool.changeMode('simple_select', { featureIds: [this.drawObj.id] });
        }
    };

    setRadius = (r) =>
    {
        this.drawConfig.radius = r;
    };

    setDrawObj = (obj) =>
    {
        this.drawObj = obj;
    };

    buildGeoQuery = () =>
    {
        if (!this.drawConfig.type || !this.drawObj)
        {
            return null;
        }

        return {
            type: this.drawConfig.type,
            radius: this.drawConfig.radius,
            coords: this.drawConfig.type === 'linestring'
                ? this.drawConfig.bufferCoords
                : this.drawConfig.type === 'polygon'
                    ? this.drawObj.geometry.coordinates[0]
                    : this.drawObj.geometry.coordinates,
        };
    };

    drawObjBuffer = autorun(() =>
    {
        if (this.drawObj)
        {
            this.mapUtil.clearSourceData(Constants.POINTS_BUFFER_LAYER_ID);
            this.mapUtil.clearSourceData(Constants.LINES_BUFFER_LAYER_ID);

            const type = this.drawObj.geometry.type;
            this.drawConfig.type = type.toLowerCase();

            const buffer = {
                mapObject: {
                    customStyle: {
                        color: this.drawConfig.color,
                        polygonOpacity: this.drawConfig.opacity,
                    },
                },
            };

            if (type.toLowerCase() === 'polygon')
            {
                buffer.coords = this.drawObj.geometry.coordinates[0];
            }
            else
            {
                const bufferCoords = this.mapUtil.getBufferCoords(this.drawObj.geometry, this.drawConfig.radius);
                this.drawConfig.bufferCoords = bufferCoords;
                buffer.coords = bufferCoords;
            }

            switch (type.toLowerCase())
            {
                case 'point':
                    this.mapUtil.drawMapObjectTypePointsBuffer([buffer]);
                    break;
                default:
                    this.mapUtil.drawMapObjectTypeLinesBuffer([buffer]);
                    break;
            }
        }
        else if (this.map)
        {
            this.mapUtil.clearSourceData(Constants.POINTS_BUFFER_LAYER_ID);
            this.mapUtil.clearSourceData(Constants.LINES_BUFFER_LAYER_ID);
        }
    });

    removeMapPopup = (id) =>
    {
        this.popups = this.popups.filter((p) => p.id !== id);
    };

    onMarkerPopupClose = (event) =>
    {
        this.removeMapPopup(event.id);
    };

    addMapPopup = (popupData) =>
    {
        // if (this.popups.find((p) => p.id === popupData.id) === undefined)
        {
            const map = this.map;
            const popup = {
                id: popupData.id,
                title: popupData.title,
                sub: popupData.sub,
                lng: popupData.y,
                lat: popupData.x,
                width: popupData.width || 400,
                height: popupData.height || 300,
                isActivate: true,
                onClose: this.onMarkerPopupClose,
                data: popupData,
            };

            this.popups.clear();
            this.popups.push(popup);

            if (map)
            {
                map.panTo({ lat: popupData.x, lng: popupData.y });
            }
        }
    };

    reset = () =>
    {
        this.setDrawObj(null);

        this.drawConfig = {
            type: '',
            radius: 1000,
            bufferCoords: null,
            color: Constants.MAP_OBJECT_POLYGON_COLOR,
            opacity: Constants.MAP_OBJECT_POLYGON_OPACITY,
        };
    };

    fitBound = (data) =>
    {
        if (this.map && data && data.length)
        {
            const bounds = new mapboxgl.LngLatBounds();

            for (const d of data)
            {
                if (d.y && d.x)
                {
                    bounds.extend([d.y, d.x]);
                }
            }
            if (JSON.stringify(bounds) !== '{}')
            {
                this.map.fitBounds(bounds, { maxZoom: 16, padding: 100 });
            }
        }
    };
}

decorate(SpatialSearchStore, {
    data: observable,
    drawObj: observable,
    popups: observable,
    drawConfig: observable,
    isLockedDrawTool: observable,
    setDrawObj: action,
    setRadius: action,
    addMapPopup: action,
    reset: action,
    lockDrawTool: action,
    setData: action,
    addData: action,
});
