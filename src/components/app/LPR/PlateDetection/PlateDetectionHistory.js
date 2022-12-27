import './PlateDetectionHistory.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layer, Source, Marker as MapMarker } from 'react-mapbox-gl';

import {
    Row,
    Map,
    Container,
    BorderPanel,
    withModal,
    MarkerPopup,
} from '@vbd/vui';

import { PlateDetectionContent } from 'components/app/LPR/PlateDetection/PlateDetectionContent';
import { PlateDetectService } from 'components/app/LPR/PlateDetection/PlateDetectService';
import { PlateDetectionDetail } from 'components/app/LPR/PlateDetection/PlateDetectionDetail';

import { Constants } from 'constant/Constants';
import Enum from 'constant/app-enum';
import { CommonHelper } from 'helper/common.helper';

import { PlateDetectionService } from 'services/plateDetection.service';

class PlateDetectionHistoryContainer extends Component
{
    render()
    {
        return (
            <Row>
                <PlateDetectionHistoryList />
                <BorderPanel flex={1}>
                    <PlateDetectionHistoryMap />
                </BorderPanel>
            </Row>
        );
    }
}

class PlateDetectionHistoryMap extends Component
{
    plateDetectionStore = this.props.plateAlertStore.plateDetectionStore;
    mapCenter = { lng: 106.6029738547868, lat: 10.754634350198572 };

    render()
    {
        return (
            <Map
                height={'100%'}
                center={this.plateDetectionStore.history.mapCenter || this.mapCenter}
                zoomLevel={[12.5]}
                onStyleLoad={(map) =>
                {
                    map.resize();
                    this.plateDetectionStore.setHistory('map', map);
                }}
            >
                <PlateDetectionHistoryMarkerPopupManager />
                <PlateDetectionHistoryVirtualRoute />
            </Map>
        );
    }
}

class PlateDetectionHistoryVirtualRoute extends Component
{
    plateDetectionStore = this.props.plateAlertStore.plateDetectionStore;

    componentDidMount()
    {
        this.plateDetectionStore.setHistoryVirtualRoute(null);
        this.drawVirtualRoute();
    }

    drawVirtualRoute = async () =>
    {
        const data = CommonHelper.clone(this.plateDetectionStore.history.data);

        if (data && data.length && data.length > 1)
        {
            data.sort((a, b) => new Date(a.gMTDatetime) > new Date(b.gMTDatetime) ? 1 : -1);

            const points = [];
            const times = [];

            for (let i = 0; i < data.length; i++)
            {
                points.push({ 'Longitude': data[i].y, 'Latitude': data[i].x });
                times.push(Math.floor(new Date(data[i].gMTDatetime) / 1000));
            }

            const routes = await new PlateDetectionService().getRoute(points, times.join('|'));

            if (routes)
            {
                const formatRoutes = {};
                routes.forEach((r, i) =>
                {
                    formatRoutes['route_' + i] = r;
                });

                this.plateDetectionStore.setHistoryVirtualRoute(formatRoutes);
            }
            else // case not found direction
            {
                this.plateDetectionStore.setHistoryVirtualRoute(null);
            }

            this.plateDetectionStore.fitBoundHistoryMap(data);
        }
    };

    render()
    {
        const routes = this.plateDetectionStore.history.virtualRoute;

        // DAT: đang gấp xử tạm
        const colors = ['#0000FF', '#FF0000', '#00FF00', '#00FFFF', '#808080', '#800000', '#008080', '#808000'];

        return (
            <>
                {
                    routes &&
                    Object.keys(routes).map((routeName, i) =>
                    {
                        return routes[routeName]
                            ? (
                                    <Container key={routeName}>

                                        <Source
                                            id={`${Constants.PLATE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID}_${i}`}
                                            geoJsonSource={{
                                                'type': 'geojson',
                                                'data': {
                                                    'type': 'Feature',
                                                    'geometry': {
                                                        'type': 'LineString',
                                                        'coordinates': [...routes[routeName].Geometry],
                                                    },
                                                },
                                            }}
                                        />
                                        <Layer
                                            type="line"
                                            layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                                            // before={Constants.DIRECTION_ARROW_BODY_LAYER_ID + '-border'}
                                            paint={{
                                                'line-color': colors[i],
                                                'line-width': {
                                                    'base': 1,
                                                    'stops': [
                                                        [13, 5],
                                                        [14, 6],
                                                        [15, 7],
                                                        [16, 8],
                                                        [17, 9],
                                                        [18, 10],
                                                        [19, 11],
                                                        [20, 12],
                                                    ],
                                                },
                                            }}
                                            id={`${Constants.PLATE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID}_${i}-body`}
                                            sourceId={`${Constants.PLATE_DETECTION_HISTORY_VIRTUAL_ROUTE_LAYER_ID}_${i}`}
                                        />
                                    </Container>
                                )
                            : <Container key={routeName} />;
                    })
                }
            </>
        );
    }
}

class PlateDetectionHistoryMarkerPopupManager extends Component
{
    plateDetectionStore = this.props.plateAlertStore.plateDetectionStore;

    state = { isLoading: false };

    search = async (page) =>
    {
        page = page || this.plateDetectionStore.history.currentPage;
        this.plateDetectionStore.setHistoryPaging(this.plateDetectionStore.history.totalItem, page);

        const searchState = {
            cameraId: '',
            limit: this.plateDetectionStore.history.pageSize,
            plateNumber: this.plateDetectionStore.history.plateNumber,
            plateNumberSearch: this.props.plateNumber,
            skip: (this.plateDetectionStore.history.currentPage - 1) * this.plateDetectionStore.history.pageSize,
            type: null,
            showData: [
                { id: 0, isActivate: true },
                { data: {}, id: 1, isActivate: false },
                { id: 2, isActivate: false, data: 6 },
            ],
        };

        const rs = await new PlateDetectService().search(searchState);

        if (rs.result === Enum.APIStatus.Success)
        {
            this.plateDetectionStore.onHistoryDataLoaded(rs, false);
        }
        else
        {
            this.props.toast({ type: 'error', message: rs.errorMessage });
        }
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

            let index = this.plateDetectionStore.getHistoryIndex(currentData);
            if (index <= 0)
            {
                if (this.plateDetectionStore.history.currentPage > 1)
                {
                    await this.search(--this.plateDetectionStore.history.currentPage);
                    if (Array.isArray(this.plateDetectionStore.history.data) && this.plateDetectionStore.history.data.length > 0)
                    {
                        return this.plateDetectionStore.history.data[this.plateDetectionStore.history.data.length - 1];
                    }
                }
            }
            else
            {
                index--;
                return this.plateDetectionStore.history.data[index];
            }
        }
        finally
        {
            this.setState({
                isLoading: false,
            });
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

            let index = this.plateDetectionStore.getHistoryIndex(currentData);
            if (index < 0 || index >= this.plateDetectionStore.history.data.length - 1)
            {
                if (this.plateDetectionStore.history.currentPage < this.plateDetectionStore.history.totalItem / this.plateDetectionStore.history.pageSize)
                {
                    await this.search(++this.plateDetectionStore.history.currentPage);
                    if (Array.isArray(this.plateDetectionStore.history.data) && this.plateDetectionStore.history.data.length > 0)
                    {
                        return this.plateDetectionStore.history.data[0];
                    }
                }
            }
            else
            {
                index++;
                return this.plateDetectionStore.history.data[index];
            }
        }
        finally
        {
            this.setState({
                isLoading: false,
            });
        }
    };

    onMarkerClick = (data) =>
    {
        this.plateDetectionStore.addHistoryPopup(data);
    };

    handlePrevClick = async (currentData) =>
    {
        const data = await this.getPrevData(currentData);

        if (data)
        {
            this.plateDetectionStore.addHistoryPopup(data);
        }
    };

    handleNextClick = async (currentData) =>
    {
        const data = await this.getNextData(currentData);

        if (data)
        {
            this.plateDetectionStore.addHistoryPopup(data);
        }
    };

    render()
    {
        const data = CommonHelper.clone(this.plateDetectionStore.history.data);

        return (
            <>
                {
                    data && data.sort((a, b) => new Date(a.gMTDatetime) > new Date(b.gMTDatetime) ? 1 : -1).map((d, index) => (
                        <MapMarker
                            key={'history-marker' + index}
                            style={{ cursor: 'pointer' }}
                            coordinates={[d.y, d.x]}
                            anchor="bottom"
                            onClick={() =>
                            {
                                this.onMarkerClick(d);
                            }}
                        >
                            <Container className={`history-middle-marker ${index === 0 ? 'start' : ''} ${index === data.length - 1 ? 'end' : ''}`}>
                                {index + 1}
                            </Container>
                            {/* <FAIcon */}
                            {/*    icon={index === 0 ? 'play-circle' : index === data.length - 1 ? 'stop-circle' : 'circle'} */}
                            {/*    color={index === 0 ? '#25d001' : index === data.length - 1 ? '#ff1313' : '#f17702'} */}
                            {/*    type='solid' */}
                            {/*    size={index === 0 || index === data.length - 1 ? '18pt' : '10pt'} */}
                            {/* /> */}
                        </MapMarker>
                    ),
                    )
                }

                {
                    this.plateDetectionStore.history.popups.map((p, index) => (
                        <MarkerPopup
                            key={index}
                            {...p}
                        >
                            {
                                p.data && (
                                    <Container style={{ margin: '0 1rem' }}>
                                        <PlateDetectionDetail
                                            data={p.data}
                                            isLoading={this.state.isLoading}
                                            mini
                                            onPrevClick={this.handlePrevClick}
                                            onNextClick={this.handleNextClick}
                                        />
                                    </Container>
                                )}
                        </MarkerPopup>
                    ),
                    )
                }
            </>
        );
    }
}

class PlateDetectionHistoryList extends Component
{
    plateDetectionStore = this.props.plateAlertStore.plateDetectionStore;

    componentDidMount()
    {
        this.plateDetectionStore.resetHistory();
        this.search();
    }

    handleDetailClick = (data) =>
    {
        this.plateDetectionStore.setHistory('selectedId', data.id);
        this.plateDetectionStore.addHistoryPopup(data);
    };

    handleChangePageSize = (size) =>
    {
        this.plateDetectionStore.setHistory('pageSize', size);
        this.search();
    };

    search = (page) =>
    {
        page = page || this.plateDetectionStore.history.currentPage;
        this.plateDetectionStore.setHistoryPaging(this.plateDetectionStore.history.totalItem, page);

        const searchState = {
            cameraId: '',
            limit: this.plateDetectionStore.history.pageSize,
            plateNumber: this.plateDetectionStore.history.plateNumber,
            searchExact: true,
            skip: (this.plateDetectionStore.history.currentPage - 1) * this.plateDetectionStore.history.pageSize,
            type: null,
            showData: [
                { id: 0, isActivate: true },
                { data: {}, id: 1, isActivate: false },
                { id: 2, isActivate: false, data: 6 },
            ],
        };

        new PlateDetectService().search(searchState).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.plateDetectionStore.onHistoryDataLoaded(rs);
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
        });
    };

    render()
    {
        return (
            <PlateDetectionContent
                data={this.plateDetectionStore.history.data}
                totalItem={this.plateDetectionStore.history.totalItem}
                currentPage={this.plateDetectionStore.history.currentPage}
                pageSize={this.plateDetectionStore.history.pageSize}
                selectedId={this.plateDetectionStore.history.selectedId}
                readOnly
                miniSize
                canChoosingTotal
                onPageChange={this.search}
                onPageSizeChange={this.handleChangePageSize}
                onDetailClick={this.handleDetailClick}
            />
        );
    }
}

PlateDetectionHistoryContainer = inject('plateAlertStore')(observer(PlateDetectionHistoryContainer));
PlateDetectionHistoryList = withModal(inject('plateAlertStore')(observer(PlateDetectionHistoryList)));
PlateDetectionHistoryMarkerPopupManager = withModal(inject('plateAlertStore')(observer(PlateDetectionHistoryMarkerPopupManager)));
PlateDetectionHistoryMap = inject('plateAlertStore')(observer(PlateDetectionHistoryMap));
PlateDetectionHistoryVirtualRoute = inject('plateAlertStore')(observer(PlateDetectionHistoryVirtualRoute));

export {
    PlateDetectionHistoryContainer,
    PlateDetectionHistoryVirtualRoute,
    PlateDetectionHistoryList,
    PlateDetectionHistoryMarkerPopupManager,
    PlateDetectionHistoryMap,
};

