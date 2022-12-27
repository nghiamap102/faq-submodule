import React from 'react';
import { decorate, observable, action, autorun, computed } from 'mobx';

import { Constants } from 'constant/Constants';
import { AppConstant } from 'constant/app-constant';
import { AdvanceSearchService } from 'services/advanceSearch.service';

import { AuthHelper } from 'helper/auth.helper';
import { CommonHelper } from 'helper/common.helper';

import { MapUtil } from '../Map/MapUtil';
import { POIContent } from '../PopupContent/POIPopup';

export class AdvanceSearchStore
{
    advanceSearchSvc = new AdvanceSearchService(AppConstant.vdms.url);

    constructor(appStore)
    {
        this.appStore = appStore;
        this.incidentStore = appStore.incidentStore;
        this.mapUtil = new MapUtil(this.map);
        this.markerPopupStore = this.appStore.markerPopupStore;
        this.popupStore = this.appStore.popupStore;
    }

    appStore = null;
    map = null;
    layer = null;
    selectedQuery = undefined;
    selectedControl = undefined;
    // activeQueryIndex = -1;
    // isVisibleAllResults = true;
    drawnObjects = [];
    searchKey = '';
    start = 0;
    count = 100;
    condition = null;
    isSearching = false;
    hiddenObjs = [];
    allResults = [];
    resultsLayerData = {};

    getResult(query)
    {
        if (!query)
        {
            return null;
        }

        return this.allResults.find((r) => r.id === query.id);
    }

    clearResultBeforeSearch(query)
    {
        const result = this.getResult(query);
        this.allResults.splice(this.allResults.indexOf(result), 1);

        for (const layerId in this.resultsLayerData)
        {
            this.mapUtil.clearSourceData(layerId);
            delete this.resultsLayerData[layerId];
        }
    }

    clearResultByLayerName(layer)
    {
        if (!layer)
        {
            this.allResults = [];
        }
        else
        {
            this.allResults.forEach(r =>
            {
                if (r.data.length)
                {
                    r.data = r.data.filter(d => d.Layer !== layer);
                }
            });
        }
    }

    operators = [
        { id: 0, name: '=' },
        { id: 1, name: 'like' },
        { id: 2, name: '=' },
        { id: 3, name: '>' },
        { id: 4, name: '<' },
        { id: 5, name: '>=' },
        { id: 6, name: '<=' },
    ];

    initDrawnObjects(listControl, selectedControl)
    {
        if (listControl.length)
        {
            const listQuery = [];

            for (let i = 0; i < listControl.length; i++)
            {
                const control = listControl[i];
                if (control.type === 'Label')
                {
                    continue;
                }
                const feature = control.mapControl.features[0];
                let queryData = control.components && control.components.advanceSearch ? control.components.advanceSearch : null;

                if (!queryData)
                {
                    queryData = {
                        type: this.mapUtil.getMapObjectType(feature.geometry),
                        layers: [],
                        radius: 500,
                        id: feature.id,
                        isEnabled: false,
                    };

                    if (!control.components)
                    {
                        control.components = {};
                    }

                    if (!control.components.advanceSearch)
                    {
                        control.components.advanceSearch = queryData;
                    }
                }

                queryData.geometry = feature.geometry;
                listQuery.push(queryData);
            }

            this.drawnObjects = listQuery;

            if (selectedControl)
            {
                this.selectedControl = selectedControl;
                const selectedQuery = this.drawnObjects.find((q) => q.id === selectedControl.id);

                if (selectedQuery)
                {
                    this.setSelectedQuery(selectedQuery);
                }
            }
        }
        else
        {
            this.drawnObjects = [];
        }
    }

    setSelectedControl(selectedControl)
    {
        this.selectedControl = selectedControl;
    }

    getCondition(id)
    {
        const condition = this.operators.filter((o) => o.id === id)[0];
        return condition ? condition.name : null;
    }

    setResults(items, query, isLazyLoad)
    {
        const result = this.getResult(query);
        items.forEach((e) =>
        {
            e.IconUrl = `${AppConstant.vdms.url}/app/render/GetLayerIcon.ashx?LayerName=${e.Layer}&access_token=${AuthHelper.getVDMSToken()}`;
        });

        if (result)
        {
            isLazyLoad ? result.data = result.data.concat(items) : result.data = items;
        }
        else
        {
            this.allResults.push({
                id: query.id,
                data: items,
                isVisible: query.isEnabled,
            });
        }
    }

    getSourceDataId(layerName, queryId)
    {
        return `${queryId}-${layerName}`;
    }

    drawResult(query)
    {
        const result = this.getResult(query);
        const layers = query ? query.layers : null;
        if (!layers || !result || !result.data || !result.isVisible)
        {
            return;
        }

        for (let i = 0; i < layers.length; i++)
        {
            const layerName = layers[i].LayerName;
            const geosGroupByLayerName = [];

            for (let j = 0; j < result.data.length; j++)
            {
                if (result.data[j].Layer === layerName)
                {
                    geosGroupByLayerName.push(this.buildGeoItem(result.data[j], layers[i]));
                }
            }

            const layerId = this.getSourceDataId(layerName, query.id);

            this.mapUtil.clearSourceData(layerId);
            this.mapUtil.initSource(layerId);

            this.map.on('click', layerId, function (e)
            {
                const coordinates = e.features[0].geometry.coordinates.slice();
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180)
                {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                let data = e.features[0].properties.data;
                if (data)
                {
                    data = JSON.parse(data);
                }
                delete data.IconUrl;
                this.showMapPopup(data, e.lngLat.lat, e.lngLat.lng, false);
            }.bind(this));

            this.map.on('mouseenter', layerId, function ()
            {
                this.map.getCanvas().style.cursor = 'pointer';
            }.bind(this));

            this.map.on('mouseleave', layerId, function ()
            {
                this.map.getCanvas().style.cursor = '';
            }.bind(this));

            const data = {
                'type': 'FeatureCollection',
                'features': geosGroupByLayerName,
            };

            if (!this.map.getLayer(layerId))
            {
                switch (geosGroupByLayerName[0] && geosGroupByLayerName[0].geometry.type)
                {
                    default:
                    case 'Point':
                        this.map.loadImage(`${AppConstant.vdms.url}/app/render/GetLayerIcon.ashx?LayerName=${layerName}&access_token=${AuthHelper.getVDMSToken()}`, (error, image) =>
                        {
                            if (error)
                            {
                                throw error;
                            }


                            if (!this.map[`icon-${layerName}`])
                            {
                                this.map.addImage(`icon-${layerName}`, image);
                                this.map[`icon-${layerName}`] = true;
                            }
                            if (!this.map.getLayer(layerId))
                            {
                                this.map.addLayer({
                                    'id': layerId,
                                    'type': 'symbol',
                                    'source': layerId,
                                    'layout': {
                                        'icon-image': `icon-${layerName}`,
                                        'icon-allow-overlap': true,
                                        'icon-rotation-alignment': 'map',
                                    },
                                });
                            }
                        });
                        break;
                    case 'LineString':
                        if (!this.map.getLayer(layerId))
                        {
                            this.mapUtil.addLayerBelowLabel({
                                'id': layerId,
                                'type': 'line',
                                'source': layerId,
                                'layout': {
                                    'line-join': 'round',
                                    'line-cap': 'round',
                                },
                                'paint': {
                                    'line-color': 'green',
                                    'line-width': 3,
                                },
                            });
                        }
                }
            }

            this.mapUtil.setSourceData(layerId, data);
            this.resultsLayerData[layerId] = data;
        }
    }

    showMapPopup = (data, lat, lng, showByResultClick) =>
    {
        if (this.currentPopupId)
        {
            this.markerPopupStore.remove(this.currentPopupId);
        }

        if (showByResultClick && this.selectedQuery.layers)
        {
            const geoField = this.selectedQuery.layers.find((l) => l.LayerName === data.Layer).geoField;
            if (geoField)
            {
                const geo = JSON.parse(data[geoField]);
                if (!lat || !lng)
                {
                    switch (geo.type)
                    {
                        default:
                        case 'Point':
                            lng = geo.coordinates[0];
                            lat = geo.coordinates[1];
                            break;
                        case 'LineString':
                            lng = geo.coordinates[0][0];
                            lat = geo.coordinates[0][1];
                            break;
                    }
                }
                data = CommonHelper.clone(data);
                delete data[geoField];
                delete data.IconUrl;
            }
        }

        const popup = this.markerPopupStore.getPopup(data.Id);
        this.currentPopupId = data.Id;

        this.markerPopupStore.setStates('isActivate', false);

        if (!popup)
        {
            this.markerPopupStore.add({
                id: data.Id,
                title: data.Title,
                sub: data.sub,
                content: (
                    <POIContent contents={data} />
                ),
                lng: lng,
                lat: lat,
                width: 350,
                height: 230,
                isActivate: true,
                onFocus: this.onMarkerPopupFocus,
                onClose: this.onMarkerPopupClose,
                // headerActions: [{ icon: 'film-alt' }, { icon: 'external-link' }],
                // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
            });
        }
        else
        {
            this.popupStore.setState(data.Id, 'isActivate', true);
        }
    };

    onMarkerPopupFocus = (event) =>
    {
        this.markerPopupStore.setStates('isActivate', false);
        this.markerPopupStore.setState(event.id, 'isActivate', true);
    };

    onMarkerPopupClose = (event) =>
    {
        this.markerPopupStore.remove(event.id);
    };

    clearQueryResultOnMap(query)
    {
        const layers = query.layers;

        if (layers)
        {
            for (let i = 0; i < layers.length; i++)
            {
                this.mapUtil.clearSourceData(this.getSourceDataId(layers[i].LayerName, query.id));
            }
        }
    }

    clearAllQueryResultOnMap()
    {
        this.drawnObjects.forEach((q) =>
        {
            this.clearQueryResultOnMap(q);
        });
    }

    buildGeoItem(rs, layer)
    {
        const geo = JSON.parse(rs[layer.geoField]);
        return {
            'type': 'Feature',
            'geometry': geo,
            'properties': {
                'icon': layer.LayerName,
                'id': rs.Id,
                'data': rs,
            },
        };
    }


    setSearching(isSeaching)
    {
        this.isSearching = isSeaching;
    }

    setSearchKey(key)
    {
        this.searchKey = key;
    }

    get isShowDetail()
    {
        return this.selectedQuery !== null && this.selectedQuery !== undefined;
    }

    setSelectedQuery(obj)
    {
        this.selectedQuery = obj;
        this.drawResult(obj);
    }

    getOperator(o)
    {
        const condition = this.operators.find((condition) => condition.id === o);
        return condition ? condition.name : null;
    }

    getAdvanceQueries(p)
    {
        const query = [];
        const convert = (param, condition) =>
        {
            if (param.condition)
            {
                if (condition && param.rules.length > 1)
                {
                    query.push({ Combine: condition + ' |(|' });
                }
                if (param.no)
                {
                    query.push({ Combine: 'NOT |(|' });
                }

                for (let i = 0; i < param.rules.length; i++)
                {
                    convert(param.rules[i], param.condition);
                }

                if (param.no)
                {
                    query.push({ Combine: '|)|' });
                }
                if (condition && param.rules.length > 1)
                {
                    query.push({ Combine: '|)|' });
                }
            }
            else
            {
                query.push({
                    ColumnName: param.property,
                    Combine: condition,
                    Condition: this.getOperator(parseInt(param.operator)),
                    DataType: 3,
                    ValueFilter: param.value,
                });
            }
        };
        convert(p);
        return query;
    }

    buildQueryInfo(query)
    {
        const queries = [];
        let returnFields = [];
        const defaultReturnFields = ['Title', 'Layer'];
        const layers = query.layers || [];

        for (let i = 0; i < layers.length; i++)
        {
            const layer = layers[i];
            let arQuery = [];
            const geoCol = layer.geoField;
            const advanceQuery = layer.advanceQuery;
            if (advanceQuery)
            {
                arQuery = this.getAdvanceQueries(advanceQuery);
            }
            if (this.searchKey)
            {
                arQuery.push({
                    ColumnName: 'PoolField',
                    DataType: 8,
                    Condition: 'like',
                    ValueFilter: this.searchKey,
                    Combine: 'AND',
                });
            }

            queries.push({
                Fields: arQuery,
                LayerName: layer.LayerName,
                GeoField: geoCol,
            });

            geoCol && returnFields.push(geoCol);
            returnFields = returnFields.concat(layer.propFields);
        }

        const geo = query.type === Constants.MAP_OBJECT.POLYGON
            ? query.geometry
            : {
                    type: 'Polygon',
                    coordinates: [this.mapUtil.getBufferCoords(query.geometry, query.radius)],
                };

        returnFields = returnFields.concat(defaultReturnFields);

        // const result = this.getResult(query);

        return {
            queryInfos: queries,
            geoJson: JSON.stringify(geo),
            distance: 1,
            // start: result ? result.data.length : this.start,
            start: 0,
            count: this.count,
            returnFields: returnFields,
        };
    }

    updateQuery(fieldName, value)
    {
        if (this.selectedControl)
        {
            this.selectedQuery[fieldName] = value;
            this.selectedControl.components.advanceSearch = this.selectedQuery;
        }
    }

    // async deleteQuery()
    // {
    //     await this.advanceSearchSvc.delQuery(this.selectedQuery.id);
    //     this.removeObj(this.selectedQuery.id);
    //     let visibleItem = this.hiddenObjs.find(i => i.id = this.selectedQuery.id);
    //     if (visibleItem)
    //     {
    //         this.hiddenObjs.splice(this.hiddenObjs.indexOf(visibleItem), 1);
    //     }
    //     this.selectedQuery = undefined;
    // }

    renderDrawnMarker = autorun(() =>
    {
        if (this.mapUtil)
        {
            this.mapUtil.clearSourceData(Constants.POINTS_BUFFER_LAYER_ID);
        }

        this.drawedMarkers = [];
        const markerObjects = this.drawnObjects.filter((o) => o && o.type === Constants.MAP_OBJECT.MARKER);

        if (this.map && markerObjects)
        {
            const buffers = [];

            for (const markerObj of markerObjects)
            {
                if (!markerObj.isEnabled)
                {
                    this.clearQueryResultOnMap(markerObj);
                    continue;
                }
                this.drawResult(markerObj);

                const bufferCoords = this.mapUtil.getBufferCoords(markerObj.geometry, markerObj.radius);

                const bufferObj = {
                    coords: bufferCoords,
                    mapObject: markerObj,
                };
                buffers.push(bufferObj);
            }

            this.mapUtil.drawMapObjectTypePointsBuffer(buffers);
        }
    });

    renderDrawnLinesAndPolygons = autorun(() =>
    {
        if (this.mapUtil)
        {
            this.mapUtil.clearSourceData(Constants.MAP_OBJECT_POLYGONS_LAYER_ID);
            this.mapUtil.clearSourceData(Constants.MAP_OBJECT_LINES_LAYER_ID);
            this.mapUtil.clearSourceData(Constants.LINES_BUFFER_LAYER_ID);
        }

        const polygonObjects = this.drawnObjects.filter((o) => o && o.type === Constants.MAP_OBJECT.POLYGON);
        const lineObjects = this.drawnObjects.filter((o) => o && o.type === Constants.MAP_OBJECT.LINES);

        if (this.map && polygonObjects)
        {
            const polygons = [];

            for (const polygonObj of polygonObjects)
            {
                if (!polygonObj.isEnabled)
                {
                    this.clearQueryResultOnMap(polygonObj);
                    continue;
                }
                this.drawResult(polygonObj);
                // render for each map object lines
                if (!polygonObj)
                {
                    continue;
                }

                if (polygonObj)
                {
                    polygons.push({
                        mapObject: polygonObj,
                        coords: polygonObj.geometry.coordinates,
                    });
                }
            }

            this.mapUtil.drawMyMapObjectTypePolygons(polygons);
        }

        if (this.map && lineObjects)
        {
            const buffers = [];

            for (const lineObj of lineObjects)
            {
                if (!lineObj.isEnabled)
                {
                    this.clearQueryResultOnMap(lineObj);
                    continue;
                }
                this.drawResult(lineObj);
                // render for each map object lines
                if (!lineObj)
                {
                    continue;
                }

                if (lineObj)
                {
                    const bufferCoords = this.mapUtil.getBufferCoords(lineObj.geometry, lineObj.radius);
                    const bufferObj = {
                        coords: bufferCoords,
                        mapObject: lineObj,
                    };
                    buffers.push(bufferObj);
                }
            }
            this.mapUtil.drawMapObjectTypeLinesBuffer(buffers);
        }
    });

    searchAll = async () =>
    {
        this.allResults = [];
        const listQuery = this.drawnObjects.filter((q) => q.isEnabled);
        for (let i = 0; i < listQuery.length; i++)
        {
            await this.doSearch(listQuery[i], false);
        }
    };

    doSearch = async (query, isLazyLoad) =>
    {
        const queryInfo = this.buildQueryInfo(query);
        const rs = await this.advanceSearchSvc.search(queryInfo);
        if (rs && rs.data)
        {
            this.setResults(rs.data, query, isLazyLoad);
            this.drawResult(query);
        }
    };
}

decorate(AdvanceSearchStore, {
    drawnObjects: observable,
    selectedQuery: observable,
    layer: observable,
    activeQueryIndex: observable,
    isVisibleAllResults: observable,
    searchKey: observable,
    start: observable,
    count: observable,
    isSearching: observable,
    allResults: observable,
    hiddenObjs: observable,
    isShowDetail: computed,
    getActiveQueryIndex: action,
    // showObjs: action,
    // removeObj: action,
    setSelectedQuery: action,
    setSearchKey: action,
    setResults: action,
    doSearch: action,
    changeVisibleItems: action,
    toggleViewAllResult: action,
    updateQuery: action,
    initDrawnObjects: action,
    clearResultByLayerName: action,
});
