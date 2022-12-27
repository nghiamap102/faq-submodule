import './FaceConfig.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    Popup, PopupFooter,
    AdvanceSelect, Button, FormControlLabel, FormGroup, Input,
    T,
    withModal,
    DataGrid,
} from '@vbd/vui';

import { ModifyMap } from 'components/app/Map/ModifiyMap';

import { CameraGroupService } from 'services/cameraGroup.service';
import { CameraService } from 'services/camera.service';

import { CommonHelper } from 'helper/common.helper';

import Enum from 'constant/app-enum';

class FaceConfigCameraStream extends Component
{
    cameraStreamStore = this.props.appStore.cameraStreamStore;
    cameraGroupStore = this.props.appStore.cameraGroupStore;

    cameraService = new CameraService();
    cameraGroupSvc = new CameraGroupService();

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
        this.reloadCameraStream();
    }

    reloadCameraGroup = () =>
    {
        this.setState({ isLoading: true });
        this.cameraGroupSvc.gets().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.cameraGroupStore.set(rs.data);
            }
            this.setState({ isLoading: false });
        });
    };

    reloadCameraStream = () =>
    {
        this.setState({ isLoading: true });
        this.cameraService.getStreamCameraList().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.cameraStreamStore.set(rs.data);
            }
            this.setState({ isLoading: false });
        });
    };

    handleClickDetail = (detail) =>
    {
        this.cameraStreamStore.setDetail(CommonHelper.clone(detail));
    };

    handleAddNew = () =>
    {
        this.cameraStreamStore.setDetail({});
    };

    handleDeleteClick = () =>
    {
        this.props.confirm({
            message: 'Bạn có chắc muốn xóa những Camera đã chọn?',
            onOk: () =>
            {
                this.cameraService.deleteStreamCamera(this.cameraStreamStore.cameras.filter((g) => g.isSelected).map((g) => g.id)).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.reloadCameraStream();

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

    getCameraGroupName = (id) =>
    {
        const group = this.cameraGroupStore.cameraGroups ? this.cameraGroupStore.cameraGroups.find((g) => g.id === id) : undefined;
        if (!group)
        {
            return '';
        }
        else
        {
            return group.title;
        }
    };

    handleChoosingAll = (isChoosingAll) =>
    {
        if (this.cameraStreamStore.cameras)
        {
            const data = this.cameraStreamStore.cameras;
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
            this.cameraStreamStore.set(data);
        }
    };

    render()
    {
        const choosingCount = this.cameraStreamStore.cameras ? this.cameraStreamStore.cameras.filter((d) => d.isSelected).length : 0;
        const isChoosingAll = this.cameraStreamStore.cameras && choosingCount === this.cameraStreamStore.cameras.length && this.cameraStreamStore.cameras.length > 0;

        const items = Array.isArray(this.cameraStreamStore.cameras) && this.cameraStreamStore.cameras.map(camera =>
        {
            return {
                ...camera,
                cameraGroup: this.getCameraGroupName(camera.cameraGroup),
            };
        });

        return (
            <Container className={'list-management'}>
                <Container className={'face-alert-tool'}>
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
                </Container>

                <DataGrid
                    columns={[
                        { id: 'id', displayAsText: 'ID', hidden: true },
                        { id: 'cameraName', displayAsText: 'Tên Camera', width: 200 },
                        { id: 'cameraGroup', displayAsText: 'Nhóm Camera' },
                        { id: 'streamUrl', displayAsText: 'Đường dẫn trực tiếp' },
                    ]}
                    items={items}
                    selectRows={{
                        onChange: (event, row) =>
                        {
                            const index = items.findIndex(item => item.id === row.id);
                            this.cameraStreamStore.cameras[index].isSelected = !this.cameraStreamStore.cameras[index].isSelected;
                            this.cameraStreamStore.set(this.cameraStreamStore.cameras);
                        },
                        onChangeAll: () => this.handleChoosingAll(isChoosingAll),
                    }}
                    loading={this.state.isLoading}
                    onCellClick={(event, row) =>
                    {
                        const index = items.findIndex(item => item.id === row.id);
                        this.handleClickDetail(this.cameraStreamStore.cameras[index]);
                    }}
                />
                {
                    this.cameraStreamStore.cameraDetail && <FaceConfigCameraStreamDetail />
                }
            </Container>
        );
    }
}

FaceConfigCameraStream = withModal(inject('appStore')(observer(FaceConfigCameraStream)));

class FaceConfigCameraStreamDetail extends Component
{
    cameraStreamStore = this.props.appStore.cameraStreamStore;
    cameraGroupStore = this.props.appStore.cameraGroupStore;

    cameraService = new CameraService();

    handleChangeProperty = (key, value) =>
    {
        this.cameraStreamStore.setDetailProperty(key, value);
    };

    handleSaveDetail = () =>
    {
        const camera = this.cameraStreamStore.cameraDetail;

        if (!camera.cameraName)
        {
            this.props.toast({ type: 'error', message: 'Tên camera không được bỏ trống' });
            return;
        }

        if (!camera.id)
        {
            // add
            this.cameraService.addStreamCamera(camera).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.cameraStreamStore.add(rs.data);
                    this.cameraStreamStore.setDetail(rs.data);

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
            this.cameraService.editStreamCamera(camera).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.cameraStreamStore.update(rs.data);

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
        this.cameraStreamStore.setDetail();
    };

    render()
    {
        const { cameraDetail } = this.cameraStreamStore;

        return (
            <Popup
                title={'Thêm/Sửa camera'}
                width={'700px'}
                onClose={this.handleClose}
            >
                <Container className={'list-detail'}>
                    <FormGroup>
                        <FormControlLabel
                            label={'Tên Camera'}
                            control={(
                                <Input
                                    placeholder={'Nhập tên camera'}
                                    value={cameraDetail.cameraName}
                                    onChange={(event) =>
                                    {
                                        this.handleChangeProperty('cameraName', event);
                                    }}
                                />
                            )}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel
                            label={'Đường dẫn trực tiếp'}
                            control={(
                                <Input
                                    placeholder={'Nhập đường dẫn trực tiếp'}
                                    value={cameraDetail.streamUrl}
                                    onChange={(event) =>
                                    {
                                        this.handleChangeProperty('streamUrl', event);
                                    }}
                                />
                            )}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel
                            label={'Nhóm Camera'}
                            control={(
                                <AdvanceSelect
                                    options={this.cameraGroupStore.cameraGroups
                                        ? this.cameraGroupStore.cameraGroups.map((g) =>
                                        {
                                            return {
                                                id: g.id,
                                                label: g.title,
                                            };
                                        })
                                        : []}
                                    value={cameraDetail.cameraGroup}
                                    onChange={(value) => this.handleChangeProperty('cameraGroup', value)}
                                />
                            )}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel
                            label={'Vị trí'}
                            control={
                                <ModifyMap dataStore={this.cameraStreamStore} />
                            }
                        />
                    </FormGroup>
                </Container>

                <PopupFooter>
                    <Button
                        color={cameraDetail.id ? 'warning' : 'primary'}
                        text={cameraDetail.id ? 'Chỉnh sửa' : 'Thêm mới'}
                        onClick={this.handleSaveDetail}
                    />
                </PopupFooter>
            </Popup>
        );
    }
}

FaceConfigCameraStreamDetail = withModal(inject('appStore')(observer(FaceConfigCameraStreamDetail)));

export { FaceConfigCameraStream, FaceConfigCameraStreamDetail };
