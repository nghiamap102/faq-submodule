import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Popup,
    Row,
    BorderPanel,
} from '@vbd/vui';

import { FaceDetectionContent } from 'components/app/FaceAlert/FaceDetection/FaceDetectionContent';
import { FaceHistoryMap } from 'components/app/FSImageDeatail/FaceHistoryMap';

import { FaceAlertService } from 'services/face-alert.service';

import Enum from 'constant/app-enum';

class FSHistory extends Component
{
    faceAlertSvc = new FaceAlertService();
    faceDetectionStore = this.props.appStore.faceAlertStore.faceDetectionStore;

    state = {
        data: [],
        totalItem: 0,
        pageSize: 25,
        currentPage: 1,
    };

    componentDidMount()
    {
        this.handlePageLoad();
    }

    handleDetailClick = (d) =>
    {
        this.faceDetectionStore.setHistory('selectedId', d.id);
        this.faceDetectionStore.addHistoryPopup(d);
    };

    handlePageSizeChange = async (size) =>
    {
        let currentPage = Math.ceil(this.state.totalItem * this.state.pageSize / size);
        currentPage = currentPage < this.state.currentPage ? currentPage : this.state.currentPage;
        await this.handlePageLoad(currentPage, size);
    };

    handlePageLoad = (page, size = this.state.pageSize) =>
    {
        page = page || this.state.currentPage;

        this.setState({ currentPage: page, pageSize: size });

        const query = {
            faceId: this.props.gallery.faceId,
            skip: (page - 1) * size,
            limit: size,
        };

        const formatData = (dt) =>
        {
            if (!dt)
            {
                return null;
            }

            return dt.map((d) =>
            {
                return {
                    ...d,
                    title: d.camId,
                    x: d.mapInfo.latitude,
                    y: d.mapInfo.longitude,
                };
            });
        };

        this.faceAlertSvc.detectSearch(query).then((rs) =>
        {
            if (rs && rs.result === Enum.APIStatus.Success)
            {
                this.setState({ data: formatData(rs.data.data), totalItem: rs.data.total });
                this.faceDetectionStore.setHistory('data', formatData(rs.data.data));
            }
        });
    };

    render()
    {
        const { data, totalItem, currentPage, pageSize } = this.state;

        return (
            <Popup
                title={'Lịch sử nhận dạng'}
                width={'90%'}
                height={'90%'}
                padding={'0'}
                scroll={false}
                onClose={this.props.onHide}
            >
                <Row>
                    <FaceDetectionContent
                        data={data}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        totalItem={totalItem}
                        detailClick={this.handleDetailClick}
                        selectedId={this.faceDetectionStore.history.selectedId}
                        mini
                        readOnly
                        canChoosingTotal
                        onPageChange={this.handlePageLoad}
                        onPageSizeChange={this.handlePageSizeChange}
                    />
                    <BorderPanel flex={1}>
                        <FaceHistoryMap />
                    </BorderPanel>
                </Row>
            </Popup>
        );
    }
}

FSHistory.propTypes = {
    gallery: PropTypes.object.isRequired,
    onHide: PropTypes.func,
};

FSHistory = inject('appStore')(observer(FSHistory));
export default FSHistory;
