import '../FaceAlert.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Container,
    FAIcon,
    Image, CropImage,
    TB1,
    BorderPanel,
    T,
    DataGrid,
} from '@vbd/vui';

import { FaceAlertService } from 'services/face-alert.service';

export class FaceRecognitionContent extends Component
{
    faceAlertSvc = new FaceAlertService();

    state = {
        viewType: 1, // 1: list view; 2 grid view,
        selectedId: '',
    };

    handleChangeViewType = (type) =>
    {
        this.setState({ viewType: type });
    };

    handleClickDetail = (data, event) =>
    {
        if (event.target.tagName === 'I')
        {
            return;
        }

        if (typeof this.props.detailClick === 'function')
        {
            this.props.detailClick(data);
        }
    };

    handleClickSearch = (data) =>
    {
        if (typeof this.props.searchClick === 'function')
        {
            this.props.searchClick(data);
        }
    };

    render()
    {
        let dataViewComponent = <></>;

        const items = Array.isArray(this.props.data) && this.props.data.map(d =>
        {
            return {
                ...d,
                faceImage: (
                    <CropImage
                        width={'150px'}
                        height={'150px'}
                        imageData={this.props.imageData}
                        box={this.props.boxes[d.faceId]}
                        canEnlarge
                    />
                ),
                candidate: (
                    <Image
                        width={'150px'}
                        height={'150px'}
                        src={this.faceAlertSvc.getBestMatchImageUrl(d.gallery.faceId)}
                        canEnlarge
                    />
                ),
                accuracy: <TB1>{(d.accuracy * 100).toFixed(0)}%</TB1>,
                details: (
                    <>
                        <TB1>{d.gallery?.personId}</TB1>
                        <TB1>{d.gallery?.name}</TB1>
                        <TB1>{d.gallery?.organization}</TB1>
                        <TB1>{d.gallery?.cellphone}</TB1>
                        <TB1>{d.gallery?.email}</TB1>
                    </>
                ),
            };
        });

        switch (this.state.viewType)
        {
            case 1:
                dataViewComponent = (
                    <>
                        <DataGrid
                            columns={
                                [
                                    { id: 'id', displayAsText: 'ID', hidden: true },
                                    { id: 'faceImage', displayAsText: 'Hình gương mặt', schema: 'react-node', width: 200 },
                                    { id: 'candidate', displayAsText: 'Người khớp nhất', schema: 'react-node', width: 200 },
                                    { id: 'accuracy', displayAsText: 'Độ chính xác', schema: 'react-node', width: 100 },
                                    { id: 'details', schema: 'react-node', displayAsText: 'Thông tin' },
                                ]
                            }
                            items={items}
                            rowNumber
                            onCellClick={(event, row) =>
                            {
                                const index = items.findIndex(item => item.id === row.id);
                                this.handleClickDetail(this.props.data[index], event);
                            }}
                        />
                    </>
                );
                break;
            case 2:
            default:
                dataViewComponent = <Container />;
                break;
        }

        return (
            <BorderPanel
                className={`face-alert-content ${this.props.className}`}
                flex={1}
            >
                <Container className={'face-alert-tool'}>
                    <Container className={'face-alert-view alias-right'}>
                        <T>KIỂU XEM</T>
                        <FAIcon
                            className={this.state.viewType === 1 ? 'active' : ''}
                            icon={'grip-lines'}
                            onClick={() =>
                            {
                                this.handleChangeViewType(1);
                            }}
                        />
                    </Container>
                </Container>
                {dataViewComponent}
            </BorderPanel>
        );
    }
}

FaceRecognitionContent.propTypes = {
    className: PropTypes.string,
    imageData: PropTypes.string,
    boxes: PropTypes.object,
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    detailClick: PropTypes.func,
    searchClick: PropTypes.func,
};

