import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Marker } from 'react-mapbox-gl';

import { Container, FAIcon, CircleMarker, PointMarker, TrackingMarker } from '@vbd/vui';

class MarkerManager extends Component
{
    eventStore = this.props.appStore.eventStore;
    incidentStore = this.props.appStore.incidentStore;
    searchStore = this.props.appStore.searchStore;
    blockadeStore = this.props.appStore.blockadeStore;
    caseHandlingStore = this.props.appStore.caseHandlingStore;

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
                                marker.type === 'tracking'
                                    ? (
                                            <TrackingMarker
                                                {...marker}
                                                isShowLabel={this.props.appStore.layerStore.isShowLabel}
                                            />
                                        )
                                    : <CircleMarker {...marker} />
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
                            marker.type === 'tracking'
                                ? (
                                        <TrackingMarker
                                            {...marker}
                                            isShowLabel={this.props.appStore.layerStore.isShowLabel}
                                        />
                                    )
                                : <PointMarker {...marker} />
                        }
                    </Marker>,
                );
            }
        }

        if (this.eventStore.isShowDetail && this.eventStore.event && this.eventStore.event.messageData)
        {
            markers.push(
                <Marker
                    key="event-location"
                    coordinates={this.eventStore.event.messageData.Shape.coordinates}
                    anchor="top-left"
                    offset={[-24, -24]}
                >
                    <Container
                        onContextMenu={e => this.handleContextMarkerMenu(e, {
                            lat: this.eventStore.event.messageData.Shape.coordinates[1],
                            lng: this.eventStore.event.messageData.Shape.coordinates[0],
                        })}
                    >
                        <CircleMarker
                            icon={'bell'}
                            size={48}
                            color={'white'}
                            backgroundColor={'#e2b100'}
                        />
                    </Container>
                </Marker>);
        }

        if (this.incidentStore.isShowDetail && this.incidentStore.incident)
        {
            markers.push(
                <Marker
                    key="incident-location"
                    coordinates={[this.incidentStore.incident.longitude, this.incidentStore.incident.latitude]}
                    anchor="top-left"
                    offset={[-24, -24]}
                >
                    <Container
                        onContextMenu={e => this.handleContextMarkerMenu(e, {
                            lat: this.incidentStore.incident.latitude,
                            lng: this.incidentStore.incident.longitude,
                        })}
                    >
                        <CircleMarker
                            icon={'exclamation-triangle'}
                            size={48}
                            color={'white'}
                            backgroundColor={'red'}
                        />
                    </Container>
                </Marker>);
        }

        if (this.searchStore.selectedResult || this.searchStore.whatHereLocation)
        {
            const { selectedResult, whatHereLocation } = this.searchStore;

            selectedResult && markers.push(
                <Marker
                    key="search-location"
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
                            icon="map-marker-alt"
                            color="red"
                            type="solid"
                            size="24pt"
                        />
                    </Container>
                </Marker>,
            );

            whatHereLocation && !(whatHereLocation?.longitude === selectedResult?.longitude && whatHereLocation?.latitude === selectedResult?.latitude) && markers.push(
                <Marker
                    key="search-location"
                    coordinates={[whatHereLocation.longitude, whatHereLocation.latitude]}
                    anchor="bottom"
                >
                    <Container
                        onContextMenu={e => this.handleContextMarkerMenu(e, {
                            lat: whatHereLocation.latitude,
                            lng: whatHereLocation.longitude,
                        })}
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

        if (this.caseHandlingStore.handlingCase)
        {

            const location = JSON.parse(this.caseHandlingStore.handlingCase.Location);
            markers.push(
                <Marker
                    key="case-location"
                    coordinates={[location.coordinates[0], location.coordinates[1]]}
                    anchor="top-left"
                    offset={[-24, -24]}
                >
                    <CircleMarker
                        icon={'briefcase'}
                        size={48}
                        color={'white'}
                        backgroundColor={'red'}
                    />
                </Marker>);
        }

        return markers;
    }
}

MarkerManager = inject('appStore')(observer(MarkerManager));
export default MarkerManager;
