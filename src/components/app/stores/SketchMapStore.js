import React from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { decorate, observable, computed } from 'mobx';
import { action } from 'mobx';

import { Container } from '@vbd/vui';

import { IncidentService } from 'services/incident.service';
import { CommonHelper } from 'helper/common.helper';
import { Constants } from 'constant/Constants';

export class SketchMapStore
{
    appStore = null;
    timeForSendLock = 5;

    controls = {
        isOpen: false,
        listControl: [],
        controlDrawTool: null,
        selectedControlId: undefined,
        sketchMapCode: undefined,
        isDirty: false,
        getSessionLock()
        {
            let sessionClientId = reactLocalStorage.get('sessionClientId', undefined);
            if (sessionClientId === undefined)
            {
                sessionClientId = CommonHelper.uuid();
                reactLocalStorage.set('sessionClientId', sessionClientId);
            }
            return sessionClientId;
        },
    };

    arrowLayerIds = [];
    stylingControl = undefined;

    constructor(appStore)
    {
        this.appStore = appStore;
        this.mapStore = appStore.mapStore;
        this.markerPopupStore = appStore.markerPopupStore;

        this.incidentSvc = new IncidentService(this.appStore);
    }

    getExpireLockDateTime(control)
    {
        let expiredLockDateTime;
        if (control.expiredLockDateTime)
        {
            if (typeof control.expiredLockDateTime === 'string')
            {
                expiredLockDateTime = new Date(control.expiredLockDateTime);
            }
            else
            {
                expiredLockDateTime = control.expiredLockDateTime;
            }
        }

        return expiredLockDateTime;
    }

    isInLockState(control)
    {
        const now = new Date();
        const expiredLockDateTime = this.getExpireLockDateTime(control);

        return expiredLockDateTime && expiredLockDateTime.getTime() >= now.getTime();
    }

    canLock(control)
    {
        const now = new Date();
        const expiredLockDateTime = this.getExpireLockDateTime(control);

        return !expiredLockDateTime || (expiredLockDateTime.getTime() - now.getTime() < this.timeForSendLock * 60 * 1000);
    }

    isSameSession(control)
    {
        return control.lockSession === this.controls.getSessionLock();
    }

    isLock(id)
    {
        const control = this.controls.listControl.find((c) => c.id === id);
        if (!control)
        {
            return false;
        }

        return this.isInLockState(control) && !this.isSameSession(control);
    }

    isControlDirty(control)
    {
        if (control.uncommitted)
        {
            return true;
        }

        if (!control)
        {
            return false;
        }

        return this.isInLockState(control) && this.isSameSession(control);
    }

    resetDirty()
    {
        this.controls.isDirty = false;
    }

    lockControl(control)
    {
        this.controls.isDirty = true;
        if (this.appStore.incidentStore.incident)
        {
            if (control && !this.isLock(control.id) && this.canLock(control))
            {
                this.incidentSvc.lockSketchMap(this.appStore.incidentStore.incident.headerInfo.id, control.id, this.controls.getSessionLock());
            }
        }
    }

    setStylingControl(control, lock = false)
    {
        this.stylingControl = control;
        this.changeArrowStyle(control, window.map);

        if (lock)
        {
            this.lockControl(control);
        }
    }

    refreshStyleControl = () =>
    {
        const control = this.getSelectedControl();
        if (control)
        {
            this.setStylingControl(control);
        }

    };

    updateControlDirectionPath = async (map, isHookToRoad, directionService) =>
    {
        const control = this.getSelectedControl();
        let coords = control.showControl.coords;
        const feature = control.mapControl.features[0];
        let routes = null;
        if (isHookToRoad)
        {
            control.rootPath = coords;

            routes = await directionService.getRouteAvoidBarrier(coords.map((c) => [c[1], c[0]]), 3, 0, null, false, 0);
            if (routes && routes[0])
            {
                feature.geometry.coordinates = routes[0].Geometry;
                coords = routes[0].Geometry;
            }
        }
        else
        {
            feature.geometry.coordinates = control.rootPath;
            coords = control.rootPath;
        }

        control.hookToRoad = isHookToRoad;

        this.controls.controlDrawTool.add(control.mapControl.features[0]);

        this.setControlProps(control, {
            color: control.showControl.color,
            width: control.showControl.width,
            opacity: control.showControl.opacity,
        });

        this.setStyleLine(control);
        this.drawArrow(control, map, control.mapControl.features[0]);

        this.setStylingControl(control, true);
        return routes;
    };

    setSelectedControl(id = undefined)
    {
        this.controls.selectedControlId = id;
    }

    getSelectedControl()
    {
        const listControl = this.controls.listControl;
        return listControl.find((c) => c.id === this.controls.selectedControlId);
    }

    setDrawTool(draw)
    {
        this.controls.controlDrawTool = draw;
    }

    removeDrawTool()
    {
        this.controls.controlDrawTool = undefined;
    }

    get isShowDetail()
    {
        return this.getSelectedControl();
    }

    addControl(control)
    {
        const isExist = this.controls.listControl.find((b) => b.id === control.id);
        if (isExist)
        {
            this.updateControl(control);
        }
        this.controls.listControl.push(control);
        this.controls.isDirty = true;
    }

    updateWithoutLock(control)
    {
        for (let i = 0; i < this.controls.listControl.length; i++)
        {
            if (this.controls.listControl[i].id === control.id)
            {
                this.controls.listControl[i] = control;
                break;
            }
        }

        this.changeArrowStyle(control, window.map);
    }

    updateControl(control)
    {
        this.lockControl(control);
        this.updateWithoutLock(control);
    }

    removeControl(id)
    {
        const removeControl = this.controls.listControl.find((c) => c.id === id);
        this.lockControl(removeControl);

        const list = this.controls.listControl;
        const controls = list.filter((control) => control.id === id);

        for (let i = 0; i < controls.length; i++)
        {
            if (list.indexOf(controls[i]) !== -1)
            {
                list.splice(list.indexOf(controls[i]), 1);
                if (this.stylingControl && this.stylingControl.id === id)
                {
                    this.stylingControl = undefined;
                }
                this.removeArrow(removeControl, window.map);
            }
        }

        this.controls.listControl = list;
    }

    removeAll()
    {
        this.controls.listControl = [];
    }

    setFullControl(controls)
    {
        this.controls.listControl = controls;
    }

    openControl()
    {
        this.controls.isOpen = true;
    }

    hideControl()
    {
        this.controls.isOpen = false;

        this.controls.listControl.forEach((c) =>
        {
            this.removeArrow(c, window.map);
        });
    }

    setStyleLine(control)
    {
        let normalStyle, dashStyle, dotStyle;

        switch (control.showControl.styleLine)
        {
            default:
            case 'Normal':
                normalStyle = 1;
                break;
            case 'Dash':
                dashStyle = 1;
                break;
            case 'Dot':
                dotStyle = 1;
                break;
        }

        this.setControlProps(control, { normalStyle, dashStyle, dotStyle });
    }

    removeArrow(c, map)
    {
        if (this.arrowLayerIds.find((id) => c.id === id) !== undefined)
        {
            map.removeLayer(`sketch-map-layer-${c.id}`);
            map.removeSource(`sketch-map-source-${c.id}`);
            this.arrowLayerIds = this.arrowLayerIds.filter((i) => i !== c.id);
        }
    }

    removeArrows(map)
    {
        this.arrowLayerIds.forEach((i) =>
        {
            map.removeLayer(`sketch-map-layer-${i}`);
            map.removeSource(`sketch-map-source-${i}`);
        });
        this.arrowLayerIds = [];
    }

    changeArrowStyle(control, map)
    {
        if (!control)
        {
            return;
        }

        const layer = map.getLayer(`sketch-map-layer-${control.id}`);
        if (layer)
        {
            map.setPaintProperty(`sketch-map-layer-${control.id}`, 'line-color', control.showControl.color);
            map.setPaintProperty(`sketch-map-layer-${control.id}`, 'line-width', control.showControl.width);
            this.drawArrow(control, map, control.mapControl.features[0]);
        }
    }

    drawArrow(c, map, feature)
    {
        if (c.type === 'LineString' && c.showControl.styleArrowLine !== 'Normal')
        {
            const zoomLevel = window.map.getZoom();
            const d = 0.0002 * (1 + (15.0 / zoomLevel) + (c.showControl.width / 8));
            const id = this.arrowLayerIds.find((i) => i === c.id);

            if (id)
            {
                const source = map.getSource(`sketch-map-source-${c.id}`);

                if (c.showControl.styleArrowLine === 'Left')
                {
                    source.setData({
                        'type': 'FeatureCollection',
                        'features': [{
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': this.getArrowLines(
                                    feature.geometry.coordinates[1][1],
                                    feature.geometry.coordinates[1][0],
                                    feature.geometry.coordinates[0][1],
                                    feature.geometry.coordinates[0][0],
                                    d,
                                ),
                            },
                        }],
                    });
                }
                else if (c.showControl.styleArrowLine === 'Right')
                {
                    source.setData({
                        'type': 'FeatureCollection',
                        'features': [{
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': this.getArrowLines(
                                    feature.geometry.coordinates[feature.geometry.coordinates.length - 2][1],
                                    feature.geometry.coordinates[feature.geometry.coordinates.length - 2][0],
                                    feature.geometry.coordinates[feature.geometry.coordinates.length - 1][1],
                                    feature.geometry.coordinates[feature.geometry.coordinates.length - 1][0],
                                    d,
                                ),
                            },
                        }],
                    });
                }
                else if (c.showControl.styleArrowLine === 'Both')
                {
                    source.setData({
                        'type': 'FeatureCollection',
                        'features': [{
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': this.getArrowLines(
                                    feature.geometry.coordinates[1][1],
                                    feature.geometry.coordinates[1][0],
                                    feature.geometry.coordinates[0][1],
                                    feature.geometry.coordinates[0][0],
                                    d,
                                ),
                            },
                        },
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': this.getArrowLines(
                                    feature.geometry.coordinates[feature.geometry.coordinates.length - 2][1],
                                    feature.geometry.coordinates[feature.geometry.coordinates.length - 2][0],
                                    feature.geometry.coordinates[feature.geometry.coordinates.length - 1][1],
                                    feature.geometry.coordinates[feature.geometry.coordinates.length - 1][0],
                                    d,
                                ),
                            },
                        }],
                    });
                }
            }
            else
            {
                if (c.showControl.styleArrowLine === 'Left')
                {
                    map.addSource(`sketch-map-source-${c.id}`, {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [{
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': this.getArrowLines(
                                        feature.geometry.coordinates[1][1],
                                        feature.geometry.coordinates[1][0],
                                        feature.geometry.coordinates[0][1],
                                        feature.geometry.coordinates[0][0],
                                        d,
                                    ),
                                },
                            }],
                        },
                    });
                }
                else if (c.showControl.styleArrowLine === 'Right')
                {
                    map.addSource(`sketch-map-source-${c.id}`, {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [{
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': this.getArrowLines(
                                        feature.geometry.coordinates[feature.geometry.coordinates.length - 2][1],
                                        feature.geometry.coordinates[feature.geometry.coordinates.length - 2][0],
                                        feature.geometry.coordinates[feature.geometry.coordinates.length - 1][1],
                                        feature.geometry.coordinates[feature.geometry.coordinates.length - 1][0],
                                        d,
                                    ),
                                },
                            }],
                        },
                    });
                }
                else if (c.showControl.styleArrowLine === 'Both')
                {
                    map.addSource(`sketch-map-source-${c.id}`, {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': [
                                {
                                    'type': 'Feature',
                                    'properties': {},
                                    'geometry': {
                                        'type': 'LineString',
                                        'coordinates': this.getArrowLines(
                                            feature.geometry.coordinates[1][1],
                                            feature.geometry.coordinates[1][0],
                                            feature.geometry.coordinates[0][1],
                                            feature.geometry.coordinates[0][0],
                                            d,
                                        ),
                                    },
                                },
                                {
                                    'type': 'Feature',
                                    'properties': {},
                                    'geometry': {
                                        'type': 'LineString',
                                        'coordinates': this.getArrowLines(
                                            feature.geometry.coordinates[feature.geometry.coordinates.length - 2][1],
                                            feature.geometry.coordinates[feature.geometry.coordinates.length - 2][0],
                                            feature.geometry.coordinates[feature.geometry.coordinates.length - 1][1],
                                            feature.geometry.coordinates[feature.geometry.coordinates.length - 1][0],
                                            d,
                                        ),
                                    },
                                }],
                        },
                    });
                }

                const arrowLayer = {
                    'id': `sketch-map-layer-${c.id}`,
                    'type': 'line',
                    'source': `sketch-map-source-${c.id}`,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    'paint': {
                        'line-color': c.showControl.color,
                        'line-width': c.showControl.width,
                    },
                };

                // Find the index of the first control point layer, .cold/.hot is mapbox auto suffix, cold is above hot - refer SketchMap.js
                const controlPointLayer = map.getStyle().layers.find((l) => l.id === 'gl-draw-vertex-inactive.cold');

                if (controlPointLayer)
                {
                    // Insert the layer beneath the first control point layer
                    map.addLayer(arrowLayer, controlPointLayer.id);
                }
                else
                {
                    map.addLayer(arrowLayer);
                }

                this.arrowLayerIds.push(c.id);
            }
        }
    }

    getArrowLines(lat1, lng1, lat2, lng2, d)
    {
        d = d || 0.0002;
        // Mũi tên mong muốn là hợp thành 30 độ so với đường thằng tạo ra từ 2 điểm đã truyền vào.
        // Do đó tam giác của mũi tên là 1 tam giác đều có cạnh là d và giao nhau với phương trình đường thằng tạo ra
        // giữa 2 điểm tại 1 điểm H. . Góc tạo ra tại H là 1 góc vuông
        const u12 = [lat2 - lat1, lng2 - lng1];
        const n12 = [-(lng2 - lng1), lat2 - lat1];

        const linearAB = {
            x: (t) =>
            {
                return lat1 + u12[0] * t;
            },
            y: (t) =>
            {
                return lng1 + u12[1] * t;
            },
        };

        // Gọi h2 là đoạn thẳng từ điểm vẽ mũi tên tới H
        const h2 = Math.sqrt(3) / 2 * d; // d * cos 30

        // Tim tH để gán vào công thức pH cho trước để tìm pH
        // h2^2 = (pH.x - lat2)^2 + (pH.y - lng2)^2
        // <=> h2^2 = (lat1 + u12[0] * t - lat2)^2 + (lng1 + u12[1] * t - lng2)^2
        // <=> h2^2 = (lat1 - lat2 + u12[0] * t)^2 + (lng1 - lng2 + u12[1] * t)^2
        // Vì u12[0] = lat2 - lat1 và u12[1] = lng2 - lng1
        // <=> h2^2 = (-u12[0] + u12[0]*t)^2 + (-u12[1] + u12[1]*t)^2
        // <=> h2^2 = (u12[0] * (t - 1))^2 + (u12[1] * (t - 1))^2
        // <=> h^2 = (u12[0]^ 2 + u12[1] ^ 2) * (t - 1) ^2
        // <=> (t - 1)^2 = h^2 / (u12[0]^ 2 + u12[1] ^ 2)
        // <=> |t - 1| = can bậc 2 (h^2 / (u12[0]^ 2 + u12[1] ^ 2))
        // <=> t = can bậc 2 (h^2 / (u12[0]^ 2 + u12[1] ^ 2)) + 1 hoặc t = - can bậc 2 (h^2 / (u12[0]^ 2 + u12[1] ^ 2)) + 1

        const tH1 = Math.sqrt(Math.pow(h2, 2) / (Math.pow(u12[0], 2) + Math.pow(u12[1], 2))) + 1;
        const tH2 = -Math.sqrt(Math.pow(h2, 2) / (Math.pow(u12[0], 2) + Math.pow(u12[1], 2))) + 1;

        const pH1 = {
            x: linearAB.x(tH1),
            y: linearAB.y(tH1),
        };

        const pH2 = {
            x: linearAB.x(tH2),
            y: linearAB.y(tH2),
        };

        const d12 = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2));
        const d1H1 = Math.sqrt(Math.pow(lat1 - pH1.x, 2) + Math.pow(lng1 - pH1.y, 2));
        // const d1H2 = Math.sqrt(Math.pow(lat1 - pH2.x, 2) + Math.pow(lng1 - pH2.y, 2));

        // Cần tìm điểm H nằm giữa 12
        const exactlypH = d1H1 < d12 ? pH1 : pH2;

        // Gọi c và d là 2 điểm cần tìm. 2 điềm này tạo thành 1 đường thẳng, đi qua H và vuông góc với 12
        const uCD = n12; // Vì cd vuông góc với 12
        const linearCD = {
            x: (t) =>
            {
                return exactlypH.x + uCD[0] * t;
            },
            y: (t) =>
            {
                return exactlypH.y + uCD[1] * t;
            },
        };

        // Vì tam giác 1cd là 1 tam giác đều. Như đã đề cập bên trên. Nên ch = hd = cd / 2 = d / 2
        const ch = d / 2;
        // Tim tC để gán vào công thức pC cho trước để tìm pC
        // ch^2 = (pC.x - pH.x)^2 + (pC.y - pH.y)^2
        // <=> ch^2 = (pH.x + uCD[0] * t - pH.x)^2 + (pH.y + uCD[1] * t - pH.y)^2
        // <=> ch^2 = uCD[0]^2 * t^2 + uCD[1]^2 * t^2
        // <=> ch^2 = (uCD[0]^2 + uCD[1]^2) * t^2
        // <=> t^2 = ch^2 / (uCD[0]^2 + uCD[1]^2)
        // => t = căn bậc 2 (ch^2 / (uCD[0]^2 + uCD[1]^2)) hoặc t = - căn bậc 2 (ch^2 / (uCD[0]^2 + uCD[1]^2))
        // Vì c và d đối xứng với nhau qua H => 2 trường hợp của t là các t của c và d
        const tC = Math.sqrt(Math.pow(ch, 2) / (Math.pow(uCD[0], 2) + Math.pow(uCD[1], 2)));
        const tD = -Math.sqrt(Math.pow(ch, 2) / (Math.pow(uCD[0], 2) + Math.pow(uCD[1], 2)));
        const pC = {
            x: linearCD.x(tC),
            y: linearCD.y(tC),
        };
        const pD = {
            x: linearCD.x(tD),
            y: linearCD.y(tD),
        };

        return [
            [pC.y, pC.x],
            [lng2, lat2],
            [pD.y, pD.x],
        ];
    }

    onIconImageOverSize(type)
    {
        const control = this.stylingControl;
        if (control)
        {
            control.showControl.media = undefined;
            this.setMarkerType(type);
        }
    }

    invalidateControl(control)
    {
        // this actually a hack fix due to mapbox behavior
        // issue: https://github.com/mapbox/mapbox-gl-draw/issues/878

        const drawTool = this.controls.controlDrawTool;
        drawTool.add(drawTool.get(control.id));
    }

    setControlProps(control, props)
    {
        const drawTool = this.controls.controlDrawTool;

        for (const [key, value] of Object.entries(props))
        {
            drawTool.setFeatureProperty(control.id, key, value);
        }

        this.invalidateControl(control);
    }

    setMarkerType(type)
    {
        const control = this.stylingControl;
        if (!control)
        {
            return;
        }

        control.showControl.markerType = type;

        if (type === 'video')
        {
            control.showControl.icon = Constants.DEFAULT_VIDEO_MARKER_ICON;
        }
        else if (type === 'image')
        {
            control.showControl.icon = Constants.DEFAULT_IMAGE_MARKER_ICON;
        }
        else if (type === 'icon')
        {
            if (this.currentVideoPopupId === control.id)
            {
                this.markerPopupStore.remove(this.currentVideoPopupId);
            }
        }

        this.setControlProps(control, {
            iconText: CommonHelper.getFontAwesomeStringFromClassName(control.showControl.icon),
            markerType: type,
        });
    }

    setMediaIcon(data, type, name)
    {
        const control = this.stylingControl;
        if (!control.showControl.media)
        {
            control.showControl.media = {};
        }

        control.showControl.media.data = data;

        if (type === 'image')
        {
            control.showControl.markerType = 'image';
            control.showControl.icon = Constants.DEFAULT_IMAGE_MARKER_ICON;

            this.setImageIcon(window.map, data);
        }
        else
        {
            control.showControl.markerType = 'video';
            control.showControl.icon = Constants.DEFAULT_VIDEO_MARKER_ICON;

            this.setControlProps(control, { markerType: type });
        }

        control.showControl.media.type = type;
        control.showControl.media.name = name;

        // this.setStylingControl(control);
    }

    setImageIcon(map, imageData)
    {
        const control = this.stylingControl;
        if (!control.showControl.media)
        {
            control.showControl.media = {};
        }

        map.loadImage(imageData, (error, image) =>
        {
            if (error)
            {
                throw error;
            }

            if (map.hasImage(`icon-image-${control.id}`))
            {
                map.removeImage(`icon-image-${control.id}`);
            }

            map.addImage(`icon-image-${control.id}`, image);

            this.setControlProps(control, {
                iconImage: `icon-image-${control.id}`,
                iconSize: control.showControl.media.iconSize ? control.showControl.media.iconSize : Constants.DEFAULT_IMAGE_ICON_SIZE,
                markerType: 'image',
            });
        });
    }

    onVideoPopupClose = (event) =>
    {
        this.markerPopupStore.remove(event.id);
    };

    showVideoPopup = (control) =>
    {
        if (!control)
        {
            control = this.stylingControl;
        }

        if (this.currentVideoPopupId)
        {
            this.markerPopupStore.remove(this.currentVideoPopupId);
        }

        const popup = this.markerPopupStore.getPopup(control.id);
        this.currentVideoPopupId = control.id;
        this.markerPopupStore.setStates('isActivate', false);

        if (!popup)
        {
            this.markerPopupStore.add({
                id: control.id,
                type: 'video',
                title: control.title,
                sub: '',
                content: (
                    <Container className={'video-popup-container'}>
                        <video
                            className="video-popup"
                            src={control.showControl.media.data}
                            type={control.showControl.media.type}
                            controls
                            autoPlay
                        />
                    </Container>
                ),
                lng: control.showControl.coords[0],
                lat: control.showControl.coords[1],
                width: 350,
                height: 230,
                isActivate: true,
                // onFocus: this.onMarkerPopupFocus,
                onClose: this.onVideoPopupClose,
                // headerActions: [{ icon: 'film-alt' }, { icon: 'external-link' }],
                // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
            });
        }
        else
        {
            this.markerPopupStore.setState(control.id, 'isActivate', true);
        }
    };

    renderMapboxDrawControl = (control) =>
    {
        const controlProps = {
            color: control.showControl.color,
            width: control.showControl.width,
            opacity: control.showControl.opacity,
        };

        if (control.type === 'Point')
        {
            controlProps.markerType = control.showControl.markerType;
            controlProps.iconText = CommonHelper.getFontAwesomeStringFromClassName(control.showControl.icon);

            if (control.showControl.media && control.showControl.media.data)
            {
                controlProps.iconImage = `icon-image-${control.id}`;
                controlProps.iconSize = control.showControl.media.iconSize || Constants.DEFAULT_IMAGE_ICON_SIZE;
            }
        }

        this.setControlProps(control, controlProps);
        this.setStyleLine(control);
    };

    loadSketchMapData = () =>
    {
        const drawTool = this.controls.controlDrawTool;
        drawTool.deleteAll();

        this.controls.listControl.forEach((c) =>
        {
            if (c.type !== 'Label')
            {
                drawTool.add(c.mapControl.features[0]);

                if (c.type === 'Point')
                {
                    if (c.showControl.media && c.showControl.media.data && c.showControl.markerType === 'image')
                    {
                        const map = this.mapStore.map;

                        map.loadImage(c.showControl.media.data, (error, image) =>
                        {
                            if (error)
                            {
                                throw error;
                            }

                            if (map.hasImage(`icon-image-${c.id}`))
                            {
                                map.removeImage(`icon-image-${c.id}`);
                            }

                            map.addImage(`icon-image-${c.id}`, image);
                        });
                    }
                }

                this.renderMapboxDrawControl(c);
                this.setStyleLine(c);
                this.drawArrow(c, this.mapStore.map, c.mapControl.features[0]);
            }
        });
    };
}

decorate(SketchMapStore, {
    appStore: observable,
    controls: observable,
    stylingControl: observable,
    isShowDetail: computed,
    resetDirty: action,
    setStylingControl: action,
    setDrawTool: action,
    removeDrawTool: action,
    setSelectedControl: action,
    refreshStyleControl: action,
    addControl: action,
    removeWithoutLock: action,
    removeControl: action,
    updateWithoutLock: action,
    updateControl: action,
    setFullControl: action,
    openControl: action,
    hideControl: action,
    updateControlDirectionPath: action,
    onIconImageOverSize: action,
    setMediaIcon: action,
    setImageIcon: action,
    renderMapboxDrawControl: action,
    loadSketchMapData: action,
});
