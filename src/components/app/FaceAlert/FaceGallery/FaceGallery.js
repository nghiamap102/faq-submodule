import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Container, withModal } from '@vbd/vui';

import Enum from 'constant/app-enum';
import { FaceAlertService } from 'services/face-alert.service';
import { CommonHelper } from 'helper/common.helper';

import FaceGallerySearch from './FaceGallerySearch';
import FaceGalleryContent from './FaceGalleryContent';

class FaceGallery extends Component
{
    faceAlertStore = this.props.appStore.faceAlertStore;
    faceGalleryStore = this.props.appStore.faceAlertStore.faceGalleryStore;

    faceAlertSvc = new FaceAlertService();

    state = { isLoading: false }

    componentDidMount()
    {
        // Set default for paging and get data
        this.faceGalleryStore.setPaging(1, true);
        this.handlePageLoad();
    }

    handleOnSearch = async () =>
    {
        this.setState({ isLoading: true });
        this.faceGalleryStore.setPaging(1, true);
        const searchState = CommonHelper.clone(this.faceGalleryStore.searchState);
        const hasFaceImage = !!searchState.faces;

        delete searchState.imagePath;
        delete searchState.imageData;
        delete searchState.boxes;
        delete searchState.dataLocation;

        this.faceGalleryStore.setData([]);
        const rs = await this.faceAlertSvc.gallerySearch(searchState);
        const rsSearchAll = await this.faceAlertSvc.gallerySearchAll(searchState);

        if (rs.result === Enum.APIStatus.Success && rsSearchAll.result === Enum.APIStatus.Success)
        {
            if (rs.data.length === 0 && !hasFaceImage)
            {
                this.faceGalleryStore.setData(rsSearchAll.data.data);
            }
            else
            {
                const data = rsSearchAll.data.data.filter(dSearchInfo => rs.data.some(d => d.gallery.id === dSearchInfo.id)) || [];
                this.faceGalleryStore.setData(data);
            }
        }
        else if (rs.result === Enum.APIStatus.Success && rsSearchAll.result !== Enum.APIStatus.Success)
        {
            this.faceGalleryStore.setData(rs.data);
        }
        else if (rs.result !== Enum.APIStatus.Success && rsSearchAll.result === Enum.APIStatus.Success)
        {
            this.faceGalleryStore.setData(rsSearchAll.data.data);
        }
        else
        {
            this.props.toast({ type: 'error', message: rs.errorMessage });
        }

        this.setState({ isLoading: false });

    };

    handlePageLoad = (inputPage) =>
    {
        this.setState({ isLoading: true });
        const page = Math.max(1, inputPage || this.faceGalleryStore.currentPage);

        const searchState = this.faceGalleryStore.getFullSearchState(page);
        this.faceAlertSvc.gallerySearchAll(searchState).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                if (rs.data.data.length > 0 || !inputPage)
                {
                    this.faceGalleryStore.setData(rs.data.data);
                }

                if (page > 1 && rs.data.data.length === 0)
                {
                    // the last page have full page size so next call will zero
                    // or delete the last item on that page
                    // => back to one page
                    this.handlePageLoad(page - 1);
                    return;
                }

                const isLast = rs.data.data.length < this.faceGalleryStore.pageSize;
                this.faceGalleryStore.setPaging(page, isLast);
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }

            this.setState({ isLoading: false });
        });
    };

    handleDetailClick = (data) =>
    {
        this.faceGalleryStore.setDetail(CommonHelper.clone(data), 'update');
    };

    handleAddClick = () =>
    {
        this.faceGalleryStore.setDetail({}, 'add');
    };

    handleDeleteClick = () =>
    {
        this.props.confirm({
            message: 'Bạn có chắc chắn muốn xóa những thư viện này?',
            onOk: () =>
            {
                const galleryIds = this.faceGalleryStore.data.filter((d) => d.isSelected).map((d) => d.id);

                this.faceAlertSvc.galleryDelete(galleryIds).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.props.toast({ type: 'success', message: 'Xóa thành công' });

                        this.handlePageLoad();
                    }
                    else
                    {
                        this.props.toast({ type: 'error', message: rs.errorMessage });
                    }
                });
            },
        });
    };

    render()
    {
        return (
            <Container className={'face-alert-container'}>
                <FaceGallerySearch onSearch={this.handleOnSearch} />
                <FaceGalleryContent
                    className={this.faceAlertStore.isCollapseSearch ? 'full-content' : ''}
                    addClick={this.handleAddClick}
                    deleteClick={this.handleDeleteClick}
                    detailClick={this.handleDetailClick}
                    changePageClick={this.handlePageLoad}
                    isLoading={this.state.isLoading}
                />
            </Container>
        );
    }
}

FaceGallery = withModal(inject('appStore')(observer(FaceGallery)));
export { FaceGallery };
