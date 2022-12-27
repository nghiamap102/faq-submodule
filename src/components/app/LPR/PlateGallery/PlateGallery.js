import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    withModal,
} from '@vbd/vui';

import PlateGallerySearch from './PlateGallerySearch';
import PlateGalleryContent from './PlateGalleryContent';

import Enum from 'constant/app-enum';
import { CommonHelper } from 'helper/common.helper';

import { PlateAlertService } from 'services/plate-alert.service';

class PlateGallery extends Component
{
    plateGalleryStore = this.props.appStore.plateGalleryStore;

    plateAlertService = new PlateAlertService();

    componentDidMount()
    {
        // Set default for paging and get data
        this.handleOnSearch();
    }

    handleOnSearch = async () =>
    {
        this.plateGalleryStore.setPaging(0, 1);
        this.handlePageLoad();
    };

    handlePageLoad = (page) =>
    {
        this.plateGalleryStore.currentPage = page;

        const searchState = this.plateGalleryStore.getFullSearchState();

        this.plateGalleryStore.setLoading(true);
        this.plateGalleryStore.setPaging(this.plateGalleryStore.totalItem, page);

        this.plateAlertService.search(searchState).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.plateGalleryStore.setData(rs.data.data);
                this.plateGalleryStore.setPaging(rs.data.total, this.plateGalleryStore.currentPage);
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
        });
    };

    handleDetailClick = (data) =>
    {
        this.plateGalleryStore.setDetail(CommonHelper.clone(data), 'update');
    };

    handleAddClick = () =>
    {
        this.plateGalleryStore.setDetail({}, 'add');
    };

    handleDeleteClick = () =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn xóa những thư viện này?',
            onOk: () =>
            {
                const galleryIds = this.plateGalleryStore.data.filter((d) => d.isSelected).map((d) => d.id);

                this.plateAlertService.delete(galleryIds).then((rss) =>
                {
                    let allDone = true;
                    for (const rs of rss)
                    {
                        if (rs.result !== Enum.APIStatus.Success)
                        {
                            allDone = false;
                            this.props.toast({ type: 'error', message: rs.errorMessage });
                        }
                    }

                    if (allDone)
                    {
                        this.props.toast({ type: 'success', message: 'Xóa thành công' });
                    }

                    this.handlePageLoad();
                });
            },
        });

    };

    render()
    {
        return (
            <Container className={'plate-alert-container'}>
                <PlateGallerySearch onSearch={this.handleOnSearch} />
                <PlateGalleryContent
                    onAddClick={this.handleAddClick}
                    onDeleteClick={this.handleDeleteClick}
                    onDetailClick={this.handleDetailClick}
                    onChangePageClick={this.handlePageLoad}
                />
            </Container>
        );
    }
}

PlateGallery = withModal(inject('appStore')(observer(PlateGallery)));
export { PlateGallery };
