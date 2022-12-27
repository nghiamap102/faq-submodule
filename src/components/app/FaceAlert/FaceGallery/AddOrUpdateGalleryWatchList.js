import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Row,
    Popup, PopupFooter,
    Section,
    AdvanceSelect, Button, CheckBox, DateTimePicker,
    InputGroup,
    FormGroup, FormControlLabel,
    withModal,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { ValidationHelper } from 'helper/validation.helper';

import { FaceAlertService } from 'services/face-alert.service';
import { WatchListService } from 'services/watchList.service';

const Enum = require('constant/app-enum');

class AddOrUpdateGalleryWatchList extends Component
{
    faceAlertSvc = new FaceAlertService();
    watchListSvc = new WatchListService();

    fsImageDetailStore = this.props.appStore.fsImageDetailStore;
    faceGalleryStore = this.props.appStore.faceGalleryStore;
    watchListStore = this.props.appStore.watchListStore;
    incidentStore = this.props.appStore.incidentStore;

    constructor(props)
    {
        super(props);

        this.watchListSvc.gets().then((rs) =>
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

        this.faceAlertSvc.addOrUpdateGalleryWatchList(data).then((rs) =>
        {
            if (rs && rs.result === Enum.APIStatus.Success)
            {
                this.props.toast({ type: 'success', message: 'Cập nhật thành công' });

                if (this.watchListStore.type === 'by-fsImageDetail' && this.fsImageDetailStore.isShowImageDetail)
                {
                    this.fsImageDetailStore.setWatchListById(data.faceId, rs.data);
                }
                else if (this.watchListStore.type === 'by-galleryDetail' && this.faceGalleryStore.detailData)
                {
                    this.faceGalleryStore.setDetailProperty('watchList', rs.data);
                    this.faceGalleryStore.updateData(CommonHelper.clone(this.faceGalleryStore.detailData));
                }
                this.watchListStore.setAddState(false);
            }
            else if (rs)
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
                {isShowPopup && (
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
                                            // wrap by fragment to prevent FormControlLabel pass className.
                                            <>
                                                <Row>
                                                    <DateTimePicker
                                                        value={addGalleryWatchListData.endDate}
                                                        disabled={!addGalleryWatchListData.isInfinity}
                                                        onChange={event => this.handleChangeData('endDate', event)}
                                                    />
                                                    <Row itemMargin="sm">
                                                        <CheckBox
                                                            label="Không thời hạn"
                                                            checked={addGalleryWatchListData.isInfinity}
                                                            onChange={checked => this.handleChangeData('isInfinity', checked)}
                                                        />
                                                    </Row>
                                                </Row>
                                            </>
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

AddOrUpdateGalleryWatchList = withModal(inject('appStore')(observer(AddOrUpdateGalleryWatchList)));
export default AddOrUpdateGalleryWatchList;
