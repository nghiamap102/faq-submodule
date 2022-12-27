import './FSimageDetail.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Moment from 'react-moment';

import {
    Field, Info, Label,
    FSDataBody,
    FSDataContainer,
    FSDataContent,
    SectionHeader,
    Button,
    Container,
} from '@vbd/vui';

class FSWatchListInfo extends Component
{
    handleAddWatchList = (faceId) =>
    {
        if (typeof this.props.onAddWatchList === 'function')
        {
            this.props.onAddWatchList(faceId);
        }
    };

    handleEditWatchList = (data, faceId) =>
    {
        if (typeof this.props.onUpdateWatchList === 'function')
        {
            this.props.onUpdateWatchList(data, faceId);
        }
    };

    handleRemoveWatchList = (id, faceId) =>
    {
        if (typeof this.props.onRemoveWatchList === 'function')
        {
            this.props.onRemoveWatchList(id, faceId);
        }
    };

    render()
    {
        const { gallery, data } = this.props;

        return (
            <FSDataContainer className={'fs-galleryData-container'}>
                <SectionHeader>Thông tin theo dõi</SectionHeader>
                {
                    data && (
                        <FSDataBody layout={'flex'}>
                            <FSDataContent>
                                <Field>
                                    <Label>Ngày bắt đầu</Label>
                                    <Info><Moment format={'L'}>{data.beginDate}</Moment></Info>
                                </Field>
                                <Field>
                                    <Label>Ngày kết thúc</Label>
                                    <Info>
                                        {data.isInfinity ? 'Không thời hạn' : <Moment format="DD/MM/YYYY">{data.endDate}</Moment>}
                                    </Info>
                                </Field>
                                <Field>
                                    <Label>Theo dõi</Label>
                                    <Info>{data.watchlist}</Info>
                                </Field>
                            </FSDataContent>
                        </FSDataBody>
                    )
                }

                <Container className={'button-group'}>
                    {
                        !data && (
                            <Button
                                className={'btn'}
                                color={'primary'}
                                text={'Thêm theo dõi'}
                                onClick={() => this.handleAddWatchList(gallery.faceId)}
                            />
                        )
                    }
                    {
                        data && (
                            <>
                                <Button
                                    className={'btn'}
                                    color={'primary'}
                                    text={'Cập nhật theo dõi'}
                                    onClick={() => this.handleEditWatchList(data, gallery.faceId)}
                                />
                                <Button
                                    className={'btn'}
                                    color={'danger'}
                                    text={'Xóa theo dõi'}
                                    onClick={() => this.handleRemoveWatchList(data.id, gallery.faceId)}
                                />
                            </>
                        )
                    }
                </Container>
            </FSDataContainer>
        );
    }
}

FSWatchListInfo.propTypes = {
    data: PropTypes.object,
    gallery: PropTypes.object,
    onAddWatchList: PropTypes.func,
    onUpdateWatchList: PropTypes.func,
    onRemoveWatchList: PropTypes.func,
};

FSWatchListInfo = inject('appStore')(observer(FSWatchListInfo));
export default FSWatchListInfo;
