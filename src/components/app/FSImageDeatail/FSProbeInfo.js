import './FSimageDetail.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    Field, Info, Label,
    TB1,
    FSDataBody,
    FSDataContainer,
    FSDataContent,
    VerticalLine,
    SectionHeader,
    Popup,
} from '@vbd/vui';

import MapLocationDisplay from 'components/app/Location/MapLocationDisplay';

class FSProbeInfo extends Component
{
    state = {
        isShowMapPopup: false,
    };

    render()
    {
        const { data } = this.props;
        const longitude = data.mapInfo.longitude;
        const latitude = data.mapInfo.latitude;

        return (
            <FSDataContainer className={'fs-probe-container'}>
                <SectionHeader>Thông tin nhận dạng</SectionHeader>

                <FSDataContent>
                    <TB1 className={'probe-pedigree'}>Vị trí bản đồ</TB1>
                    <Field>
                        <Info>
                            <MapLocationDisplay
                                height={'12rem'}
                                location={{ longitude: longitude, latitude: latitude }}
                                onClick={() =>
                                {
                                    this.setState({ isShowMapPopup: true });
                                }}
                            />
                            {
                                this.state.isShowMapPopup && (
                                    <Popup
                                        width={'70vw'}
                                        title={'Vị trí nhận dạng'}
                                        onClose={() =>
                                        {
                                            this.setState({ isShowMapPopup: false });
                                        }}
                                    >
                                        <MapLocationDisplay
                                            height={'70vh'}
                                            location={{ longitude: longitude, latitude: latitude }}
                                            interactive
                                        />
                                    </Popup>
                                )}
                        </Info>
                    </Field>
                </FSDataContent>

                <FSDataBody layout={'flex'}>

                    <FSDataContent>
                        <TB1 className={'probe-pedigree'}>Thời gian</TB1>
                        <Field>
                            <Label>Ngày</Label>
                            <Info><Moment format={'L'}>{data.pedigreeInfo.date}</Moment></Info>
                        </Field>
                        <Field>
                            <Label>Giờ</Label>
                            <Info><Moment format={'LTS'}>{data.pedigreeInfo.date}</Moment></Info>
                        </Field>
                    </FSDataContent>

                    <VerticalLine />

                    <FSDataContent>
                        <TB1 className={'probe-pedigree'}>Quét bởi</TB1>
                        <Field>
                            <Label>Nhà cung cấp</Label>
                            <Info>{data.scannedBy.owner}</Info>
                        </Field>
                        <Field>
                            <Label>Tên Camera</Label>
                            <Info>{data.scannedBy.cameraName}</Info>
                        </Field>
                    </FSDataContent>

                </FSDataBody>
            </FSDataContainer>
        );
    }
}

FSProbeInfo.propTypes = {
    data: PropTypes.object.isRequired,
};

export default FSProbeInfo;
