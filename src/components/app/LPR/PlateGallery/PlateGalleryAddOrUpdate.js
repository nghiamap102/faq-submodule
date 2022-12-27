import '../PlateAlert.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
    Container,
    Popup, PopupFooter,
    Button,
    CheckBox, FormControlLabel, FormGroup, Input, Section,
    withModal,
} from '@vbd/vui';

import FSWatchListInfo from 'components/app/FSImageDeatail/FSWatchListInfo';

import { CommonHelper } from 'helper/common.helper';
import { PlateAlertService } from 'services/plate-alert.service';

import Enum from 'constant/app-enum';

class PlateGalleryAddOrUpdate extends Component
{
    plateGalleryStore = this.props.appStore.plateGalleryStore;
    watchListStore = this.props.appStore.plateWatchListStore;

    plateAlertService = new PlateAlertService();

    handleClose = () =>
    {
        this.plateGalleryStore.setDetail(this.plateGalleryStore.detailData, undefined);
    };

    handleAddWatchList = (plateId) =>
    {
        this.watchListStore.setAddState(true, 'by-galleryDetail');
        this.watchListStore.addGalleryWatchListData.plateId = plateId;
    };

    handleUpdateWatchList = (data, plateId) =>
    {
        this.watchListStore.setUpdateState(true, CommonHelper.clone(data), 'by-galleryDetail');
        this.watchListStore.addGalleryWatchListData.plateId = plateId;
    };

    handleRemoveWatchList = (id, faceId) =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn xóa danh sách theo dõi này?',
            onOk: () =>
            {
                this.plateAlertService.deletePlateGalleryWatchList({ id: faceId }).then((rs) =>
                {
                    if (rs && rs.result === Enum.APIStatus.Success)
                    {
                        this.props.toast({ type: 'success', message: 'Xóa thành công' });

                        this.plateGalleryStore.setDetailProperty('watchList', undefined);
                        this.plateGalleryStore.updateData(CommonHelper.clone(this.plateGalleryStore.detailData));
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
        const detail = this.plateGalleryStore.detailData;
        delete detail.faceId; // for reuse watchlist info component
        // Validation
        if (!detail.plateNumber)
        {
            this.props.toast({ type: 'error', message: 'Biển số xe không được bỏ trống' });
            return;
        }

        if (this.plateGalleryStore.type === 'add')
        {
            this.plateAlertService.add(this.plateGalleryStore.detailData).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.props.toast({ type: 'success', message: 'Thêm thành công' });

                    const searchState = this.plateGalleryStore.getFullSearchState();
                    this.plateAlertService.search(searchState).then((rs) =>
                    {
                        if (rs.result === Enum.APIStatus.Success)
                        {
                            this.plateGalleryStore.setData(rs.data.data);
                            this.plateGalleryStore.setPaging(rs.data.total, this.plateGalleryStore.currentPage);
                        }
                    });
                    this.plateGalleryStore.setDetail(rs.data, 'update');
                }
                else
                {
                    this.props.toast({ type: 'error', message: rs.errorMessage });
                }
            });
        }
        else
        {
            this.plateAlertService.edit(this.plateGalleryStore.detailData).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.props.toast({ type: 'success', message: 'Sửa thành công' });

                    const searchState = this.plateGalleryStore.getFullSearchState();
                    this.plateAlertService.search(searchState).then((rs) =>
                    {
                        if (rs.result === Enum.APIStatus.Success)
                        {
                            this.plateGalleryStore.setData(rs.data.data);
                            this.plateGalleryStore.setPaging(rs.data.total, this.plateGalleryStore.currentPage);
                        }
                    });
                    this.plateGalleryStore.setDetail(rs.data, 'update');
                }
                else
                {
                    this.props.toast({ type: 'error', message: rs.errorMessage });
                }
            });
        }
    };

    handleChangeProperty = (key, value) =>
    {
        this.plateGalleryStore.setDetailProperty(key, value);
    };

    render()
    {
        const { type, detailData } = this.plateGalleryStore;

        if (detailData)
        {
            detailData.faceId = detailData.id; // for reuse watchlist info component
        }

        return (
            <>
                {type && (
                    <Popup
                        title={'Thêm/Sửa thư viện'}
                        width={'600px'}
                        onClose={this.handleClose}
                    >
                        <Container className={'plate-gallery-add-update'}>
                            <Section header={'Thông tin cơ bản'}>
                                <FormGroup>
                                    <FormControlLabel
                                        label={'Biển số xe'}
                                        control={(
                                            <Input
                                                placeholder={'Nhập biển số xe'}
                                                value={detailData.plateNumber}
                                                disabled={type !== 'add'}
                                                onChange={(event) => this.handleChangeProperty('plateNumber', event)}
                                            />
                                        )}
                                    />

                                    <FormControlLabel
                                        label={'Loại xe'}
                                        control={(
                                            <Input
                                                placeholder={'Nhập loại xe'}
                                                value={detailData.type}
                                                onChange={(event) => this.handleChangeProperty('type', event)}
                                            />
                                        )}
                                    />

                                    <FormControlLabel
                                        label={'Màu xe'}
                                        control={(
                                            <Input
                                                placeholder={'Nhập màu xe'}
                                                value={detailData.color}
                                                onChange={(event) => this.handleChangeProperty('color', event)}
                                            />
                                        )}
                                    />

                                    <FormControlLabel
                                        label={'Chủ sở hữu'}
                                        control={(
                                            <Input
                                                placeholder={'Nhập người sở hữu'}
                                                value={detailData.owner}
                                                onChange={(event) => this.handleChangeProperty('owner', event)}
                                            />
                                        )}
                                    />

                                    <FormControlLabel
                                        label={'Số khung'}
                                        control={(
                                            <Input
                                                placeholder={'Nhập số khung'}
                                                value={detailData.vin}
                                                onChange={(event) => this.handleChangeProperty('vin', event)}
                                            />
                                        )}
                                    />

                                    <FormControlLabel
                                        label={'Hãng sản xuất'}
                                        control={(
                                            <Input
                                                placeholder={'Nhập hãng sản xuất'}
                                                value={detailData.make}
                                                onChange={(event) => this.handleChangeProperty('make', event)}
                                            />
                                        )}
                                    />

                                    <FormControlLabel
                                        label={'Dòng xe'}
                                        control={(
                                            <Input
                                                placeholder={'Nhập dòng xe'}
                                                value={detailData.model}
                                                onChange={(event) => this.handleChangeProperty('model', event)}
                                            />
                                        )}
                                    />

                                    <FormControlLabel
                                        label={'Hoạt động'}
                                        control={(
                                            <CheckBox
                                                checked={detailData.isActivate}
                                                onChange={() => this.handleChangeProperty('isActivate', !detailData.isActivate)}
                                            />
                                        )}
                                    />

                                </FormGroup>
                            </Section>
                            {
                                type !== 'add' && (
                                    <FSWatchListInfo
                                        gallery={detailData}
                                        data={detailData.watchList}
                                        onAddWatchList={this.handleAddWatchList}
                                        onUpdateWatchList={this.handleUpdateWatchList}
                                        onRemoveWatchList={this.handleRemoveWatchList}
                                    />
                                )}
                        </Container>

                        <PopupFooter>
                            <Button
                                color={type === 'add' ? 'primary' : 'warning'}
                                text={type === 'add' ? 'Thêm mới' : 'Cập nhật'}
                                disabled={!detailData.plateNumber}
                                onClick={this.handleApply}
                            />
                        </PopupFooter>
                    </Popup>
                )}

            </>
        );
    }
}

PlateGalleryAddOrUpdate.propTypes = {
    onSearch: PropTypes.func,
};

PlateGalleryAddOrUpdate = withModal(inject('appStore')(observer(PlateGalleryAddOrUpdate)));
export default PlateGalleryAddOrUpdate;
