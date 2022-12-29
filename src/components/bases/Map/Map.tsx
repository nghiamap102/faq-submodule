import React, { ReactNode, SyntheticEvent, useContext, useEffect, useMemo, useRef } from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { ZoomControl, ScaleControl, RotationControl } from 'react-mapbox-gl';
import { isMobile } from 'react-device-detect';

import lightStyle from 'components/bases/Map/MapStyles/light-style.json';
import darkStyle from 'components/bases/Map/MapStyles/dark-style.json';
import defaultStyle from 'components/bases/Map/MapStyles/default-style.json';
import satelliteStyle from 'components/bases/Map/MapStyles/satellite-style.json';
import terrainStyle from 'components/bases/Map/MapStyles/terrain-style.json';
import boundaryStyle from 'components/bases/Map/MapStyles/boundary-style.json';

import lightStyleOverride from 'components/bases/Map/MapStyles/light-style.override';
import darkStyleOverride from 'components/bases/Map/MapStyles/dark-style.override.js';
import defaultStyleOverride from 'components/bases/Map/MapStyles/default-style.override.js';
import satelliteStyleOverride from 'components/bases/Map/MapStyles/satellite-style.override.js';
import terrainStyleOverride from 'components/bases/Map/MapStyles/terrain-style.override.js';
import boundaryStyleOverride from 'components/bases/Map/MapStyles/boundary-style.override.js';

import globalOverride from 'components/bases/Map/MapStyles/global.override.json';

import mapDefaultImage from 'images/map-style-default.png';
import mapLightImage from 'images/map-style-light.png';
import mapDarkImage from 'images/map-style-dark.png';
import mapTerrainImage from 'images/map-style-terrain.png';
import mapSatelliteImage from 'images/map-style-satellite.png';
import mapBoundaryImage from 'images/map-style-boundary.png';
import mapBoxBuildingImage from 'images/map-style-box-building.png';
import map3dBuildingImage from 'images/map-style-3d-building.png';
import compassImage from 'images/compass.svg';

import { StyleSwitcher } from 'components/bases/Map/StyleSwitcher/StyleSwitcher';
import { BuildingLayer } from 'components/bases/Map/VBD3DBuildings';
import { ThemeContext } from 'components/bases/Theme/ThemeContext';
import { FullScreenButton, FullScreenOverlay } from 'components/bases/FullScreen';
import { MapContext } from 'components/bases/Map/MapContext';

import { B3DMData } from './model3d-data';

import './Map.scss';
import './MapPopup.scss';

export const mapStyleList = [
    { id: 'light', label: 'Màu Sáng' },
    { id: 'dark', label: 'Màu Tối' },
    { id: 'default', label: 'Tiêu chuẩn' },
    { id: 'satellite', label: 'Vệ Tinh' },
    { id: 'terrain', label: 'Địa hình' },
    { id: 'boundary', label: 'Ranh giới' },
];

type showLocateControlConfig = {
    autoLocate: boolean;
}

type mapOverlays = {
    id: string,
    label: string,
    image: ReactNode,
}

export type MapProps = {
    width?: string,
    height?: string,
    center?: any,
    zoomLevel?: any,
    preserveDrawingBuffer?: boolean,
    onViewportChange?: (viewPort?: Record<string, any>) => void,
    onStyleLoad?: (map: mapboxgl.Map) => void,
    onRender?: (map: mapboxgl.Map) => void,
    onZoomEnd?: (map: mapboxgl.Map) => void,
    onMoveEnd?: (map: mapboxgl.Map, event: SyntheticEvent<any>) => void,
    onContextMenu?: (map: mapboxgl.Map, event: SyntheticEvent<any>) => void,
    onMove?: (map: mapboxgl.Map, event: SyntheticEvent<any>) => void,
    onClick?: () => void,
    saveViewport?: boolean,
    droneURL?: string,
    fontURL?: string,
    mapStyle?: string,
    mapStyles?: Record<string, any>[],
    lightStyleOverride?: Record<string, any>,
    darkStyleOverride?: Record<string, any>,
    defaultStyleOverride?: Record<string, any>,
    satelliteStyleOverride?: Record<string, any>
    terrainStyleOverride?: Record<string, any>,
    boundaryStyleOverride?: Record<string, any>,
    defaultOverlays?: mapOverlays[],
    mapOverlays?: mapOverlays[]
    showOverlays?: boolean,
    scrollZoom?: boolean,
    boxZoom?: boolean,
    dragRotate?: boolean,
    dragPan?: boolean,
    interactive?: boolean,
    showLocateControl?: showLocateControlConfig,
    mapImageURL?: string,
    isMainMap?: boolean,
    isNotControl?: boolean,
    isNotScaleControl?: boolean,
    map?: any,
    children?: any,
}

export const Map = React.memo((props: MapProps) =>
{
    const {
        width = '100%',
        height = '100%',
        center,
        zoomLevel,
        preserveDrawingBuffer = false,
        onViewportChange,
        onStyleLoad,
        onRender,
        onZoomEnd,
        onMoveEnd,
        onContextMenu,
        onMove,
        onClick,
        saveViewport = false,
        droneURL,
        fontURL,
        showOverlays = true,
        scrollZoom = true,
        boxZoom,
        dragRotate,
        dragPan,
        interactive,
        showLocateControl,
        mapImageURL,
        isNotControl = false,
        isNotScaleControl,
        map,
        children,
    } = props;

    const context = useContext(ThemeContext);
    const mapRef = useRef<mapboxgl.Map>();

    let mapStyles: Record<string, any>[] = [];
    let mapStyle = '';
    let mapDefaultStyle: Record<string, any> | undefined = {};
    let mapCenter: any = center;
    let mapZoomLevel: any = zoomLevel;
    let themeBase = '';
    let pressTimeout: any = undefined;
    let rotating = false;
    let showLocate = false;

    const mapOverlays = [
        {
            id: '3d-building',
            label: 'Tòa nhà 3D',
            image: map3dBuildingImage,
        },
        {
            id: 'box-building',
            label: 'Tòa vuông',
            image: mapBoxBuildingImage,
        },
    ];

    const defaultOverlays = [mapOverlays[1]];

    const { styles } = useContext<any>(MapContext);

    mapStyles = styles?.length
        ? styles
        : (props.mapStyles || mapStyleList).map((style: any) =>
            {
                switch (style.id)
                {
                    case 'light':
                        style['style'] = lightStyle;
                        style['image'] = mapLightImage;
                        break;
                    case 'dark':
                        style['style'] = darkStyle;
                        style['image'] = mapDarkImage;
                        break;
                    case 'default':
                        style['style'] = defaultStyle;
                        style['image'] = mapDefaultImage;
                        break;
                    case 'satellite':
                        style['style'] = satelliteStyle;
                        style['image'] = mapSatelliteImage;
                        break;
                    case 'terrain':
                        style['style'] = terrainStyle;
                        style['image'] = mapTerrainImage;
                        break;
                    case 'boundary':
                        style['style'] = boundaryStyle;
                        style['image'] = mapBoundaryImage;
                        break;
                }

                return style;
            });

    useEffect(() =>
    {
        // global override
        overrideStyle(lightStyle, globalOverride);
        overrideStyle(darkStyle, globalOverride);
        overrideStyle(satelliteStyle, globalOverride);
        overrideStyle(defaultStyle, globalOverride);
        overrideStyle(terrainStyle, globalOverride);
        overrideStyle(boundaryStyle, globalOverride);

        // local override
        overrideStyle(lightStyle, lightStyleOverride);
        overrideStyle(darkStyle, darkStyleOverride);
        overrideStyle(defaultStyle, defaultStyleOverride);
        overrideStyle(satelliteStyle, satelliteStyleOverride);
        overrideStyle(terrainStyle, terrainStyleOverride);
        overrideStyle(boundaryStyle, boundaryStyleOverride);

        // component override
        overrideStyle(lightStyle, props.lightStyleOverride);
        overrideStyle(darkStyle, props.darkStyleOverride);
        overrideStyle(defaultStyle, props.defaultStyleOverride);
        overrideStyle(satelliteStyle, props.satelliteStyleOverride);
        overrideStyle(terrainStyle, props.terrainStyleOverride);
        overrideStyle(boundaryStyle, props.boundaryStyleOverride);

        if (mapImageURL)
        {
            const changeSource = (style: Record<string, any>) =>
            {
                for (const key of Object.keys(style.sources))
                {
                    if (style.sources[key].url)
                    {
                        style.sources[key].url = style.sources[key].url.replace('https://images.vietbando.com', mapImageURL);
                    }

                    // $RELATIVE_URL
                    if (Array.isArray(style.sources[key].tiles) && style.sources[key].tiles.length)
                    {
                        style.sources[key].tiles[0] = style.sources[key].tiles[0].replace('$RELATIVE_URL', window.location.origin);
                    }
                }

                style.sprite = style.sprite.replace('https://images.vietbando.com', mapImageURL);
                style.glyphs = style.glyphs.replace('https://images.vietbando.com', mapImageURL);
            };

            changeSource(lightStyle);
            changeSource(darkStyle);
            changeSource(defaultStyle);
            changeSource(satelliteStyle);
            changeSource(terrainStyle);
            changeSource(boundaryStyle);

            themeBase = context?.theme?.base;
        }

        if (droneURL !== null && droneURL !== undefined)
        {
            // proxy drone orthomosaic tile
            satelliteStyle.sources.area.tiles[0] = `${props.droneURL}`;
        }

        if (fontURL !== null && fontURL !== undefined)
        {
            lightStyle.glyphs = darkStyle.glyphs = defaultStyle.glyphs = satelliteStyle.glyphs = terrainStyle.glyphs = boundaryStyle.glyphs = `${props.fontURL}/fonts/{fontstack}/{range}.pbf`;
        }
    }, []);

    useEffect(() =>
    {
        const style = mapStyles.find(ms => ms.id === context.theme.base);
        if (style)
        {
            handleChangeMapStyle(style);
        }
    }, [context.theme.base]);

    const overrideStyle = (origin: Record<string, any>, override?: Record<string, any>) =>
    {
        if (!override)
        {
            return;
        }

        if (override.sources && Object.keys(override.sources).length)
        {
            for (const key in override.sources)
            {
                const source = override.sources[key];
                const originSource = origin.sources[key];
                if (originSource)
                {
                    origin.sources[key] = JSON.parse(JSON.stringify(source));
                }
                else
                {
                    origin.sources.push(JSON.parse(JSON.stringify(source)));
                }
            }
        }

        if (override.layers && Object.keys(override.layers).length)
        {
            for (const layer of override.layers)
            {
                if (layer.add)
                {
                    const originLayer = origin.layers.find((l: Record<string, any>) => l.id === layer.id);
                    const afterLayerIndex = origin.layers.findIndex((l: Record<string, any>) => l.id === layer.after);

                    if (!originLayer && afterLayerIndex >= 0)
                    {
                        origin.layers.splice(afterLayerIndex, 0, JSON.parse(JSON.stringify(layer)));
                    }
                }
                else
                {
                    const originLayer = origin.layers.find((l: Record<string, any>) => l.id === layer.id);

                    if (originLayer)
                    {
                        overrideObject(originLayer, layer);
                    }
                }
            }
        }
    };

    const overrideObject = (origin: Record<string, any>, override: Record<string, any>) =>
    {
        for (const key of Object.keys(override))
        {
            const prop = override[key];

            if (Array.isArray(prop))
            {
                origin[key] = Object.assign([], prop);
            }
            else if (typeof prop !== 'object')
            {
                origin[key] = prop;
            }
            else
            {
                if (typeof origin[key] === 'object')
                {
                    overrideObject(origin[key], prop);
                }
                else
                {
                    origin[key] = prop;
                }
            }
        }
    };

    const getViewport = () =>
    {
        const bounds = mapRef.current?.getBounds && mapRef.current.getBounds();
        const level = mapRef.current?.getZoom && mapRef.current.getZoom();

        if (!bounds || !level)
        {
            return;
        }

        return {
            left: bounds.getWest(),
            top: bounds.getNorth(),
            right: bounds.getEast(),
            bottom: bounds.getSouth(),
            level: Math.round(level),
        };
    };

    const handleRender = (map: mapboxgl.Map) =>
    {
        mapRef.current = map;
        if (onViewportChange)
        {
            onViewportChange(getViewport());
        }

        if (onRender)
        {
            onRender(map);
        }

        if (showLocateControl && (!showLocate || themeBase !== context?.theme?.base))
        {
            showLocate = true;
            themeBase = context?.theme?.base;

            const geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            });

            mapRef.current?.addControl(geolocate);

            if (showLocateControl.autoLocate)
            {
                mapRef.current?.on('load', () =>
                {
                    geolocate.trigger();
                });
            }
        }
    };

    const findFirstLayerType = (type: string) =>
    {
        const layers = mapRef.current?.getStyle().layers;

        // Find the index of the first symbol layer in the map style
        const layer = layers?.find((layer) => layer.type === type);

        return layer ? layer.id : undefined;
    };

    const handleStyleLoad = (map: mapboxgl.Map) =>
    {
        if (onStyleLoad)
        {
            onStyleLoad(map);
        }

        // temporary leave it here until find another good place
        const element = mapRef.current?.getContainer().querySelector('.map-rotation-control > button > span');
        if (element)
        {
            element.innerHTML = `<img src='${compassImage}' alt={'compass'}>`;
        }
    };

    const handleChangeMapStyle = (mapStyle: Record<string, any>) =>
    {
        mapRef.current?.setStyle(mapStyle.styleUrl || mapStyle.style);
    };

    const handleToggleMapOverlay = (overlay: Record<string, any>, checked: boolean) =>
    {
        if (overlay.id === '3d-building')
        {
            if (checked)
            {
                // turn it on
                const firstSymbolId = findFirstLayerType('symbol');

                mapRef.current?.addLayer(new BuildingLayer('b3dm', B3DMData) as mapboxgl.CustomLayerInterface, firstSymbolId);
                // mapRef.current?.addLayer(new BuildingLayer('gltf', GLTFData) as mapboxgl.CustomLayerInterface);
            }
            else
            {
                // turn it off
                if (mapRef.current?.getLayer('b3dm'))
                {
                    mapRef.current.removeLayer('b3dm');
                }

                if (mapRef.current?.getLayer('gltf'))
                {
                    mapRef.current.removeLayer('gltf');
                }
            }
        }
        else if (overlay.id === 'box-building')
        {
            if (mapRef.current?.getLayer('region_building3d_index'))
            {
                if (checked)
                {
                    // turn it on
                    mapRef.current.setLayoutProperty('region_building3d_index', 'visibility', 'visible');
                }
                else
                {
                    // turn it off
                    mapRef.current.setLayoutProperty('region_building3d_index', 'visibility', 'none');
                }
            }
        }
    };

    const handleMove = (map: mapboxgl.Map, event: SyntheticEvent<any>) =>
    {
        if (onMove)
        {
            onMove(map, event);
        }
    };

    const saveMapState = () =>
    {
        if (saveViewport && mapRef.current)
        {
            mapRef.current?.getCenter && localStorage.setItem('center', JSON.stringify(mapRef.current.getCenter()));
            mapRef.current?.getZoom && localStorage.setItem('zoom', mapRef.current.getZoom() as unknown as string);
        }
    };

    const handleMoveEnd = (map: mapboxgl.Map, event: SyntheticEvent<any>) =>
    {
        saveMapState();

        if (onViewportChange)
        {
            onViewportChange(getViewport());
        }

        cancelContextMenuMobile();

        if (onMoveEnd)
        {
            onMoveEnd(map, event);
        }
    };

    const handleZoomEnd = (map: mapboxgl.Map) =>
    {
        saveMapState();

        if (onViewportChange)
        {
            onViewportChange(getViewport());
        }
        if (onZoomEnd && typeof onZoomEnd === 'function')
        {
            onZoomEnd(map);
        }
    };

    const handleContextMenu = (map: mapboxgl.Map, event: SyntheticEvent<any>) =>
    {
        if (!isMobile && !rotating && onContextMenu)
        {
            onContextMenu(map, event);
        }
    };

    const handleRotateStart = () =>
    {
        rotating = true;
    };

    const handleRotateEnd = () =>
    {
        setTimeout(() =>
        {
            rotating = false;
        }, 100);
    };

    const handleTouchStart = (map: mapboxgl.Map, event: SyntheticEvent<any>) =>
    {
        if (isMobile && pressTimeout === undefined && onContextMenu)
        {
            pressTimeout = setTimeout(() =>
            {
                onContextMenu(map, event);
            }, 500);
        }
    };

    const handleTouchEnd = () =>
    {
        cancelContextMenuMobile();
    };

    const handleTouchCancel = () =>
    {
        cancelContextMenuMobile();
    };

    const handleTouchMove = () =>
    {
        cancelContextMenuMobile();
    };

    const cancelContextMenuMobile = () =>
    {
        if (isMobile && pressTimeout)
        {
            clearTimeout(pressTimeout);
        }
    };

    const mapContent = useMemo(() =>
    {
        const MapBox = map || ReactMapboxGl({
            accessToken: '',
            scrollZoom: scrollZoom,
            boxZoom: boxZoom,
            dragRotate: dragRotate,
            dragPan: dragPan,
            interactive: interactive,
            preserveDrawingBuffer: preserveDrawingBuffer,
        });

        if (saveViewport)
        {
            const saveCenter = JSON.parse(localStorage.getItem('center') || '{}');

            if (saveCenter && saveCenter.lat && saveCenter.lng)
            {
                mapCenter = saveCenter;
            }
            else
            {
                localStorage.setItem('zoom', JSON.stringify(center));
            }

            const saveZoom = +(localStorage.getItem('zoom') || 0);
            if (saveZoom >= 0 && saveZoom <= 20)
            {
                mapZoomLevel = [saveZoom];
            }
            else
            {
                localStorage.setItem('zoom', mapZoomLevel);
            }
        }

        mapStyle = props.mapStyle || context?.theme?.base;
        mapDefaultStyle = mapStyle ? mapStyles.find((ms: Record<string, any>) => ms.id === mapStyle) : mapStyles[1];

        return (
            <FullScreenOverlay>
                <MapBox
                    style={mapDefaultStyle?.styleUrl || mapDefaultStyle?.style}
                    containerStyle={{
                        height,
                        width,
                    }}
                    center={mapCenter}
                    zoom={mapZoomLevel}
                    // trackResize
                    onStyleLoad={handleStyleLoad}
                    onRender={handleRender}
                    onZoomEnd={handleZoomEnd}
                    onMoveEnd={handleMoveEnd}
                    onContextMenu={handleContextMenu}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                    onTouchMove={handleTouchMove}
                    onMove={handleMove}
                    onClick={onClick}
                    onRotateStart={handleRotateStart}
                    onRotateEnd={handleRotateEnd}
                >
                    {!isNotControl && (
                        <>
                            <ZoomControl className={'map-zoom-control'} />

                            {!isNotScaleControl && (
                                <ScaleControl
                                    className={'map-scale-control'}
                                    position={'bottom-left'}
                                />
                            )}

                            <RotationControl className={'map-rotation-control'} />

                            <StyleSwitcher
                                mapStyles={mapStyles}
                                style={mapDefaultStyle}
                                mapOverlays={props.mapOverlays || mapOverlays}
                                overlays={props.defaultOverlays || defaultOverlays}
                                showOverlays={showOverlays}
                                onChangeMapStyle={handleChangeMapStyle}
                                onToggleMapOverlay={handleToggleMapOverlay}
                            />

                            <FullScreenButton className="map-expand-control" />
                        </>
                    )}
                    {children}
                </MapBox>
            </FullScreenOverlay>
        );
    }, [center, zoomLevel, styles]);

    return mapContent;

}, (prevProps, nextProps) =>
{
    const { lng: nextLng, lat: nextLat } = nextProps.center;
    const { zoomLevel: nextZoomLevel } = nextProps;
    const { lng, lat } = prevProps.center;
    const { zoomLevel } = prevProps;

    if (lat !== nextLat || lng !== nextLng || zoomLevel?.length !== nextZoomLevel?.length)
    {
        return false;
    }

    for (let i = 0; i < zoomLevel?.length; i++)
    {
        if (zoomLevel[i] !== nextZoomLevel[i])
        {
            return false;
        }
    }

    return true;
});

