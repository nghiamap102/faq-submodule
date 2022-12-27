import 'components/app/LPR/PlateAlert.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Enum from 'constant/app-enum';

import {
    AdvanceSelect, CheckBox, Radio, Input, InputGroup, Section, InputAppend, DateTimePicker,
    FormControlLabel, FormGroup,
    withModal,
    Slider,
    Row,
    TB1,
    Tooltip,
    FlexPanel, PanelBody, PanelFooter,
    T,
} from '@vbd/vui';

export const searchGuide = `    * - đại diện cho 0 hoặc nhiều ký tự bất kỳ.
    ? - đại diện cho một ký tự đơn bất kỳ.
    @ - đại diện cho một chữ cái đơn bất kỳ.
    # - đại diện cho một số đơn bất kỳ.
[...] - đại diện cho nhiều ký tự trong dấu ngoặc
        + Vd: [38B] chỉ ra bất kỳ sự kết hợp của
        các ký tự 3, 8, và B. Nghĩa là các số sau
        có thể khớp ABC12[3], ABC12[8], ABC12[B]
`;

class PlateDetectionSearch extends Component
{
    state = {
        plateNumberInputAppendValue: 0,
    };

    plateDetectionStore = this.props.plateAlertStore.plateDetectionStore;
    plateAlertStore = this.props.plateAlertStore;

    plateDetectService = this.props.service;

    handlePlateNumberKeyDown = (e) =>
    {
        if (e.key === 'Enter' || e.keyCode === 13)
        {
            this.handleSearch();
        }
    };

    handleChangeData = (key, value) =>
    {
        this.plateDetectionStore.setSearchState(key, value);

        if (key === 'systemName')
        {
            this.plateDetectionStore.setSearchState('cameraId', '');
            if (!this.plateAlertStore.cameras[value])
            {
                this.plateDetectService.getCameras(value).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.plateAlertStore.setCameras(value, rs.data);
                    }
                });
            }
        }
    };

    handleSearch = () =>
    {
        const { searchState } = this.plateDetectionStore;
        if (searchState.showData[1].isActivate)
        {
            if (searchState.showData[1].data.from > searchState.showData[1].data.to)
            {
                this.props.toast({ type: 'error', message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc' });
                return;
            }
        }

        if (typeof this.props.onSearch === 'function')
        {
            const plateNumber = this.plateDetectionStore.searchState.plateNumber;

            this.plateDetectionStore.setSearchState('plateNumberSearch', plateNumber);

            this.props.onSearch(this.state);
        }
    };

    handleChangeTypeActivate = (index) =>
    {
        const showData = this.plateDetectionStore.searchState.showData;

        for (let i = 0; i < showData.length; i++)
        {
            showData[i].isActivate = i === index;
        }

        this.plateDetectionStore.setSearchState('showData', showData);
    };

    handleChangeTypeData = (index, key, data) =>
    {
        const showData = this.plateDetectionStore.searchState.showData;

        if (key === undefined)
        {
            showData[index].data = data;
        }
        else
        {
            showData[index].data[key] = data;
        }

        this.plateDetectionStore.setSearchState('showData', showData);
    };

    render()
    {
        const systemName = this.plateDetectionStore.searchState.systemName;
        const systems = this.plateAlertStore.systems.map((c) => ({ id: c.id, label: c.name }));
        systems.unshift({ id: '', label: 'Tất cả' });

        let cameras = (systemName === '' ? this.plateAlertStore.cameras['all'] : this.plateAlertStore.cameras[systemName]) || [];
        cameras = cameras.map((c) => ({ id: c.id, label: c.name }));

        return (
            <FlexPanel width={'20rem'}>
                <PanelBody scroll>
                    <Section header={'Thông tin'}>
                        <FormGroup>
                            <FormControlLabel
                                label={'Biển số'}
                                control={(
                                    <InputGroup>
                                        <Input
                                            placeholder={'Nhập biển số'}
                                            value={this.plateDetectionStore.searchState.plateNumber}
                                            onKeyDown={this.handlePlateNumberKeyDown}
                                            onChange={(event) =>
                                            {
                                                this.handleChangeData('plateNumber', event);
                                            }}
                                        />
                                        <InputAppend>
                                            <Tooltip
                                                content={(
                                                    <>
                                                        <TB1>Ký tự đại diện</TB1>
                                                        <pre>{searchGuide}</pre>
                                                    </>
                                                )}
                                                position={'bottom'}
                                                trigger={['click']}
                                            >
                                                ?
                                            </Tooltip>
                                        </InputAppend>
                                    </InputGroup>
                                )}
                            />
                            <FormControlLabel
                                label={'Hệ thống'}
                                control={(
                                    <AdvanceSelect
                                        placeholder="Chọn hệ thống"
                                        options={systems}
                                        value={this.plateDetectionStore.searchState.systemName}
                                        searchable
                                        onChange={(value) => this.handleChangeData('systemName', value)}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label={'Camera'}
                                control={(
                                    <AdvanceSelect
                                        placeholder="Tất cả"
                                        options={cameras}
                                        value={this.plateDetectionStore.searchState.cameraId}
                                        searchable
                                        multi
                                        onChange={(value) => this.handleChangeData('cameraId', value)}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>

                    <Section header={'Độ chính xác'}>
                        <FormGroup>
                            <FormControlLabel
                                direction={'column'}
                                label={'Biển số'}
                                control={(
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={this.plateDetectionStore.searchState.accuracy}
                                        marks={{
                                            0: '0%',
                                            60: '60%',
                                            80: '80%',
                                            100: '100%',
                                        }}
                                        range
                                        onChange={(value) => this.handleChangeData('accuracy', value)}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>

                    <Section header={'Dữ liệu'}>
                        <FormGroup>
                            {/* <Radio */}
                            {/*    label="Tất cả" */}
                            {/*    checked={this.plateDetectionStore.searchState.showData[0].isActivate} */}
                            {/*    onChange={() => this.handleChangeTypeActivate(0)} */}
                            {/* /> */}

                            <Radio
                                label="Khoảng thời gian"
                                checked={this.plateDetectionStore.searchState.showData[1].isActivate}
                                onChange={() => this.handleChangeTypeActivate(1)}
                            />

                            <FormGroup>
                                <FormControlLabel
                                    label={'Từ'}
                                    labelWidth={'3rem'}
                                    control={(
                                        <DateTimePicker
                                            value={this.plateDetectionStore.searchState.showData[1].data.from}
                                            showTimeSelect
                                            onChange={(event) =>
                                            {
                                                this.handleChangeTypeData(1, 'from', event);
                                            }}
                                        />
                                    )}
                                />
                                <FormControlLabel
                                    label={'Đến'}
                                    labelWidth={'3rem'}
                                    control={(
                                        <DateTimePicker
                                            value={this.plateDetectionStore.searchState.showData[1].data.to}
                                            showTimeSelect
                                            onChange={(event) =>
                                            {
                                                this.handleChangeTypeData(1, 'to', event);
                                            }}
                                        />
                                    )}
                                />
                            </FormGroup>

                            <Row mainAxisAlignment={'space-between'}>
                                <Radio
                                    label="Cách đây"
                                    checked={this.plateDetectionStore.searchState.showData[2].isActivate}
                                    onChange={() => this.handleChangeTypeActivate(2)}
                                />
                                <AdvanceSelect
                                    options={[
                                        { id: 6, label: <T params={[6]}>%0% tiếng</T> },
                                        { id: 12, label: <T params={[12]}>%0% tiếng</T> },
                                        { id: 24, label: <T params={[1]}>%0% ngày</T> },
                                        { id: 168, label: <T params={[7]}>%0% ngày</T> },
                                        { id: 720, label: <T params={[30]}>%0% ngày</T> },
                                    ]}
                                    value={this.plateDetectionStore.searchState.showData[2].data}
                                    onChange={(value) => this.handleChangeTypeData(2, undefined, value)}
                                />
                            </Row>
                        </FormGroup>
                    </Section>
                    <Section header={'Truy vấn không gian'}>
                        <FormGroup>
                            <CheckBox
                                label="Truy vấn không gian"
                                checked={this.plateDetectionStore.spatialSearch}
                                onChange={(val) => this.plateDetectionStore.setSpatialSearch(val)}
                            />
                        </FormGroup>
                    </Section>
                </PanelBody>

                <PanelFooter
                    actions={[
                        {
                            text: 'Tìm kiếm', onClick: this.handleSearch,
                        },
                    ]}
                />
            </FlexPanel>
        );
    }
}

PlateDetectionSearch.propTypes = {
    service: PropTypes.any,
    onSearch: PropTypes.func,
};

PlateDetectionSearch = withModal(inject('plateAlertStore')(observer(PlateDetectionSearch)));

export default PlateDetectionSearch;
