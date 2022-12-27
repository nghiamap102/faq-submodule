import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    Section,
    AdvanceSelect, Button, CheckBox, InputGroup, DateTimePicker,
    FormGroup, FormControlLabel,
    Popup, PopupFooter,
    withModal,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { ValidationHelper } from 'helper/validation.helper';

import { PlateAlertService } from 'services/plate-alert.service';
import { PlateWatchListService } from 'services/plate-watch-list.service';

const Enum = require('constant/app-enum');

class AddOrUpdatePlateGalleryWatchList extends Component
{
    plateAlertService = new PlateAlertService();
    watchListSvc = new PlateWatchListService();

    plateGalleryStore = this.props.appStore.plateGalleryStore;
    watchListStore = this.props.appStore.plateWatchListStore;

    constructor(props)
    {
        super(props);

        this.watchListSvc.getAll().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.watchListStore.setWatchList(rs.data);
            }
        });
    }

    handleClose = () =>
    {
        this.watchListStore.setAddState(false);
    };

    handleChangeData = (key, value) =>
    {
        this.watchListStore.setAddProperty(key, value);
    };

    handleAddWatchList = () =>
    {
        // Validation
        const data = CommonHelper.clone(this.watchListStore.addGalleryWatchListData);

        if (!data.watchListIds)
        {
            this.props.toast({ type: 'error', message: 'Theo dõi không được bỏ trống' });
            return;
        }

        if (!data.isInfinity && !data.endDate)
        {
            this.props.toast({ type: 'error', message: 'Ngày kết thúc không được bỏ trống' });
            return;
        }

        if (data.SMS && !ValidationHelper.isPhoneNumber(data.SMS))
        {
            this.props.toast({ type: 'error', message: 'SMS không đúng định dạng' });
            return;
        }

        if (data.email && !ValidationHelper.isEmail(data.email))
        {
            this.props.toast({ type: 'error', message: 'Email không đúng định dạng' });
            return;
        }

        this.plateAlertService.addOrUpdatePlateGalleryWatchList(data).then((rs) =>
        {
            if (rs && rs.result === Enum.APIStatus.Success)
            {
                this.props.toast({ type: 'success', message: 'Cập nhật thành công' });

                if (this.watchListStore.type === 'by-fsImageDetail' && this.fsImageDetailStore.isShowImageDetail)
                {
                    this.fsImageDetailStore.setWatchListById(data.faceId, rs.data.watchList);
                }
                else if (this.watchListStore.type === 'by-galleryDetail' && this.plateGalleryStore.detailData)
                {
                    this.plateGalleryStore.setDetailProperty('watchList', rs.data.watchList);
                    this.plateGalleryStore.updateData(CommonHelper.clone(this.plateGalleryStore.detailData));
                }
                this.watchListStore.setAddState(false);

                if (rs.data.isAddGallery)
                {
                    this.reloadGalleries();
                }
            }
            else if (rs)
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
        });
    };

    reloadGalleries = () =>
    {
        this.plateGalleryStore.setPaging(this.plateGalleryStore.totalItem, this.plateGalleryStore.currentPage);

        const searchState = this.plateGalleryStore.getFullSearchState();
        this.plateAlertService.search(searchState).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.plateGalleryStore.setData(rs.data.data);
                this.plateGalleryStore.setPaging(rs.data.total, this.plateGalleryStore.currentPage);
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
        });
    };

    render()
    {
        const { isShowPopup, addGalleryWatchListData } = this.watchListStore;
        const watchList = this.watchListStore.watchList;

        return (
            <>
                {
                    isShowPopup && (
                        <Popup
                            className={'popup-wl'}
                            title={'Thêm vào danh sách theo dõi'}
                            width={'600px'}
                            onClose={this.handleClose}
                        >
                            <Container className={'wl'}>
                                <Section header={'Thông tin'}>
                                    <FormGroup>
                                        <FormControlLabel
                                            label={'Thời hạn'}
                                            control={(
                                                <InputGroup>
                                                    <DateTimePicker
                                                        value={addGalleryWatchListData.endDate}
                                                        disabled={addGalleryWatchListData.isInfinity}
                                                        onChange={(event) =>
                                                        {
                                                            this.handleChangeData('endDate', event);
                                                        }}
                                                    />
                                                    <CheckBox
                                                        className={'check-infinity'}
                                                        label="Không thời hạn"
                                                        checked={addGalleryWatchListData.isInfinity}
                                                        onChange={() => this.handleChangeData('isInfinity', !addGalleryWatchListData.isInfinity)}
                                                    />
                                                </InputGroup>
                                            )}
                                        />

                                        <FormControlLabel
                                            label={'Theo dõi'}
                                            control={(
                                                <AdvanceSelect
                                                    options={watchList.map((wl) =>
                                                    {
                                                        return { id: wl.id, label: wl.name };
                                                    })}
                                                    value={addGalleryWatchListData.watchListIds ? addGalleryWatchListData.watchListIds : []}
                                                    multi
                                                    onChange={(value) => this.handleChangeData('watchListIds', value)}
                                                />
                                            )}
                                        />
                                    </FormGroup>
                                </Section>
                            </Container>

                            <PopupFooter>
                                <Button
                                    className={'btn add-watch-list'}
                                    color={'primary'}
                                    text={'Cập nhật'}
                                    onClick={this.handleAddWatchList}
                                />
                            </PopupFooter>
                        </Popup>
                    )}
            </>
        );
    }
}

AddOrUpdatePlateGalleryWatchList = withModal(inject('appStore')(observer(AddOrUpdatePlateGalleryWatchList)));
export default AddOrUpdatePlateGalleryWatchList;
