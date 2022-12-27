import '../PlateAlert.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

import {
    Container,
    BorderPanel,
    Paging,
    Button,
    T,
    Tag,
    DataGrid,
} from '@vbd/vui';

import { PlateWatchListService } from 'services/plate-watch-list.service';

const Enum = require('constant/app-enum');

export const plateGalleryColumns = [
    { id: 'plateNumber', displayAsText: 'Biển số xe', width: 150 },
    { id: 'owner', displayAsText: 'Chủ sở hữu', width: 200 },
    { id: 'type', displayAsText: 'Loại xe', width: 200 },
    { id: 'color', displayAsText: 'Màu xe', width: 80 },
    { id: 'watchList', schema: 'react-node', displayAsText: 'Danh sách theo dõi', width: 200 },
    { id: 'updatedDate', schema: 'react-node', displayAsText: 'Ngày cập nhật' },
];
class PlateGalleryContent extends Component
{
    plateGalleryStore = this.props.appStore.plateGalleryStore;
    watchListStore = this.props.appStore.plateWatchListStore;
    watchListSvc = new PlateWatchListService();

    constructor(props)
    {
        super(props);

        this.watchListSvc.getAll().then((rs) =>
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
        if (typeof this.props.onDetailClick === 'function')
        {
            this.props.onDetailClick(data);
        }
    };

    handleChoosingAll = (isChoosingAll) =>
    {
        if (this.plateGalleryStore.data)
        {
            if (isChoosingAll)
            {
                const data = this.plateGalleryStore.data;
                data.forEach((d) =>
                {
                    d.isSelected = false;
                });
                this.plateGalleryStore.setData(data);
            }
            else
            {
                const data = this.plateGalleryStore.data;
                data.forEach((d) =>
                {
                    d.isSelected = true;
                });
                this.plateGalleryStore.setData(data);
            }
        }
    };

    handleSelect = (item) =>
    {
        const selectedItem = this.plateGalleryStore.data.find(d => d.id === item.id);
        selectedItem.isSelected = !selectedItem.isSelected;
    };

    handleChangePage = (page) =>
    {
        if (typeof this.props.onChangePageClick === 'function')
        {
            this.props.onChangePageClick(page);
        }
    };

    handleDeleteClick = () =>
    {
        if (typeof this.props.onDeleteClick === 'function')
        {
            this.props.onDeleteClick();
        }
    };

    handleAddClick = () =>
    {
        if (typeof this.props.onAddClick === 'function')
        {
            this.props.onAddClick();
        }
    };

    render()
    {
        const watchList = this.watchListStore.watchList;

        let data = [];
        if (this.plateGalleryStore.data)
        {
            if (watchList)
            {
                data = this.plateGalleryStore.data.map((d) =>
                {
                    let watchLists = [];
                    if (d.watchList && Array.isArray(d.watchList.watchListIds) && d.watchList.watchListIds.length > 0)
                    {
                        watchLists = watchList.filter((w) => d.watchList.watchListIds.includes(w.id));
                    }

                    return { ...d, watchLists };
                });
            }
            else
            {
                data = this.plateGalleryStore.data;
            }
        }

        const choosingCount = data.filter((d) => d.isSelected).length;
        const isChoosingAll = choosingCount === data.length && data.length > 0;

        const items = Array.isArray(this.plateGalleryStore.data)
            ? this.plateGalleryStore.data.map(d =>
            {
                let item = {};
                if (watchList)
                {
                    let watchLists = [];
                    if (d.watchList && Array.isArray(d.watchList.watchListIds) && d.watchList.watchListIds.length > 0)
                    {
                        watchLists = watchList.filter((w) => d.watchList.watchListIds.includes(w.id));
                    }

                    item = { watchLists };
                }

                return {
                    ...d,
                    ...item,
                    watchList: item.watchLists.map((wl) => (
                        <Tag
                            key={wl.id}
                            color={wl.label}
                            text={wl.name}
                        />
                    )),
                    updatedDate: <Moment format={'L LTS'}>{d.updatedDate}</Moment>,
                };
            })
            : [];


        return (
            <BorderPanel
                className={`plate-alert-content ${this.props.className}`}
                flex={1}
            >
                <Container className={'plate-alert-tool'}>
                    <Container className={'plate-alert-actions'}>
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
                    <Container className={'alias-right plate-alert-view paging'}>
                        <Paging
                            total={this.plateGalleryStore.totalItem}
                            currentPage={this.plateGalleryStore.currentPage}
                            pageSize={this.plateGalleryStore.pageSize}
                            onChange={(page) => this.handleChangePage(page)}
                        />
                    </Container>
                </Container>

                <DataGrid
                    rowKey='id'
                    columns={plateGalleryColumns}
                    items={items}
                    total={this.plateGalleryStore.totalItem}
                    pagination={{
                        pageIndex: this.plateGalleryStore.currentPage,
                        pageSize: this.plateGalleryStore.pageSize,
                        pageSizeOptions: [20, 50, 100, 200],
                        onChangePage: (page) => this.handleChangePage(page),
                    }}
                    selectRows={{
                        onChange: (event, row) =>
                        {
                            const index = items.findIndex(item => item.id === row.id);
                            this.handleSelect(this.plateGalleryStore.data[index]);
                        },
                        onChangeAll: () => this.handleChoosingAll(isChoosingAll),
                    }}
                    rowNumber
                    onCellClick={(event, row) =>
                    {
                        const index = items.findIndex(item => item.id === row.id);
                        this.handleClickDetail(this.plateGalleryStore.data[index], event);
                    }}
                />
            </BorderPanel>
        );
    }
}

PlateGalleryContent.propTypes = {
    className: PropTypes.string,
    // data: PropTypes.array,
    onDetailClick: PropTypes.func,
    onChangePageClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onAddClick: PropTypes.func,
};

PlateGalleryContent = inject('appStore')(observer(PlateGalleryContent));
export default PlateGalleryContent;
