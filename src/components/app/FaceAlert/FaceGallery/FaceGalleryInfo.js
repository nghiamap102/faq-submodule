import './FaceGalleryAddOrUpdate.scss';

import React, { Component } from 'react';
import moment from 'moment-timezone';
import { inject, observer } from 'mobx-react';

import {
    SectionHeader,
    Input, AdvanceSelect, FormControlLabel, FormGroup,
    DateTimePicker,
    FSDataBody, FSDataContainer, FSDataContent, VerticalLine,
} from '@vbd/vui';

class FaceGalleryInfo extends Component
{
    faceGalleryStore = this.props.appStore.faceGalleryStore;

    handleChangeData = (key, value) =>
    {
        this.faceGalleryStore.setDetailProperty(key, value);
    };

    render()
    {
        const { type, detailData } = this.faceGalleryStore;
        let dob = undefined;
        let expiredAfter = undefined;
        if (type)
        {
            if (!detailData.dob)
            {
                dob = undefined;
            }
            else
            {
                dob = moment(detailData.dob).format('YYYY-MM-DD');
            }

            if (!detailData.expiredAfter)
            {
                expiredAfter = '';
            }
            else
            {
                expiredAfter = moment(detailData.expiredAfter).format('YYYY-MM-DD');
            }
        }
        return (
            <FSDataContainer className={'fs-galleryData-container'}>
                <SectionHeader>Thông tin chi tiết</SectionHeader>

                <FSDataBody layout={'flex'}>
                    <FSDataContent>
                        <FormGroup>
                            <FormControlLabel
                                label={'Id cá nhân'}
                                control={(
                                    <Input
                                        placeholder={'Nhập Id cá nhân'}
                                        value={detailData.personId}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('personId', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Họ và tên'}
                                control={(
                                    <Input
                                        placeholder={'Nhập họ và tên'}
                                        value={detailData.name}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('name', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Bí danh'}
                                control={(
                                    <Input
                                        placeholder={'Nhập bí danh'}
                                        value={detailData.alias}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('alias', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Tổ chức'}
                                control={(
                                    <Input
                                        placeholder={'Nhập tổ chức'}
                                        value={detailData.organization}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('organization', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Số điện thoại'}
                                control={(
                                    <Input
                                        placeholder={'Nhập số điện thoại'}
                                        value={detailData.cellPhone}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('cellPhone', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Email'}
                                control={(
                                    <Input
                                        placeholder={'Nhập email'}
                                        value={detailData.email}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('email', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Giới tính'}
                                control={(
                                    <AdvanceSelect
                                        options={[
                                            { id: null, label: 'Chọn giới tính' },
                                            { id: 'Nam', label: 'Nam' },
                                            { id: 'Nữ', label: 'Nữ' },
                                            { id: 'Khác', label: 'Khác' },
                                        ]}
                                        value={detailData.gender ? detailData.gender : null}
                                        onChange={(value) => this.handleChangeData('gender', value)}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label="Ngày sinh"
                                control={(
                                    <DateTimePicker
                                        value={dob}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('dob', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Địa chỉ'}
                                control={(
                                    <Input
                                        placeholder={'Nhập địa chỉ'}
                                        value={detailData.street}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('street', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Tỉnh Thành'}
                                control={(
                                    <Input
                                        placeholder={'Nhập tỉnh thành'}
                                        value={detailData.province}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('province', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label="Quốc gia"
                                control={(
                                    <AdvanceSelect
                                        options={[
                                            { id: null, label: 'Chọn quốc gia' },
                                            { id: 'VN', label: 'Việt Nam' },
                                            { id: 'US', label: 'Mỹ' },
                                            { id: 'JP', label: 'Nhật' },
                                            { id: 'CN', label: 'Trung Quốc' },
                                        ]}
                                        value={detailData.country ? detailData.country : null}
                                        onChange={(value) => this.handleChangeData('country', value)}
                                    />
                                )}
                            />
                        </FormGroup>
                    </FSDataContent>

                    <VerticalLine />

                    <FSDataContent>
                        <FormGroup>
                            <FormControlLabel
                                label={'Màu da'}
                                control={(
                                    <Input
                                        value={detailData.race}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('race', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Nơi làm việc'}
                                control={(
                                    <Input
                                        value={detailData.agency}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('agency', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Biệt danh'}
                                control={(
                                    <Input
                                        value={detailData.nickName}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('nickName', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Vết sẹo/Hình xăm'}
                                control={(
                                    <Input
                                        value={detailData.scarsMarksTattoos}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('scarsMarksTattoos', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Màu tóc'}
                                control={(
                                    <Input
                                        value={detailData.hairColor}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('hairColor', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Màu mắt'}
                                control={(
                                    <Input
                                        value={detailData.eyeColor}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('eyeColor', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Chiều cao'}
                                control={(
                                    <Input
                                        value={detailData.height}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('height', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Cân nặng'}
                                control={(
                                    <Input
                                        value={detailData.weight}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('weight', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Ghi chú'}
                                control={(
                                    <Input
                                        value={detailData.notes}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('notes', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Trạng thái'}
                                control={(
                                    <Input
                                        value={detailData.status}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('status', event);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label="Ngày kết thúc"
                                control={(
                                    <DateTimePicker
                                        value={expiredAfter}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('expiredAfter', event);
                                        }}
                                    />
                                )}
                            />
                        </FormGroup>
                    </FSDataContent>
                </FSDataBody>
            </FSDataContainer>
        );
    }
}

FaceGalleryInfo = inject('appStore')(observer(FaceGalleryInfo));
export { FaceGalleryInfo };
