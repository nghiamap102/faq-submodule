import './FaceConfig.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Row,
    Popup, PopupFooter,
    Button, FormControlLabel, FormGroup, Input, CheckBox,
    T,
    withModal,
    DataGrid,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { CameraGroupService } from 'services/cameraGroup.service';

const Enum = require('constant/app-enum');

class FaceConfigCameraGroup extends Component
{
    cameraGroupService = new CameraGroupService();
    cameraGroupStore = this.props.appStore.cameraGroupStore;

    constructor(props)
    {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    componentDidMount()
    {
        this.reloadCameraGroup();
    }

    reloadCameraGroup = () =>
    {
        this.setState({ isLoading: true });
        this.cameraGroupService.gets().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.cameraGroupStore.set(rs.data);
            }
            this.setState({ isLoading: false });
        });
    };

    handleClickDetail = (detail) =>
    {
        this.cameraGroupStore.setDetail(CommonHelper.clone(detail));
    };

    handleAddNew = () =>
    {
        this.cameraGroupStore.setDetail({ isActive: true });
    };

    handleDeleteClick = () =>
    {
        this.props.confirm({
            message: 'Bạn có chắc muốn xóa những nhóm Camera đã chọn?', onOk: () =>
            {
                this.cameraGroupService.delete(this.cameraGroupStore.cameraGroups.filter((g) => g.isSelected).map((g) => g.id)).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.reloadCameraGroup();

                        this.props.toast({ type: 'success', message: 'Xóa thành công' });
                    }
                    else
                    {
                        this.props.toast({ type: 'error', message: rs.errorMessage });
                    }
                });
            },
        });

    };

    handleChoosingAll = (isChoosingAll) =>
    {
        if (this.cameraGroupStore.cameraGroups)
        {
            const data = this.cameraGroupStore.cameraGroups;
            if (isChoosingAll)
            {
                data.forEach((d) =>
                {
                    d.isSelected = false;
                });
            }
            else
            {
                data.forEach((d) =>
                {
                    d.isSelected = true;
                });
            }
            this.cameraGroupStore.set(data);
        }
    };

    render()
    {
        const choosingCount = this.cameraGroupStore.cameraGroups ? this.cameraGroupStore.cameraGroups.filter((d) => d.isSelected).length : 0;
        const isChoosingAll = this.cameraGroupStore.cameraGroups && choosingCount === this.cameraGroupStore.cameraGroups.length && this.cameraGroupStore.cameraGroups.length > 0;

        const items = Array.isArray(this.cameraGroupStore.cameraGroups) && this.cameraGroupStore.cameraGroups.map(group =>
        {
            return {
                ...group,
                deDuplicateInterval: group.isCheckDeDuplicateEvent ? group.deDuplicateInterval : '--',
                confidenceThreshold: group.isUseConfidenceThreshold ? group.confidenceThreshold : '--',
                status: (
                    <Row
                        mainAxisAlignment="center"
                        crossAxisAlignment="center"
                    >
                        <CheckBox
                            className={'column-status'}
                            checked={group.isActive}
                        />
                    </Row>
                ),
            };
        });

        return (
            <Container className={'list-management'}>
                <Row className={'face-alert-tool'}>
                    <Container className={'face-alert-actions'}>
                        <Button
                            color={'primary'}
                            text={'Thêm mới'}
                            onClick={this.handleAddNew}
                        />
                        <Button
                            color={'primary'}
                            text={<T params={[choosingCount]}>Xóa những mục đã chọn (%0%)</T>}
                            disabled={choosingCount === 0}
                            onClick={this.handleDeleteClick}
                        />
                    </Container>
                </Row>

                <DataGrid
                    columns={[
                        { id: 'id', displayAsText: 'ID', hidden: true },
                        { id: 'title', displayAsText: 'Tên' },
                        { id: 'deDuplicateInterval', displayAsText: 'Khử trùng lặp sự kiện' },
                        { id: 'confidenceThreshold', displayAsText: 'Ngưỡng tin cậy' },
                        { id: 'status', schema: 'react-node', displayAsText: 'Trạng thái', width: 100 },
                    ]}
                    items={items}
                    selectRows={{
                        onChange: (event, row) =>
                        {
                            const index = items.findIndex(item => item.id === row.id);
                            this.cameraGroupStore.cameraGroups[index].isSelected = !this.cameraGroupStore.cameraGroups[index].isSelected;
                            this.cameraGroupStore.set(this.cameraGroupStore.cameraGroups);
                        },
                        onChangeAll: () => this.handleChoosingAll(isChoosingAll),
                    }}
                    loading={this.state.isLoading}
                    onCellClick={(event, row) =>
                    {
                        const index = items.findIndex(item => item.id === row.id);
                        this.handleClickDetail(this.cameraGroupStore.cameraGroups[index]);
                    }}
                />

                {this.cameraGroupStore.cameraGroupDetail && <FaceConfigCameraGroupDetail />}
            </Container>
        );
    }
}

FaceConfigCameraGroup = withModal(inject('appStore')(observer(FaceConfigCameraGroup)));

class FaceConfigCameraGroupDetail extends Component
{
    cameraGroupStore = this.props.appStore.cameraGroupStore;
    cameraGroupService = new CameraGroupService();

    handleChangeProperty = (key, value) =>
    {
        this.cameraGroupStore.setDetailProperty(key, value);
    };

    handleSaveDetail = () =>
    {
        const cameraGroup = this.cameraGroupStore.cameraGroupDetail;
        if (!cameraGroup.title)
        {
            this.props.toast({ type: 'error', message: 'Tên nhóm camera không được bỏ trống' });
            return;
        }

        if (!cameraGroup.id)
        {
            // add
            this.cameraGroupService.add(cameraGroup).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.cameraGroupStore.add(rs.data);
                    this.cameraGroupStore.setDetail(rs.data);

                    this.props.toast({ type: 'success', message: 'Thêm mới thành công' });
                }
                else
                {
                    this.props.toast({ type: 'error', message: rs.errorMessage });
                }
            });
        }
        else
        {
            // edit
            this.cameraGroupService.edit(cameraGroup).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.cameraGroupStore.update(rs.data);

                    this.props.toast({ type: 'success', message: 'Chỉnh sửa thành công' });
                }
                else
                {
                    this.props.toast({ type: 'error', message: rs.errorMessage });
                }
            });
        }
    };

    handleClose = () =>
    {
        this.cameraGroupStore.setDetail();
    };

    render()
    {
        const { cameraGroupDetail } = this.cameraGroupStore;
        return (
            <Popup
                title={'Thêm/Sửa nhóm camera'}
                width={'500px'}
                onClose={this.handleClose}
            >
                <Container className={'list-detail'}>
                    <FormGroup>
                        <FormControlLabel
                            label={'Tên'}
                            control={(
                                <Input
                                    placeholder={'Nhập tên nhóm camera'}
                                    value={cameraGroupDetail.title}
                                    onChange={(event) =>
                                    {
                                        this.handleChangeProperty('title', event);
                                    }}
                                />
                            )}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel
                            label={'Mô tả'}
                            control={(
                                <Input
                                    placeholder={'Nhập mô tả'}
                                    value={cameraGroupDetail.description}
                                    onChange={(event) =>
                                    {
                                        this.handleChangeProperty('description', event);
                                    }}
                                />
                            )}
                        />
                    </FormGroup>
                    <FormGroup>
                        <CheckBox
                            label="Khử trùng lặp sự kiện"
                            checked={cameraGroupDetail.isCheckDeDuplicateEvent}
                            onChange={() => this.handleChangeProperty('isCheckDeDuplicateEvent', !cameraGroupDetail.isCheckDeDuplicateEvent)}
                        />
                        {
                            cameraGroupDetail.isCheckDeDuplicateEvent && (
                                <FormControlLabel
                                    label={'(Giây)'}
                                    control={(
                                        <Input
                                            type={'number'}
                                            value={cameraGroupDetail.deDuplicateInterval}
                                            onChange={(event) =>
                                            {
                                                this.handleChangeProperty('deDuplicateInterval', parseInt(event));
                                            }}
                                        />
                                    )}
                                />
                            )}
                    </FormGroup>
                    <FormGroup>
                        <CheckBox
                            label="Ngưỡng tin cậy"
                            checked={cameraGroupDetail.isUseConfidenceThreshold}
                            onChange={() => this.handleChangeProperty('isUseConfidenceThreshold', !cameraGroupDetail.isUseConfidenceThreshold)}
                        />
                    </FormGroup>
                    {
                        cameraGroupDetail.isUseConfidenceThreshold && (
                            <FormGroup>
                                <FormControlLabel
                                    label={cameraGroupDetail.confidenceThreshold ? cameraGroupDetail.confidenceThreshold : ' '}
                                    control={(
                                        <Input
                                            type="range"
                                            min={0.01}
                                            max={0.99}
                                            step={0.01}
                                            value={cameraGroupDetail.confidenceThreshold}
                                            onChange={(event) =>
                                            {
                                                this.handleChangeProperty('confidenceThreshold', parseFloat(event));
                                            }}
                                        />
                                    )}
                                />
                            </FormGroup>
                        )}
                    <FormGroup>
                        <CheckBox
                            label="Hoạt động"
                            checked={cameraGroupDetail.isActive}
                            onChange={() => this.handleChangeProperty('isActive', !cameraGroupDetail.isActive)}
                        />
                    </FormGroup>
                </Container>

                <PopupFooter>
                    <Button
                        color={cameraGroupDetail.id ? 'warning' : 'primary'}
                        text={cameraGroupDetail.id ? 'Chỉnh sửa' : 'Thêm mới'}
                        onClick={this.handleSaveDetail}
                    />
                </PopupFooter>
            </Popup>
        );
    }
}

FaceConfigCameraGroupDetail = withModal(inject('appStore')(observer(FaceConfigCameraGroupDetail)));

export { FaceConfigCameraGroup, FaceConfigCameraGroupDetail };
