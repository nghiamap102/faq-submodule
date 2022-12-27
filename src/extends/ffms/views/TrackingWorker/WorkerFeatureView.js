import './WorkerFeatureView.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { toJS } from 'mobx';

import {
    SideBar, Container, PanelHeaderWithSwitcher,
    SearchBox, Paging, Expanded, EmptyButton, Label,
    T, EmptyData, PopOver, Sub1, Select, SelectOption,
    Row, Column, PanelHeader, PanelBody, PanelFooter, ToggleButton,
} from '@vbd/vui';

import { RouterParamsHelper } from 'helper/router.helper';

import { WorkerFilter } from 'extends/ffms/views/TrackingWorker/WorkerFilter';
import { WorkerTreeView } from 'extends/ffms/views/TrackingWorker/WorkerTreeView';


class WorkerFeatureView extends Component
{
    workerStore = this.props.fieldForceStore.workerStore;

    reloadDurations = [ 10, 20, 30, 40, 50, 60 ];
    maxDurations = [ 10, 20, 30, 40, 50, 60 ];

    state = {
        filter: true,
        pinConfigPopped: false,
        selectedInterval: null,
    }
    settingRef = React.createRef();

    async componentDidMount()
    {
        this.workerStore.appStore = this.props.appStore;

        // Restore params & set to url
        if (this.workerStore.urlParams && Object.values(this.workerStore.urlParams).length !== 0)
        {
            RouterParamsHelper.setParams(null, this.props, this.workerStore.urlParams);
        }

        const value = await this.workerStore.fillTrackingSwitchers();
        if (!this.workerStore.trackingWorkerData || Object.keys(this.workerStore.trackingWorkerData).length === 0)
        {
            this.workerStore.setTrackingWorkerData(value);
            await this.workerStore.getWorkerData();
        }

        this.workerStore._loadTrailings();

        this.setState({
            selectedInterval: this.reloadDurations[0],
        });

        // Load params
        this.loadParams();
    }

    componentDidUpdate = (prevProps) =>
    {
        const locationSearch = RouterParamsHelper.shouldLocationChanged(this.props.location, prevProps.location);
        if (locationSearch)
        {
            this.loadParams(locationSearch);
        }
    };

    loadParams = async (search) =>
    {
        const qs = RouterParamsHelper.getParams(this.props.location.search, {});

        for (const key in qs)
        {
            this.workerStore.urlParams[key] = qs[key];
        }
    };

    handleClose = () =>
    {
        this.props.history.push('/' + this.props.history.location.pathname.split('/')[1]);
    };

    filterBtnClick = () =>
    {
        this.setState({ filter: !this.state.filter });
    };

    handlePageLoad = async (page) =>
    {
        page = page || this.workerStore.currentPage;
        this.workerStore.setPaging(this.workerStore.totalItem, page, this.workerStore.pageSize);
        await this.workerStore.getDataDebounced();
    };

    setPageIndex = async (pageIndex) =>
    {
        await this.handlePageLoad(pageIndex);
    };

    handleRefreshClick = () =>
    {
        this.handlePageLoad();
    };

    handleKeyword = async (searchKey) =>
    {
        this.workerStore.setFilterState('searchKey', searchKey);
        await this.handlePageLoad(1);
    };

    switcherWorkersData = async () =>
    {
        this.workerStore.setToggleWorkersData();
        this.workerStore.getDataDebounced();
    };

    handlePinnedSettingClick = () =>
    {
        this.setState({
            pinConfigPopped: !this.state.pinConfigPopped,
        });
    }

    render()
    {
        return (
            <>
                <SideBar width={'20rem'}>
                    <PanelHeader
                        actions={[
                            { icon: 'times', onClick: this.handleClose },
                        ]}
                    >
                        Lịch trình nhân viên
                    </PanelHeader>

                    <PanelBody
                        className={'tracking-worker-content'}
                        scroll
                    >
                        <Column>
                            <Row
                                className={'twc-toolbar'}
                                itemMargin={'md'}
                                crossAxisSize={'min'}
                            >
                                <SearchBox
                                    placeholder={'Nhập từ khóa để tìm kiếm'}
                                    value={this.workerStore.filterState.searchKey}
                                    onChange={this.handleKeyword}
                                />
                                <ToggleButton
                                    icon={'filter'}
                                    pressed={false}
                                    onlyIcon
                                    onClick={this.filterBtnClick}
                                />
                            </Row>
                            <PanelHeaderWithSwitcher
                                value={this.workerStore.togglePinnedList ? 1 : 0}
                                onChanged={(value) =>
                                {
                                    this.workerStore.togglePinnedList = !this.workerStore.togglePinnedList;
                                }}
                                settingRef={this.settingRef}
                                onSettingClick={this.handlePinnedSettingClick}
                            >
                                <Label width={'auto'}><T>Danh sách theo dõi</T> ({!this.workerStore.togglePinnedList ? 0 : this.workerStore.pinnedTrackers?.length})</Label>
                            </PanelHeaderWithSwitcher>
                            {
                                this.state.pinConfigPopped &&
                                <PopOver
                                    anchorEl={this.settingRef}
                                    onBackgroundClick={this.handlePinnedSettingClick}
                                >
                                    <Container className={'pin-config'}>
                                        <PanelHeader>Tùy chỉnh</PanelHeader>
                                        <PanelBody>
                                            <Row>
                                                <Sub1>Cập nhật sau</Sub1>
                                                <Select
                                                    value={this.workerStore.pinnedConfig.intervalTime}
                                                    className='wfv-menu-config'
                                                    onChange={this.workerStore.changeInterval}
                                                >
                                                    {
                                                        this.reloadDurations.map((z) =>
                                                            <SelectOption key={`interval-${z}`} text={z} value={z * 1000} />,
                                                        )
                                                    }
                                                </Select>
                                                <Sub1>giây</Sub1>
                                            </Row>
                                            <Row>
                                                <Sub1>Theo dõi trong</Sub1>
                                                <Select
                                                    value={this.workerStore.pinnedConfig.maxDuration}
                                                    className='wfv-menu-config'
                                                    onChange={this.workerStore.changeDuration}
                                                >
                                                    {
                                                        this.maxDurations.map((z) =>
                                                            <SelectOption key={`duration-${z}`} text={z} value={z * 60 * 1000} />,
                                                        )
                                                    }
                                                </Select>
                                                <Sub1>phút</Sub1>
                                            </Row>
                                        </PanelBody>
                                    </Container>
                                </PopOver>
                            }
                            {
                                this.workerStore.togglePinnedList && this.workerStore.pinnedTrackers?.length > 0 &&
                                <WorkerTreeView
                                    data={toJS(this.workerStore.pinnedTrackers)}
                                />
                            }
                            <PanelHeaderWithSwitcher
                                value={this.workerStore.toggleWorkersData ? 1 : 0}
                                onChanged={(value) => this.switcherWorkersData(value)}
                            >
                                <Row >
                                    <Label width={'auto'}><T>Danh sách nhân viên</T> ({!this.workerStore.toggleWorkersData ? 0 : this.workerStore.totalItem})</Label>
                                    <Expanded />
                                    {
                                        this.workerStore.toggleWorkersData &&
                                        <EmptyButton
                                            icon={'redo-alt'}
                                            isLoading={this.workerStore.isLoading}
                                            onlyIcon
                                            onClick={this.handleRefreshClick}
                                        />
                                    }

                                </Row>
                            </PanelHeaderWithSwitcher>
                            {
                                this.workerStore.workers?.length > 0 ?
                                    <WorkerTreeView
                                        data={toJS(this.workerStore.displayWorkers)}
                                    /> : <EmptyData />
                            }
                        </Column>
                    </PanelBody>
                    {
                        this.workerStore.totalItem > 0 &&
                        <PanelFooter>
                            <Paging
                                total={this.workerStore.totalItem}
                                pageSize={this.workerStore.pageSize}
                                currentPage={this.workerStore.currentPage}
                                onChange={this.setPageIndex}
                            />
                        </PanelFooter>
                    }
                </SideBar>

                {
                    this.state.filter &&
                    <SideBar className="worker-tracking-filter" width={'18rem'}>
                        {
                            this.workerStore.trackingWorkerData && Object.keys(this.workerStore.trackingWorkerData).length > 0 ?
                                <WorkerFilter
                                    data={this.workerStore.trackingWorkerData}
                                /> :
                                <EmptyData />
                        }
                    </SideBar>
                }
            </>
        );
    }
}


WorkerFeatureView = inject('appStore', 'fieldForceStore')(observer(WorkerFeatureView));
WorkerFeatureView = withRouter(WorkerFeatureView);
export { WorkerFeatureView };
