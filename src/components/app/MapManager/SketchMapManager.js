import './SketchMapManager.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import { CommonHelper } from 'helper/common.helper';

class SketchMapManager extends Component
{
    geofenceStore = this.props.appStore.geofenceStore;
    sketchMapStore = this.props.appStore.sketchMapStore;
    incidentStore = this.props.appStore.incidentStore;
    advanceSearchStore = this.props.appStore.advanceSearchStore;
    blockadeStore = this.props.appStore.blockadeStore;
    markerPopupStore = this.props.appStore.markerPopupStore;

    componentDidMount()
    {
        if (!this.flagInitLayer)
        {
            this.advanceSearchStore.mapUtil.initBufferLayers();
            this.flagInitLayer = true;
        }
        if (!this.geofenceStore.flagInitLayer)
        {
            this.geofenceStore.mapUtil.initGeofenceLayers();
            this.geofenceStore.flagInitLayer = true;
        }
        if (!this.blockadeStore.flagInitLayer)
        {
            this.blockadeStore.mapUtil.initBlockadeLayers();
            this.blockadeStore.flagInitLayer = true;
        }
    }

    watchSelection = reaction(
        () =>
        {
            return {
                markerType: this.sketchMapStore.stylingControl ? this.sketchMapStore.stylingControl.showControl.markerType : undefined,
                media: this.sketchMapStore.stylingControl && this.sketchMapStore.stylingControl.showControl.media ?
                    this.sketchMapStore.stylingControl.showControl.media.data : null
                // selectedControlId: this.sketchMapStore.controls.selectedControlId
            };
        },
        (data) =>
        {
            const control = this.sketchMapStore.stylingControl;
            if (control && control.showControl.media && data.markerType === 'video')
            {
                this.sketchMapStore.showVideoPopup();
            }
            else if (this.currentVideoPopupId && this.currentVideoPopupId === control.selectedControlId)
            {
                this.markerPopupStore.remove(this.currentVideoPopupId);
            }
        }
    );

    watchListControl = reaction(
        () =>
        {
            return {
                listControl: this.sketchMapStore.controls.listControl.map((c) => c.type !== 'Label' ? c.mapControl.features[0] : null),
                selectedControlId: this.sketchMapStore.controls.selectedControlId,
                hookToRoad: this.sketchMapStore.getSelectedControl() ? this.sketchMapStore.getSelectedControl().hookToRoad : false,
                isOpen: this.sketchMapStore.controls.isOpen
            };
        },
        () =>
        {
            const selectedControl = this.sketchMapStore.getSelectedControl();
            const isOpen = this.sketchMapStore.controls.isOpen;
            const listControl = isOpen ? this.sketchMapStore.controls.listControl : [];

            this.advanceSearchStore.initDrawnObjects(listControl, selectedControl);
            if (selectedControl && selectedControl.type !== 'Label' && selectedControl.components.advanceSearch.isEnabled)
            {
                this.advanceSearchStore.clearQueryResultOnMap(selectedControl.components.advanceSearch);
                setTimeout(() =>
                {
                    this.advanceSearchStore.doSearch(selectedControl.components.advanceSearch, false);
                }, 300);
            }

            this.geofenceStore.initDrawnObjects(listControl, selectedControl);

            this.blockadeStore.initDrawnObjects(listControl, selectedControl);
        }
    );

    watchIncident = reaction(
        () => this.incidentStore.incident,
        () =>
        {
            const listObj = CommonHelper.clone(this.advanceSearchStore.drawnObjects);
            const incident = this.incidentStore.incident;

            if (!incident)
            {
                this.advanceSearchStore.clearAllQueryResultOnMap();
            }

            const waitForSketchmapRender = setInterval(() =>
            {
                if (this.advanceSearchStore.drawnObjects.length && listObj !== this.advanceSearchStore.drawnObjects)
                {
                    clearInterval(waitForSketchmapRender);
                    this.advanceSearchStore.clearAllQueryResultOnMap();
                    this.advanceSearchStore.searchAll();
                }
            }, 200);
        }
    );

    render()
    {
        return <></>;
    }
}

SketchMapManager = inject('appStore')(observer(SketchMapManager));
export default SketchMapManager;

