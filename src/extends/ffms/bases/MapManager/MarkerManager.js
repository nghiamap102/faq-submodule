import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Marker } from 'react-mapbox-gl';

import { Container, FAIcon } from '@vbd/vui';
import { PointMarker } from 'extends/ffms/bases/Marker/PointMarker';
import { TrackingMarker } from 'extends/ffms/bases/Marker/TrackingMarker';
import { CircleMarker } from 'extends/ffms/bases/Marker/CircleMarker';


class MarkerManager extends Component
{
    searchStore = this.props.appStore.searchStore;

    checkMarkerInMap = (marker) =>
    {
        return this.props.appStore.layerStore.checkExist(marker.layer);
    };

    handleContextMarkerMenu = (e, lngLat) =>
    {
        e.preventDefault();

        this.props.onContextMenu && this.props.onContextMenu(this.props.map, {
            point: { x: e.clientX, y: e.clientY },
            lngLat,
        });
    };

    render()
    {
        const markers = [];
        for (const marker of this.props.appStore.markerStore.markers)
        {
            if (marker.draw !== 'symbol' && marker.draw !== 'point' && this.checkMarkerInMap(marker))
            {
                markers.push(
                    <Marker
                        key={marker.id}
                        coordinates={[marker.lng, marker.lat]}
                        offset={[0, (marker.size || 48) / 2]}
                        anchor="bottom"
                    >
                        <Container
                            onContextMenu={e => this.handleContextMarkerMenu(e, marker)}
                        >
                            {
                                marker.type === 'tracking' ?
                                    <TrackingMarker
                                        {...marker}
                                        isShowLabel={this.props.appStore.layerStore.isShowLabel}
                                    /> :
                                    <CircleMarker {...marker}/>
                            }
                        </Container>
                    </Marker>,
                );
            }
            
            if (marker.draw === 'point' && this.checkMarkerInMap(marker))
            {
                markers.push(
                    <Marker
                        key={marker.id}
                        coordinates={[marker.lng, marker.lat]}
                        anchor={marker.anchor} // default anchor:'bottom'
                        offset={marker.offset} // default offset: [0,0]
                    >
                        {
                            marker.type === 'tracking' ?
                                <TrackingMarker
                                    {...marker}
                                    isShowLabel={this.props.appStore.layerStore.isShowLabel}
                                /> :
                                <PointMarker {...marker} />
                        }
                    </Marker>,
                );
            }
        }

        if (this.searchStore.selectedResult || this.searchStore.whatHereLocation)
        {
            const { selectedResult, whatHereLocation } = this.searchStore;

            selectedResult && markers.push(
                <Marker
                    key='search-location'
                    coordinates={[selectedResult.longitude, selectedResult.latitude]}
                    anchor="bottom"
                >
                    <Container
                        onContextMenu={e => this.handleContextMarkerMenu(e, {
                            lat: selectedResult.latitude,
                            lng: selectedResult.longitude,
                        })}
                    >
                        <FAIcon
                            icon='map-marker-alt'
                            color='red'
                            type='solid'
                            size='24pt'
                        />
                    </Container>
                </Marker>,
            );

            whatHereLocation && !(whatHereLocation?.longitude === selectedResult?.longitude && whatHereLocation?.latitude === selectedResult?.latitude) && markers.push(
                <Marker
                    key='search-location'
                    coordinates={[whatHereLocation.longitude, whatHereLocation.latitude]}
                    anchor="bottom"
                >
                    <Container
                        onContextMenu={e => this.handleContextMarkerMenu(e, { lat: whatHereLocation.latitude, lng: whatHereLocation.longitude })}
                    >
                        <CircleMarker
                            icon={'question'}
                            size={40}
                            color={'white'}
                            backgroundColor={'red'}
                        />
                    </Container>
                </Marker>,
            );
        }

        return markers;
    }
}

MarkerManager = inject('appStore')(observer(MarkerManager));
export default MarkerManager;
