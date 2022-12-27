import './MapContent.scss';

import lightStyleOverride from './MapStyles/light-style.override';
import darkStyleOverride from './MapStyles/dark-style.override';
import defaultStyleOverride from './MapStyles/default-style.override';
import satelliteStyleOverride from './MapStyles/satellite-style.override';
import terrainStyleOverride from './MapStyles/terrain-style.override';
import boundaryStyleOverride from './MapStyles/boundary-style.override';

import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import {
    Container, Column, Positioned,
    Map, BoxSelectHandler,
    useModal,
} from '@vbd/vui';

import MarkerManager from 'components/app/MapManager/MarkerManager';
import SymbolManager from 'components/app/MapManager/SymbolManager';
import MarkerPopupManager from 'components/app/MapManager/MarkerPopupManager';
import LayerManager from 'components/app/MapManager/LayerManager';
import DirectionManager from 'components/app/MapManager/DirectionManager';
import IncidentDirectionManager from 'components/app/MapManager/IncidentDirectionManager';
import LabelManager from 'components/app/MapManager/LabelManager';
import SketchMapManager from 'components/app/MapManager/SketchMapManager';
import { AdminBoundaries } from 'components/app/Map/AdminBoundaries';
import MeasureDistance from 'components/app/Map/MeasureDistance';
import PopupNormalManager from 'components/app/MapManager/PopupNormalManager';
import WhatHerePopupContent from 'components/app/PopupContent/WhatHerePopup';
import { POIContent } from 'components/app/PopupContent/POIPopup';
import WindowPopupManager from 'components/app/WindowScreen/WindowPopupManager';

import LayerService from 'services/layer.service';
import { AppConstant } from 'constant/app-constant';

const layerSvc = new LayerService();

const coordinate = {
    lng: 106.6029738547868,
    lat: 10.754634350198572,
    zoom: 12.5,
};

export let MapContent = (props) =>
{
    const { menu } = useModal();

    const {
        markerPopupStore,
        streetViewStore,
        popupStore,
        markerStore,
        layerStore,
        mapStore,
        drawToolStore,
        advanceSearchStore,
        geofenceStore,
        blockadeStore,
        adminBoundariesStore,
        measureStore,
        searchStore,
        directionStore,
    } = props.appStore;

    const containerRef = useRef(null);

    useEffect(() =>
    {
        mapStore.setCoordinate(coordinate);
    }, []);

    const history = useHistory();

    const onMarkerPopupFocus = (event) =>
    {
        const store = markerPopupStore;
        store.setStates('isActivate', false);
        store.setState(event.id, 'isActivate', true);
    };

    const onViewportChange = (view) =>
    {
        mapStore.setViewport(view);
    };

    const onMarkerPopupClose = (event) =>
    {
        markerPopupStore.remove(event.id);
    };

    const onPOIClicked = (data) =>
    {
        const store = markerPopupStore;
        const popup = store.getPopup(data.Data.id);
        const geoData = JSON.parse(data.GeoData.Coords);

        store.setStates('isActivate', false);

        let lat = -1;
        let lng = -1;

        if (geoData.type === 'Point')
        {
            lat = geoData.coordinates[1];
            lng = geoData.coordinates[0];
        }
        else if (geoData.type === 'LineString')
        {
            lat = geoData.coordinates[0][1];
            lng = geoData.coordinates[0][0];
        }

        if (data?.Data?.Layer === 'ICS_PANORAMA' && lng && lat)
        {
            streetViewStore.show({ ...data?.Data, coordinates: [lng, lat] });
            return null;
        }

        if (!popup)
        {
            store.add({
                id: data.Data.Id,
                title: data.Data.Title,
                sub: data.sub,
                content: <POIContent contents={data.Data} />,
                lng: lng,
                lat: lat,
                width: 350,
                height: 230,
                isActivate: true,
                onFocus: onMarkerPopupFocus,
                onClose: onMarkerPopupClose,
                // headerActions: [{ icon: 'film-alt' }, { icon: 'external-link' }],
                // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
            });
        }
        else
        {
            popupStore.setState(data.Data.id, 'isActivate', true);
        }
    };

    const onMapClick = (map, event) =>
    {
        const features = map.queryRenderedFeatures(event.point);
        for (const feature of features)
        {
            if (feature.layer.id === 'symbol-marker')
            {
                return;
            }
        }

        markerStore.clearActive();

        if (layerStore.listLayerActive.length > 0)
        {
            const layers = [];

            layerStore.listLayerActive.forEach((layer) =>
            {
                layers.push(layer.LayerName);
            });

            const query = {
                Layers: layers,
                Level: Math.round(map.getZoom()),
                X: event.lngLat.lng,
                Y: event.lngLat.lat,
                Detail: true,
            };

            layerSvc.getObjectByLatLng(query).then((rs) =>
            {
                if (rs.data)
                {
                    onPOIClicked(rs.data);
                }
            });
        }
    };

    const onMapRender = (map) =>
    {
        mapStore.setBounds(map.getBounds());
        mapStore.map = map;
        drawToolStore.map = map;
        drawToolStore.mapUtil.map = map;
        advanceSearchStore.map = map;
        advanceSearchStore.mapUtil.map = map;
        geofenceStore.map = map;
        geofenceStore.mapUtil.map = map;
        blockadeStore.map = map;
        blockadeStore.mapUtil.map = map;
        adminBoundariesStore.mapUtil.map = map;
        measureStore.mapUtil.map = map;

    };

    const onMapMove = (map) =>
    {
        mapStore.setBounds(map.getBounds());
    };

    const onMapMoveEnd = (map) =>
    {
        const { lng, lat } = map.getCenter();
        if (coordinate.lng !== lng || coordinate.lat !== lat)
        {
            // only do these when there're real center change
            const newCoordinate = {
                lng: lng,
                lat: lat,
                zoom: map.getZoom(),
            };
            mapStore.setCoordinate(newCoordinate);
        }
    };

    const renderWhatHerePopupContent = (locationData, layerLocationData) =>
    {
        return (
            <WhatHerePopupContent
                listAllLayers={layerStore.listAllLayers}
                locationData={locationData}
                layerLocationData={layerLocationData}
            />
        );
    };

    const onMapContextMenu = (map, event, disabledIndex = []) =>
    {
        const rect = containerRef.current.getBoundingClientRect();

        const menuProps = {
            id: 'map-context-menu',
            isTopLeft: true,
            position: { x: event.point.x + rect.left, y: event.point.y },
            backdrop: false,
            actions: [
                {
                    label: 'Từ đây',
                    className: 'fromhere',
                    onClick: () =>
                    {
                        const path = history.location.pathname.split('/');
                        const newPath = ['', path[1], 'direction'].join('/');
                        history.push(newPath);

                        directionStore.contextMenuSetDirectionAtHere(true, event.lngLat);
                    },
                },
                {
                    label: 'Đến đây',
                    className: 'tohere',
                    onClick: () =>
                    {
                        const path = history.location.pathname.split('/');
                        const newPath = ['', path[1], 'direction'].join('/');
                        history.push(newPath);

                        directionStore.contextMenuSetDirectionAtHere(false, event.lngLat);
                    },
                },
                {
                    label: 'Đây là đâu?',
                    className: 'whathere',
                    onClick: () =>
                    {
                        searchStore.contextMenuSetPointWhatHere(event.lngLat, renderWhatHerePopupContent);
                    },
                },
                // {
                //     label: 'Tạo sự cố',
                //     className: 'missingplace',
                //     onClick: async () =>
                //     {
                //         const rs = await locationSvc.getLocationDataByGeo(event.lngLat.lng, event.lngLat.lat);
                //
                //         if (rs.result === appEnum.APIStatus.Success && rs.data)
                //         {
                //             incidentStore.addShow({
                //                 location: {
                //                     longitude: event.lngLat.lng,
                //                     latitude: event.lngLat.lat,
                //                     address1: directionSvc.getAddress(rs.data),
                //                     city: rs.data.province,
                //                     country: rs.data.country,
                //                 },
                //             });
                //         }
                //         else
                //         {
                //             incidentStore.addShow({
                //                 location: {
                //                     longitude: event.lngLat.lng,
                //                     latitude: event.lngLat.lat,
                //                 },
                //             });
                //         }
                //     },
                // },
            ],
        };

        if (disabledIndex?.length > 0)
        {
            disabledIndex.forEach(index =>
            {
                if (menuProps.actions[index])
                {
                    menuProps.actions[index]['disabled'] = true;
                }
            });
        }

        menu(menuProps);
    };

    const onStyleLoad = (map) =>
    {
        map.onBoxSelectHandler = onBoxSelectHandler;
        new BoxSelectHandler(map).initBoxSelectEvent();
    };

    const onBoxSelectHandler = async (box, map) =>
    {
        const startLatLng = map.unproject(box[0]);
        const endLatLng = map.unproject(box[1]);
        markerStore.onBoxSelectChange(startLatLng, endLatLng);
    };

    return (
        <Container
            ref={containerRef}
            className={'map-container'}
        >
            <Map
                center={{ lng: 106.6029738547868, lat: 10.754634350198572 }}
                zoomLevel={[12.5]}
                fontURL={''}
                mapImageURL={window.location.origin + AppConstant.map.url}
                lightStyleOverride={lightStyleOverride}
                darkStyleOverride={darkStyleOverride}
                defaultStyleOverride={defaultStyleOverride}
                satelliteStyleOverride={satelliteStyleOverride}
                terrainStyleOverride={terrainStyleOverride}
                boundaryStyleOverride={boundaryStyleOverride}
                isMainMap
                saveViewport
                onRender={onMapRender}
                onMoveEnd={onMapMoveEnd}
                onMove={onMapMove}
                onClick={onMapClick}
                onViewportChange={onViewportChange}
                onContextMenu={onMapContextMenu}
                // droneURL={'/api/drone_ortho?level={z}&x={x}&y={y}'}
                onStyleLoad={onStyleLoad}
            >
                <MarkerManager
                    map={mapStore.map}
                    onContextMenu={onMapContextMenu}
                />
                <SymbolManager />
                <MarkerPopupManager />

                <LayerManager />
                <DirectionManager />
                <IncidentDirectionManager />
                <LabelManager />
                <SketchMapManager />

                <Positioned
                    top={'50px'}
                    right={'0'}
                >
                    <Column clipped={false}>
                        <AdminBoundaries />
                        <MeasureDistance />
                    </Column>
                </Positioned>

            </Map>
            <WindowPopupManager />
            <PopupNormalManager />
        </Container>
    );
};

MapContent = inject('appStore')(observer(MapContent));
