import { decorate, observable, action, autorun } from 'mobx';
import mapboxgl from 'mapbox-gl';

import { MapUtil } from '../Map/MapUtil';

import { Constants } from 'constant/Constants';

export class DrawToolStore
{
    appStore = null;
    map = null;

    constructor(appStore, directionService)
    {
        this.appStore = appStore;
        this.directionService = directionService;
        this.mapUtil = new MapUtil(this.map);
    }

    actions = [
        {
            id: 'tool-select',
            cursor: '' // cursor hover on Map when action is selected
        },
        {
            id: 'tool-add-marker',
            cursor: 'crosshair',
            defaultName: 'Điểm',
            radius: 500
        },
        {
            id: 'tool-add-line',
            cursor: 'crosshair',
            defaultName: 'Đường nối',
            radius: 100
        },
        {
            id: 'tool-add-polygon',
            cursor: 'crosshair',
            defaultName: 'Vùng',
            radius: 0
        },
        {
            id: 'tool-add-direction',
            cursor: 'crosshair',
            defaultName: 'Đường đi',
            radius: 100
        }
    ];
    selectedActionIndex = 0;
    active = true;
    isShowMapObjects = true;

    drawingObject = {
        type: -1,
        points: [],
        updatedAt: new Date().getTime() // time update points
    };

    // drawnObjects = [];
    renderOnDrag = {
        points: [], // maybe 2 or 3 points
        onDragIndex: 0, // index of point on drag
        color: Constants.MAP_OBJECT_POLYGON_COLOR
    };


    activeDrawTool()
    {
        this.active = true;
    }

    unActiveDrawTool()
    {
        this.active = false;
    }


    addPointToDrawingObject(point)
    {
        if (point && point.longitude && point.latitude)
        {
            if (new Date().getTime() - this.drawingObject.updatedAt > 300)
            {
                this.drawingObject.updatedAt = new Date().getTime();
                this.drawingObject.points.push(point);
            }
        }
    }

    handleClickDrawToolAction(index)
    {
        this.setActiveDrawActionIndex(index);

        // reset focus map object
        // this.setSelectedObjectIndex(-1);

        // reset if in middle drawing (lines, polygon) and click pointer
        if (index === Constants.MAP_OBJECT.POINTER)
        {
            this.resetDrawObject();
        }
    }

    resetDrawObject()
    {
        this.drawingObject = {
            type: -1,
            points: [],
            updatedAt: new Date().getTime()
        };
    }

    getActiveDrawAction()
    {
        if (this.active) // only return active action when draw tool is active
        {
            const selectedActionIndex = this.selectedActionIndex;
            const activeAction = this.actions[selectedActionIndex];

            return activeAction;
        }

        return null;
    }

    setActiveDrawActionIndex(index)
    {
        this.selectedActionIndex = index;
        // if (index !== this.MAP_OBJECT.MARKER) // multi points
        // {
        //     this.drawingObject.type = index;
        // }
    }

    setMapObjectOnDragPosition(position)
    {
        if (position && this.renderOnDrag.onDragIndex < this.renderOnDrag.points.length)
        {
            this.renderOnDrag.points[this.renderOnDrag.onDragIndex] = position;
        }
    }

    setMapObjectDragPoints(lineObj, indexDrag)
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
            if (lineObj.type === Constants.MAP_OBJECT.LINES || lineObj.type === Constants.MAP_OBJECT.PATH)
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
            else if (lineObj.type === Constants.MAP_OBJECT.POLYGON)
            {
                if (indexDrag === 0) // drag start point
                {
                    points[0] = lineObj.points[lineObj.points.length - 1];
                    points[1] = lineObj.points[0];
                    points[2] = lineObj.points[1];
                    this.renderOnDrag.onDragIndex = 1;
                }
                else if (indexDrag === (lineObj.points.length - 1)) // drag end point
                {
                    points[0] = lineObj.points[lineObj.points.length - 2];
                    points[1] = lineObj.points[lineObj.points.length - 1];
                    points[2] = lineObj.points[0];
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
        }

        this.renderOnDrag.points = points;

        // color
        this.renderOnDrag.color = (lineObj.customStyle && lineObj.customStyle.color) ? lineObj.customStyle.color : Constants.MAP_OBJECT_POLYGON_COLOR;

        // type
        this.renderOnDrag.type = lineObj.type;
    }

    isValidObj(obj)
    {
        let isValid = true;
        switch (obj.type)
        {
            default:
            case Constants.MAP_OBJECT.POINTER:
                isValid = obj.points.length >= 1;
                break;
            case Constants.MAP_OBJECT.LINES:
                isValid = obj.points.length >= 2;
                break;
            case Constants.MAP_OBJECT.POLYGON:
                isValid = obj.points.length >= 3;
                break;
        }
        return isValid;
    }

    async addLastPointToDrawingObject(params, callback)
    {
        if (this.drawingObject.points && this.drawingObject.points.length)
        {
            if (params && params.longitude && params.latitude)
            {
                params.points = this.drawingObject.points;

                // calculate center point of shape
                const center = this.getCenter(params.points.map((o) => [o.latitude, o.longitude]));

                params.longitude = center.longitude;
                params.latitude = center.latitude;

                if (typeof (callback) === 'function' && this.isValidObj(params))
                {
                    await callback(params, this.map);
                }
            }
        }
        this.resetDrawObject();
    }

    getCenter = (arr) =>
    {
        let minX, maxX, minY, maxY;
        for (let i = 0; i < arr.length; i++)
        {
            minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
            maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
            minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
            maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
        }
        return { longitude: (minY + maxY) / 2, latitude: (minX + maxX) / 2 };
    };

    onFitbound = (drawObj) =>
    {
        const bounds = new mapboxgl.LngLatBounds();

        if (drawObj.type === 3)
        {
            drawObj.points.forEach((point) =>
            {
                bounds.extend([point.longitude, point.latitude]);
            });
        }
        else
        {
            drawObj.bufferCoords.forEach((point) =>
            {
                bounds.extend(point);
            });
        }

        this.map.fitBounds(bounds, {
            padding: { top: 10, bottom: 10, left: 840, right: 10 },
            maxZoom: 15
        });
    };

    renderOnDrawLinesOfTypeLineAndPolygon = autorun(() =>
    {
        // always need to reset first
        if (this.renderOnDrag.points)
        {
            if (this.mapUtil)
            {
                this.mapUtil.clearSourceData(Constants.DRAG_MAP_OBJECT_LINE_LAYER_ID);
            }

            if (this.map && this.renderOnDrag.points.length)
            {
                let coords = [];
                if (this.renderOnDrag.type === 4)
                {
                    const points = this.renderOnDrag.points.map((e) => ({
                        'Longitude': e.longitude,
                        'Latitude': e.latitude
                    }));

                    // car and fasted
                    this.directionService.getRouteAvoidBarrierDebounced(points, 3, 0, null, false, 0).then((routes) =>
                    {
                        coords = routes[0].Geometry;
                        this.mapUtil.drawMyMapOnDragObjectTypeLines(coords, this.renderOnDrag.color);
                    });
                }
                else
                {
                    coords = this.renderOnDrag.points.map((o) =>
                    {
                        return [o.longitude, o.latitude];
                    });
                    this.mapUtil.drawMyMapOnDragObjectTypeLines(coords, this.renderOnDrag.color);
                }
            }
        }
    });
}

decorate(DrawToolStore, {
    appStore: observable,
    selectedActionIndex: observable,
    active: observable,
    drawingObject: observable,
    renderOnDrag: observable,
    addPointToDrawingObject: action,
    getActiveDrawAction: action,
    handleCreateNewObjectMarker: action,
    setMapObjectDragPoints: action,
    handleClickDrawToolAction: action,
    unActiveDrawTool: action,
    activeDrawTool: action,
    resetDrawObject: action,
    setSelectedObjectIndex: action,
    addLastPointToDrawingObject: action,
    setActiveDrawActionIndex: action,
    setMapObjectOnDragPosition: action
});
