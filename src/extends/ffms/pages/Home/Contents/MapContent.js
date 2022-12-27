import './MapContent.scss';

import lightStyleOverride from 'extends/ffms/map-styles/light-style.override.js';
import darkStyleOverride from 'extends/ffms/map-styles/dark-style.override.js';
import satelliteStyleOverride from 'extends/ffms/map-styles/satellite-style.override.js';
import terrainStyleOverride from 'extends/ffms/map-styles/terrain-style.override.js';
import boundaryStyleOverride from 'extends/ffms/map-styles/boundary-style.override.js';

import React, { useContext, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { Container, Column, Panorama, Positioned, TenantContext, BoxSelectHandler, useModal, Map } from '@vbd/vui';

import LayerService from 'services/layer.service';
import { AppConstant } from 'constant/app-constant';

import MarkerPopupManager from 'components/app/MapManager/MarkerPopupManager';
import SymbolManager from 'components/app/MapManager/SymbolManager';
import DirectionManager from 'components/app/MapManager/DirectionManager';
import LabelManager from 'components/app/MapManager/LabelManager';
import LayerManager from 'extends/ffms/pages/Home/Contents/LayerManager';
import SketchMapManager from 'components/app/MapManager/SketchMapManager';
import MeasureDistance from 'components/app/Map/MeasureDistance';
import { POIContent } from 'components/app/PopupContent/POIPopup';

import HistoryManager from 'extends/ffms/views/TrackingHistory/HistoryManager';
import { TrackingManager } from 'extends/ffms/views/TrackingWorker/TrackingManager';
import MarkerManager from 'extends/ffms/bases/MapManager/MarkerManager';
import { MAP_OPTIONS } from 'extends/ffms/constant/ffms-enum';
import AdministrativeBoundary from 'extends/ffms/views/AdministrativeBoundary/AdministrativeBoundary';
import { CommonHelper } from 'helper/common.helper';

let MapContent = ({ appStore }) =>
{
    const { menu } = useModal();

    const tenantContext = useContext(TenantContext);
    const mapStyles = tenantContext.config['mapStyleList'];
    const mapOptions = tenantContext.config['mapOptions'] || MAP_OPTIONS;
    const countryCode = tenantContext.config['country'];

    const {
        markerStore,
        markerPopupStore,
        layerStore,
        mapStore,
        drawToolStore,
        advanceSearchStore,
        geofenceStore,
        blockadeStore,
        measureStore,
        adminBoundariesStore,
    } = appStore;

    let coordinate = {
        lng: 106.6029738547868,
        lat: 10.754634350198572,
        zoom: 12.5,
    };

    const layerSvc = new LayerService(AppConstant.vdms.url);

    useEffect(() =>
    {
        mapStore.setCoordinate(coordinate);
    }, []);

    const history = useHistory();

    const onMapRender = (map, event) =>
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
        measureStore.mapUtil.map = map;
    };

    const onMapMove = (map, event) =>
    {
        mapStore.setBounds(map.getBounds());
    };

    const onMapMoveEnd = (map, event) =>
    {
        const { lng, lat } = map.getCenter();
        if (coordinate.lng !== lng || coordinate.lat !== lat)
        {
            // only do these when there're real center change
            coordinate = {
                lng: lng,
                lat: lat,
                zoom: map.getZoom(),
            };

            mapStore.setCoordinate(coordinate);
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

    const onMarkerPopupFocus = (event) =>
    {
        const store = markerPopupStore;
        store.setStates('isActivate', false);
        store.setState(event.id, 'isActivate', true);
    };

    const onViewportChange = (view) =>
    {
        appStore.mapStore.setViewport(view);
    };

    const onMarkerPopupClose = (event) =>
    {
        markerPopupStore.remove(event.id);
    };

    const onPOIClicked = (data) =>
    {
        let poiContent;
        switch (data.Data.Layer)
        {
            case 'ICS_PANORAMA':
                poiContent = (
                    <Panorama
                        img={
                            `/api/pano?id=${data.Data.guid}`
                        }
                    />
                );
                break;
            default:
                poiContent = <POIContent contents={data.Data} />;
                break;
        }

        // Other Markers Popup
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

        if (!popup)
        {
            store.add({
                id: data.Data.Id,
                title: data.Data.Title,
                sub: data.sub,
                content: poiContent,
                lng: lng,
                lat: lat,
                width: 350,
                height: 230,
                isActivate: true,
                className: 'ffms-popup-marker',
                onFocus: onMarkerPopupFocus,
                onClose: onMarkerPopupClose,
                // headerActions: [{ icon: 'film-alt' }, { icon: 'external-link' }],
                // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
            });
        }
        else
        {
            store.setState(data.Data.id, 'isActivate', true);
        }
    };

    const onMapContextMenu = (map, event) =>
    {
        menu({
            id: 'map-context-menu',
            isTopLeft: true,
            position: event.point,
            actions: [
                {
                    label: 'Từ đây',
                    className: 'fromhere',
                    onClick: () =>
                    {
                        // appStore.directionStore.contextMenuSetDirectionAtHere(true, event.lngLat);

                        const path = history.location.pathname.split('/');
                        const newPath = ['', path[1], 'direction'].join('/');
                        history.push(newPath);

                        appStore.directionStore.contextMenuSetDirectionAtHere(true, event.lngLat);
                    },
                },
                {
                    label: 'Đến đây',
                    className: 'tohere',
                    onClick: () =>
                    {
                        // appStore.directionStore.contextMenuSetDirectionAtHere(false, event.lngLat);

                        const path = history.location.pathname.split('/');
                        const newPath = ['', path[1], 'direction'].join('/');
                        history.push(newPath);

                        appStore.directionStore.contextMenuSetDirectionAtHere(false, event.lngLat);
                    },
                },
            ],
        });
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
    const mapImageURL = window.location.origin + AppConstant.map.url;
    return (
        <Container className={'map-container'}>
            <Map
                center={mapOptions ? { lng: mapOptions.longitude, lat: mapOptions.latitude } : { lng: 78.5256851848203, lat: 22.4886934737012 }}
                zoomLevel={[mapOptions ? mapOptions.zoom : 12.5]}
                fontURL={''}
                mapStyles={mapStyles}
                lightStyleOverride={lightStyleOverride}
                darkStyleOverride={darkStyleOverride}
                satelliteStyleOverride={satelliteStyleOverride}
                terrainStyleOverride={terrainStyleOverride}
                boundaryStyleOverride={boundaryStyleOverride}
                showOverlays={false}
                mapImageURL={mapImageURL}
                isMainMap
                // droneURL={'/api/drone_ortho?level={z}&x={x}&y={y}'}
                saveViewport
                onRender={onMapRender}
                onMoveEnd={onMapMoveEnd}
                onMove={onMapMove}
                onClick={onMapClick}
                onViewportChange={onViewportChange}
                onContextMenu={onMapContextMenu}
                onStyleLoad={onStyleLoad}
            >
                <MarkerManager
                    map={mapStore.map}
                    onContextMenu={onMapContextMenu}
                />
                <SymbolManager />
                <MarkerPopupManager />

                <LayerManager isSingleOverlay />
                <DirectionManager />
                <LabelManager />
                <SketchMapManager />
                <HistoryManager />
                <TrackingManager />
                <Positioned
                    top={'50px'}
                    right={'0'}
                >
                    <Column clipped={false}>
                        <AdministrativeBoundary root={CommonHelper.getCountryName(countryCode)} />
                        <MeasureDistance />
                    </Column>
                </Positioned>
            </Map>
        </Container>
    );

};
MapContent = inject('appStore', 'fieldForceStore')(observer(MapContent));
export default MapContent;
