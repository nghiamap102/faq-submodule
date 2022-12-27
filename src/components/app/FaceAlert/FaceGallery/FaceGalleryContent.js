import '../FaceAlert.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

import {
    Container,
    BorderPanel,
    LargeDataPaging,
    Button,
    T,
    DataGrid,
    Tag,
} from '@vbd/vui';

import { FaceAlertService } from 'services/face-alert.service';
import { WatchListService } from 'services/watchList.service';

const Enum = require('constant/app-enum');

class FaceGalleryContent extends Component
{
    faceGalleryStore = this.props.appStore.faceGalleryStore;
    faceAlertSvc = new FaceAlertService();

    watchListStore = this.props.appStore.watchListStore;
    watchListSvc = new WatchListService();

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

    handleClickDetail = (data, event) =>
    {
        if (event.target.tagName === 'I')
        {
            return;
        }
        if (typeof this.props.detailClick === 'function')
        {
            const items = this.faceGalleryStore.data;
            const index = items.findIndex(item => item.id === data.id);
            this.props.detailClick(items[index]);
        }
    };

    handleChoosingAll = (isChoosingAll) =>
    {
        if (this.faceGalleryStore.data)
        {
            if (isChoosingAll)
            {
                const data = this.faceGalleryStore.data;
                data.forEach((d) =>
                {
                    d.isSelected = false;
                });
                this.faceGalleryStore.setData(data);
            }
            else
            {
                const data = this.faceGalleryStore.data;
                data.forEach((d) =>
                {
                    d.isSelected = true;
                });
                this.faceGalleryStore.setData(data);
            }
        }
    };

    handleSelect = (item) =>
    {
        const selectedItem = this.faceGalleryStore.data.find(d => d.id === item.id);
        selectedItem.isSelected = !selectedItem.isSelected;
    };

    handleChangePage = (page) =>
    {
        this.props.changePageClick && this.props.changePageClick(page);
    };

    handleDeleteClick = () =>
    {
        if (typeof this.props.deleteClick === 'function')
        {
            this.props.deleteClick();
        }
    };

    handleAddClick = () =>
    {
        if (typeof this.props.addClick === 'function')
        {
            this.props.addClick();
        }
    };

    render()
    {
        const watchList = this.watchListStore.watchList;

        let data = [];
        if (this.faceGalleryStore.data)
        {
            if (watchList)
            {
                data = this.faceGalleryStore.data.map((d) =>
                {
                    let watchLists = [];
                    if (d.watchList && Array.isArray(d.watchList.watchListIds) && d.watchList.watchListIds.length > 0)
                    {
                        watchLists = watchList.filter((w) => d.watchList.watchListIds.includes(w.id));
                    }

                    return {
                        ...d,
                        watchLists: watchLists.map(wl => (
                            <Tag
                                key={wl.id}
                                color={wl.label}
                                text={wl.name}
                            />
                        )),
                        faceImage: this.faceAlertSvc.getBestMatchImageUrl(d.faceId),
                        updateDate: <Moment format={'L LTS'}>{d.updatedDate}</Moment>,
                    };
                });
            }
            else
            {
                data = this.faceGalleryStore.data.map(d => ({
                    ...d,
                    faceImage: this.faceAlertSvc.getBestMatchImageUrl(d.faceId),
                    updateDate: <Moment format={'L LTS'}>{d.updatedDate}</Moment>,
                }));
            }
        }

        const choosingCount = data.filter((d) => d.isSelected).length;
        const isChoosingAll = choosingCount === data.length && data.length > 0;

        return (
            <BorderPanel
                className={`face-alert-content ${this.props.className}`}
                flex={1}
            >
                <Container className={'face-alert-tool'}>
                    <Container className={'face-alert-actions'}>
                        <Button
                            color={'success'}
                            text={'Thêm mới'}
                            onClick={this.handleAddClick}
                        />
                        <Button
                            color={'danger'}
                            text={<T params={[choosingCount]}>Xóa những mục đã chọn (%0%)</T>}
                            disabled={choosingCount === 0}
                            onClick={this.handleDeleteClick}
                        />
                    </Container>
                    <Container className={'alias-right face-alert-view paging'}>
                        <LargeDataPaging
                            currentPage={this.faceGalleryStore.currentPage}
                            isLast={this.faceGalleryStore.isLast}
                            onChange={(page) => this.handleChangePage(page)}
                        />
                    </Container>
                </Container>
                {
                    this.faceGalleryStore.data && (
                        <DataGrid
                            columns={[
                                { id: 'faceId', displayAsText: 'Id', width: 200 },
                                { id: 'faceImage', schema: 'image', displayAsText: 'Hình gương mặt', width: 120 },
                                { id: 'name', displayAsText: 'Họ và tên', width: 200 },
                                { id: 'watchLists', displayAsText: 'Danh sách theo dõi', width: 200 },
                                { id: 'updateDate', schema: 'react-node', displayAsText: 'Ngày cập nhật' },
                            ]}
                            rowKey={'faceId'}
                            items={data}
                            selectRows={{
                                onChange: (event, item) => this.handleSelect(item),
                                onChangeAll: () => this.handleChoosingAll(isChoosingAll),
                            }}
                            loading={this.props.isLoading}
                            onCellClick={(event, item) => this.handleClickDetail(item, event)}
                        />
                    )}
            </BorderPanel>
        );
    }
}

FaceGalleryContent.propTypes = {
    className: PropTypes.string,
    // data: PropTypes.array,
    detailClick: PropTypes.func,
    changePageClick: PropTypes.func,
    deleteClick: PropTypes.func,
    addClick: PropTypes.func,
    isLoading: PropTypes.bool,
};

FaceGalleryContent = inject('appStore')(observer(FaceGalleryContent));
export default FaceGalleryContent;
