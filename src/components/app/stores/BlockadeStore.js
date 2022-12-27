import { decorate, observable, action, autorun } from 'mobx';

import { MapUtil } from '../Map/MapUtil';
import { Constants } from 'constant/Constants';
import { BlockadeService } from 'services/blockade.service';
import { CommonHelper } from 'helper/common.helper';

export class BlockadeStore
{
    blockadeService = new BlockadeService();

    constructor(appStore)
    {
        this.appStore = appStore;
        this.mapUtil = new MapUtil(this.map);
        // this.trackingData = appStore.layerStore.trackingData;
        this.incidentStore = appStore.incidentStore;
    }

    appStore = null;
    map = null;
    selectedBlockade = undefined;
    drawnObjects = [];
    flagInitLayer = false;

    initDrawnObjects(listControl, selectedControl)
    {
        if (listControl && listControl.length)
        {
            this.drawnObjects = this.onLoadDrawObjects(listControl);

            if (selectedControl)
            {
                this.selectedControl = selectedControl;
                const selectedBlockade = this.drawnObjects.find((g) => g.id === selectedControl.id);

                if (selectedBlockade)
                {
                    this.setSelectedBlockade(selectedBlockade);
                }
            }
        }
        else
        {
            this.drawnObjects = [];
        }
    }

    buildBlockade = (sketchMapObj) =>
    {
        const geometry = sketchMapObj.mapControl.features[0].geometry;

        return {
            id: sketchMapObj.id,
            description: '',
            type: this.mapUtil.getMapObjectType(geometry),
            radius: 200,
            geometry: [],
            points: [],
            euclid: 1,
            criteria: 1,
            flagpolesMarker: [],
            isEnabled: false
        };
    };

    onLoadDrawObjects = (listControl) =>
    {
        const listBlockade = [];
        for (let i = 0; i < listControl.length; i++)
        {
            const control = listControl[i];
            if (control.mapControl && control.mapControl.features && control.mapControl.features.length)
            {
                const feature = control.mapControl.features[0];
                let blockadeData = control.components && control.components.blockade ? control.components.blockade : null;

                if (!blockadeData)
                {
                    blockadeData = this.buildBlockade(control);

                    if (!control.components)
                    {
                        control.components = {};
                    }

                    control.components.blockade = blockadeData;
                }

                blockadeData.geometry = feature.geometry;
                listBlockade.push(blockadeData);
            }
        }

        return listBlockade;
    };

    setSelectedBlockade(selectedBlockade)
    {
        this.selectedBlockade = selectedBlockade;
    }

    setFlagpoleMarker = (flagpolesPoints) =>
    {
        const flagpolesMarker = [];
        if (flagpolesPoints && flagpolesPoints.length > 0)
        {
            flagpolesPoints.forEach((flagpole) =>
            {
                const [latitude, longitude] = flagpole;
                flagpolesMarker.push({
                    id: CommonHelper.uuid(),
                    icon: 'map-pin',
                    color: Constants.MAP_OBJECT_BLOCKADE_FLAGPOLE_COLOR,
                    draw: 'symbol',
                    lng: longitude,
                    lat: latitude
                });
            });
        }
        return flagpolesMarker;
    };

    updateBlockade(fieldName, value)
    {
        if (this.selectedControl)
        {
            this.selectedBlockade[fieldName] = value;

            this.selectedControl.components.blockade = this.selectedBlockade;
        }
    }


    getFlagpoles({ geometry, radius, euclid, criteria })
    {
        const { coordinates, type } = geometry;

        // just for Point, order type in development
        const loc = type === 'Point' ? coordinates : null;

        this.blockadeService.getFlagpolesDebounced(loc, radius, euclid, criteria).then((rs) =>
        {
            if (rs && rs.status === 200 && rs.flagpoles)
            {
                const flagpolesMarker = this.setFlagpoleMarker(rs.flagpoles.points);
                this.updateBlockade('flagpolesMarker', flagpolesMarker);
            }
        });
    }

    renderFlagpoleMakers = autorun(() =>
    {
        if (this.selectedBlockade && this.selectedBlockade.isEnabled)
        {
            const blockadeData = this.drawnObjects.find((o) => o && o.type === Constants.MAP_OBJECT.MARKER && o.id === this.selectedBlockade.id);
            if (this.map && blockadeData)
            {
                this.getFlagpoles(blockadeData);
            }
        }
    });

    renderPointBuffer = autorun(() =>
    {
        if (this.mapUtil)
        {
            this.mapUtil.clearSourceData(Constants.BLOCKADE_POINTS_BUFFER_LAYER_ID);
        }

        const markerObjects = this.drawnObjects.filter((o) => o && o.type === Constants.MAP_OBJECT.MARKER);
        if (this.map && markerObjects)
        {
            const buffers = [];
            for (const markerObj of markerObjects)
            {
                if (!markerObj.isEnabled)
                {
                    continue;
                }
                const bufferCoords = this.mapUtil.getBufferCoords(markerObj.geometry, markerObj.radius);

                const bufferObj = {
                    coords: bufferCoords,
                    mapObject: markerObj
                };
                buffers.push(bufferObj);
            }

            this.mapUtil.drawBlockadePointsBuffer(buffers);
        }
    });

    renderBlockadeBuffer = autorun(async () =>
    {
        if (this.mapUtil)
        {
            this.mapUtil.clearSourceData(Constants.BLOCKADE_LINES_BUFFER_LAYER_ID);
        }

        const lineObjects = this.drawnObjects.filter((o) => o && o.type === Constants.MAP_OBJECT.LINES);
        if (this.map && lineObjects && lineObjects.length > 0)
        {
            const buffers = [];

            for (const lineObj of lineObjects)
            {
                // render for each map object lines
                if (!lineObj || !lineObj.isEnabled)
                {
                    continue;
                }

                let geometry = {};

                geometry = lineObj.geometry;
                const bufferCoords = this.mapUtil.getBufferCoords(geometry, lineObj.radius);


                const bufferObj = {
                    coords: bufferCoords,
                    mapObject: lineObj
                };

                lineObj.bufferCoords = bufferCoords;
                buffers.push(bufferObj);
            }
            this.mapUtil.drawBlockadeLinesBuffer(buffers);
        }
    });
}

decorate(BlockadeStore, {
    drawnObjects: observable,
    selectedBlockade: observable,
    flagInitLayer: observable,
    updateBlockade: action,
    updateFlagpolesMarker: action
});
