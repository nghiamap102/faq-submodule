import 'components/app/LPR/PlateAlert.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    Container,
    Image,
    FAIcon,
    Button, EmptyButton, AdvanceSelect,
    HD6, TB1,
    Paging,
    Row, Column, Expanded, Spacer,
    BorderPanel,
    T,
    DataGrid,
    ImageGrid,
} from '@vbd/vui';

export class PlateDetectionContent extends Component
{
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

        if (typeof this.props.onDetailClick === 'function')
        {
            this.props.onDetailClick(data);
        }
    };

    handleClickDelete = () =>
    {
        if (typeof this.props.onDeleteClick === 'function')
        {
            this.props.onDeleteClick();
        }
    };

    handleChangeProperty = (data, key, value) =>
    {
        this.props.onPropertyChange && this.props.onPropertyChange(data, key, value);
    };

    render()
    {
        let dataViewComponent;

        const choosingCount = this.props.data ? this.props.data.filter((d) => d.isSelected).length : 0;
        const isChoosingAll = this.props.data && choosingCount === this.props.data.length && this.props.data.length > 0;
        const mini = this.props.miniSize;

        const items = Array.isArray(this.props.data)
            ? this.props.data.map(detect =>
            {
                return {
                    ...detect,
                    carImage: (
                        <Row
                            height="100%"
                            mainAxisAlignment="center"
                            crossAxisAlignment="center"
                        >
                            <Image
                                height={mini ? '5rem' : '10rem'}
                                src={detect.carImage}
                                canEnlarge
                            />
                        </Row>
                    ),
                    carNumber: (
                        <Row
                            height="100%"
                            mainAxisAlignment="center"
                        >
                            <Image
                                className={'plate-detect-number'}
                                width={mini ? '11rem' : '20rem'}
                                height={mini ? '3rem' : '8rem'}
                                src={detect.plateImage}
                                label={<HD6>{detect.carNumber}</HD6>}
                                canEnlarge
                            />
                        </Row>
                    ),
                    accuracy: (
                        <Row
                            height="100%"
                            mainAxisAlignment="center"
                            crossAxisAlignment="center"
                        >
                            <TB1>{(detect.accuracy * 100).toFixed(0)}%</TB1>
                        </Row>
                    ),
                    details: (
                        <Column
                            height="100%"
                            mainAxisAlignment="center"
                            crossAxisAlignment="center"
                            itemMargin={mini ? 'sm' : 'md'}
                        >
                            <TB1>{detect.source}</TB1>
                            <TB1>{detect.learnSystemName}</TB1>
                            <TB1>{detect.cameraName}</TB1>
                            <TB1><Moment format={'L LTS'}>{detect.gMTDatetime}</Moment></TB1>
                        </Column>
                    ),
                };
            })
            : [];

        switch (this.state.viewType)
        {
            case 1:
                {
                    const header = [
                        { label: 'STT', width: '3.5rem' },
                        { label: 'Hình toàn cảnh', width: mini ? '10rem' : '20rem' },
                        { label: 'Hình biển số', width: mini ? '11rem' : '20rem' },
                        { label: 'Độ chính xác', width: mini ? '5rem' : '7rem' },
                        { label: 'Thông tin chi tiết' },
                    ];

                    const columns = [
                        { id: 'id', displayAsText: 'ID', hidden: true },
                        { id: 'carImage', schema: 'react-node', displayAsText: 'Hình toàn cảnh', width: mini ? 160 : 270 },
                        { id: 'carNumber', schema: 'react-node', displayAsText: 'Hình biển số', width: mini ? 176 : 290 },
                        { id: 'accuracy', schema: 'react-node', displayAsText: 'Độ chính xác', width: mini ? 80 : 112 },
                        { id: 'details', schema: 'react-node', displayAsText: 'Thông tin chi tiết' },
                    ];

                    if (!this.props.readOnly)
                    {
                        header.unshift({
                            isUseChild: true,
                            width: '3.5rem',
                            child: (
                                <FAIcon
                                    color={isChoosingAll ? 'var(--primary-color)' : 'var(--text-color)'}
                                    icon={isChoosingAll ? 'check-circle' : 'circle'}
                                    onClick={() =>
                                    {
                                        if (typeof this.props.selectedAllChange === 'function')
                                        {
                                            this.props.selectedAllChange(!isChoosingAll);
                                        }
                                    }}
                                />
                            ),
                        });
                    }

                    dataViewComponent = (
                        <DataGrid
                            className={'result-table'}
                            columns={columns}
                            items={items}
                            total={this.props.totalItem}
                            pagination={{
                                pageIndex: this.props.currentPage,
                                pageSize: this.props.pageSize,
                            }}
                            externalPaginationRow
                            rowNumber
                            onCellClick={(event, row) =>
                            {
                                const index = items.findIndex(item => item.id === row.id);
                                this.handleClickDetail(this.props.data[index], event);
                            }}
                            {...(!this.props.readOnly
                                ? {
                                        selectRows: { onChangeAll: () => this.props.selectedAllChange(isChoosingAll) },
                                    }
                                : {})
                            }
                            loading={this.props.isLoading}
                        />
                    );
                }
                break;
            case 2:
            {
                const mappedData = (this.props.data || []).map((detect) =>
                {
                    return {
                        isSelected: detect.isSelected,
                        onClick: (e, img) => this.handleClickDetail(detect, e),
                        src: detect.carImage,
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

        return (
            <BorderPanel
                className={`plate-alert-content ${this.props.className}`}
                flex={1}
            >
                <Container style={{ padding: '1rem' }}>
                    <Row crossAxisSize={'min'}>
                        {!this.props.readOnly && (
                            <Expanded>
                                <Button
                                    color={'primary'}
                                    text={<T params={[choosingCount > 0 ? `(${choosingCount})` : '']}>Xóa những mục đã chọn (%0%)</T>}
                                    onClick={this.handleClickDelete}
                                />
                            </Expanded>
                        )}

                        {items && items.length > 0 && (
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
                            <Row
                                crossAxisAlignment="center"
                                height="100%"
                            >
                                <EmptyButton
                                    className={this.state.viewType === 1 ? 'active' : ''}
                                    icon={'grip-lines'}
                                    iconSize="md"
                                    onlyIcon
                                    onClick={() => this.handleChangeViewType(1)}
                                />
                                <Spacer size=".5rem" />
                                <EmptyButton
                                    className={this.state.viewType === 3 ? 'active' : ''}
                                    iconSize="md"
                                    icon={'th'}
                                    onlyIcon
                                    onClick={() => this.handleChangeViewType(2)}
                                />
                            </Row>
                        </Container>
                    </Row>
                </Container>
                {dataViewComponent}
            </BorderPanel>
        );
    }
}

PlateDetectionContent.propTypes = {
    onPageSizeChange: PropTypes.func,
    onPageChange: PropTypes.func,
    onDetailClick: PropTypes.func,
    onDeleteClick: PropTypes.func,

    className: PropTypes.string,
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    totalItem: PropTypes.number,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,

    readOnly: PropTypes.bool,
    miniSize: PropTypes.bool,
};
