import './DrawTool.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { ToggleButton, ToggleButtonGroup } from '@vbd/vui';

import { Constants } from 'constant/Constants';
import { CommonHelper } from 'helper/common.helper';

class DrawTool extends Component
{
    state = {
        selectedActionIndex: 0,
        initMapEvent: true,
    };

    drawToolStore = this.props.appStore.drawToolStore;
    map = this.drawToolStore.map;

    // override this method
    handleCreateNewObjectMarker = (mapObj) =>
    {
        if (typeof (this.props.drawCallback) === 'function')
        {
            this.props.drawCallback(mapObj);
        }
        else
        {
            this.drawToolStore.showObjects(mapObj);
        }

        this.handleClickAction(0);
        this.map.getCanvas().style.cursor = this.getActiveDrawAction().cursor;
    };

    handleClickAction = (i) =>
    {
        this.setState({ selectedActionIndex: i });

        if (i === Constants.MAP_OBJECT.POINTER)
        {
            this.drawToolStore.resetDrawObject();
        }

        setTimeout(() =>
        {
            this.map.getCanvas().style.cursor = this.getActiveDrawAction().cursor;
        }, 200); // waiting for render
    };

    getActiveDrawAction()
    {
        const selectedActionIndex = this.state.selectedActionIndex;
        return this.drawToolStore.actions[selectedActionIndex];
    }

    componentDidMount()
    {
        if (!this.drawToolStore.flagInitLayer)
        {
            this.drawToolStore.mapUtil.init();
            this.drawToolStore.flagInitLayer = true;
        }

        const map = this.drawToolStore.map;

        if (map && this.state.initMapEvent)
        {
            map.on('click', (e) =>
            {
                const activeAction = this.getActiveDrawAction();
                if (activeAction && activeAction.id)
                {
                    switch (activeAction.id)
                    {
                        default:
                        case 'tool-select':
                            // do nothing
                            break;
                        case 'tool-add-marker':
                            // create new marker and push to map objects of current My Map
                            this.handleCreateNewObjectMarker({
                                longitude: e.lngLat.lng,
                                latitude: e.lngLat.lat,
                                type: 1,
                                radius: activeAction.radius,
                                name: activeAction.defaultName,
                                objId: CommonHelper.uuid(),
                            });
                            break;
                        case 'tool-add-line':
                        {
                            const newestClickPoint = {
                                longitude: e.lngLat.lng,
                                latitude: e.lngLat.lat,
                            };

                            this.drawToolStore.addPointToDrawingObject(newestClickPoint);

                            const lineObj = {
                                type: Constants.MAP_OBJECT.LINES,
                                points: [newestClickPoint, newestClickPoint],
                            };

                            this.drawToolStore.setMapObjectDragPoints(lineObj, 1 /* indexDrag */);

                            break;
                        }
                        case 'tool-add-polygon':
                        {
                            const newestClickPoint = {
                                longitude: e.lngLat.lng,
                                latitude: e.lngLat.lat,
                            };

                            this.drawToolStore.addPointToDrawingObject(newestClickPoint);

                            const lineObj = {
                                type: Constants.MAP_OBJECT.POLYGON,
                                points: [newestClickPoint, newestClickPoint, this.drawToolStore.drawingObject.points[0]],
                            };

                            this.drawToolStore.setMapObjectDragPoints(lineObj, 1 /* indexDrag */);

                            break;
                        }
                        case 'tool-add-direction':
                        {
                            const newestClickPoint = {
                                longitude: e.lngLat.lng,
                                latitude: e.lngLat.lat,
                            };
                            this.drawToolStore.drawingObject.type = Constants.MAP_OBJECT.PATH;
                            this.drawToolStore.addPointToDrawingObject(newestClickPoint);

                            const lineObj = {
                                type: Constants.MAP_OBJECT.PATH,
                                points: [newestClickPoint, newestClickPoint],
                            };

                            this.drawToolStore.setMapObjectDragPoints(lineObj, 1 /* indexDrag */);

                            break;
                        }
                    }
                }
            });

            map.on('dblclick', (e) =>
            {
                const activeAction = this.getActiveDrawAction();

                if (activeAction && activeAction.id)
                {
                    this.drawToolStore.setMapObjectDragPoints(null);

                    switch (activeAction.id)
                    {
                        case 'tool-add-line':
                            this.drawToolStore.addLastPointToDrawingObject({
                                longitude: e.lngLat.lng,
                                latitude: e.lngLat.lat,
                                type: Constants.MAP_OBJECT.LINES,
                                radius: activeAction.radius,
                                name: activeAction.defaultName,
                                objId: CommonHelper.uuid(),
                            }, this.handleCreateNewObjectMarker);

                            // disable auto zoom in to map
                            map.doubleClickZoom.disable();
                            setTimeout(() =>
                            {
                                map.doubleClickZoom.enable();
                            }, 2000);
                            break;

                        case 'tool-add-polygon':
                            this.drawToolStore.addLastPointToDrawingObject({
                                longitude: e.lngLat.lng,
                                latitude: e.lngLat.lat,
                                type: Constants.MAP_OBJECT.POLYGON,
                                name: activeAction.defaultName,
                                objId: CommonHelper.uuid(),
                            }, this.handleCreateNewObjectMarker);

                            map.doubleClickZoom.disable();
                            setTimeout(() =>
                            {
                                map.doubleClickZoom.enable();
                            }, 2000);
                            break;
                        case 'tool-add-direction':
                            this.drawToolStore.addLastPointToDrawingObject({
                                longitude: e.lngLat.lng,
                                latitude: e.lngLat.lat,
                                type: Constants.MAP_OBJECT.PATH,
                                radius: activeAction.radius,
                                name: activeAction.defaultName,
                                objId: CommonHelper.uuid(),
                            }, this.handleCreateNewObjectMarker);

                            // disable auto zoom in to map
                            map.doubleClickZoom.disable();
                            setTimeout(() =>
                            {
                                map.doubleClickZoom.enable();
                            }, 2000);
                            break;
                        default:
                            break;
                    }
                }
            });

            map.on('mousemove', (e) =>
            {
                const activeAction = this.getActiveDrawAction();
                if (activeAction)
                {
                    if (this.drawToolStore.drawingObject.points.length) // drawing map object
                    {
                        this.drawToolStore.setMapObjectOnDragPosition({
                            longitude: e.lngLat.lng,
                            latitude: e.lngLat.lat,
                        });
                    }
                }
            });

            this.setState({ initMapEvent: false });
        }
    }

    render()
    {
        const actions = this.props.isDirect ? this.drawToolStore.actions : this.drawToolStore.actions.filter(e => e.id !== 'tool-add-direction');
        const selectedActionIndex = this.state.selectedActionIndex;

        return (
            <ToggleButtonGroup>
                {
                    actions.map((action, i) => (
                        <ToggleButton
                            key={action.id}
                            active={i === selectedActionIndex}
                            icon={action.id}
                            onClick={this.handleClickAction.bind(this, i)}
                        />
                    ),
                    )
                }
            </ToggleButtonGroup>
        );
    }
}

DrawTool.defaultProps = {
    isDirect: false,
};

DrawTool = inject('appStore')(observer(DrawTool));
export default DrawTool;
