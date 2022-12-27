import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { GeneralDetectionService } from 'services/general-detection-service';
import LayerService from 'services/layer.service';
import { FaceAlertService } from 'services/face-alert.service';
import Enum from 'constant/app-enum';
import { CommonHelper } from 'helper/common.helper';
import { AppConstant } from 'constant/app-constant';

import {
    BorderPanel, PanelBody, PanelHeader,
    Row, Spacer,
    FAIcon,
    Popup,
    withI18n, withModal,
    Resizable, withResizeMap,
} from '@vbd/vui';

import { SpatialSearchMap } from 'components/app/SpatialSearch/SpatialSearchMap';
import { POIContent } from 'components/app/PopupContent/POIPopup';

import { MarkerPopupStore } from 'components/app/stores/MarkerPopupStore';
import { PopupStore } from 'components/app/stores/PopupStore';

import GeneralDetectionSearch from './GeneralDetectionSearch';
import { GeneralDetectionContent } from './GeneralDetectionContent';
import { GeneralDetectionDetail } from './GeneralDetectionDetail';

const UPDATE_TIME = 3000;

class GeneralDetection extends Component
{
    gdStore = this.props.appStore.generalDetectionStore;
    spatialSearchStore = this.props.appStore.generalDetectionStore.spatialSearchStore;

    state = {
        isLoading: false,
        liveUpdate: false,
    };

    liveUpdateTimeout;

    detectionService = new GeneralDetectionService();
    faceSvc = new FaceAlertService();
    layerSvc = new LayerService();

    markerPopupStore = new MarkerPopupStore();
    popupStore = new PopupStore();

    lprSources = [
        {
            id: '5e9cadc5-79c8-4710-a9a3-a48305ab20a3',
            name: 'CAMERALPR',
            type: 'raster',
            tiles: [
                `${AppConstant.vdms.url}/App/Render/Overlay.ashx?Level={z}&X={x}&Y={y}&Layers=CAMERALPR&Strokes=%23FFff0000&Fills=%237Fff0000`,
            ],
            minzoom: 0,
            maxzoom: 22,
            tileSize: 256,
        },
    ];

    componentDidMount()
    {
        setTimeout(() => this.setState({ liveUpdate: true }), 3000);

        this.detectionService.getSystems().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.gdStore.setSystems(rs.data);
            }
        });

        this.detectionService.getCameras().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.gdStore.setCameras('all', rs.data);
            }
        });

        this.detectionService.getMetaData().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.gdStore.setMetaData(rs.data);

                this.props.addTranslates(rs.data.map((d) =>
                {
                    const index = d['FieldDisplay.Locale'].findIndex(l => l === this.props.language);

                    if (d.FieldName)
                    {
                        return {
                            key: `${d.EventType}.${d.FieldName}`,
                            value: d['FieldDisplay.Value'][index],
                        };
                    }
                    else
                    {
                        return {
                            key: d.EventType,
                            value: d['FieldDisplay.Value'][index],
                        };
                    }
                }));
            }
        });

        this.spatialSearchStore.popupContent = (
            <GeneralDetectionDetail
                isLoading={this.state.isLoading}
                mini
                onLoad={(data) =>
                {
                    this.gdStore.setSelected(data.guid);
                }}
                onPrevClick={async (currentData) =>
                {
                    const data = await this.getPrevData(currentData);
                    if (data)
                    {
                        this.detectionService.getById(data.guid).then((rs) =>
                        {
                            if (rs.result === Enum.APIStatus.Success)
                            {
                                const popupData = {
                                    ...rs.data,
                                    id: rs.data.guid,
                                    x: rs.data.latitude,
                                    y: rs.data.longitude,
                                    title: rs.data.capturedBy,
                                };
                                this.spatialSearchStore.addMapPopup(popupData);
                                this.gdStore.setSelected(rs.data.guid);
                                const faceIds = rs.data.info.filter((i) => i.eventType === 'Face').map((i) => i.metricsValue[0]);
                                if (faceIds.length > 0)
                                {
                                    this.faceSvc.galleryGetByFaceIds(faceIds).then((rs) =>
                                    {
                                        if (rs.result === Enum.APIStatus.Success)
                                        {
                                            this.gdStore.addNewFaceInfos(rs.data);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }}
                onNextClick={async (currentData) =>
                {
                    const data = await this.getNextData(currentData);
                    if (data)
                    {
                        this.detectionService.getById(data.guid).then((rs) =>
                        {
                            if (rs.result === Enum.APIStatus.Success)
                            {
                                const popupData = {
                                    ...rs.data,
                                    id: rs.data.guid,
                                    x: rs.data.latitude,
                                    y: rs.data.longitude,
                                    title: rs.data.capturedBy,
                                };

                                this.spatialSearchStore.addMapPopup(popupData);
                                this.gdStore.setSelected(rs.data.guid);
                                const faceIds = rs.data.info.filter((i) => i.eventType === 'Face').map((i) => i.metricsValue[0]);
                                if (faceIds.length > 0)
                                {
                                    this.faceSvc.galleryGetByFaceIds(faceIds).then((rs) =>
                                    {
                                        if (rs.result === Enum.APIStatus.Success)
                                        {
                                            this.gdStore.addNewFaceInfos(rs.data);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }}
            />
        );

        this.handleOnSearch();
    }

    componentDidUpdate(prevProps, prevState)
    {
        (prevState.liveUpdate !== this.state.liveUpdate) && this.handleAutoUpdate(this.state.liveUpdate);
    }

    componentWillUnmount()
    {
        this.liveUpdateTimeout && clearTimeout(this.liveUpdateTimeout);
    }

    handleChangePageSize = async (size) =>
    {
        let currentPage = Math.ceil(this.gdStore.currentPage * this.gdStore.pageSize / size);
        currentPage = currentPage < this.gdStore.currentPage ? currentPage : this.gdStore.currentPage;

        this.gdStore.setPaging(this.gdStore.totalItem, currentPage, size);
        await this.handlePageLoad(this.gdStore.currentPage);
    };

    handleOnSearch = () =>
    {
        this.gdStore.resetSearch();
        this.handlePageLoad();
    };

    handlePageLoad = async (page) =>
    {
        this.setState({ isLoading: true });
        page = page || this.gdStore.currentPage;
        this.gdStore.setPaging(this.gdStore.totalItem, page);
        this.gdStore.setData([]);
        await this.handleGetData();
        this.setState({ isLoading: false });
    };

    handleGetData = async () =>
    {
        let geoData = null;
        if (this.gdStore.spatialSearch)
        {
            geoData = this.spatialSearchStore.buildGeoQuery();
            this.spatialSearchStore.lockDrawTool(true);
        }

        const searchState = this.gdStore.getFullSearchState(geoData);

        const rs = await this.detectionService.search(searchState);

        if (rs.result === Enum.APIStatus.Success)
        {
            this.gdStore.setData(rs.data.data);
            this.gdStore.setPaging(rs.data.total, this.gdStore.currentPage);

            this.spatialSearchStore.setData(CommonHelper.clone(rs.data.data.map((d) =>
            {
                d.x = d.latitude;
                d.y = d.longitude;
                d.id = d.guid;
                d.title = d.capturedBy;
                return d;
            })));

            this.spatialSearchStore.fitBound(this.spatialSearchStore.data);
        }
        else
        {
            this.props.toast({ type: 'error', message: rs.errorMessage });
        }
    };

    handleChangeProperty = (data, key, value) =>
    {
        this.gdStore.setDataProperty(data.guid, key, value);
    };

    handleSelectedAllChange = (value) =>
    {
        this.gdStore.setSelectedAllChange(value);
    };

    handleDetailClick = (data) =>
    {
        if (data)
        {
            this.gdStore.setDetail(data, data);

            this.detectionService.getById(data.guid).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success && this.gdStore.detailData !== null)
                {
                    this.gdStore.setDetail(rs.data, data);
                }
            });
        }
    };

    handleDeleteClick = () =>
    {
    };

    handleViewModeChange = (viewMode) =>
    {
        this.gdStore.setViewMode(viewMode);

        if (viewMode !== 'LIST')
        {
            setTimeout(() =>
            {
                this.spatialSearchStore.map.resize();
            }, 300);
        }
    };

    handleMapClicked = (map, event) =>
    {
        const query = {
            Layers: this.lprSources.map((s) => s.name),
            Level: Math.round(map.getZoom()),
            X: event.lngLat.lng,
            Y: event.lngLat.lat,
            Detail: true,
        };

        this.layerSvc.getObjectByLatLng(query).then((rs) =>
        {
            if (rs.data)
            {
                this.onPOIClicked(rs.data);
            }
        });
    };

    onPOIClicked = (data) =>
    {
        const store = this.markerPopupStore;
        const popup = store.getPopup(data.Data.id);
        const geoData = JSON.parse(data.GeoData.Coords);

        store.setStates('isActivate', false);

        const lat = geoData.coordinates[1];
        const lng = geoData.coordinates[0];

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
                onFocus: this.onMarkerPopupFocus,
                onClose: this.onMarkerPopupClose,
            });
        }
        else
        {
            this.popupStore.setState(data.Data.id, 'isActivate', true);
        }
    };

    onMarkerPopupFocus = (event) =>
    {
        const store = this.markerPopupStore;
        store.setStates('isActivate', false);
        store.setState(event.id, 'isActivate', true);
    };

    onMarkerPopupClose = (event) =>
    {
        this.markerPopupStore.remove(event.id);
    };

    getNextData = async (currentData) =>
    {
        if (this.state.isLoading)
        {
            return;
        }

        let index = this.gdStore.getDetailIndex(currentData);
        if (index <= 0)
        {
            if (this.gdStore.currentPage > 1)
            {
                await this.handlePageLoad(--this.gdStore.currentPage);

                if (Array.isArray(this.gdStore.data) && this.gdStore.data.length > 0)
                {
                    return this.gdStore.data[this.gdStore.data.length - 1];
                }
            }
        }
        else
        {
            index--;
            return this.gdStore.data[index];
        }
    };

    getPrevData = async (currentData) =>
    {
        if (this.state.isLoading)
        {
            return;
        }

        let index = this.gdStore.getDetailIndex(currentData);
        if (index < 0 || index >= this.gdStore.data.length - 1)
        {
            if (this.gdStore.currentPage < this.gdStore.totalItem / this.gdStore.pageSize)
            {
                await this.handlePageLoad(++this.gdStore.currentPage);

                if (Array.isArray(this.gdStore.data) && this.gdStore.data.length > 0)
                {
                    return this.gdStore.data[0];
                }
            }
        }
        else
        {
            index++;
            return this.gdStore.data[index];
        }
    };

    handlePrevClick = async (currentData) =>
    {
        const data = await this.getPrevData(currentData);
        this.handleDetailClick(data);
    };

    handleNextClick = async (currentData) =>
    {
        const data = await this.getNextData(currentData);
        this.handleDetailClick(data);
    };

    handleResize = (sizes) =>
    {
        const { run, map } = this.props;
        map && run();
    };

    handleAutoUpdate = async (update = true, time = UPDATE_TIME) =>
    {
        this.liveUpdateTimeout && clearTimeout(this.liveUpdateTimeout);

        if (update)
        {
            this.liveUpdateTimeout = setTimeout(async () =>
            {
                await this.handleGetData();
                this.handleAutoUpdate(update);
            }, time);
        }
    };

    handleLiveUpdate = (liveUpdate = !this.state.liveUpdate) => this.setState({ liveUpdate });

    handleMapRender = (newMap) =>
    {
        const { map, onMap, onDelay } = this.props;
        if (newMap !== map)
        {
            newMap.resize();
            onMap(newMap);
            onDelay(300);
        }
    };

    render()
    {
        return (
            <>
                <Row className="general-alert">
                    <GeneralDetectionSearch
                        service={this.plateDetectService}
                        onSearch={this.handleOnSearch}
                    />

                    <BorderPanel
                        flex={1}
                    >
                        <PanelHeader>
                            <Row className={'general-detection-toolbar'}>
                                <FAIcon
                                    icon={'list'}
                                    size={'1.25rem'}
                                    color={this.gdStore.viewMode === 'LIST' ? 'var(--contrast-color)' : ''}
                                    onClick={this.handleViewModeChange.bind(this, 'LIST')}
                                />
                                <Spacer size={'1.5rem'} />
                                <FAIcon
                                    icon={'columns'}
                                    size={'1.25rem'}
                                    color={this.gdStore.viewMode === 'SPLIT' ? 'var(--contrast-color)' : ''}
                                    onClick={this.handleViewModeChange.bind(this, 'SPLIT')}
                                />
                            </Row>
                        </PanelHeader>
                        <PanelBody>
                            <Resizable onResizeEnd={this.handleResize}>
                                {
                                    this.gdStore.viewMode !== 'MAP' && (
                                        <GeneralDetectionContent
                                            data={this.gdStore.data}
                                            isLoading={this.state.isLoading}
                                            totalItem={this.gdStore.totalItem}
                                            currentPage={this.gdStore.currentPage}
                                            pageSize={this.gdStore.pageSize}
                                            miniSize={this.gdStore.viewMode === 'SPLIT'}
                                            selectedAllChange={this.handleSelectedAllChange}
                                            selectedId={this.gdStore.selectedId}
                                            liveUpdate={this.state.liveUpdate}
                                            readOnly
                                            onPageChange={this.handlePageLoad}
                                            onDetailClick={this.handleDetailClick}
                                            onDeleteClick={this.handleDeleteClick}
                                            onPageSizeChange={this.handleChangePageSize}
                                            onPropertyChange={this.handleChangeProperty}
                                            onLiveUpdate={this.handleLiveUpdate}
                                        />
                                    )
                                }
                                <BorderPanel
                                    className={`map-view ${this.gdStore.viewMode === 'LIST' ? 'hidden' : ''}`}
                                    flex={1}
                                >
                                    <SpatialSearchMap
                                        store={this.spatialSearchStore}
                                        popupStore={this.markerPopupStore}
                                        lprSources={this.lprSources}
                                        onClick={this.handleMapClicked}
                                        onMapRender={this.handleMapRender}
                                    />
                                </BorderPanel>
                            </Resizable>
                        </PanelBody>
                    </BorderPanel>
                </Row>

                {this.gdStore.detailData && (
                    <Popup
                        title={'Thông tin chi tiết'}
                        scroll={false}
                        onClose={() => this.gdStore.setDetail(null)}
                    >
                        <GeneralDetectionDetail
                            data={this.gdStore.detailData}
                            matchData={this.gdStore.searchState.searchData?.length ? this.gdStore.detailMatchData : undefined}
                            searchData={this.gdStore.searchState.searchData?.length ? this.gdStore.searchState.searchData : []}
                            isLoading={this.state.isLoading}
                            onPrevClick={this.handlePrevClick}
                            onNextClick={this.handleNextClick}
                            onViewHistory={() => this.gdStore.setHistory('plateNumber', this.gdStore.detailData.carNumber)}
                        />
                    </Popup>
                )}
            </>
        );
    }
}

GeneralDetection = withResizeMap(withI18n(withModal(inject('appStore')(observer(GeneralDetection)))));
export { GeneralDetection };
