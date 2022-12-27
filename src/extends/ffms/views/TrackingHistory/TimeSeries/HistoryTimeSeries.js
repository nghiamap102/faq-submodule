import './HistoryTimeSeries.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, PanelBody, PanelHeader, Sub1,
    Row, EmptyButton, Expanded, PopOver, withModal, CheckBox,
} from '@vbd/vui';

import { HistoryTimeSlider } from 'extends/ffms/views/TrackingHistory/TimeSeries/HistoryTimeSlider';
import { HistorySpeedChart } from 'extends/ffms/views/TrackingHistory/TimeSeries/HistorySpeedChart';
class HistoryTimeSeries extends Component
{
    settingRef = React.createRef();

    historyStore = this.props.fieldForceStore.historyStore;

    state = {
        isSettingActive: false,
    };

    componentWillUnmount =() =>
    {
        this.historyStore.setSimulate(false);
    }

    handleClosePanel = () =>
    {
        this.historyStore.historyTimePanel();
    }

    handleExportLog = (type) =>
    {
        this.historyStore.historySvc.getExportGPSLog(type, {
            driver: this.historyStore.selectedEmp.employee_username,
            from: this.historyStore.currentFilter.start_time,
            to: this.historyStore.currentFilter.end_time,
        });
    }

    handleSpeedChange = (speed) =>
    {
        this.historyStore.defaultSimulationSpeed = speed;
    }

    handleSettingClick = (event) =>
    {
        this.setState({
            isSettingActive: !this.state.isSettingActive,
        });
    }

    render()
    {
        return (
            <Container className={'history-time-series'}>
                <PanelHeader
                    actions={
                        [
                            {
                                icon: 'cog',
                                className: 'hts-action',
                                innerRef: this.settingRef,
                                onClick: this.handleSettingClick,
                            },
                            {
                                icon: 'download',
                                className: 'hts-action',
                                onClick: (event) =>
                                {
                                    this.props.menu({
                                        id: 'map-context-menu',
                                        isTopLeft: true,
                                        position: { x: event.clientX, y: event.clientY },
                                        actions: [
                                            {
                                                label: 'Tải tập tin CSV',
                                                icon: 'file-csv',
                                                iconSize: '1.25rem',
                                                onClick: () =>
                                                {
                                                    this.handleExportLog('csv');
                                                },
                                            },
                                            {
                                                label: 'Tải tập tin GPX',
                                                icon: 'file-code',
                                                iconSize: '1.25rem',
                                                onClick: () =>
                                                {
                                                    this.handleExportLog('gpx');
                                                },
                                            },
                                        ],
                                    });
                                },
                            },
                            {
                                icon: this.historyStore.isTimePanel ? 'chevron-circle-down' : 'chevron-circle-up',
                                className: 'hts-action',
                                onClick: () =>
                                {
                                    this.handleClosePanel();
                                },
                            }]
                    }
                >
                    Biểu đồ tốc độ theo thời gian
                </PanelHeader>
                {
                    this.historyStore.isTimePanel &&
                    <PanelBody className={'history-time-panel'}>
                        <HistoryTimeSlider />
                        <HistorySpeedChart />
                    </PanelBody>
                }
                {
                    this.state.isSettingActive &&
                    <PopOver
                        placement="top-left"
                        anchorEl={this.settingRef}
                        onBackgroundClick={this.handleSettingClick}
                    >
                        <Container className={'speed-config'}>
                            <PanelHeader>Tùy chỉnh</PanelHeader>
                            <PanelBody>
                                <Sub1>Tốc độ</Sub1>
                                <Expanded>
                                    <Row itemMargin={'md'}>
                                        {
                                            this.historyStore.speedStates && this.historyStore.defaultSimulationSpeed ? this.historyStore.speedStates.map((speed) =>
                                            {
                                                return (
                                                    <EmptyButton
                                                        key={speed}
                                                        disabled={this.historyStore.simulate}
                                                        text={`${speed}x`}
                                                        className={`hts-speed-btn ${this.historyStore.defaultSimulationSpeed === speed ? 'active' : ''}`}
                                                        onClick={() => this.handleSpeedChange(speed)}
                                                    />);
                                            }) : null
                                        }
                                    </Row>
                                </Expanded>
                                <Row
                                    crossAxisAlignment={'center'}
                                >
                                    <Sub1>Di chuyển bản đồ theo</Sub1>
                                    <CheckBox
                                        onChange={(checked)=>
                                        {
                                            this.historyStore.setFocusOn(checked);
                                        }}
                                        checked={this.historyStore.focusOn}
                                    />
                                </Row>
                                {/* <Row>
                                    <Sub1>Tự động chạy lại</Sub1>
                                    <Expanded />
                                    <Switch
                                        // onChange={onSwitchChange}
                                        checked
                                        width={28}
                                        height={14}
                                        activeBoxShadow='none'
                                        disabled
                                        className={'switch-toggle active'}
                                    />
                                </Row> */}
                            </PanelBody>
                        </Container>
                    </PopOver>
                }
            </Container>
        );
    }
}

HistoryTimeSeries = withModal(inject('fieldForceStore', 'appStore')(observer(HistoryTimeSeries)));
export { HistoryTimeSeries };
