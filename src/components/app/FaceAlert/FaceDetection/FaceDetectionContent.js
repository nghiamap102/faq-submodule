import '../FaceAlert.scss';
import unknownFace from 'images/faceImage/unknown-face.png';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    Container, Row, Column, Spacer,
    Image,
    TB1,
    BorderPanel,
    AdvanceSelect, EmptyButton,
    Paging,
    T,
    ImageGrid,
    DataGrid, ScrollView,
} from '@vbd/vui';

import { FaceAlertService } from 'services/face-alert.service';

export class FaceDetectionContent extends Component
{
    faceAlertSvc = new FaceAlertService();

    state = {
        viewType: 1, // 1: list view 2: ImageView ; 3 grid view,
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

    handleClickDelete = () =>
    {
        if (typeof this.props.deleteClick === 'function')
        {
            this.props.deleteClick();
        }
    };

    handleChangePage = (page) =>
    {
        if (typeof this.props.onPageChange === 'function')
        {
            this.props.onPageChange(page);
        }
    };

    handleSelect = (event, item) =>
    {

    };

    render()
    {
        const mini = this.props.mini;

        let dataViewComponent;

        const pageSizeOptions = [
            { id: 0, label: 'Tất cả' },
            { id: 25, label: <T params={[25]}>%0% dòng</T> },
            { id: 50, label: <T params={[50]}>%0% dòng</T> },
            { id: 100, label: <T params={[100]}>%0% dòng</T> },
            { id: 250, label: <T params={[250]}>%0% dòng</T> },
        ];

        if (!this.props.canChoosingTotal)
        {
            pageSizeOptions.shift(pageSizeOptions);
        }

        const items = Array.isArray(this.props.data)
            ? this.props.data.map(detect =>
            {
                return {
                    ...detect,
                    overviewImage: (
                        <Row mainAxisAlignment="center">
                            <Image
                                height={mini ? '5rem' : '10rem'}
                                src={detect.overviewImage}
                                canEnlarge
                            />
                        </Row>
                    ),
                    faceImage: (
                        <Column>
                            <Row mainAxisAlignment="center">
                                <Image
                                    width={mini ? '5rem' : '10rem'}
                                    height={mini ? '5rem' : '10rem'}
                                    src={detect.faceImage}
                                    canEnlarge
                                />

                            </Row>
                            <Row mainAxisAlignment="center">
                                {detect.distance && `${Math.round(detect.distance * 100)} %`}
                            </Row>
                        </Column>
                    ),
                    candidate: detect.candidates.length > 0 && this.state.viewType === 1 && (
                        <Column>
                            <Row mainAxisAlignment="center">
                                <Image
                                    width={mini ? '5rem' : '10rem'}
                                    height={mini ? '5rem' : '10rem'}
                                    src={this.faceAlertSvc.getBestMatchImageUrl(detect.candidates[0].id)}
                                    altSrc={unknownFace}
                                    canEnlarge
                                />
                            </Row>
                            <Row mainAxisAlignment="center">
                                {detect.accuracy && `${Math.round(detect.accuracy * 100)} %`}
                            </Row>
                        </Column>
                    ),
                    candidates: detect.candidates.length > 0 && this.state.viewType === 2 && (
                        <ScrollView
                            className={'face-alert-result'}
                            scrollY={false}
                        >
                            <Container className={'face-alert-result-container'}>
                                {
                                    detect.candidates.map((candidate, i) => (
                                        <Container
                                            key={i}
                                            className={'face-alert-result-item'}
                                        >
                                            <Image
                                                className={i === 0 ? 'i-best' : ''}
                                                width={mini ? '5rem' : '10rem'}
                                                height={mini ? '5rem' : '10rem'}
                                                src={this.faceAlertSvc.getBestMatchImageUrl(candidate.id)}
                                                altSrc={unknownFace}
                                                canEnlarge
                                            />
                                            <TB1>{Math.round(candidate.accuracy * 100)}%</TB1>
                                        </Container>
                                    ))
                                }
                            </Container>
                        </ScrollView>
                    ),
                    accuracy: (
                        <Column
                            height="100%"
                            mainAxisAlignment="center"
                            crossAxisAlignment="center"
                        >
                            <TB1>{Math.round(detect.accuracy * 100)}%</TB1>
                        </Column>
                    ),
                    mask: (
                        <Column
                            height="100%"
                            mainAxisAlignment="center"
                            crossAxisAlignment="center"
                        >
                            <TB1>{Math.round(detect.mask * 100)}%</TB1>
                        </Column>
                    ),
                    details: (
                        <Column
                            height="100%"
                            mainAxisAlignment="center"
                            crossAxisAlignment="center"
                        >
                            <TB1>{detect.gallery?.personId}</TB1>
                            <TB1>{detect.gallery?.name}</TB1>
                            <TB1>{detect.gallery?.organization}</TB1>
                            <TB1>{detect.gallery?.cellphone}</TB1>
                            <TB1>{detect.gallery?.email}</TB1>
                            <TB1>{detect.camId}</TB1>
                            <TB1>
                                <Moment format={'L LTS'}>{detect.detectDate}</Moment>
                            </TB1>
                        </Column>
                    ),
                };
            })
            : [];

        switch (this.state.viewType)
        {
            case 1:
            {
                const columns = [
                    { id: 'id', displayAsText: 'ID', hidden: true },
                    { id: 'overviewImage', schema: 'react-node', displayAsText: 'Hình toàn cảnh', width: mini ? 192 : 292 },
                    { id: 'faceImage', schema: 'react-node', displayAsText: 'Hình gương mặt', width: mini ? 128 : 152 },
                    { id: 'candidate', schema: 'react-node', displayAsText: 'Người khớp nhất', width: mini ? 128 : 152 },
                    // { id: 'accuracy', schema: 'react-node', displayAsText: 'Độ chính xác', width: 100 },
                    { id: 'mask', schema: 'react-node', displayAsText: 'Mặt nạ', width: 96 },
                    { id: 'details', schema: 'react-node', displayAsText: 'Thông tin chi tiết', minWidth: 220 },
                ];

                dataViewComponent = (
                    <DataGrid
                        columns={columns}
                        items={items}
                        total={this.props.totalItem}
                        pagination={{
                            pageSize: this.props.pageSize,
                            pageIndex: this.props.currentPage,
                        }}
                        loading={this.props.isLoading}
                        externalPaginationRow
                        rowNumber
                        onCellClick={(event, row) =>
                        {
                            const index = items.findIndex(item => item.id === row.id);
                            return this.handleClickDetail(this.props.data[index], event);
                        }}
                    />
                );
                break;
            }
            case 2:
            {
                const columns = [
                    { id: 'id', displayAsText: 'ID', hidden: true },
                    { id: 'overviewImage', schema: 'react-node', displayAsText: 'Hình toàn cảnh', width: mini ? 192 : 320 },
                    { id: 'faceImage', schema: 'react-node', displayAsText: 'Hình gương mặt', width: mini ? 128 : 192 },
                    { id: 'candidates', schema: 'react-node', displayAsText: 'Các khả năng' },
                ];

                dataViewComponent = (
                    <DataGrid
                        columns={columns}
                        items={items}
                        total={this.props.totalItem}
                        pagination={{
                            pageSize: this.props.pageSize,
                            pageIndex: this.props.currentPage,
                        }}
                        loading={this.props.isLoading}
                        externalPaginationRow
                        rowNumber
                        onCellClick={(event, row) =>
                        {
                            const index = items.findIndex(item => item.id === row.id);
                            return this.handleClickDetail(this.props.data[index], event);
                        }}
                    />
                );
                break;
            }
            case 3:
            {
                const mappedData = (this.props.data || []).map((detect) =>
                {
                    return {
                        isSelected: detect.isSelected,
                        onClick: (e, img) => this.handleClickDetail(detect, e),
                        onSelect: (e, img) => this.props.selectedChange && this.props.selectedChange(detect),
                        src: detect.faceImage,
                    };
                });

                dataViewComponent = (
                    <ImageGrid
                        isLoading={this.props.isLoading}
                        data={mappedData}
                    />
                );
                break;
            }
            default:
                dataViewComponent = <Container />;
                break;
        }

        return (
            <BorderPanel
                className={`face-alert-content ${this.props.className}`}
                flex={1}
            >
                <Container style={{ padding: '1rem' }}>
                    <Row crossAxisAlignment="center">
                        {!!this.props.totalItem && (
                            <>
                                <Container style={{ paddingRight: '1rem' }}>
                                    <Paging
                                        total={this.props.totalItem}
                                        currentPage={this.props.currentPage}
                                        pageSize={this.props.pageSize}
                                        onChange={this.props.onPageChange}
                                    />
                                </Container>

                                <Container style={{ paddingRight: '1rem' }}>
                                    <AdvanceSelect
                                        options={pageSizeOptions}
                                        value={this.props.pageSize}
                                        onChange={this.props.onPageSizeChange}
                                    />
                                </Container>
                            </>
                        )}

                        <Container style={{ paddingRight: '1rem', marginLeft: 'auto' }}>
                            <EmptyButton
                                className={this.state.viewType === 1 ? 'active' : ''}
                                icon={'grip-lines'}
                                iconSize="md"
                                onlyIcon
                                onClick={() => this.handleChangeViewType(1)}
                            />
                            <Spacer size=".5rem" />
                            <EmptyButton
                                className={this.state.viewType === 2 ? 'active' : ''}
                                icon={'image'}
                                iconSize="md"
                                onlyIcon
                                onClick={() => this.handleChangeViewType(2)}
                            />
                            <Spacer size=".5rem" />
                            <EmptyButton
                                className={this.state.viewType === 3 ? 'active' : ''}
                                icon={'th'}
                                iconSize="md"
                                onlyIcon
                                onClick={() => this.handleChangeViewType(3)}
                            />
                        </Container>
                    </Row>
                </Container>
                {dataViewComponent}
            </BorderPanel>
        );
    }
}

FaceDetectionContent.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    totalItem: PropTypes.number,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    onPageChange: PropTypes.func,
    detailClick: PropTypes.func,
    deleteClick: PropTypes.func,
    selectedChange: PropTypes.func,
    selectedAllChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    mini: PropTypes.bool,
    canChoosingTotal: PropTypes.bool,
};
