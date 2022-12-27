import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Feature, Layer } from 'react-mapbox-gl';
import { CommonHelper } from 'helper/common.helper';
import { MapContextGroup } from 'components/app/MapContextButton/MapContextGroup';

class SymbolManager extends Component
{
    incidentStore = this.props.appStore.incidentStore;
    blockadeStore = this.props.appStore.blockadeStore;
    markerStore = this.props.appStore.markerStore;

    checkMarkerInMap = (marker) =>
    {
        return this.props.appStore.layerStore.checkExist(marker.layer);
    };

    handleClick = (marker, event) =>
    {
        // stop propagate to behind marker
        if (marker.id === event.features[0].properties.Id)
        {
            if ((event.originalEvent.ctrlKey || event.originalEvent.metaKey) && event.originalEvent.button === 0)
            {
                marker.onActiveMarker();
            }
            else
            {
                marker.onClick(marker);
            }

            event.originalEvent.cancelBubble = true;
        }
    };


    render()
    {
        const features = [];
        let iconType = 'Font Awesome Pro Light';

        for (const marker of this.markerStore.markers)
        {
            if (marker.draw === 'symbol' && this.checkMarkerInMap(marker))
            {
                const cloneMarker = JSON.parse(JSON.stringify(marker));

                cloneMarker.Id = marker.id;
                cloneMarker.iconText = CommonHelper.getFontAwesomeStringFromClassName(marker.icon);
                cloneMarker.fontSize = marker.size / 2;
                iconType = marker.iconType || 'Font Awesome Pro Light';

                cloneMarker.color = marker.active ? (marker.activeColor ?? '#0086ff') : marker.color;
                cloneMarker.background = marker.active ? (marker.activeBackground ?? '#fff') : (marker.background ?? '#333');
                cloneMarker.halo = marker.active ? (marker.activeHalo ?? '#0086ff') : (marker.halo ?? '#966500');

                features.push(
                    <Feature
                        key={cloneMarker.id}

                        coordinates={[cloneMarker.lng, cloneMarker.lat]}
                        properties={cloneMarker}
                        onClick={this.handleClick.bind(this, marker)}
                    />
                );
            }
        }

        if (Array.isArray(this.incidentStore.incidentNearestMarkers))
        {
            for (const marker of this.incidentStore.incidentNearestMarkers)
            {
                marker.Id = marker.id;
                marker.iconText = CommonHelper.getFontAwesomeStringFromClassName(marker.icon);

                features.push(
                    <Feature
                        key={marker.id}
                        coordinates={[marker.lng, marker.lat]}
                        properties={marker}
                        onClick={this.handleClick.bind(this, marker)}
                    />
                );
            }
        }

        if (this.blockadeStore && this.blockadeStore.drawnObjects)
        {
            this.blockadeStore.drawnObjects.forEach((obj) =>
            {
                if (obj.isEnabled && obj.flagpolesMarker && obj.flagpolesMarker.length > 0)
                {
                    obj.flagpolesMarker.forEach((marker, index) =>
                    {
                        marker.Id = marker.id;
                        marker.iconText = CommonHelper.getFontAwesomeStringFromClassName(marker.icon);

                        features.push(
                            <Feature
                                key={marker.id}
                                coordinates={[marker.lng, marker.lat]}
                                properties={marker}
                            />
                        );
                    });
                }
            });
        }

        return (
            <>
                <Layer
                    type="symbol"
                    id="symbol-marker-label"
                    layout={{
                        'text-field': '{text}',
                        'text-font': ['Roboto Medium'],
                        'text-size': 14,
                        'text-anchor': 'left',
                        'text-offset': [1.5, 0]
                    }}
                    paint={{
                        'text-color': '#fff',
                        'text-halo-color': ['get', 'halo'],
                        'text-halo-width': 1
                    }}
                >
                    {features}
                </Layer>

                <Layer
                    type="symbol"
                    id="symbol-marker"
                    layout={{
                        'text-field': '{iconText}',
                        'text-font': [iconType],
                        'text-size': ['get', 'fontSize']
                    }}
                    paint={{
                        'text-color': ['get', 'background'],
                        'text-halo-color': ['get', 'color'],
                        'text-halo-width': 2
                    }}
                >
                    {features}
                </Layer>
                {
                    this.markerStore.listActive.length > 0 && <MapContextGroup />
                }
            </>
        );
    }
}

SymbolManager = inject('appStore')(observer(SymbolManager));
export default SymbolManager;
