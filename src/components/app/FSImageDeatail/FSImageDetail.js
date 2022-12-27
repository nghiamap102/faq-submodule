import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Container,
    Popup,
    withModal,
} from '@vbd/vui';

import FSQuickInfo from './FSQuickInfo';
import FSImageInfo from './FSImageInfo';
import FSGalleryInfo from './FSGalleryInfo';
import FSWatchListInfo from './FSWatchListInfo';
import FSCaseInfo from './FSCaseInfo';
import FSComment from './FSComment';
import FSProbeInfo from './FSProbeInfo';

import { FaceAlertService } from 'services/face-alert.service';

import Enum from 'constant/app-enum';

class FSImageDetail extends Component
{
    fsImageDetailStore = this.props.appStore.fsImageDetailStore;
    watchListStore = this.props.appStore.watchListStore;

    faceAlertSvc = new FaceAlertService();

    constructor(props)
    {
        super(props);

        this.fsImageDetailStore.loadGallery(props.gallery);
        this.fsImageDetailStore.loadProbe(props.probe);

    }

    handleCloseGeofenceDetail = () =>
    {
        this.fsImageDetailStore.toggleShowImageDetail();
    };

    handleAddWatchList = (faceId) =>
    {
        this.watchListStore.setAddState(true, 'by-fsImageDetail');
        this.watchListStore.addGalleryWatchListData.faceId = faceId;
    };

    handleUpdateWatchList = (data, faceId) =>
    {
        this.watchListStore.setUpdateState(true, data, 'by-fsImageDetail');
        this.watchListStore.addGalleryWatchListData.faceId = faceId;
    };

    handleRemoveWatchList = (id, faceId) =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn xóa danh sách theo dõi này?',
            onOk: () =>
            {
                this.faceAlertSvc.deleteGalleryWatchList({ id, faceId }).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.props.toast({ type: 'success', message: 'Xóa thành công' });

                        this.fsImageDetailStore.deleteWatchListByFaceId(faceId);
                    }
                    else
                    {
                        this.props.toast({ type: 'error', message: rs.errorMessage });
                    }
                });
            },
        });
    };

    render()
    {
        const { isShowImageDetail, gallery, probe } = this.fsImageDetailStore;
        const gallerySelected = gallery.find((g) => g.selected === true);

        return (
            <>
                {
                    isShowImageDetail && (
                        <Popup
                            title={'Chi tiết ảnh'}
                            width={'1200px'}
                            height={'80%'}
                            onClose={this.handleCloseGeofenceDetail}
                        >
                            <Container>
                                <FSQuickInfo data={gallerySelected.quickInfo} />

                                <FSImageInfo
                                    gallery={gallery}
                                    probe={probe}
                                />
                                {
                                    probe && probe.isShowProbeInfo && <FSProbeInfo data={probe} />
                                }

                                <FSGalleryInfo
                                    data={gallerySelected.galleryInfo}
                                    probe={probe}
                                />

                                <FSWatchListInfo
                                    gallery={gallerySelected}
                                    data={gallerySelected.watchList}
                                    onAddWatchList={this.handleAddWatchList}
                                    onUpdateWatchList={this.handleUpdateWatchList}
                                    onRemoveWatchList={this.handleRemoveWatchList}
                                />

                                <FSCaseInfo data={gallerySelected.cases} />
                                <FSComment data={gallerySelected.commentForm} />

                            </Container>
                        </Popup>
                    )}

            </>
        );
    }
}

FSImageDetail.propTypes = {
    gallery: PropTypes.array.isRequired,
    probe: PropTypes.object,

};

FSImageDetail = withModal(inject('appStore')(observer(FSImageDetail)));
export { FSImageDetail };
