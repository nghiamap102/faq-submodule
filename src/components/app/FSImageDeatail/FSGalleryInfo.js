import './FSimageDetail.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    SectionHeader, TB1,
    Field, Info, Label,
    FSDataBody,
    FSDataContainer, FSDataContent,
    VerticalLine,
} from '@vbd/vui';

class FSGalleryInfo extends Component
{
    render()
    {
        const { data } = this.props;
        return (
            <FSDataContainer className={'fs-galleryData-container'}>
                <SectionHeader>Thông tin chi tiết</SectionHeader>

                <FSDataBody layout={'flex'}>
                    <FSDataContent>
                        <Field>
                            <Label>ID</Label>
                            <Info>{data.personId}</Info>
                        </Field>
                        <Field>
                            <Label>Họ tên</Label>
                            <Info>{data.name}</Info>
                        </Field>
                        <Field>
                            <Label>Bí danh</Label>
                            <Info>{data.alias}</Info>
                        </Field>
                        <Field>
                            <Label>Tổ chức</Label>
                            <Info>{data.organization}</Info>
                        </Field>
                        <Field>
                            <Label>Số điện thoại</Label>
                            <Info>{data.cellPhone}</Info>
                        </Field>
                        <Field>
                            <Label>Email</Label>
                            <Info>{data.email}</Info>
                        </Field>
                        <Field>
                            <Label>Giới tính</Label>
                            <Info>{data.gender}</Info>
                        </Field>
                        <Field>
                            <Label>Ngày sinh</Label>
                            <TB1>{data.dateOfBirth && <Moment format={'L'}>{data.dateOfBirth}</Moment>}</TB1>
                        </Field>
                        <Field>
                            <Label>Địa chỉ</Label>
                            <Info>{data.street}</Info>
                        </Field>
                        <Field>
                            <Label>Tỉnh/Thành phố</Label>
                            <Info>{data.province}</Info>
                        </Field>
                        <Field>
                            <Label>Quốc gia</Label>
                            <Info>{data.country}</Info>
                        </Field>
                    </FSDataContent>

                    <VerticalLine />

                    <FSDataContent>
                        <Field>
                            <Label>Màu da</Label>
                            <Info>{data.race}</Info>
                        </Field>
                        <Field>
                            <Label>Nơi làm việc</Label>
                            <Info>{data.agency}</Info>
                        </Field>
                        <Field>
                            <Label>Ngày cập nhật</Label>
                            <Info>{data.updateDate}</Info>
                        </Field>
                        <Field>
                            <Label>Biệt danh</Label>
                            <Info>{data.nickName}</Info>
                        </Field>
                        <Field>
                            <Label>Vết sẹo/Hình xăm</Label>
                            <Info>{data.scarsMarksTattoos}</Info>
                        </Field>
                        <Field>
                            <Label>Màu tóc</Label>
                            <Info>{data.hairColor}</Info>
                        </Field>
                        <Field>
                            <Label>Màu mắt</Label>
                            <Info>{data.eyeColor}</Info>
                        </Field>
                        <Field>
                            <Label>Chiều cao</Label>
                            <Info>{data.height}</Info>
                        </Field>
                        <Field>
                            <Label>Cân nặng</Label>
                            <Info>{data.weight}</Info>
                        </Field>
                        <Field>
                            <Label>Ghi chú</Label>
                            <Info>{data.notes}</Info>
                        </Field>
                        <Field>
                            <Label>Trạng thái</Label>
                            <Info>{data.status}</Info>
                        </Field>
                        <Field>
                            <Label>Ngày kết thúc</Label>
                            <Info>{data.expiredAfter}</Info>
                        </Field>
                    </FSDataContent>

                </FSDataBody>
            </FSDataContainer>
        );
    }

}

FSGalleryInfo.propTypes = {
    data: PropTypes.object.isRequired,
};

export default FSGalleryInfo;
