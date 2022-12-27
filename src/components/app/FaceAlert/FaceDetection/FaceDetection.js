import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    BorderPanel, PanelBody, PanelHeader,
    Row, Spacer,
    FAIcon,
    withModal,
    Resizable, withResizeMap,
} from '@vbd/vui';

import Enum from 'constant/app-enum';
import { CommonHelper } from 'helper/common.helper';
import { FaceAlertService } from 'services/face-alert.service';

import { SpatialSearchMap } from 'components/app/SpatialSearch/SpatialSearchMap';

import FaceDetectionSearch from './FaceDetectionSearch';
import { FaceDetectionContent } from './FaceDetectionContent';
import { FaceDetectionPopupDetail } from './FaceDetectionPopupDetail';

class FaceDetection extends Component
{
    faceAlertStore = this.props.appStore.faceAlertStore;
    faceDetectionStore = this.props.appStore.faceAlertStore.faceDetectionStore;
    fsImageDetailStore = this.props.appStore.fsImageDetailStore;
    spatialSearchStore = this.props.appStore.faceAlertStore.spatialSearchStore;

    faceAlertSvc = new FaceAlertService();

    constructor(props)
    {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount()
    {
        this.setState({ isLoading: true });
        this.faceAlertSvc.getCameras().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.faceAlertStore.setCameras(rs.data);
            }
            this.setState({ isLoading: false });
        });

        this.spatialSearchStore.popupContent = <FaceDetectionPopupDetail mini />;
        this.handleOnSearch();
    }

    handleOnSearch = () =>
    {
        this.faceDetectionStore.setData(null);
        this.faceDetectionStore.setPaging(0, 1);
        this.handlePageLoad();
    };

    handlePageSizeChange = async (size) =>
    {
        let currentPage = Math.ceil(this.faceDetectionStore.currentPage * this.faceDetectionStore.pageSize / size);
        currentPage = currentPage < this.faceDetectionStore.currentPage ? currentPage : this.faceDetectionStore.currentPage;
        this.faceDetectionStore.setPaging(this.faceDetectionStore.totalItem, currentPage, size);
        await this.handlePageLoad(this.faceDetectionStore.currentPage);
    };

    handlePageLoad = async (page) =>
    {
        this.setState({ isLoading: true });
        page = page || this.faceDetectionStore.currentPage;

        this.faceDetectionStore.setPaging(this.faceDetectionStore.totalItem, page);

        let geoData = null;
        if (this.faceDetectionStore.spatialSearch)
        {
            geoData = this.spatialSearchStore.buildGeoQuery();
            this.spatialSearchStore.lockDrawTool(true);
        }

        const searchState = this.faceDetectionStore.getFullSearchState(geoData);
        this.faceAlertSvc.detectSearch(searchState).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.faceDetectionStore.setData(rs.data.data);
                this.faceDetectionStore.setPaging(rs.data.total, this.faceDetectionStore.currentPage);
                this.spatialSearchStore.setData(this.formatData(CommonHelper.clone(rs.data.data)));
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
            this.setState({ isLoading: false });
        });
    };

    handleDetailClick = (data) =>
    {
        this.faceDetectionStore.setSelectedId(data.id);
        const prob = {
            pedigreeInfo: {
                date: data.detectDate,
            },
            mapInfo: data.mapInfo,
            scannedBy: {
                owner: 'VVMS',
                cameraName: data.camId,
            },
            images: {
                overview: {
                    source: data.overviewImage,
                },
                seachable: {
                    source: data.faceImage,
                    score: data.score,
                },
            },
            isShowProbeInfo: true,
        };

        const gallery = data.candidates.map((c) =>
        {
            return {
                id: c.id,
                faceId: c.id,
                selected: false,
                isLoaded: false,
                galleryImages: {
                    source: this.faceAlertSvc.getBestMatchImageUrl(c.id),
                    accuracy: c.accuracy,
                },
                quickInfo: {},
                galleryInfo: {},
                cases: {},
                commentForm: {},
            };
        });

        gallery[0] = {
            id: data.gallery.faceId,
            personId: data.gallery.personId,
            faceId: data.gallery.faceId,
            selected: true,
            isLoaded: true,
            quickInfo: {
                name: data.gallery.name,
                personId: data.gallery.personId,
                faceId: data.gallery.faceId,
                province: data.gallery.province,
                dateOfBirth: data.gallery.dob,
            },
            galleryImages: {
                source: this.faceAlertSvc.getBestMatchImageUrl(data.gallery.faceId),
                accuracy: data.accuracy,
            },
            galleryInfo: {
                personId: data.gallery.personId,
                name: data.gallery.name,
                alias: data.gallery.alias,
                gender: data.gallery.gender,
                dateOfBirth: data.gallery.dob,
                street: data.gallery.street,
                province: data.gallery.province,
                country: data.gallery.country,
                race: data.gallery.race,
                agency: data.gallery.agency,
                updateDate: data.gallery.updateDate,
                nickName: data.gallery.nickName,
                scarsMarksTattoos: data.gallery.scarsMarksTattoos,
                hairColor: data.gallery.hairColor,
                eyeColor: data.gallery.eyeColor,
                height: data.gallery.height,
                weight: data.gallery.weight,
                notes: data.gallery.notes,
                status: data.gallery.status,
                expiredAfter: data.gallery.expiredAfter,
            },
            cases: {},
            commentForm: {},
            watchList: data.gallery.watchList,
        };

        this.fsImageDetailStore.loadProbe(prob);
        this.fsImageDetailStore.loadGallery(gallery);
        this.fsImageDetailStore.loadOriginData(this.faceDetectionStore.data.find((d) => d.faceId === data.faceId));

        if (!this.fsImageDetailStore.isShowImageDetail)
        {
            this.fsImageDetailStore.toggleShowImageDetail();
        }
    };

    handleSelectedChange = (detect) =>
    {
        this.faceDetectionStore.setSelected(detect.id);
    };

    handleSelectedAllChange = (isAll) =>
    {
        this.faceDetectionStore.setAllSelected(isAll);
    };

    handleDeleteClick = () =>
    {
        this.faceAlertSvc.deleteDetect(this.faceDetectionStore.data.filter((d) => d.isSelected).map((d) =>
        {
            return {
                id: d.id,
                faceId: d.faceId,
            };
        })).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.props.toast({ type: 'success', message: 'Xóa thành công' });

                this.handlePageLoad();
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
        });
    };

    handleViewModeChange = (viewMode) =>
    {
        this.faceDetectionStore.setViewMode(viewMode);

        if (viewMode !== 'LIST')
        {
            setTimeout(() =>
            {
                this.spatialSearchStore.map.resize();
            }, 500);
        }
    };

    formatData(data)
    {
        return data.map((d) =>
        {
            return {
                ...d,
                id: d.camId,
                title: d.camId,
                x: d.mapInfo.latitude,
                y: d.mapInfo.longitude,
            };
        });
    }

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
            <Container className={'face-alert-container'}>
                <FaceDetectionSearch onSearch={this.handleOnSearch} />
                <BorderPanel
                    flex={1}
                >
                    <PanelHeader>
                        <Row className={'plate-detection-toolbar'}>
                            <FAIcon
                                icon={'list'}
                                size={'1.25rem'}
                                color={this.faceDetectionStore.viewMode === 'LIST' ? 'var(--contrast-color)' : ''}
                                onClick={this.handleViewModeChange.bind(this, 'LIST')}
                            />
                            <Spacer size={'1.5rem'} />
                            <FAIcon
                                icon={'columns'}
                                size={'1.25rem'}
                                color={this.faceDetectionStore.viewMode === 'SPLIT' ? 'var(--contrast-color)' : ''}
                                onClick={this.handleViewModeChange.bind(this, 'SPLIT')}
                            />
                        </Row>
                    </PanelHeader>
                    <PanelBody>
                        <Resizable onResizeEnd={this.handleResize}>
                            {
                                this.faceDetectionStore.viewMode !== 'MAP' && (
                                    <FaceDetectionContent
                                        className={this.faceAlertStore.isCollapseSearch ? 'full-content' : ''}
                                        isLoading={this.state.isLoading}
                                        data={this.faceDetectionStore.data}
                                        detailClick={this.handleDetailClick}
                                        deleteClick={this.handleDeleteClick}
                                        selectedChange={this.handleSelectedChange}
                                        selectedAllChange={this.handleSelectedAllChange}
                                        totalItem={this.faceDetectionStore.totalItem}
                                        currentPage={this.faceDetectionStore.currentPage}
                                        pageSize={this.faceDetectionStore.pageSize}
                                        mini={this.faceDetectionStore.viewMode === 'SPLIT'}
                                        selectedId={this.faceDetectionStore.selectedId}
                                        onPageChange={this.handlePageLoad}
                                        onPageSizeChange={this.handlePageSizeChange}
                                    />
                                )}
                            <BorderPanel
                                className={`map-view ${this.faceDetectionStore.viewMode === 'LIST' ? 'hidden' : ''}`}
                                flex={1}
                            >
                                <SpatialSearchMap
                                    store={this.spatialSearchStore}
                                    onMapRender={this.handleMapRender}
                                />
                            </BorderPanel>
                        </Resizable>
                    </PanelBody>
                </BorderPanel>
            </Container>
        );
    }
}

FaceDetection = withResizeMap(withModal(inject('appStore')(observer(FaceDetection))));
export { FaceDetection };
