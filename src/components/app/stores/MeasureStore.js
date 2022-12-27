import mapboxgl from 'mapbox-gl';
import { action, autorun, computed, decorate, observable } from 'mobx';

import { MapUtil } from 'components/app/Map/MapUtil';

import { Constants } from 'constant/Constants';
import { CommonHelper } from 'helper/common.helper';

export class MeasureStore
{
    active = false;
    complete = false;
    drawingMarkersOfMeasure = [];
    distances = [];
    drawingObject = {
        points: [],
        updatedAt: new Date().getTime() // time update points
    };
    drawedObject = {
        points: [],
        updatedAt: new Date().getTime() // time update points
    };
    renderOnDrag = {
        points: [], // maybe 2 or 3 points
        onDragIndex: 0 // index of point on drag
    };

    constructor(appStore)
    {
        this.appStore = appStore;
        this.mapStore = appStore.mapStore;
        this.mapUtil = new MapUtil(this.mapStore.map);
    }

    handleToggleMeasure = () =>
    {
        this.active = !this.active;

        this.drawedObject.points = [];
        this.drawingObject.points = [];
        this.renderOnDrag.points = [];

        if (!this.active) // turn off
        {
            this.setComplete(false); // reset
            this.mapStore.map.doubleClickZoom.enable();
        }
        else
        {
            this.mapStore.map.doubleClickZoom.disable();
        }
    };

    setComplete = (complete) =>
    {
        this.complete = complete;
    };

    addPointToDrawingObject = (point) =>
    {
        if (point && point.longitude && point.latitude)
        {
            if (new Date().getTime() - this.drawingObject.updatedAt > 300)
            {
                this.drawingObject.updatedAt = new Date().getTime();
                this.drawingObject.points.push(point);
            }
        }
    };

    addLastPointToDrawingObject = action((params) =>
    {
        if (this.drawingObject.points && this.drawingObject.points.length)
        {
            if (params && params.longitude && params.latitude)
            {
                params.points = this.drawingObject.points;
            }
        }

        this.drawedObject = this.drawingObject;

        this.resetDrawingObject();
    });

    resetDrawingObject = action(() =>
    {
        this.drawingObject = {
            points: [],
            updatedAt: new Date().getTime()
        };
    });

    get getDistance() // auto convert to compute
    {
        if (this.active)
        {
            if (this.complete)
            {
                return this.mapUtil.getTotalDistanceWithCoordinates(this.drawedObject.points);
            }
            else
            {
                const points = JSON.parse(JSON.stringify(this.drawingObject.points));
                points.push(this.renderOnDrag.points[1]);

                return this.mapUtil.getTotalDistanceWithCoordinates(points);
            }
        }

        return 0;
    }

    setMeasureOnDragPosition = (position) =>
    {
        if (position && this.renderOnDrag.onDragIndex < this.renderOnDrag.points.length)
        {
            this.renderOnDrag.points[this.renderOnDrag.onDragIndex] = position;
        }
    };

    setMeasureDragPoints = (lineObj, indexDrag) =>
    {
        if (!lineObj)
        {
            this.renderOnDrag.points = [];
            return null;
        }

        // check lines or polygon
        const points = [];

        if (lineObj && lineObj.points)
        {
            if (indexDrag === 0) // drag start point
            {
                points[0] = lineObj.points[0];
                points[1] = lineObj.points[1];
                this.renderOnDrag.onDragIndex = 0;
            }
            else if (indexDrag === (lineObj.points.length - 1)) // drag end point
            {
                points[0] = lineObj.points[indexDrag - 1];
                points[1] = lineObj.points[indexDrag];
                this.renderOnDrag.onDragIndex = 1;
            }
            else // drag middle point
            {
                points[0] = lineObj.points[indexDrag - 1];
                points[1] = lineObj.points[indexDrag];
                points[2] = lineObj.points[indexDrag + 1];
                this.renderOnDrag.onDragIndex = 1;
            }
        }

        this.renderOnDrag.points = points;
    };

    updateMeasureObject = (myMapObj) =>
    {
        this.drawedObject = myMapObj;
    };

    showMeasurePopup = (point) =>
    {
        if (this.measurePopup)
        {
            this.measurePopup.remove();
            this.measurePopup = null;
        }

        if (!this.complete)
        {
            this.measurePopup = new mapboxgl.Popup({
                className: 'measure-popup',
                closeButton: false,
                anchor: 'bottom',
                offset: { left: [0, -32] },
                closeOnClick: false
            })
                .setLngLat([point.longitude, point.latitude])
                .setHTML(`<div className="measure-distance-popup">${this.getDistance.toFixed(2)} m</div>`)
                .addTo(this.mapStore.map);
        }
    };

    showMiddleMeasurePopup = (points) =>
    {
        if (this.measureMiddlePopups && this.measureMiddlePopups.length)
        {
            this.measureMiddlePopups = this.clearRoutePopups(this.measureMiddlePopups);
        }

        this.measureMiddlePopups = []; // reset

        const getMiddlePoint = (point1, point2) =>
        {
            return {
                longitude: (point1.longitude + point2.longitude) * 0.5,
                latitude: (point1.latitude + point2.latitude) * 0.5
            };
        };

        // build middle points
        const middlePoints = [];
        for (let i = 0; i < points.length - 1; i++)
        {
            middlePoints.push({
                distance: this.mapUtil.getDistance({ X: points[i].longitude, Y: points[i].latitude }, {
                    X: points[i + 1].longitude,
                    Y: points[i + 1].latitude
                }),
                coords: getMiddlePoint(points[i], points[i + 1])
            });
        }

        this.distances = middlePoints.map((p) => p.distance);

        if (points.length <= 2)
        {
            return null;
        }

        for (const point of middlePoints)
        {
            if (point.coords && point.coords.longitude && point.coords.latitude)
            {
                this.measureMiddlePopups.push(new mapboxgl.Popup({
                    className: 'measure-middle-popup',
                    closeButton: false,
                    anchor: 'bottom',
                    offset: { left: [0, -32] },
                    closeOnClick: false
                })
                    .setLngLat([point.coords.longitude, point.coords.latitude])
                    .setHTML(`<div className="measure-distance-popup">${point.distance.toFixed(2)} m</div>`)
                    .addTo(this.mapStore.map));
            }
        }
    };

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

    renderMarkersOfMeasure = (lineObj) =>
    {
        // always need to reset first
        const points = lineObj.points || [];

        if (points && points.length)
        {
            for (let i = 0; i < points.length; i++)
            {
                const point = points[i];

                const el = document.createElement('div');

                el.className = 'marker marker-circle editable';
                el.innerHTML = '<i class="vbd"></i>';

                // Note: can not add event click on marker because mapbox don't support
                el.addEventListener('click', () =>
                {
                    const cloneObj = CommonHelper.clone(lineObj);
                    cloneObj.points.splice(i, 1);


                    if (cloneObj.points.length <= 1)
                    {
                        cloneObj.points = [];
                        this.handleToggleMeasure();
                    }
                    else
                    {
                        this.updateMeasureObject(cloneObj);
                    }
                });

                const marker = new mapboxgl.Marker(el, {
                    offset: [0, -16],
                    draggable: true
                })
                    .setLngLat([point.longitude, point.latitude])
                    .addTo(this.mapStore.map);

                this.showMeasurePopup(point);

                marker.on('dragstart', () =>
                {
                    this.setMeasureDragPoints(lineObj, i);
                });

                marker.on('drag', () =>
                {
                    const lngLat = marker.getLngLat();

                    const dragPoint = {
                        longitude: lngLat.lng,
                        latitude: lngLat.lat
                    };

                    this.setMeasureOnDragPosition(dragPoint);
                });

                marker.on('dragend', () =>
                {
                    const lngLat = marker.getLngLat();

                    // must clone 'obj', because can not change props of 'obj' outside 'action' function
                    const cloneObj = JSON.parse(JSON.stringify(lineObj));
                    cloneObj.points[i] = {
                        longitude: lngLat.lng,
                        latitude: lngLat.lat
                    };

                    this.updateMeasureObject(cloneObj);

                    this.setMeasureDragPoints(null); // to hide dash line on drag
                });

                this.markersOfMeasure = this.markersOfMeasure || [];
                this.markersOfMeasure.push(marker);
            }
        }
    };


    renderDrawingMarkersAndLineOfMeasure = autorun(() =>
    {
        // always need to reset first
        if (this.drawingMarkersOfMeasure)
        {
            if (this.mapUtil)
            {
                this.drawingMarkersOfMeasure = this.clearMarkers(this.drawingMarkersOfMeasure);
                this.mapUtil.clearSourceData(Constants.MEASURE_DRAG_LINE_LAYER_ID);
            }
        }

        this.drawingMarkersOfMeasure = [];
        for (const point of this.drawingObject.points)
        {
            if (point)
            {
                const el = document.createElement('div');
                el.className = 'marker marker-circle drawing';
                el.innerHTML = '<i class="vbd"></i>';

                const marker = new mapboxgl.Marker(el, { offset: [0, -16] })
                    .setLngLat([point.longitude, point.latitude])
                    .addTo(this.mapStore.map);

                this.drawingMarkersOfMeasure.push(marker);
            }
        }

        this.showMiddleMeasurePopup(this.drawingObject.points);
    });

    renderDrawMarkersAndLineOfMeasure = autorun(() =>
    {
        if (!this.active)
        {
            if (this.measurePopup)
            {
                this.measurePopup.remove();
                this.measurePopup = null;
            }
        }

        if (this.markersOfMeasure && this.mapUtil)
        {
            this.markersOfMeasure = this.clearMarkers(this.markersOfMeasure);
            this.middleMarkersOfMeasure = this.clearMarkers(this.middleMarkersOfMeasure);
            this.mapUtil.clearSourceData(Constants.MEASURE_LINE_LAYER_ID);
        }

        if (this.mapStore?.map)
        {
            this.renderMarkersOfMeasure(this.drawedObject);
            this.showMiddleMeasurePopup(this.drawedObject.points);
        }
    });
}

decorate(MeasureStore, {
    active: observable,
    complete: observable,
    drawedObject: observable,
    drawingObject: observable,
    renderOnDrag: observable,
    distances: observable,

    getDistance: computed,
    handleToggleMeasure: action,
    setComplete: action,
    updateMeasureObject: action,
    setMeasureOnDragPosition: action,
    addPointToDrawingObject: action,
    setMeasureDragPoints: action,
    addLastPointToDrawingObject: action
});
