
import './SampleConfig.scss';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import {
    Container, Popup, PopupFooter,Expanded,
    EmptyButton, HD4, Sub1, T, Row, Column, ProgressLinear, Button,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

import { TENANT_STATUS } from 'extends/ffms/constant/ffms-enum';
import TenantService from 'extends/ffms/services/TenantService';
import { MANAGER_LAYER_DATA, FFMS } from 'extends/ffms/routes';

class SampleConfig extends Component
{
    tenantSvc = new TenantService();

    colorSuccess = 'var(--success-color)';
    colorErr = 'var(--danger-color)';
    messSuccess = 'Success Messages Success Messages Success Messages Success Messages Success Messages Success Messages Success Messages Success Messages Success Messages... ';
    messErr = 'Error Message Error Message Error Message Error Message Error Message Error Message Error Message Error Message Error Message Error Message Error Message...';

    state = {
        showPopup: false,
        loading: false,
        rs: undefined,
        // rs: { success: false,type: 'error', message: 'Failed' },
        loadingText: '',
        status: 0,
        latestLog: undefined,
    }

    componentDidMount = () =>
    {
        this.tenantSvc.getTenantInfo().then((info) =>
        {
            this.setState({
                status: info.Status,
                loadingText: info.Status === TENANT_STATUS.failed ? info.Message : this.getLoadingText(info.Status),
            });
        });
    };

    updateLogStatus = () =>
    {
        if (this.logTimer)
        {
            clearTimeout(this.logTimer);
        }
        this.tenantSvc.getLog(1).then((rs) =>
        {
            if (rs && rs.data && rs.data.length)
            {
                const log = rs.data[rs.data.length - 1];

                if (!this.state.latestLog || log.Time !== this.state.latestLog.Time)
                {
                    this.setState({
                        latestLog: log,
                    });
                }
            }
        });

        this.logTimer = setTimeout(this.updateLogStatus, 300);
    };

    getLoadingText = (status) =>
    {
        switch (status)
        {
            case TENANT_STATUS.new:
            case TENANT_STATUS.init:
                return 'Hệ thống chưa sẵn sàng';
            case TENANT_STATUS.readyToConfig:
            case TENANT_STATUS.userConfig:
                return 'Tải bộ dữ liệu mẫu';
            case TENANT_STATUS.sampleDataLoading:
                return 'Đang nhập dữ liệu mẫu...';
            case TENANT_STATUS.failed:
                return 'Tải dữ liệu mẫu không thành công';
            case TENANT_STATUS.ready:
                return 'Hệ thống đã sẵn sàng';
        }
    }

    handleSampleConfigData = async () =>
    {
        this.setState({
            showPopup: true,
        });
        this.checkStatus();
    };

    handleLoadSampleDataClick = async () =>
    {
        const status = await this.tenantSvc.getTenantStatus();
        if (status >= TENANT_STATUS.readyToConfig && status !== TENANT_STATUS.sampleDataLoading)
        {
            this.setState({
                loading: true,
                loadingText: this.getLoadingText(TENANT_STATUS.sampleDataLoading),
            });

            this.updateLogStatus();

            const result = await this.tenantSvc.loadSampleData();

            this.timer && clearTimeout(this.timer);
            this.logTimer && clearTimeout(this.logTimer);

            const newState = {
                loading: false,
            };

            if (!result || (result.status && !result.status.success))
            {
                newState['loadingText'] = this.getLoadingText(TENANT_STATUS.failed);
                newState['rs'] = result && result.status ? result.status : { type: 'error', success: false };
            }
            else if (result.status)
            {
                const newStatus = await this.tenantSvc.getTenantStatus();
                newState['loadingText'] = this.getLoadingText(newStatus);
                newState['rs'] = result.status;
                newState['status'] = newStatus;
            }

            this.setState(newState);
        }
    };

    handleUserConfigClick = async () =>
    {
        const status = await this.tenantSvc.getTenantStatus();
        if (status === TENANT_STATUS.readyToConfig || status === TENANT_STATUS.sampleDataLoading)
        {
            await this.tenantSvc.setTenantStatus(TENANT_STATUS.userConfig);
        }
        window.location.href = MANAGER_LAYER_DATA;

    }

    checkStatus = async () =>
    {
        if (this.timer)
        {
            clearTimeout(this.timer);
        }
        const sysInfo = await this.tenantSvc.getTenantInfo();
        if (!sysInfo)
        {
            window.location.href = '/under-construction';
            return;
        }

        const status = sysInfo.Status;
        
        if (status === TENANT_STATUS.ready)
        {
            this.setState({
                loading: false,
                loadingText: this.getLoadingText(status),
            });
        }
        else
        {
            if (status === TENANT_STATUS.sampleDataLoading)
            {
                this.setState({
                    loading: true,
                    loadingText: this.getLoadingText(status),
                });
            }
            else if (status === TENANT_STATUS.failed)
            {
                this.setState({
                    loading: false,
                    loadingText: this.getTenantStatus(status),
                    rs: { success: false, type: 'error', message: sysInfo.Message },
                });
            }
            this.timer = setTimeout(this.checkStatus, 10000);
        }
        this.setState({ status });
    }
    
    render()
    {
        const { showPopup, loading, rs, status, latestLog } = this.state;
        return (
            <>
                {/* Button bị đụng css */}
                <button
                    className={this.props.className || ''}
                    onClick={this.handleSampleConfigData}
                >
                    <T>Tải bộ dữ liệu mẫu</T>
                </button>
                {
                    showPopup && (
                        <Popup
                            title={'Tải dữ liệu mẫu'}
                            className={'sample-config-popup'}
                            width={'50vw'}
                            padding={'1.5rem'}
                            scroll={false}
                            height={'20rem'}
                            isShowContentOnly
                            onClose={() => this.setState({ showPopup: false })}
                        >
                            <Container>
                                <HD4>{this.state.loadingText}</HD4>
                                <Column itemMargin={'md'}>
                                    {
                                        (rs || loading) && (
                                            <ProgressLinear
                                                loading={loading}
                                                backgroundColor={'#bbcedd'}
                                                loadingColor={'#17a2b8'}
                                                trackColor={rs && rs.success === false ? this.colorErr : (this.state.status === TENANT_STATUS.ready ? this.colorSuccess : '#bbcedd')}
                                            />
                                        )}

                                    {
                                        (!rs || Object.keys(rs).length === 0 || latestLog) && (
                                            <Row
                                                itemMargin={'md'}
                                                mainAxisAlignment={'center'}
                                                crossAxisAlignment={'center'}
                                            >
                                                { latestLog && <div className={`log-${latestLog.Code}`}><T>{latestLog && latestLog.Message}</T></div> }
                                            </Row>
                                        )}

                                    {
                                        rs && (
                                            <Row
                                                itemMargin={'md'}
                                                mainAxisAlignment={'center'}
                                                crossAxisAlignment={'center'}
                                            >
                                                <FAIcon
                                                    className={'icon'}
                                                    icon={rs.type === 'success' ? 'check-circle' : 'exclamation-triangle'}
                                                    type={'solid'}
                                                    size={'1rem'}
                                                    color={rs.type === 'success' ? this.colorSuccess : this.colorErr}
                                                />
                                                <Sub1>{rs.type === 'success' ? 'Success' : `Error: ${rs.message}`}</Sub1>
                                                {
                                                    rs && rs.success === false && (
                                                        <EmptyButton
                                                            icon={'life-ring'}
                                                            text={'Hỗ trợ'}
                                                            type={'default'}
                                                            tooltip={'Liên hệ tư vấn viên'}
                                                        />
                                                    )}
                                            </Row>
                                        )}
                                
                                </Column>
                            </Container>
                        
                            <PopupFooter>
                                {
                                    this.state.status >= TENANT_STATUS.readyToConfig && (
                                        <Row
                                            itemMargin={'md'}
                                        >
                                            <Expanded />
                                            {
                                                status === TENANT_STATUS.ready && (
                                                    <Button
                                                        icon={'home'}
                                                        text={'Trang chủ'}
                                                        type={'success'}
                                                        tooltip={'Về trang chủ'}
                                                        onClick={() => window.location.href = FFMS}
                                                    />
                                                )}
                                            {
                                                (status === TENANT_STATUS.readyToConfig || status === TENANT_STATUS.userConfig || status === TENANT_STATUS.sampleDataLoading) && (
                                                    <Button
                                                        icon={'file-import'}
                                                        color={'primary-color'}
                                                        text={'Thêm dữ liệu mẫu'}
                                                        tooltip={'Tải bộ dữ liệu mẫu'}
                                                        // disabled={loading}
                                                        isLoading={loading}
                                                        onClick={!loading && this.handleLoadSampleDataClick}
                                                    />
                                                )}
                                            {/* {
                                                status >= TENANT_STATUS.sampleDataLoading &&
                                                <Button
                                                    icon={'database'}
                                                    text={'Thiết lập dữ liệu'}
                                                    type={'warning'}
                                                    tooltip={'Đến trang thiết lập dữ liệu'}
                                                    onClick={this.handleUserConfigClick}
                                                />
                                            } */}
                                            <Expanded />
                                        </Row>
                                    )}
                                {
                                    status === TENANT_STATUS.failed && (
                                        <Button
                                            icon={'life-ring'}
                                            text={'Hỗ trợ'}
                                            type={'default'}
                                            tooltip={'Liên hệ tư vấn viên'}
                                        />
                                    )}
                            </PopupFooter>
                        </Popup>
                    )}
            </>
        );
    }
}

SampleConfig = withRouter(SampleConfig);
export default SampleConfig;
