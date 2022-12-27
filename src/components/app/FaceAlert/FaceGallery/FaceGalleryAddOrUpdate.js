import '../FaceAlert.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    Popup, PopupFooter,
    Button,
    withModal,
} from '@vbd/vui';

import FSQuickInfo from 'components/app/FSImageDeatail/FSQuickInfo';
import FSCaseInfo from 'components/app/FSImageDeatail/FSCaseInfo';
import FSComment from 'components/app/FSImageDeatail/FSComment';
import FSWatchListInfo from 'components/app/FSImageDeatail/FSWatchListInfo';

import Enum from 'constant/app-enum';

import { FaceAlertService } from 'services/face-alert.service';
import { ValidationHelper } from 'helper/validation.helper';
import { CommonHelper } from 'helper/common.helper';

import { FaceGalleryInfo } from './FaceGalleryInfo';
import FaceGalleryImages from './FaceGalleryImages';

class FaceGalleryAddOrUpdate extends Component
{
    faceGalleryStore = this.props.appStore.faceGalleryStore;
    watchListStore = this.props.appStore.watchListStore;
    faceAlertSvc = new FaceAlertService(this.props.appStore);

    handleClose = () =>
    {
        this.faceGalleryStore.setDetail(this.faceGalleryStore.detailData, undefined);
    };

    handleAddWatchList = (faceId) =>
    {
        this.watchListStore.setAddState(true, 'by-galleryDetail');
        this.watchListStore.addGalleryWatchListData.faceId = faceId;
    };

    handleUpdateWatchList = (data, faceId) =>
    {
        this.watchListStore.setUpdateState(true, CommonHelper.clone(data), 'by-galleryDetail');
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
                    if (rs && rs.result === Enum.APIStatus.Success)
                    {
                        this.props.toast({ type: 'success', message: 'Xóa thành công' });

                        this.faceGalleryStore.setDetailProperty('watchList', undefined);
                        this.faceGalleryStore.updateData(CommonHelper.clone(this.faceGalleryStore.detailData));
                    }
                    else if (rs)
                    {
                        this.props.toast({ type: 'error', message: rs.errorMessage });
                    }
                });
            },
        });
    };

    handleApply = () =>
    {
        const detail = this.faceGalleryStore.detailData;
        // Validation
        if (!detail.personId)
        {
            this.props.toast({ type: 'error', message: 'Id cá nhân không được bỏ trống' });
            return;
        }
        if (detail.cellPhone && !ValidationHelper.isPhoneNumber(detail.cellPhone))
        {
            this.props.toast({ type: 'error', message: 'Số điện thoại không đúng định dạng' });
            return;
        }

        if (detail.email && !ValidationHelper.isEmail(detail.email))
        {
            this.props.toast({ type: 'error', message: 'Email không đúng định dạng' });
            return;
        }

        if (this.faceGalleryStore.type === 'add')
        {
            this.faceAlertSvc.galleryAdd(this.faceGalleryStore.detailData).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.props.toast({ type: 'success', message: 'Thêm thành công' });

                    const searchState = this.faceGalleryStore.getFullSearchState();
                    this.faceAlertSvc.gallerySearchAll(searchState).then((rs) =>
                    {
                        if (rs.result === Enum.APIStatus.Success)
                        {
                            this.faceGalleryStore.setData(rs.data.data);
                            this.faceGalleryStore.setPaging(rs.data.total, this.faceGalleryStore.currentPage);
                        }
                    });
                    this.faceGalleryStore.setDetail(rs.data, 'update');
                }
                else
                {
                    this.props.toast({ type: 'error', message: rs.errorMessage || rs.message });
                    let coresponseStatus = ['internal-error'];
                    const { detailData } = this.faceGalleryStore;

                    if (detailData && detailData.images && detailData.images.length)
                    {
                        coresponseStatus = [...coresponseStatus, ...Array(detailData.images.length).fill('internal-error')];
                    }

                    this.faceGalleryStore.setDetailProperty('imageStatuses', coresponseStatus);
                }
            });
        }
        else
        {
            this.faceAlertSvc.galleryEdit(this.faceGalleryStore.detailData).then((galleryResponse) =>
            {
                if (galleryResponse.result === Enum.APIStatus.Success && galleryResponse.data.index === true)
                {
                    this.props.toast({ type: 'success', message: 'Sửa thành công' });

                    const searchState = this.faceGalleryStore.getFullSearchState();
                    this.faceAlertSvc.gallerySearchAll(searchState).then((rs) =>
                    {
                        if (rs.result === Enum.APIStatus.Success)
                        {
                            this.faceGalleryStore.setData(rs.data.data);
                            this.faceGalleryStore.setPaging(rs.data.total, this.faceGalleryStore.currentPage);
                        }
                    });
                    this.faceGalleryStore.setDetail(galleryResponse.data.gallery, 'update');
                }
                else if (galleryResponse.result === Enum.APIStatus.Success && galleryResponse.data.index === false)
                {
                    this.props.toast({ type: 'error', message: 'Lỗi hệ thống' });
                    const { newSubImageIndex, isMainFaceImageChange } = galleryResponse.data;
                    const coresponseStatus = [];

                    if (isMainFaceImageChange)
                    {
                        coresponseStatus.push('internal-error');
                    }
                    else
                    {
                        coresponseStatus.push(null);
                    }
                    const { detailData } = this.faceGalleryStore;

                    if (detailData && detailData.images && detailData.images.length)
                    {
                        detailData.images.forEach((i, index) =>
                        {
                            if (newSubImageIndex.includes(index))
                            {
                                coresponseStatus.push('internal-error');
                            }
                            else
                            {
                                coresponseStatus.push(null);
                            }
                        });
                    }

                    this.faceGalleryStore.setDetailProperty('imageStatuses', coresponseStatus);
                }
                else
                {
                    this.props.toast({ type: 'error', message: galleryResponse.errorMessage || galleryResponse.message });
                    this.faceGalleryStore.setDetailProperty('imageStatuses', ['internal-error']);
                }
            });
        }
    };

    render()
    {
        const { type, detailData } = this.faceGalleryStore;
        return (
            <>
                {type && (
                    <Popup
                        title={'Thêm/Sửa thư viện'}
                        width={'1200px'}
                        onClose={this.handleClose}
                    >
                        <Container className={'face-gallery-add-update'}>
                            <FSQuickInfo data={detailData} />

                            <FaceGalleryImages />

                            <FaceGalleryInfo />

                            <FSWatchListInfo
                                gallery={detailData}
                                data={detailData.watchList}
                                onAddWatchList={this.handleAddWatchList}
                                onUpdateWatchList={this.handleUpdateWatchList}
                                onRemoveWatchList={this.handleRemoveWatchList}
                            />

                            <FSCaseInfo data={detailData.cases} />
                            <FSComment data={detailData.commentForm} />
                        </Container>

                        <PopupFooter>
                            <Button
                                color={type === 'add' ? 'primary' : 'warning'}
                                text={type === 'add' ? 'Thêm mới' : 'Cập nhật'}
                                disabled={(!detailData.imageData && !detailData.faceImage) || detailData.imageStatuses?.some(e => e)}
                                onClick={this.handleApply}
                            />
                        </PopupFooter>
                    </Popup>
                )}

            </>
        );
    }
}

FaceGalleryAddOrUpdate.propTypes = {};

FaceGalleryAddOrUpdate = withModal(inject('appStore')(observer(FaceGalleryAddOrUpdate)));
export default FaceGalleryAddOrUpdate;
