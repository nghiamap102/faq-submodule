import './SketchControlList.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import mapboxgl from 'mapbox-gl';

import {
    ScrollView, Row,
    ListItem, FAIcon,
    withModal,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';

class SketchControlList extends Component
{
    sketchMapStore = this.props.appStore.sketchMapStore;
    markerPopupStore = this.props.appStore.markerPopupStore;
    mapStore = this.props.appStore.mapStore;
    advanceSearchStore = this.props.appStore.advanceSearchStore;

    componentWillUnmount()
    {
        this.sketchMapStore.setStylingControl();
    }

    fitBound = (obj) =>
    {
        const bounds = new mapboxgl.LngLatBounds();

        if (obj.type === 'Label' || obj.type === 'Point')
        {
            bounds.extend(obj.showControl.coords);
        }
        else if (obj.type === 'LineString')
        {
            obj.showControl.coords.forEach((coord) =>
            {
                bounds.extend(coord);
            });
        }
        else
        {
            obj.showControl.coords[0].forEach((coord) =>
            {
                bounds.extend(coord);
            });
        }

        this.mapStore.map.fitBounds(bounds, {
            padding: { top: 10, bottom: 10, left: 840, right: 10 },
            maxZoom: 15,
        });
    };

    handleControlSelected = (control, isLock) =>
    {
        this.handleOpenDrawMap();

        if (control.type !== 'Label')
        {
            if (isLock || control.readOnly || this.props.disabled)
            {
                this.sketchMapStore.controls.controlDrawTool.changeMode('disable_drag', { featureIds: [control.id] });
            }
            else
            {
                this.sketchMapStore.controls.controlDrawTool.changeMode('simple_select', { featureIds: [control.id] });
            }
        }

        this.sketchMapStore.setSelectedControl(control.id);
        this.sketchMapStore.setStylingControl(control);

        this.fitBound(control);
    };

    handleDeleteObject = (obj) =>
    {
        const draw = this.sketchMapStore.controls.controlDrawTool;
        if (draw)
        {
            draw.delete([obj.id]);
        }

        this.sketchMapStore.removeControl(obj.id);
        this.advanceSearchStore.clearResultBeforeSearch(this.advanceSearchStore.selectedQuery);
    };

    handleClickMenu = (e, obj) =>
    {
        e.stopPropagation();
        const actions = [];
        
        if (obj)
        {
            actions.push(
                {
                    label: 'Xóa',
                    onClick: () =>
                    {
                        this.handleDeleteObject(obj);
                    },
                },
            );
        }

        this.props.menu({
            id: 'place-list-more-action',
            isTopLeft: true,
            position: { x: e.clientX, y: e.clientY },
            actions: actions,
        });
    };

    handleOpenDrawMap = () =>
    {
        const isOpen = this.sketchMapStore.controls.isOpen;

        if (!isOpen)
        {
            this.sketchMapStore.openControl();
            this.sketchMapStore.loadSketchMapData();
        }
    };

    getIconUrl(type, color)
    {
        const iconColor = CommonHelper.clone(encodeURIComponent(color));

        switch (type)
        {
            case 'Polygon':
                return `data:image/svg+xml;charset=utf-8,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9.717 4.728l4.368-.437a3 3 0 1 1 3.524 3.647l-1.252 9.387a3 3 0 1 1-4.347 2.434l-3.827-1.701a3 3 0 1 1-2.892-4.973l.437-4.368a3 3 0 1 1 3.989-3.989zM6 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm9 4.001a1 1 0 1 1 .002 1.998A1 1 0 0 1 15 19.001zM7 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm.272 8.283a3 3 0 0 1 1.718 2.959l3.827 1.701c.415-.44.961-.754 1.575-.88l1.252-9.387a3.007 3.007 0 0 1-1.361-1.404l-4.368.436a3.002 3.002 0 0 1-2.207 2.207l-.436 4.368zM17.001 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="${iconColor}"/></svg>`;
            case 'Label':
                return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="35" height="35" class=""><g transform="matrix(0.681941 0 0 0.681941 81.4232 81.4232)"><path d="m124.007812 186.214844h30v-26h86.992188v191.785156h-24.746094v30h79.492188v-30h-24.746094v-191.785156h86.992188v26h30v-56h-263.984376zm0 0" fill="${iconColor}"/><path d="m129 35.75h41.976562v30h-41.976562zm0 0" fill="${iconColor}"/><path d="m199.675781 35.75h41.976563v30h-41.976563zm0 0" fill="${iconColor}"/><path d="m270.347656 35.75h41.980469v30h-41.980469zm0 0" fill="${iconColor}"/><path d="m341.023438 35.75h41.976562v30h-41.976562zm0 0" fill="${iconColor}"/><path d="m129 446.25h41.976562v30h-41.976562zm0 0" fill="${iconColor}"/><path d="m199.675781 446.25h41.976563v30h-41.976563zm0 0" fill="${iconColor}"/><path d="m270.347656 446.25h41.980469v30h-41.980469zm0 0" fill="${iconColor}"/><path d="m341.023438 446.25h41.976562v30h-41.976562zm0 0" fill="${iconColor}"/><path d="m446.25 129h30v41.976562h-30zm0 0" fill="${iconColor}"/><path d="m446.25 199.675781h30v41.976563h-30zm0 0" fill="${iconColor}"/><path d="m446.25 270.347656h30v41.976563h-30zm0 0" fill="${iconColor}"/><path d="m446.25 341.023438h30v41.976562h-30zm0 0" fill="${iconColor}"/><path d="m35.75 129h30v41.976562h-30zm0 0" fill="${iconColor}"/><path d="m35.75 199.675781h30v41.976563h-30zm0 0" fill="${iconColor}"/><path d="m35.75 270.347656h30v41.976563h-30zm0 0" fill="${iconColor}"/><path d="m35.75 341.023438h30v41.976562h-30zm0 0" fill="${iconColor}"/><path d="m0 101.5h101.5v-101.5h-101.5zm30-71.5h41.5v41.5h-41.5zm0 0" fill="${iconColor}"/><path d="m410.5 0v101.5h101.5v-101.5zm71.5 71.5h-41.5v-41.5h41.5zm0 0" fill="${iconColor}"/><path d="m0 512h101.5v-101.5h-101.5zm30-71.5h41.5v41.5h-41.5zm0 0" fill="${iconColor}"/><path d="m410.5 512h101.5v-101.5h-101.5zm30-71.5h41.5v41.5h-41.5zm0 0" fill="${iconColor}"/></g></svg>`;
            case 'LineString':
                return `data:image/svg+xml;charset=utf-8,<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.725 7.912l-.487 5.355A3.001 3.001 0 0 1 10 16v.026l5.693 2.058a3 3 0 1 1-.692 1.917v-.049l-5.679-2.053a3 3 0 1 1-3.046-4.81l.486-5.356a3 3 0 1 1 1.963.179zM7 15a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm11.001 4.001a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM8 4a1 1 0 1 1 .002 1.998A1 1 0 0 1 8 4z" fill="${iconColor}"/></svg>`;
            default:
                return undefined;
        }
    }

    render()
    {
        const listControl = this.sketchMapStore.controls.listControl;
        const selectedId = this.sketchMapStore.controls.selectedControlId;

        return (
            <ScrollView>
                {
                    listControl.map((control) =>
                    {
                        const type = control.type === 'Point' ? 'Điểm' : control.type === 'Polygon' ? 'Vùng' : control.type === 'Label' ? 'Nhãn' : 'Đường';
                        const isLock = this.sketchMapStore.isLock(control.id);
                        const isDirty = this.sketchMapStore.isControlDirty(control);

                        return (
                            <ListItem
                                key={control.id}
                                label={(control.title ? control.title : type) + (isLock ? ' (Khóa)' : '')}
                                isImportant={isDirty}
                                sub={control.showControl.des}
                                iconUrl={this.getIconUrl(control.type, control.showControl.color)}
                                iconClass={control.type === 'Point' ? (control.showControl.icon ? control.showControl.icon : 'map-marker') : undefined}
                                iconColor={control.showControl.color}
                                active={selectedId === control.id}
                                trailing={
                                    !control.readOnly && !this.props.disabled
                                        ? (
                                                <Row
                                                    width='24px'
                                                    height='24px'
                                                    mainAxisAlignment='center'
                                                    crossAxisAlignment='center'
                                                    onClick={event => this.handleClickMenu(event, control)}
                                                >
                                                    <FAIcon
                                                        icon="ellipsis-v"
                                                        type='regular'
                                                        size="1.5rem"
                                                        disabled={isLock || control.readOnly || this.props.disabled}
                                                    />
                                                </Row>
                                            )
                                        : null
                                }
                                onClick={() =>
                                {
                                    this.handleControlSelected(control, isLock);
                                }}
                            />
                        );
                    })
                }
            </ScrollView>
        );
    }
}

SketchControlList = withModal(inject('appStore')(observer(SketchControlList)));
export default SketchControlList;
