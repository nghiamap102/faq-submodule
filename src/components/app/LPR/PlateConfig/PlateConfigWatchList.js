import 'components/app/LPR/PlateConfig/PlateConfig.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Row,
    Popup, PopupFooter,
    AdvanceSelect, Button, FormControlLabel, FormGroup, Input, Section, CheckBox,
    ColorPicker,
    DataGrid,
    withModal,
    T,
} from '@vbd/vui';

import { PlateWatchListService } from 'services/plate-watch-list.service';
import { CommonHelper } from 'helper/common.helper';
import { CameraGroupService } from 'services/cameraGroup.service';

const Enum = require('constant/app-enum');

class PlateConfigWatchList extends Component
{
    watchListStore = this.props.appStore.plateWatchListStore;
    watchListSvc = new PlateWatchListService();

    constructor(props)
    {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    componentDidMount = () =>
    {
        this.setState({ isLoading: true });
        this.watchListSvc.getAll().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.watchListStore.setWatchList(rs.data);
            }
            this.setState({ isLoading: false });
        });
    };

    handleClickDetail = (detail) =>
    {
        this.watchListStore.setWatchListDetail(CommonHelper.clone(detail));
    };

    handleAddNew = () =>
    {
        this.watchListStore.setWatchListDetail({});
    };

    handleDeleteClick = () =>
    {
        this.watchListSvc.delete(this.watchListStore.watchList.filter((wl) => wl.isSelected).map((wl) => wl.id)).then((rss) =>
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

            const data = this.watchListStore.watchList.filter((wl) => !wl.isSelected);
            this.watchListStore.setWatchList(data);
        });
    };

    handleChoosingAll = (isChoosingAll) =>
    {
        if (this.watchListStore.watchList)
        {
            const data = this.watchListStore.watchList;
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
            this.watchListStore.setWatchList(data);
        }
    };

    render()
    {
        const choosingCount = this.watchListStore.watchList ? this.watchListStore.watchList.filter((d) => d.isSelected).length : 0;
        const isChoosingAll = this.watchListStore.watchList && choosingCount === this.watchListStore.watchList.length && this.watchListStore.watchList.length > 0;

        const items = Array.isArray(this.watchListStore.watchList) && this.watchListStore.watchList.map(watchList =>
        {
            return {
                ...watchList,
                label: <Container
                    className={'column-label'}
                    style={{ backgroundColor: watchList.label ? watchList.label : 'black' }}
                />,
                status: (
                    <Row
                        height="100%"
                        crossAxisAlignment="center"
                        mainAxisAlignment="center"
                    >
                        <CheckBox
                            className={'column-status'}
                            checked={watchList.isActivate}
                        />
                    </Row>
                ),
            };
        });

        return (
            <Container className={'list-management'}>
                <Container className={'plate-alert-tool'}>
                    <Container className={'plate-alert-actions'}>
                        <Button
                            color={'primary'}
                            text={'Thêm mới'}
                            onClick={this.handleAddNew}
                        />
                        <Button
                            color={'danger'}
                            text={<T params={[choosingCount]}>Xóa những mục đã chọn (%0%)</T>}
                            disabled={choosingCount === 0}
                            onClick={this.handleDeleteClick}
                        />
                    </Container>
                </Container>

                <DataGrid
                    className={'result-table'}
                    columns={[
                        { id: 'label', schema: 'react-node', displayAsText: 'Nhãn', width: 150 },
                        { id: 'name', displayAsText: 'Tên' },
                        { id: 'status', schema: 'react-node', displayAsText: 'Trạng thái', width: 100 },
                    ]}
                    items={items}
                    selectRows={{
                        onChange: (event, row) =>
                        {
                            const index = items.findIndex(item => item.id === row.id);
                            this.watchListStore.watchList[index].isSelected = !this.watchListStore.watchList[index].isSelected;
                            this.watchListStore.setWatchList(this.watchListStore.watchList);
                        },
                        onChangeAll: () => this.handleChoosingAll(isChoosingAll),
                    }}
                    loading={this.state.isLoading}
                    rowNumber
                    // externalPaginationRow
                    onCellClick={(event, row) =>
                    {
                        const index = items.findIndex(item => item.id === row.id);
                        this.handleClickDetail(this.watchListStore.watchList[index], event);
                    }}
                />


                {this.watchListStore.watchListDetail && <PlateConfigWatchListDetail />}
            </Container>
        );
    }
}

PlateConfigWatchList = withModal(inject('appStore')(observer(PlateConfigWatchList)));

class PlateConfigWatchListDetail extends Component
{
    watchListStore = this.props.appStore.plateWatchListStore;
    cameraGroupStore = this.props.appStore.cameraGroupStore;
    incidentStore = this.props.appStore.incidentStore;

    watchListSvc = new PlateWatchListService();
    cameraGroupService = new CameraGroupService();

    constructor(props)
    {
        super(props);

        this.cameraGroupService.gets().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.cameraGroupStore.set(rs.data);
            }
        });
    }

    handleChangeProperty = (key, value) =>
    {
        this.watchListStore.setWatchListDetailProperty(key, value);
    };

    handleSaveDetail = () =>
    {
        const watchList = this.watchListStore.watchListDetail;
        if (!watchList.name)
        {
            this.props.toast({ type: 'error', message: 'Tên danh sách theo dõi không được bỏ trống' });
            return;
        }

        // set default for label
        if (!watchList.label)
        {
            watchList.label = '#000';
        }

        if (!watchList.id)
        {
            // add
            this.watchListSvc.add(watchList).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.watchListStore.addToWatchList(rs.data);
                    this.watchListStore.setWatchListDetail(rs.data);

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
            this.watchListSvc.edit(watchList).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    this.watchListStore.updateWatchList(rs.data);
                    this.watchListStore.setWatchListDetail(rs.data);

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
        this.watchListStore.setWatchListDetail();
    };

    render()
    {
        const { watchListDetail } = this.watchListStore;
        const incidents = this.incidentStore.incidents;

        return (
            <Popup
                title={'Thêm/Sửa danh sách theo dõi'}
                width={'600px'}
                onClose={this.handleClose}
            >
                <Container className={'list-detail'}>
                    <Section header={'Thông tin cơ bản'}>
                        <FormGroup>
                            <FormControlLabel
                                label={'Nhãn'}
                                control={(
                                    <ColorPicker
                                        value={watchListDetail.label}
                                        onChange={(color) => this.handleChangeProperty('label', color)}
                                    />
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormControlLabel
                                label={'Tên'}
                                control={(
                                    <Input
                                        placeholder={'Nhập tên danh sách theo dõi'}
                                        value={watchListDetail.name}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeProperty('name', event);
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
                                        value={watchListDetail.description}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeProperty('description', event);
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
                                        options={this.cameraGroupStore.cameraGroups.map((group) =>
                                        {
                                            return {
                                                id: group.id,
                                                label: group.title,
                                            };
                                        })}
                                        value={watchListDetail.cameraGroupId}
                                        onChange={(value) => this.handleChangeProperty('cameraGroupId', value)}
                                    />
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormControlLabel
                                label={'Độ chính xác'}
                                control={(
                                    <Input
                                        type={'number'}
                                        min={0}
                                        max={100}
                                        value={watchListDetail.accuracy}
                                        onChange={(value) => this.handleChangeProperty('accuracy', value)}
                                    />
                                )}
                            />
                        </FormGroup>
                        <FormGroup>
                            {/* <CheckBox */}
                            {/*    label="Báo động khi đó là sự kiện" */}
                            {/*    checked={watchListDetail.isRequireEventAcknowledgement} */}
                            {/*    onChange={() => this.handleChangeProperty('isRequireEventAcknowledgement', !watchListDetail.isRequireEventAcknowledgement)} */}
                            {/* /> */}

                            {/* <CheckBox */}
                            {/*    label="Bật thông báo âm thanh" */}
                            {/*    checked={watchListDetail.isEnableAlert} */}
                            {/*    onChange={() => this.handleChangeProperty('isEnableAlert', !watchListDetail.isEnableAlert)} */}
                            {/* /> */}

                            <CheckBox
                                label="Hoạt động"
                                checked={watchListDetail.isActivate}
                                onChange={() => this.handleChangeProperty('isActivate', !watchListDetail.isActivate)}
                            />
                        </FormGroup>
                    </Section>
                    <Section header={'Thông báo'}>
                        <FormGroup>
                            <FormControlLabel
                                label={'Sự cố'}
                                control={(
                                    <AdvanceSelect
                                        options={incidents.map((i) =>
                                        {
                                            return { id: i.id, label: [i.incidentId, i.description].join(' - ') };
                                        })}
                                        value={watchListDetail.incidentIds ? watchListDetail.incidentIds : []}
                                        multi
                                        onChange={(value) => this.handleChangeProperty('incidentIds', value)}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Người dùng'}
                                control={(
                                    <Input
                                        placeholder={''}
                                        value={watchListDetail.matterMostUser}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeProperty('matterMostUser', event);
                                        }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label={'Kênh'}
                                control={(
                                    <Input
                                        placeholder={''}
                                        value={watchListDetail.matterMostChannel}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeProperty('matterMostChannel', event);
                                        }}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>
                </Container>

                <PopupFooter>
                    <Button
                        type={watchListDetail.id ? 'warning' : 'primary'}
                        text={watchListDetail.id ? 'Chỉnh sửa' : 'Thêm mới'}
                        onClick={this.handleSaveDetail}
                    />
                </PopupFooter>
            </Popup>
        );
    }
}

PlateConfigWatchListDetail = withModal(inject('appStore')(observer(PlateConfigWatchListDetail)));

export { PlateConfigWatchList, PlateConfigWatchListDetail };
