import { action, decorate, observable } from 'mobx';
import * as THREE from 'three';

import LayerService from 'services/layer.service';
import { StreetViewService } from 'services/streetView.service';

export class StreetViewStore
{
    constructor(appStore)
    {
        this.appStore = appStore;

        this.streetViewSvc = new StreetViewService();
        this.layerSvc = new LayerService();

        this.STREET_VIEW = {
            ...this.STREET_VIEW, ...{
                SKY_BOX: this.STREET_VIEW.SIZE * 2,
                HEIGHT: this.STREET_VIEW.SIZE * 0.3,
                SIZE_EP: this.STREET_VIEW.SIZE * 0.2,
                FAR: this.STREET_VIEW.SIZE * 2 * 100,
                STR_SIZE: '' + this.STREET_VIEW.SIZE,
                FONT_SIZE: this.STREET_VIEW.SIZE * 0.03
            }
        };
    }

    STREET_VIEW = {
        COLOR: 'white',
        LABEL_COLOR: 0xFFFFFF,
        OPACITY: 0.7,
        SIZE: 256,
        DISTANCE: 0.1,
        NEAR: 0.001,
        ROTATE: -Math.PI / 2,
        CAMERA_ZOOM: 2,
        FOVS: [25, 45, 65, 85, 105]
    };


    ICON_ROTATES = {
        '350': require('images/icon/rotating/rotating-5.png'),
        '340': require('images/icon/rotating/rotating-6.png'),
        '330': require('images/icon/rotating/rotating-6.png'),
        '320': require('images/icon/rotating/rotating-7.png'),
        '310': require('images/icon/rotating/rotating-7.png'),
        '300': require('images/icon/rotating/rotating-7.png'),
        '290': require('images/icon/rotating/rotating-8.png'),
        '280': require('images/icon/rotating/rotating-8.png'),
        '270': require('images/icon/rotating/rotating-9.png'),
        '260': require('images/icon/rotating/rotating-10.png'),
        '250': require('images/icon/rotating/rotating-10.png'),
        '240': require('images/icon/rotating/rotating-10.png'),
        '230': require('images/icon/rotating/rotating-11.png'),
        '220': require('images/icon/rotating/rotating-11.png'),
        '210': require('images/icon/rotating/rotating-11.png'),
        '200': require('images/icon/rotating/rotating-12.png'),
        '190': require('images/icon/rotating/rotating-12.png'),
        '180': require('images/icon/rotating/rotating-13.png'),
        '170': require('images/icon/rotating/rotating-14.png'),
        '160': require('images/icon/rotating/rotating-14.png'),
        '150': require('images/icon/rotating/rotating-14.png'),
        '140': require('images/icon/rotating/rotating-15.png'),
        '130': require('images/icon/rotating/rotating-15.png'),
        '120': require('images/icon/rotating/rotating-15.png'),
        '110': require('images/icon/rotating/rotating-16.png'),
        '100': require('images/icon/rotating/rotating-16.png'),
        '90': require('images/icon/rotating/rotating-1.png'),
        '80': require('images/icon/rotating/rotating-2.png'),
        '70': require('images/icon/rotating/rotating-2.png'),
        '60': require('images/icon/rotating/rotating-3.png'),
        '50': require('images/icon/rotating/rotating-3.png'),
        '40': require('images/icon/rotating/rotating-3.png'),
        '30': require('images/icon/rotating/rotating-4.png'),
        '20': require('images/icon/rotating/rotating-4.png'),
        '10': require('images/icon/rotating/rotating-4.png'),
        '0': require('images/icon/rotating/rotating-5.png')
    };

    active = false;
    streetViewData = null;

    streetMap = { center: null, map: null };

    degCameraRotating = 0;
    degRealRotating = 180;

    personMapIcon = {
        coordinates: null,
        degRotating: null
    };

    closeMapIcon = {
        coordinates: null
    };

    planeMapping = {
        position: [0, -this.STREET_VIEW.HEIGHT, 0],
        rotation: [this.STREET_VIEW.ROTATE, 0, 0]
    };

    panoramaPoints = [];

    interactedPoint = {
        nodeId: null,
        dx: 0,
        dz: 0,
        heading: 0,
        visible: false
    };

    isResetCameraPosition = false;

    show = ((data) =>
    {
        this.loadSceneById(data.guid, true);
        this.active = true;
        this.setStreetMap('center', data.coordinates);
    });

    setStreetMap = (type, data) => this.streetMap[type] = data;

    setDegCameraRotating = (deg) =>
    {
        this.degCameraRotating = deg;
    };

    setDegRealRotating = (deg) =>
    {
        this.degRealRotating = deg;
    };

    setStreetViewData = (data, type = null) =>
    {
        if (!type)
        {
            this.streetViewData = data;
        }
        else
        {
            this.streetViewData[type] = data;
        }
    };

    setPersonMapIcon = (data, type = null) =>
    {
        if (!type)
        {
            this.personMapIcon = data;
        }
        else
        {
            this.personMapIcon[type] = data;
        }
    };

    setCloseMapIcon = (data, type = null) =>
    {
        if (!type)
        {
            this.closeMapIcon = data;
        }
        else
        {
            this.closeMapIcon[type] = data;
        }
    };

    setPlaneMapping = (data) => this.planeMapping = data;

    setInteractedPoint = (data, type = null) =>
    {
        if (!type)
        {
            this.interactedPoint = data;
        }
        else
        {
            this.interactedPoint[type] = data;
        }
    };

    clearStreetView = () =>
    {
        this.personMapIcon = {
            coordinates: null,
            degRotating: null
        };

        this.setStreetViewData(null);
        this.setDegRealRotating(null);
        this.setDegCameraRotating(null);
    };

    handleCloseStreetView = () =>
    {
        this.active = false;
        this.clearStreetView();
    };

    formatPanoramaPoints = (links) =>
    {
        this.panoramaPoints = links.map((link) =>
        {
            const sNodeId = link.id;
            const sDistance = link.distance * 55;// 80
            const sHeading = link.heading + (this.degCameraRotating - this.degRealRotating);
            const sRad = THREE.Math.degToRad(sHeading);

            const dx = Math.cos(sRad) * sDistance;
            const dz = Math.sin(sRad) * sDistance;

            return {
                nodeId: sNodeId,
                heading: sHeading,
                visible: false,
                lngLat: link.lngLat,
                dz,
                dx
            };
        });
    };

    updateCompass = (deg) =>
    {
        this.setDegCameraRotating(deg);

        let key = deg - this.degRealRotating;

        if (Math.abs(key / 360) > 1)
        {
            key = key % 360;
        }

        if (key < 0)
        {
            key = key + 360;
        }

        key = '' + Math.floor(key / 10) * 10;

        if (key !== this.personMapIcon.degRotating)
        {
            this.setPersonMapIcon(key, 'degRotating');
        }
    };

    loadSceneById = (id, isReset) =>
    {
        this.streetViewSvc.getLinks(id).then((data) =>
        {
            if (data?.id && data?.id !== this.streetViewData?.id && data?.latlng)
            {
                const lnglat = [data.latlng[1], data.latlng[0]];

                this.setPersonMapIcon(lnglat, 'coordinates');
                this.setCloseMapIcon(lnglat, 'coordinates');

                data?.links && this.formatPanoramaPoints(data.links);

                if (!isReset && this.degRealRotating != null)
                {
                    const angle = Math.abs(this.degRealRotating - data.direction);
                    if (angle > 90)
                    {
                        isReset = true;
                    }
                }

                this.isResetCameraPosition = isReset;
                this.setDegRealRotating(data.direction);
                this.setStreetViewData({ ...data, coordinates: lnglat });

                !isReset && this.updateCompass(this.degCameraRotating);
            }
        });
    };

    // search with big radius, is suitable for click point in Image
    loadSceneByLngLat = (lngLat, isReset) =>
    {
        if (lngLat)
        {
            this.streetViewSvc.getId(lngLat).then((rs) =>
            {
                if (rs?.id)
                {
                    this.loadSceneById(rs?.id, isReset);
                }
            });
        }
    };

    // search with exactly lngLat, is suitable for click point in Map
    loadSceneLayerByLngLat = async (lngLat, isReset) =>
    {
        if (lngLat)
        {
            const { lng, lat } = lngLat;

            try
            {
                const rs = await this.layerSvc.getObjectByLatLng({
                    Layers: ['ICS_PANORAMA'],
                    Level: Math.round(this.streetMap.map.getZoom()),
                    X: lng,
                    Y: lat,
                    Detail: true
                });

                if (rs?.data?.Data?.guid)
                {
                    this.loadSceneById(rs.data.Data.guid);
                    return rs.data.Data.guid;
                }
                else
                {
                    return null;
                }
            }
            catch (e)
            {
                console.error(e);
                return null;
            }
        }
        else
        {
            return null;
        }
    };
}

decorate(StreetViewStore, {
    initData: observable,
    degRealRotating: observable,
    degCameraRotating: observable,
    streetViewData: observable,
    ICON_ROTATES: observable,
    personMapIcon: observable,
    closeMapIcon: observable,
    panoramaPoints: observable,
    planeMapping: observable,
    streetMap: observable,
    active: observable,
    interactedPoint: observable,
    isResetCameraPosition: observable,

    show: action,
    handleCloseStreetView: action,
    setPlaneMapping: action,
    setStreetMap: action,
    loadSceneByLngLat: action,
    updateCompass: action,
    setInteractedPoint: action,
    loadSceneLayerByLngLat: action,
    setPersonMapIcon: action
});
