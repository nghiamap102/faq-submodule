import React, { Component } from 'react';
import Moment from 'react-moment';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Row, Container, Column, Expanded, Spacer,
    Image,
    FormControlLabel,
    Button, EmptyButton,
    Popup,
    HD6, TB1,
    DescriptionItem,
} from '@vbd/vui';

import MapLocationDisplay from 'components/app/Location/MapLocationDisplay';

class PlateDetectionDetail extends Component
{
    watchListStore = this.props.appStore.plateWatchListStore;

    state = {
        isShowMapPopup: false,
    };

    handleAddWatchList = () =>
    {
        this.watchListStore.setAddState(true, 'by-galleryDetail');
        this.watchListStore.addGalleryWatchListData.detectedData = this.props.data;
    };

    handlePrevClick = () =>
    {
        !this.props.isLoading && this.props.onPrevClick && this.props.onPrevClick(this.props.data);
    };

    handleNextClick = () =>
    {
        !this.props.isLoading && this.props.onNextClick && this.props.onNextClick(this.props.data);
    };

    renderTitleBar = (data) =>
    {
        return (
            <Row
                mainAxisAlignment={'start'}
                crossAxisAlignment={'center'}
                crossAxisSize={'min'}
                itemMargin={'sm'}
            >
                <EmptyButton
                    icon="arrow-left"
                    disabled={this.props.isLoading}
                    onlyIcon
                    onClick={this.handlePrevClick}
                />
                <EmptyButton
                    icon="arrow-right"
                    disabled={this.props.isLoading}
                    onlyIcon
                    onClick={this.handleNextClick}
                />
                <HD6>{data.carNumber}</HD6>
                <TB1><Moment format={'L LTS'}>{data.gMTDatetime}</Moment></TB1>

                {
                    !this.props.mini && (
                        <Expanded>
                            <Row
                                mainAxisAlignment={'end'}
                                crossAxisAlignment={'center'}
                                crossAxisSize={'min'}
                                itemMargin={'sm'}
                            >
                                <Button
                                    className={'btn'}
                                    type={'warning'}
                                    text={'Thêm theo dõi'}
                                    onClick={this.handleAddWatchList}
                                />
                                <Button
                                    color={'primary'}
                                    text={'Lịch sử'}
                                    onClick={this.props.onViewHistory}
                                />
                            </Row>
                        </Expanded>
                    )}
            </Row>
        );
    };

    renderPlateNumberImage = (data) =>
    {
        const mini = this.props.mini;

        const children = (
            <>
                <Expanded>
                    <FormControlLabel
                        label={'Hình toàn cảnh'}
                        labelWidth={'8rem'}
                        direction={'column'}
                        control={(
                            <Image
                                width={'100%'}
                                height={'12rem'}
                                fitMode={'cover'}
                                src={data.carImage}
                                canEnlarge
                            />
                        )}
                    />
                </Expanded>
                <Spacer size={mini ? '0' : '1.25rem'} />
                <Expanded>
                    <FormControlLabel
                        label={'Hình biển số'}
                        labelWidth={'8rem'}
                        direction={'column'}
                        control={(
                            <Image
                                width={'100%'}
                                height={'12rem'}
                                fitMode={'cover'}
                                src={data.plateImage}
                                canEnlarge
                            />
                        )}
                    />
                </Expanded>
            </>
        );

        return mini ? <Column>{children}</Column> : <Row>{children}</Row>;
    };

    renderDetailFields = (data) =>
    {
        const mini = this.props.mini;
        const children = (
            <>
                <Column>
                    <DescriptionItem
                        label={'Biển số xe'}
                        labelWidth={'8rem'}
                    >
                        {data.carNumber}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Độ chính xác'}
                        labelWidth={'8rem'}
                    >
                        {`${data.accuracy ? (data.accuracy * 100).toFixed(0) : 0}%`}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Số khung'}
                        labelWidth={'8rem'}
                    >
                        {data.vin}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Màu xe'}
                        labelWidth={'8rem'}
                    >
                        {data.carColor}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Nhãn hiệu'}
                        labelWidth={'8rem'}
                    >
                        {data.make}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Loại xe'}
                        labelWidth={'8rem'}
                    >
                        {data.model}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Chủ sở hữu'}
                        labelWidth={'8rem'}
                    >
                        {data.ownerName}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Tốc độ'}
                        labelWidth={'8rem'}
                    >
                        {data.carSpeed}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Ngày giờ sự kiện'}
                        labelWidth={'8rem'}
                    >
                        {<Moment format={'L LT'}>{data.gMTDatetime}</Moment>}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Chiều cao chữ'}
                        labelWidth={'8rem'}
                    >
                        {data.heightCharacter}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Mã sự kiện'}
                        labelWidth={'8rem'}
                    >
                        {data.eventID}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Mã phát hiện'}
                        labelWidth={'8rem'}
                    >
                        {data.hitID}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Mã theo dõi'}
                        labelWidth={'8rem'}
                    >
                        {data.hotID}
                    </DescriptionItem>

                    <DescriptionItem
                        label={'Nguồn'}
                        labelWidth={'8rem'}
                    >
                        {data.source}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Ghi chú'}
                        labelWidth={'8rem'}
                    >
                        {data.notes}
                    </DescriptionItem>
                </Column>
                <Spacer size={mini ? '0' : '1.25rem'} />
                <Column>
                    <FormControlLabel
                        label={'Vị trí'}
                        labelWidth={'8rem'}
                        control={(
                            <Container>
                                <MapLocationDisplay
                                    height={'12rem'}
                                    location={{ longitude: data.y, latitude: data.x }}
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
                                                location={{ longitude: data.y, latitude: data.x }}
                                                interactive
                                            />
                                        </Popup>
                                    )}
                            </Container>
                        )}
                        direction={'column'}
                    />
                    <DescriptionItem
                        label={'Hệ thống'}
                        labelWidth={'8rem'}
                    >
                        {data.learnSystemName}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Camera'}
                        labelWidth={'8rem'}
                    >
                        {data.cameraName}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Trạng thái'}
                        labelWidth={'8rem'}
                    >
                        {data.status}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Múi giờ'}
                        labelWidth={'8rem'}
                    >
                        {data.timeZone}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Cập nhật'}
                        labelWidth={'8rem'}
                    >
                        {data.update}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Người dùng'}
                        labelWidth={'8rem'}
                    >
                        {data.user}
                    </DescriptionItem>
                    <DescriptionItem
                        label={'Phiên bản'}
                        labelWidth={'8rem'}
                    >
                        {data.version}
                    </DescriptionItem>
                </Column>
            </>
        );

        return mini ? <Column>{children}</Column> : <Row>{children}</Row>;
    };

    render()
    {
        const data = this.props.data;

        return (
            <Column mainAxisSize={'min'}>
                {this.renderTitleBar(data)}
                {this.renderPlateNumberImage(data)}
                {this.renderDetailFields(data)}
            </Column>
        );
    }
}

PlateDetectionDetail.propTypes = {
    onViewHistory: PropTypes.func,
    onPrevClick: PropTypes.func,
    onNextClick: PropTypes.func,
    data: PropTypes.object,
    // style: PropTypes.object,
    mini: PropTypes.bool,
    isLoading: PropTypes.bool,
};

PlateDetectionDetail.defaultProps = {
    // className: '',
    mini: false,
    data: null,
    // style: {},
};


PlateDetectionDetail = inject('appStore')(observer(PlateDetectionDetail));
export { PlateDetectionDetail };
