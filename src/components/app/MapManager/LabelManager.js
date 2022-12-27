import './LabelManager.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Marker } from 'react-mapbox-gl';

import { Container, Input } from '@vbd/vui';

import { Constants } from 'constant/Constants';

class LabelManager extends Component
{
    sketchMapStore = this.props.appStore.sketchMapStore;
    moveItemId = undefined;

    constructor(props)
    {
        super(props);

        this.state = {
            editItems: {},
            zoomLevel: window.map.getZoom(),
        };
    }

    handleValueChange = (control, event, isLock) =>
    {
        if (isLock)
        {
            return;
        }
        control.showControl.des = event;
        this.sketchMapStore.updateControl(control);
    };

    handleEditStateChange = (itemId, editing, isLock) =>
    {
        if (isLock)
        {
            return;
        }
        const state = this.state;
        state.editItems[itemId] = {
            isEditing: editing,
        };
        this.setState(state);
    };

    componentDidMount()
    {
        document.body.addEventListener('click', this.handleClickBody);
        document.body.addEventListener('mouseup', this.handleMovingMouseUp);

        window.map.on('mousemove', this.handleMovingMouseMove);
        window.map.on('zoom', this.handleMapZoom);
    }

    componentWillUnmount()
    {
        document.body.removeEventListener('click', this.handleClickBody);
        document.body.removeEventListener('mouseup', this.handleMovingMouseUp);

        window.map.off('mousemove', this.handleMovingMouseMove);
        window.map.off('zoom', this.handleMapZoom);
    }

    handleMapZoom = (event) =>
    {
        const state = this.state;
        state.zoomLevel = window.map.getZoom();
        this.setState(state);
    };

    handleMovingMouseUp = () =>
    {
        this.moveItemId = undefined;
    };

    handleMovingMouseDown = (id, isLock) =>
    {
        if (isLock)
        {
            return;
        }
        this.moveItemId = id;
    };

    handleSelectingControl = (control) =>
    {
        this.sketchMapStore.setSelectedControl(control.id);
        this.sketchMapStore.setStylingControl(control);
    };

    handleMovingMouseMove = (event) =>
    {
        if (this.moveItemId)
        {
            const control = this.sketchMapStore.controls.listControl.find((c) => c.id === this.moveItemId);
            if (control)
            {
                control.showControl.coords = [event.lngLat.lng, event.lngLat.lat];
                this.sketchMapStore.updateControl(control);
            }
        }
    };

    handleClickBody = (event) =>
    {
        if (typeof event.target.className === 'string' && !event.target.className.includes('item-input'))
        {
            const state = this.state;
            for (const item in state.editItems)
            {
                if (state.editItems.hasOwnProperty(item))
                {
                    state.editItems[item] = false;
                }
            }
            this.setState(state);
        }
    };

    render()
    {
        const markers = [];

        if (this.sketchMapStore.controls.isOpen)
        {
            const hideZoomLevelPercent = this.state.zoomLevel * 100 / 12.5;
            if (hideZoomLevelPercent > 50)
            {
                const selectedId = this.sketchMapStore.controls.selectedControlId;
                this.sketchMapStore.controls.listControl.forEach((c) =>
                {
                    if (c.type === 'Label')
                    {
                        const isLock = this.sketchMapStore.isLock(c.id);
                        const fontSize = (c.showControl.fontSize || Constants.LABEL_FONTSIZE) * hideZoomLevelPercent / 100;
                        markers.push(
                            <Marker
                                key={c.id}
                                coordinates={[c.showControl.coords[0], c.showControl.coords[1]]}
                                anchor="top-left"
                            >
                                <Container
                                    className={`label-item ${selectedId === c.id ? 'label-active' : ''}`}
                                    onMouseDown={() =>
                                    {
                                        this.handleMovingMouseDown(c.id, isLock);
                                    }}
                                    onClick={() =>
                                    {
                                        this.handleSelectingControl(c);
                                    }}
                                >
                                    {
                                        !this.state.editItems[c.id]?.isEditing
                                            ? (
                                                    <Container
                                                        style={{
                                                            fontSize: `${fontSize}px`,
                                                            fontweight: 'bold',
                                                            color: c.showControl.color,
                                                        }}
                                                        onClick={() =>
                                                        {
                                                            this.handleEditStateChange(c.id, true, isLock);
                                                        }}
                                                    >
                                                        {c.showControl.des}
                                                    </Container>
                                                )
                                            : (
                                                    <Input
                                                        className={'item-input'}
                                                        value={c.showControl.des}
                                                        width={'300px'}
                                                        onChange={(event) => this.handleValueChange(c, event, isLock)}
                                                    />
                                                )
                                    }
                                </Container>
                            </Marker>,
                        );
                    }
                });
            }
        }

        return markers;
    }
}

LabelManager = inject('appStore')(observer(LabelManager));
export default LabelManager;
