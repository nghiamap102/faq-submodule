import './SketchMap.scss';

import React, { Component } from 'react';
import { autorun, toJS } from 'mobx';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import area from '@turf/area';
import length from '@turf/length';

import {
    withI18n, withModal,
    PanelHeader, PanelFooter, FlexPanel, PanelBody,
    WebSocketService,
    ToolBarToggleButton, ToolBarToggleButtonGroup,
} from '@vbd/vui';

import Enum from 'constant/app-enum';
import { Constants } from 'constant/Constants';
import { CommonHelper } from 'helper/common.helper';
import { IncidentService } from 'services/incident.service';

import SketchControlList from './SketchControlList';

class SketchMap extends Component
{
    sketchMapStore = this.props.appStore.sketchMapStore;
    geofenceStore = this.props.appStore.geofenceStore;
    mapStore = this.props.appStore.mapStore;
    incidentStore = this.props.appStore.incidentStore;
    advanceSearchStore = this.props.appStore.advanceSearchStore;

    incidentSvc = new IncidentService(this.props.appStore);

    state = {
        mapDrawCurrentState: '',
    };

    pointName = this.props.t('Điểm') || 'Điểm';
    lineName = this.props.t('Đường') || 'Đường';
    polygonName = this.props.t('Vùng') || 'Vùng';
    labelName = this.props.t('Nhãn') || 'Nhãn';

    handleClose = () =>
    {
        const draw = this.sketchMapStore.controls.controlDrawTool;

        if (draw)
        {
            draw.deleteAll();
        }
    };

    buildMyControl(control, oldControl = undefined)
    {
        const type = control.features[0].geometry.type;
        const geometry = control.features[0].geometry;
        let des = '';
        let opacity,
            width,
            color;

        switch (type)
        {
            case 'Point':
                des = geometry.coordinates[1].toFixed(6) + ', ' + geometry.coordinates[0].toFixed(6);
                color = Constants.MAP_OBJECT_MARKER_COLOR;
                break;
            case 'Polygon':
                des = (area(geometry) / 1000000).toFixed(2) + ' km²';
                opacity = Constants.MAP_OBJECT_POLYGON_OPACITY;
                width = Constants.MAP_OBJECT_LINE_WIDTH;
                color = Constants.MAP_OBJECT_POLYGON_COLOR;
                break;
            case 'LineString':
                des = length(geometry).toFixed(2) + ' km';
                opacity = Constants.MAP_OBJECT_LINE_OPACITY;
                width = Constants.MAP_OBJECT_LINE_WIDTH;
                color = Constants.MAP_OBJECT_LINE_COLOR;
                break;
            default:
        }

        return {
            id: control.features[0].id,
            type: type,
            coords: control.features[0].geometry.coordinates,
            des: des,
            color: oldControl ? oldControl.color : color,
            opacity: oldControl ? oldControl.opacity : opacity,
            width: oldControl ? oldControl.width : width,
            styleLine: oldControl ? oldControl.styleLine : 'Normal',
            styleArrowLine: oldControl ? oldControl.styleArrowLine : 'Normal',
            icon: oldControl && oldControl.icon ? oldControl.icon : 'map-marker',
            media: oldControl && oldControl.media ? oldControl.media : undefined,
            markerType: oldControl && oldControl.markerType ? oldControl.markerType : 'icon',
        };
    }

    buildMyLabel(lng, lat)
    {
        return {
            id: CommonHelper.uuid(),
            type: 'Label',
            coords: [lng, lat],
            des: this.labelName,
            color: Constants.COLORS[0][0],
            fontSize: Constants.LABEL_FONTSIZE,
        };
    }

    onControlCreate = (control) =>
    {
        const isOpen = this.sketchMapStore.controls.isOpen;

        if (control.features && control.features[0])
        {
            const checkingControl = this.sketchMapStore.controls.listControl.find((c) => c.id === control.features[0].id);
            if (!checkingControl)
            {
                delete control.target;

                const type = control.features[0].geometry.type;
                const ctl = {
                    showControl: this.buildMyControl(control),
                    mapControl: control,
                    id: control.features[0].id,
                    type: type,
                    uncommitted: true,
                    title: type === 'Point' ? this.pointName : type === 'Polygon' ? this.polygonName : type === 'Label' ? this.labelName : this.lineName,
                };

                this.sketchMapStore.addControl(ctl);
                this.sketchMapStore.renderMapboxDrawControl(ctl);

                this.setState({ mapDrawCurrentState: '' });
            }
        }
        // if hiding mapDraw, this will open all map draw sketchmap
        !isOpen && this.handleOpenHide();
    };

    onControlDelete = (control) =>
    {
        this.sketchMapStore.removeControl(control.features[0].id);
    };

    onControlUpdate = (control) =>
    {
        delete control.target;

        let ctl = this.sketchMapStore.controls.listControl.find((c) => c.id === control.features[0].id);

        if (ctl)
        {
            ctl.showControl = this.buildMyControl(control, ctl.showControl);
            ctl.mapControl = control;

            this.sketchMapStore.updateControl(ctl);
        }
        else
        {
            ctl = {
                showControl: this.buildMyControl(control),
                mapControl: control,
                id: control.features[0].id,
                type: control.features[0].geometry.type,
            };

            this.sketchMapStore.addControl(ctl);
        }

        this.sketchMapStore.renderMapboxDrawControl(ctl);
    };

    onControlSelectionChange = (control) =>
    {
        if (control.features.length > 0)
        {
            const stylingControl = this.sketchMapStore.controls.listControl.find((c) => c.id === control.features[0].id);

            if (stylingControl)
            {
                this.sketchMapStore.setSelectedControl(stylingControl.id);
                this.sketchMapStore.setStylingControl(stylingControl);

                if (stylingControl.showControl.markerType === 'video')
                {
                    this.sketchMapStore.showVideoPopup(stylingControl);
                }

                if (this.sketchMapStore.isLock(stylingControl.id) || stylingControl.readOnly)
                {
                    this.sketchMapStore.controls.controlDrawTool.changeMode('disable_drag', { featureIds: [stylingControl.id] });
                }
            }
        }
        else
        {
            // this.sketchMapStore.setStylingControl();
            // this.sketchMapStore.setSelectedControl();
        }
    };

    onDrawRender = () =>
    {
        const selected = this.sketchMapStore.controls.controlDrawTool.getSelected();
        if (selected.features.length > 0)
        {
            const c = this.sketchMapStore.controls.listControl.find((c) => c.id === selected.features[0].id);
            if (c)
            {
                this.sketchMapStore.drawArrow(c, this.mapStore.map, selected.features[0]);
            }
        }
    };

    componentDidMount()
    {
        if (!this.incidentStore.incident)
        {
            return;
        }

        const disableDrag = CommonHelper.clone(MapboxDraw.modes.simple_select);
        disableDrag.dragMove = () =>
        {
        };

        const drawOptions = {
            modes: {
                ...MapboxDraw.modes,
                disable_drag: disableDrag,
            },
            clickBuffer: 3,
            displayControlsDefault: false,
            controls: { point: false, line_string: false, polygon: false, trash: false },
            userProperties: true,
            styles: [
                // POLYGON
                // polygon fill use user color, opacity when inactive
                {
                    'id': 'gl-draw-polygon-fill-inactive',
                    'type': 'fill',
                    'filter': ['all',
                        ['==', '$type', 'Polygon'],
                    ],
                    'paint': {
                        'fill-color': ['coalesce', ['get', 'user_color'], Constants.MAP_OBJECT_POLYGON_COLOR],
                        'fill-outline-color': ['coalesce', ['get', 'user_color'], Constants.MAP_OBJECT_POLYGON_COLOR],
                        'fill-opacity': ['coalesce', ['get', 'user_opacity'], Constants.MAP_OBJECT_POLYGON_OPACITY],
                    },
                },
                // polygon stroke use user color, opacity when inactive, fix width
                {
                    'id': 'gl-draw-polygon-stroke-inactive',
                    'type': 'line',
                    'filter': ['all',
                        ['==', 'active', 'false'],
                        ['==', '$type', 'Polygon'],
                    ],
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    'paint': {
                        'line-color': ['coalesce', ['get', 'user_color'], Constants.MAP_OBJECT_POLYGON_COLOR],
                        'line-opacity': ['coalesce', ['get', 'user_opacity'], Constants.MAP_OBJECT_POLYGON_OPACITY],
                        'line-width': 3,
                    },
                },
                // polygon selected fill style - we don't want it
                // polygon selected stroke style / line selected
                // this is also for when drawing line, also for drawing polygon first edge
                {
                    'id': 'gl-draw-polygon-stroke-active',
                    'type': 'line',
                    'filter': ['all',
                        ['==', 'active', 'true'],
                        ['any',
                            ['==', '$type', 'Polygon'],
                            ['==', '$type', 'LineString'],
                        ],
                    ],
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    'paint': {
                        'line-color': ['coalesce', ['get', 'user_color'], Constants.MAP_OBJECT_LINE_COLOR],
                        'line-dasharray': [0.2, 2],
                        'line-width': 2,
                    },
                },

                // LINE
                // we need 3 separate for dash because mapbox didn't support data driven for it yet
                {
                    'id': 'gl-draw-line-normal-inactive',
                    'type': 'line',
                    'filter': ['all',
                        ['==', '$type', 'LineString'],
                        ['has', 'user_normalStyle'],
                    ],
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    'paint': {
                        'line-color': ['coalesce', ['get', 'user_color'], Constants.MAP_OBJECT_LINE_COLOR],
                        'line-width': ['coalesce', ['get', 'user_width'], Constants.MAP_OBJECT_LINE_WIDTH],
                    },
                },
                {
                    'id': 'gl-draw-line-dash-inactive',
                    'type': 'line',
                    'filter': ['all',
                        ['==', '$type', 'LineString'],
                        ['has', 'user_dashStyle'],
                    ],
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    'paint': {
                        'line-color': ['coalesce', ['get', 'user_color'], Constants.MAP_OBJECT_LINE_COLOR],
                        'line-width': ['coalesce', ['get', 'user_width'], Constants.MAP_OBJECT_LINE_WIDTH],
                        'line-dasharray': [4, 3],
                    },
                },
                {
                    'id': 'gl-draw-line-dot-inactive',
                    'type': 'line',
                    'filter': ['all',
                        ['==', '$type', 'LineString'],
                        ['has', 'user_dotStyle'],
                    ],
                    'layout': {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    'paint': {
                        'line-color': ['coalesce', ['get', 'user_color'], Constants.MAP_OBJECT_LINE_COLOR],
                        'line-width': ['coalesce', ['get', 'user_width'], Constants.MAP_OBJECT_LINE_WIDTH],
                        'line-dasharray': [0.1, 2],
                    },
                },
                // POINT
                // point stroke inactive
                {
                    'id': 'gl-draw-point-stroke-inactive',
                    'type': 'circle',
                    'filter': ['all',
                        ['==', 'active', 'false'],
                        ['==', '$type', 'Point'],
                        ['==', 'meta', 'feature'],
                        ['!=', 'user_markerType', 'image'],
                    ],
                    'paint': {
                        'circle-radius': 16,
                        'circle-opacity': 1,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#949494',
                        'circle-color': ['get', 'user_color'],
                    },
                },
                // point stroke active
                {
                    'id': 'gl-draw-point-stroke-active',
                    'type': 'circle',
                    'filter': ['all',
                        ['==', '$type', 'Point'],
                        ['==', 'active', 'true'],
                        ['==', 'meta', 'feature'],
                        ['!=', 'user_markerType', 'image'],
                    ],
                    'paint': {
                        'circle-radius': 16,
                        'circle-stroke-width': 3,
                        'circle-color': ['get', 'user_color'],
                        'circle-stroke-color': '#fff',
                    },
                },
                // point icon
                {
                    'id': 'gl-draw-point-icon',
                    'type': 'symbol',
                    'filter': ['all',
                        ['!=', 'user_markerType', 'image'],
                    ],
                    'layout': {
                        'text-field': ['get', 'user_iconText'],
                        'text-font': ['Font Awesome Pro Light'],
                        'text-size': 16,
                        'text-ignore-placement': true, // important, reduce flickering when drag
                        'text-allow-overlap': true, // important, reduce flickering when drag
                    },
                    'paint': {
                        'text-color': '#fff',
                        'text-translate': [0, 3],
                    },
                },
                // image marker
                {
                    'id': 'gl-draw-point-image',
                    'type': 'symbol',
                    'filter': ['all',
                        ['==', '$type', 'Point'],
                        ['==', 'meta', 'feature'],
                        ['==', 'user_markerType', 'image'],
                    ],
                    'layout': {
                        'icon-image': ['get', 'user_iconImage'],
                        'icon-size': ['get', 'user_iconSize'],
                        'icon-allow-overlap': true, // important, reduce flickering when drag
                        'icon-ignore-placement': true, // important, reduce flickering when drag
                    },
                },
                // although the flickering is reduce but mapbox still have this issue with select/deselect
                // see more: https://github.com/mapbox/mapbox-gl-draw/issues/916

                // CONTROL POINTS
                // inactive - smaller one
                {
                    'id': 'gl-draw-vertex-inactive',
                    'type': 'circle',
                    'filter': ['all',
                        ['==', 'active', 'false'],
                        ['==', 'meta', 'vertex'],
                        ['==', '$type', 'Point'],
                    ],
                    'paint': {
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#ffffff',
                        'circle-radius': 5,
                        'circle-color': '#fbb03b',
                    },
                },

                // active - bigger one
                {
                    'id': 'gl-draw-vertex-active',
                    'type': 'circle',
                    'filter': ['all',
                        ['==', 'active', 'true'],
                        ['==', 'meta', 'vertex'],
                        ['==', '$type', 'Point'],
                    ],
                    'paint': {
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#ffffff',
                        'circle-radius': 7,
                        'circle-color': '#fbb03b',
                    },
                },
                // midpoint only one style
                {
                    'id': 'gl-draw-midpoint',
                    'type': 'circle',
                    'filter': ['all',
                        ['==', '$type', 'Point'],
                        ['==', 'meta', 'midpoint'],
                    ],
                    'paint': {
                        'circle-radius': 5,
                        'circle-color': '#fbb03b',
                    },
                },
            ],
        };

        const draw = new MapboxDraw(drawOptions);
        this.mapStore.map.addControl(draw, 'bottom-right');
        this.mapStore.map.on('draw.create', this.onControlCreate);
        this.mapStore.map.on('draw.update', this.onControlUpdate);
        this.mapStore.map.on('draw.delete', this.onControlDelete);
        this.mapStore.map.on('draw.selectionchange', this.onControlSelectionChange);
        this.mapStore.map.on('draw.render', this.onDrawRender);
        this.mapStore.map.on('click', this.handleMapClick);

        this.sketchMapStore.setDrawTool(draw);
        this.sketchMapStore.openControl();

        document.body.addEventListener('click', this.handleLabelDrawingClickBody);

        WebSocketService.subscribeChanel('sketchmap', this.handleSketchMapUpdate);
        WebSocketService.subscribeChanel('sketchmap-lock', this.handleSketchMapLock);

        this.getSketchMap();
    }

    componentWillUnmount()
    {
        this.disposeAutoLoadSketchMap();
        this.clearCurrentControl();

        const draw = this.sketchMapStore.controls.controlDrawTool;

        this.mapStore.map.removeControl(draw);
        this.mapStore.map.off('draw.create', this.onControlCreate);
        this.mapStore.map.off('draw.update', this.onControlUpdate);
        this.mapStore.map.off('draw.delete', this.onControlDelete);
        this.mapStore.map.off('draw.selectionchange', this.onControlSelectionChange);
        this.mapStore.map.off('draw.render', this.onDrawRender);
        this.mapStore.map.off('click', this.handleMapClick);

        this.sketchMapStore.removeDrawTool();
        this.sketchMapStore.hideControl();
        this.sketchMapStore.resetDirty();

        document.body.removeEventListener('click', this.handleLabelDrawingClickBody);

        WebSocketService.leaveChanel('sketchmap', this.handleSketchMapUpdate);
        WebSocketService.leaveChanel('sketchmap-lock', this.handleSketchMapLock);
    }

    // Handle signal lock from websocket
    handleSketchMapLock = (event) =>
    {
        const isStyling = this.sketchMapStore.stylingControl && this.sketchMapStore.stylingControl.id === event.id;
        if (isStyling)
        {
            let control = this.sketchMapStore.stylingControl;
            control = {
                ...control,
                expiredLockDateTime: event.expiredLockDateTime,
                lockSession: event.lockSession,
            };

            this.sketchMapStore.updateWithoutLock(control);
            if (this.sketchMapStore.isLock(control.id))
            {
                this.sketchMapStore.setStylingControl();
            }
            else
            {
                this.sketchMapStore.setStylingControl(control);
                this.sketchMapStore.drawArrow(control, this.mapStore.map, control.mapControl.features[0]);
            }
        }
        else
        {
            let control = this.sketchMapStore.controls.listControl.find((c) => c.id === event.id);
            if (control)
            {
                control = {
                    ...control,
                    expiredLockDateTime: event.expiredLockDateTime,
                    lockSession: event.lockSession,
                };

                this.sketchMapStore.updateWithoutLock(control);
                if (this.sketchMapStore.controls.selectedControlId === event.id)
                {
                    this.sketchMapStore.setSelectedControl();
                    if (control.type !== 'Label')
                    {
                        this.sketchMapStore.controls.controlDrawTool.changeMode('simple_select');
                        this.sketchMapStore.drawArrow(control, this.mapStore.map, control.mapControl.features[0]);
                    }
                }
            }
        }
    };

    // Handle signal update from websocket
    handleSketchMapUpdate = (event) =>
    {
        if (this.incidentStore.incident.headerInfo.id === event.incidentId)
        {
            const controls = [];
            let isDirty = false;
            const now = new Date();

            event.data.forEach((f) =>
            {
                if (f.expiredLockDateTime && typeof f.expiredLockDateTime === 'string')
                {
                    f.expiredLockDateTime = new Date(f.expiredLockDateTime);
                }

                if (!f.expiredLockDateTime || !f.lockSession || f.expiredLockDateTime.getTime() <= now.getTime())
                {
                    controls.push(f);
                }
                else if (f.lockSession !== this.sketchMapStore.controls.getSessionLock())
                {
                    controls.push(f);
                }
                else if (f.lockSession === this.sketchMapStore.controls.getSessionLock())
                {
                    isDirty = true;
                    const control = this.sketchMapStore.controls.listControl.find((feature) => feature.id === f.id);
                    if (control)
                    {
                        controls.push(control);
                    }
                }
            });

            this.sketchMapStore.controls.listControl.forEach((f) =>
            {
                if (controls.find((feature) => feature.id === f.id) === undefined)
                {
                    if (!this.sketchMapStore.isLock(f.id))
                    {
                        controls.push(f);
                        isDirty = true;
                    }
                }
            });

            this.sketchMapStore.setFullControl(controls);

            if (this.sketchMapStore.controls.isOpen && this.sketchMapStore.controls.controlDrawTool)
            {
                this.sketchMapStore.loadSketchMapData();
            }

            if (!isDirty)
            {
                this.sketchMapStore.resetDirty();
            }
        }
    };

    disposeAutoLoadSketchMap = autorun(() =>
    {
        // be careful and remember to dispose this when component unmount
        const incident = this.incidentStore.incident;
        if (typeof this.clearCurrentControl === 'function')
        {
            this.clearCurrentControl();
            this.getSketchMap(incident);
        }
    });

    clearCurrentControl = () =>
    {
        const draw = this.sketchMapStore.controls.controlDrawTool;
        if (draw)
        {
            draw.deleteAll();
        }

        this.sketchMapStore.removeAll();
        this.sketchMapStore.removeArrows(this.mapStore.map);
        this.sketchMapStore.setStylingControl(undefined);
        this.sketchMapStore.setSelectedControl(undefined);
    };

    getSketchMap = () =>
    {
        const incident = this.incidentStore.incident;

        if (incident)
        {
            this.incidentSvc.getSketchMap(incident.headerInfo.id).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    const data = rs.data || {};
                    this.sketchMapStore.resetDirty();
                    this.sketchMapStore.setFullControl(data.data || []);
                    this.sketchMapStore.controls.sketchMapCode = data.code;

                    if (this.sketchMapStore.controls.isOpen)
                    {
                        this.sketchMapStore.loadSketchMapData();
                    }
                }
                else
                {
                    this.sketchMapStore.setFullControl([]);
                }
            });
        }
    };

    handleApply = async () =>
    {
        for (const control of this.sketchMapStore.controls.listControl)
        {
            delete control.uncommitted;
        }

        const data = toJS(this.sketchMapStore.controls.listControl);

        const rs = await this.incidentSvc.commitSketchMap(data, this.sketchMapStore.controls.sketchMapCode,
            this.incidentStore.incident.headerInfo.id,
            this.sketchMapStore.controls.getSessionLock());

        if (rs.result === Enum.APIStatus.Success)
        {
            this.props.toast({ type: 'success', message: 'Cập nhật thành công' });

            this.sketchMapStore.controls.sketchMapCode = rs.data.code;
            this.sketchMapStore.resetDirty();

            // call on publish for sketchmap components - right now only geofence needed
            for (const control of this.sketchMapStore.controls.listControl)
            {
                if (control.components?.geofence)
                {
                    this.geofenceStore.handleOnPublish(control.components['geofence']);
                }
            }

            // refresh style control when submit
            this.sketchMapStore.refreshStyleControl();
        }
        else if (rs.result === Enum.APIStatus.SpecialCase)
        {
            this.props.toast({ type: 'info', message: 'Đã có bản cập nhật mới, hệ thống tự cập nhật mới...' });

            this.getSketchMap();
        }
        else
        {
            this.props.toast({ type: 'error', message: rs.errorMessage });
        }
    };

    handleCancel = async () =>
    {
        const rs = await this.incidentSvc.cancelSketchMap(this.incidentStore.incident.headerInfo.id, this.sketchMapStore.controls.getSessionLock());

        if (rs?.result === Enum.APIStatus.Success)
        {
            if (rs.data)
            {
                const incident = this.incidentStore.incident;
                this.getSketchMap(incident);
            }
            else
            {
                // cancel with never commit
                this.clearCurrentControl();
                this.sketchMapStore.resetDirty();
            }

            this.advanceSearchStore.clearResultBeforeSearch(this.advanceSearchStore.selectedQuery);
        }
    };


    handleOpenHide = () =>
    {
        const isOpen = this.sketchMapStore.controls.isOpen;
        const { mapDrawCurrentState } = this.state;

        if (isOpen)
        {
            this.advanceSearchStore.clearAllQueryResultOnMap();

            this.sketchMapStore.controls.controlDrawTool.deleteAll();
            this.sketchMapStore.setSelectedControl();
            this.sketchMapStore.hideControl();

            // must wait deleteAll() complete to avoid bug
            mapDrawCurrentState && this.handleResetMapDrawState();
        }
        else
        {
            this.sketchMapStore.openControl();
            this.sketchMapStore.loadSketchMapData();
        }
    };

    handleSetMapDrawState = (e, state) =>
    {
        e.stopPropagation();
        this.setState({ mapDrawCurrentState: state });

        if (state !== 'Label' && state !== '')
        {
            this.sketchMapStore.controls.controlDrawTool.changeMode(state);
        }
        else
        {
            this.sketchMapStore.controls.controlDrawTool.changeMode('simple_select');
        }
    };

    handleLabelDrawingClickBody = (event) =>
    {
        // not run  when hide sketch map - handleResetMapDrawState must run after mapDraw.deleteAll() to avoid bug
        const keepDrawingException = ['mapboxgl-canvas', 'btn-line-string', 'btn-polygon', 'btn-point', 'fa-font', 'toggle-sketch-map', 'fa-eye'];
        const keepDrawing = keepDrawingException.find((cls) => cls.indexOf(event.target.className) !== -1);

        if (!keepDrawing)
        {
            this.handleResetMapDrawState();
        }
    };

    handleResetMapDrawState = () =>
    {
        this.sketchMapStore.controls.controlDrawTool.changeMode('simple_select');
        this.setState({ mapDrawCurrentState: '' });
    };

    handleMapClick = (event) =>
    {
        const isOpen = this.sketchMapStore.controls.isOpen;

        if (this.state.mapDrawCurrentState === 'Label')
        {
            const ctl = {
                showControl: this.buildMyLabel(event.lngLat.lng, event.lngLat.lat),
                mapControl: undefined,
                type: 'Label',
                uncommitted: true,
                title: this.labelName,
            };

            ctl.id = ctl.showControl.id;
            this.sketchMapStore.addControl(ctl);

            // if hiding mapDraw, this will open all map draw sketchmap
            !isOpen && this.handleOpenHide();
            this.setState({ mapDrawCurrentState: '' });
        }
    };

    render()
    {
        const isOpen = this.sketchMapStore.controls.isOpen;

        return (
            <FlexPanel flex={1}>
                <PanelHeader
                    actions={[
                        {
                            icon: !isOpen ? 'eye-slash' : 'eye',
                            onClick: this.handleOpenHide,
                            className: 'toggle-sketch-map',
                        },
                    ]}
                >
                    Bản đồ tác chiến
                </PanelHeader>

                <ToolBarToggleButtonGroup
                    disabled={this.props.disabled}
                >
                    <ToolBarToggleButton
                        icon={'tool-select'}
                        active={this.state.mapDrawCurrentState === ''}
                        onClick={(e) => this.handleSetMapDrawState(e, '')}
                    />
                    <ToolBarToggleButton
                        icon={'tool-label'}
                        active={this.state.mapDrawCurrentState === 'Label'}
                        onClick={(e) => this.handleSetMapDrawState(e, 'Label')}
                    />
                    <ToolBarToggleButton
                        icon={'tool-add-marker'}
                        active={this.state.mapDrawCurrentState === 'draw_point'}
                        onClick={(e) => this.handleSetMapDrawState(e, 'draw_point')}
                    />
                    <ToolBarToggleButton
                        icon={'tool-add-line'}
                        active={this.state.mapDrawCurrentState === 'draw_line_string'}
                        onClick={(e) => this.handleSetMapDrawState(e, 'draw_line_string')}
                    />
                    <ToolBarToggleButton
                        icon={'tool-add-polygon'}
                        active={this.state.mapDrawCurrentState === 'draw_polygon'}
                        onClick={(e) => this.handleSetMapDrawState(e, 'draw_polygon')}
                    />
                </ToolBarToggleButtonGroup>

                <PanelBody>
                    <SketchControlList disabled={this.props.disabled} />
                </PanelBody>

                <PanelFooter
                    disabled={this.props.disabled}
                    actions={[
                        {
                            text: 'Hủy',
                            onClick: this.handleCancel,
                        },
                        {
                            text: 'Xuất bản',
                            disabled: !this.sketchMapStore.controls.isDirty,
                            isDirty: this.sketchMapStore.controls.isDirty,
                            onClick: this.handleApply,
                        },
                    ]}
                />
            </FlexPanel>
        );
    }
}

SketchMap.propTypes = {
    // className: PropTypes.string,
    disabled: PropTypes.bool,
};

SketchMap.defaultProps = {
    // className: '',
    // title: 'Facility Evacuation',
    disabled: false,
};

SketchMap = withI18n(withModal(inject('appStore')(observer(SketchMap))));
export { SketchMap };
