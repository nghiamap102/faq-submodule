import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Enum from 'constant/app-enum';
import { CommonHelper } from 'helper/common.helper';
import LayerService from 'services/layer.service';
import { AppConstant } from 'constant/app-constant';

import {
    Popup,
    BorderPanel, PanelBody, PanelHeader,
    Row, Spacer,
    Resizable, withResizeMap,
    FAIcon,
    withModal,
} from '@vbd/vui';

import { SpatialSearchMap } from 'components/app/SpatialSearch/SpatialSearchMap';
import { POIContent } from 'components/app/PopupContent/POIPopup';
import { MarkerPopupStore } from 'components/app/stores/MarkerPopupStore';
import { PopupStore } from 'components/app/stores/PopupStore';

import PlateDetectionSearch from './PlateDetectionSearch';
import { PlateDetectionContent } from './PlateDetectionContent';
import { PlateDetectService } from './PlateDetectService';
import { PlateDetectionDetail } from './PlateDetectionDetail';
import { PlateDetectionHistoryContainer } from './PlateDetectionHistory';

class PlateDetection extends Component
{
    plateAlertStore = this.props.plateAlertStore;
    plateDetectionStore = this.props.plateAlertStore.plateDetectionStore;
    spatialSearchStore = this.props.plateAlertStore.spatialSearchStore;

    plateDetectService = new PlateDetectService();
    layerSvc = new LayerService();
    markerPopupStore = new MarkerPopupStore();
    popupStore = new PopupStore();


    state = {
        isLoading: false,
    };

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

        this.plateDetectService.getSystems().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.plateAlertStore.setSystems(rs.data);
            }
        });

        this.plateDetectService.getCameras().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.plateAlertStore.setCameras('all', rs.data);
            }
        });

        this.spatialSearchStore.popupContent = (
            <PlateDetectionDetail
                isLoading={this.state.isLoading}
                mini
                onPrevClick={async (currentData) =>
                {
                    const data = await this.getPrevData(currentData);

                    if (data)
                    {
                        this.spatialSearchStore.addMapPopup({
                            ...data,
                            id: data.eventID,
                            title: data.carNumber,
                        });
                    }
                }}
                onNextClick={async (currentData) =>
                {
                    const data = await this.getNextData(currentData);

                    if (data)
                    {
                        this.spatialSearchStore.addMapPopup({
                            ...data,
                            id: data.eventID,
                            title: data.carNumber,
                        });
                    }
                }}
            />
        );

        this.handleOnSearch();
    }

    handleChangePageSize = async (size) =>
    {
        let currentPage = Math.ceil(this.plateDetectionStore.currentPage * this.plateDetectionStore.pageSize / size);
        currentPage = currentPage < this.plateDetectionStore.currentPage ? currentPage : this.plateDetectionStore.currentPage;
        this.plateDetectionStore.setPaging(this.plateDetectionStore.totalItem, currentPage, size);
        await this.handlePageLoad(this.plateDetectionStore.currentPage);
    };

    handleOnSearch = async () =>
    {
        this.plateDetectionStore.resetSearch();
        await this.handlePageLoad();
    };

    handlePageLoad = async (page) =>
    {
        this.setState({ isLoading: true });
        page = page || this.plateDetectionStore.currentPage;
        this.plateDetectionStore.setPaging(this.plateDetectionStore.totalItem, page);

        let geoData = null;
        if (this.plateDetectionStore.spatialSearch)
        {
            geoData = this.spatialSearchStore.buildGeoQuery();
            this.spatialSearchStore.lockDrawTool(true);
        }

        const searchState = this.plateDetectionStore.getFullSearchState(geoData);

        const rs = await this.plateDetectService.search(searchState);

        if (rs.result === Enum.APIStatus.Success)
        {
            this.plateDetectionStore.setData(this.plateDetectionStore.formatData(CommonHelper.clone(rs.data.data)));
            this.plateDetectionStore.setPaging(rs.data.total, this.plateDetectionStore.currentPage);
            this.spatialSearchStore.setData(this.plateDetectionStore.formatData(CommonHelper.clone(rs.data.data)));
            this.spatialSearchStore.fitBound(rs.data.data);
        }
        else
        {
            this.props.toast({ type: 'error', message: rs.errorMessage });
        }

        this.setState({ isLoading: false });
    };

    handleChangeProperty = (data, key, value) =>
    {
        this.plateDetectionStore.setDataProperty(data.incrementId, key, value);
    };

    handleSelectedAllChange = (value) =>
    {
        this.plateDetectionStore.setSelectedAllChange(value);
    };

    handleDetailClick = (data) =>
    {
        this.plateDetectionStore.setDetail(data);
    };

    handleDeleteClick = () =>
    {
    };

    handleViewModeChange = (viewMode) =>
    {
        this.plateDetectionStore.setViewMode(viewMode);

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

    getPrevData = async (currentData) =>
    {
        if (this.state.isLoading)
        {
            return;
        }

        try
        {
            this.setState({ isLoading: true });

            let index = this.plateDetectionStore.getDetailIndex(currentData);
            if (index <= 0)
            {
                if (this.plateDetectionStore.currentPage > 1)
                {
                    await this.handlePageLoad(--this.plateDetectionStore.currentPage);

                    if (Array.isArray(this.plateDetectionStore.data) && this.plateDetectionStore.data.length > 0)
                    {
                        return this.plateDetectionStore.data[this.plateDetectionStore.data.length - 1];
                    }
                }
            }
            else
            {
                index--;
                return this.plateDetectionStore.data[index];
            }
        }
        finally
        {
            this.setState({ isLoading: false });
        }
    };

    getNextData = async (currentData) =>
    {
        if (this.state.isLoading)
        {
            return;
        }

        try
        {
            this.setState({ isLoading: true });

            let index = this.plateDetectionStore.getDetailIndex(currentData);
            if (index < 0 || index >= this.plateDetectionStore.data.length - 1)
            {
                if (this.plateDetectionStore.currentPage < this.plateDetectionStore.totalItem / this.plateDetectionStore.pageSize)
                {
                    await this.handlePageLoad(++this.plateDetectionStore.currentPage);

                    if (Array.isArray(this.plateDetectionStore.data) && this.plateDetectionStore.data.length > 0)
                    {
                        return this.plateDetectionStore.data[0];
                    }
                }
            }
            else
            {
                index++;
                return this.plateDetectionStore.data[index];
            }
        }
        finally
        {
            this.setState({ isLoading: false });
        }
    };

    handlePrevClick = async (currentData) =>
    {
        const data = await this.getPrevData(currentData);
        if (data)
        {
            this.plateDetectionStore.setDetail(data);
        }
    };

    handleNextClick = async (currentData) =>
    {
        const data = await this.getNextData(currentData);
        if (data)
        {
            this.plateDetectionStore.setDetail(data);
        }
    };

    handleResize = (sizes) =>
    {
        const { run, map } = this.props;
        map && run();
    };

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
                <Resizable
                    minSizes={[300, 700]}
                    defaultSizes={[320]}
                    onResizeEnd={this.handleResize}
                >
                    <PlateDetectionSearch
                        service={this.plateDetectService}
                        onSearch={this.handleOnSearch}
                    />

                    <BorderPanel
                        flex={1}
                    >
                        <PanelHeader>
                            <Row className={'plate-detection-toolbar'}>
                                <FAIcon
                                    icon={'list'}
                                    size={'1.25rem'}
                                    color={this.plateDetectionStore.viewMode === 'LIST' ? 'var(--contrast-color)' : ''}
                                    onClick={this.handleViewModeChange.bind(this, 'LIST')}
                                />
                                <Spacer size={'1.5rem'} />
                                <FAIcon
                                    icon={'columns'}
                                    size={'1.25rem'}
                                    color={this.plateDetectionStore.viewMode === 'SPLIT' ? 'var(--contrast-color)' : ''}
                                    onClick={this.handleViewModeChange.bind(this, 'SPLIT')}
                                />
                                {/* <Spacer */}
                                {/*    size={'24px'} */}
                                {/* /> */}
                                {/* <FAIcon */}
                                {/*    icon={'map'} */}
                                {/*    size={'18px'} */}
                                {/*    color={this.plateDetectionStore.viewMode === 'MAP' ? '#fff' : null} */}
                                {/*    onClick={this.handleViewModeChange.bind(this, 'MAP')} */}
                                {/* /> */}
                            </Row>
                        </PanelHeader>
                        <PanelBody>
                            <Resizable onResizeEnd={this.handleResize}>
                                {
                                    this.plateDetectionStore.viewMode !== 'MAP' && (
                                        <PlateDetectionContent
                                            data={this.plateDetectionStore.data}
                                            isLoading={this.state.isLoading}
                                            totalItem={this.plateDetectionStore.totalItem}
                                            currentPage={this.plateDetectionStore.currentPage}
                                            pageSize={this.plateDetectionStore.pageSize}
                                            miniSize={this.plateDetectionStore.viewMode === 'SPLIT'}
                                            selectedAllChange={this.handleSelectedAllChange}
                                            selectedId={this.plateDetectionStore.selectedId}
                                            readOnly
                                            onPageChange={this.handlePageLoad}
                                            onDetailClick={this.handleDetailClick}
                                            onDeleteClick={this.handleDeleteClick}
                                            onPageSizeChange={this.handleChangePageSize}
                                            onPropertyChange={this.handleChangeProperty}
                                        />
                                    )}
                                {
                                    <BorderPanel
                                        className={`map-view ${this.plateDetectionStore.viewMode === 'LIST' ? 'hidden' : ''}`}
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
                                }

                            </Resizable>
                        </PanelBody>
                    </BorderPanel>
                </Resizable>
                {
                    this.plateDetectionStore.detailData && (
                        <Popup
                            width={'900px'}
                            title={'Thông tin chi tiết'}
                            onClose={() =>
                            {
                                this.plateDetectionStore.setDetail(null);
                            }}
                        >
                            <PlateDetectionDetail
                                data={this.plateDetectionStore.detailData}
                                isLoading={this.state.isLoading}
                                onPrevClick={this.handlePrevClick}
                                onNextClick={this.handleNextClick}
                                onViewHistory={() =>
                                {
                                    this.plateDetectionStore.setHistory('plateNumber', this.plateDetectionStore.detailData.carNumber);
                                }}
                            />
                        </Popup>
                    )}
                {
                    !!this.plateDetectionStore.history.plateNumber && (
                        <Popup
                            title={'Lịch sử'}
                            width={'90%'}
                            height={'90%'}
                            padding={'0'}
                            scroll={false}
                            onClose={() => this.plateDetectionStore.setHistory('plateNumber', null)}
                        >
                            <PlateDetectionHistoryContainer />
                        </Popup>
                    )}
            </>
        );
    }
}

PlateDetection = withResizeMap(withModal(inject('plateAlertStore')(observer(PlateDetection))));
export { PlateDetection };
