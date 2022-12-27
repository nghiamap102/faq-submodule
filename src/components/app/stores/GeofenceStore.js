import { decorate, observable, action, autorun } from 'mobx';

import { MapUtil } from '../Map/MapUtil';
import { Constants } from 'constant/Constants';
import { GeofenceService } from 'services/geofence.service';

export class GeofenceStore
{

    appStore = null;
    map = null;
    selectedGeofence = undefined;
    drawnObjects = [];
    flagInitLayer = false;

    constructor(appStore)
    {
        this.appStore = appStore;
        this.mapUtil = new MapUtil(this.map);

        this.trackingData = appStore.layerStore.trackingData;
        this.incidentStore = appStore.incidentStore;
        this.geofenceSvc = new GeofenceService(appStore);
    }

    initDrawnObjects(listControl, selectedControl)
    {
        if (listControl.length)
        {
            const listGeofence = [];

            for (let i = 0; i < listControl.length; i++)
            {
                const control = listControl[i];
                if (control.type === 'Label')
                {
                    continue;
                }

                const feature = control.mapControl.features[0];
                let geofenceData = control.components && control.components.geofence ? control.components.geofence : null;

                if (!geofenceData)
                {
                    geofenceData = this.buildGeofence(control);

                    control.components = control.components || {};
                    control.components.geofence = control.components.geofence || geofenceData;
                }

                geofenceData.geometry = feature.geometry;
                listGeofence.push(geofenceData);
            }

            this.drawnObjects = listGeofence;

            if (selectedControl)
            {
                this.selectedControl = selectedControl;
                const selectedGeofence = this.drawnObjects.find((g) => g.id === selectedControl.id);

                if (selectedGeofence)
                {
                    this.setSelectedGeofence(selectedGeofence);
                }
            }
        }
        else
        {
            this.drawnObjects = [];
        }
    }

    buildGeofence = (sketchMapObj) =>
    {
        const listMoving = this.trackingData.childes.filter((e) => e.Id === 'LOAIPHUONGTIEN')[0].childes.map((e) =>
        {
            return {
                title: e.Title,
                checkingType: e.checkingType,
                id: e.Id,
                transType: e.transType
            };
        });

        const geometry = sketchMapObj.mapControl.features[0].geometry;

        return {
            id: sketchMapObj.id,
            description: '',
            type: this.mapUtil.getMapObjectType(geometry),
            radius: 200,
            states: { in: true, out: false },
            messageTemplate: 'Xe {trackerId} vừa {state} {descrption}',
            listJoining: [],
            listMoving: listMoving.map((item) => ({ ...item, checkingType: 0 })),
            geometry: geometry,
            points: [],
            matterMostChannelId: this.incidentStore.incident?.headerInfo.matterMostChannelId,
            isEnabled: false,
            isDirection: false,
            onPublish: this.handleOnPublish
        };
    };

    handleOnPublish = (geofence) =>
    {
        if (geofence)
        {
            if (geofence.isEnabled)
            {
                let type = geofence.type;

                switch (geofence.type)
                {
                    case 1:
                        type = 0;
                        break;
                    case 2:
                    case 4:
                        type = 1;
                        break;
                    default:
                        break;
                }

                const geofenceData = {
                    id: geofence.id,
                    type: type,
                    radius: geofence.radius
                };

                if (type === 0)
                {
                    geofenceData.longitude = geofence.geometry.coordinates[0];
                    geofenceData.latitude = geofence.geometry.coordinates[1];
                }
                else
                {
                    geofenceData.radius = type === 3 ? null : geofence.radius;
                    geofenceData.coordinates = geofence.geometry.coordinates;
                }

                this.geofenceSvc.insert(geofenceData).then((res) =>
                {
                    if (res.success)
                    {
                        const states = [];

                        if (geofence.states.in)
                        {
                            states.push(1);
                        }

                        if (geofence.states.out)
                        {
                            states.push(2);
                        }

                        const geofenceState = {
                            geofenceId: geofence.id,
                            states: states,
                            transTypes: geofence.listMoving.filter((item) => item.checkingType === 1).map((item) => item.transType),
                            trackerIds: geofence.listJoining.filter((item) => item.checkingType === 1).map((item) => item.trackerId)
                        };

                        this.geofenceSvc.register(geofenceState);
                    }
                });
            }
            else
            {
                this.geofenceSvc.delete(geofence.id);
            }
        }
    };

    setSelectedGeofence(selectedGeofence)
    {
        this.selectedGeofence = selectedGeofence;
    }

    updateGeofence(fieldName, value)
    {
        if (this.selectedControl)
        {
            this.selectedGeofence[fieldName] = value;

            this.selectedControl.components.geofence = this.selectedGeofence;
        }
    }

    renderPointBuffer = autorun(() =>
    {
        if (this.mapUtil)
        {
            this.mapUtil.clearSourceData(Constants.GEOFENCE_POINTS_BUFFER_LAYER_ID);
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

            this.mapUtil.drawGeofencePointsBuffer(buffers);
        }
    });

    renderGeofenceBuffer = autorun(async () =>
    {
        if (this.mapUtil)
        {
            this.mapUtil.clearSourceData(Constants.GEOFENCE_LINES_BUFFER_LAYER_ID);
        }

        const lineObjects = this.drawnObjects.filter((o) => o && o.type === Constants.MAP_OBJECT.LINES);

        if (this.map && lineObjects)
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

            this.mapUtil.drawGeofenceLinesBuffer(buffers);
        }
    });
}

decorate(GeofenceStore, {
    queryDetail: observable,
    drawnObjects: observable,
    flagInitLayer: observable,
    updateGeofence: action
});
