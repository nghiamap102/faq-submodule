import '../FaceAlert.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Input,
    CheckBox, Radio, AdvanceSelect, Slider, DateTimePicker,
    Section,
    FormGroup, FormControlLabel,
    Row,
    FlexPanel, PanelBody, PanelFooter,
    T,
    withModal,
    ImageReader, ImageInput,
} from '@vbd/vui';

import { FaceAlertService } from 'services/face-alert.service';

class FaceDetectionSearch extends Component
{
    faceDetectionStore = this.props.appStore.faceDetectionStore;
    faceAlertStore = this.props.appStore.faceAlertStore;

    imageReader = ImageReader();
    faceAlertService = new FaceAlertService();

    handleChangeData = (key, value) =>
    {
        this.faceDetectionStore.setSearchState(key, value);
    };

    handleSearch = () =>
    {
        const { searchState } = this.faceDetectionStore;
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
            this.props.onSearch(this.state);
        }
    };

    handleChangeTypeActivate = (index) =>
    {
        const showData = this.faceDetectionStore.searchState.showData;
        for (let i = 0; i < showData.length; i++)
        {
            showData[i].isActivate = i === index;
        }
        this.faceDetectionStore.setSearchState('showData', showData);
    };

    handleChangeTypeData = (index, key, data) =>
    {
        const showData = this.faceDetectionStore.searchState.showData;
        if (key === undefined)
        {
            showData[index].data = data;
        }
        else
        {
            showData[index].data[key] = data;
        }
        this.faceDetectionStore.setSearchState('showData', showData);
    };

    handleImageChange = async (file, image, orientation) =>
    {
        if (file)
        {
            this.faceDetectionStore.setIsLoading(true);

            try
            {
                const response = await this.faceAlertService.checkFace(file, orientation);
                const feature = response?.[0]?.Objects?.[0]?.Feature;
                this.faceDetectionStore.setSearchState('feature', feature);
            }
            catch (error)
            {
            }

            this.faceDetectionStore.setIsLoading(false);
        }
        else
        {
            this.faceDetectionStore.setSearchState('feature', undefined);
        }
    };

    render()
    {
        const cameras = this.faceAlertStore.cameras.map((c) => ({ id: c.id, label: c.name }));

        return (
            <FlexPanel width={'20rem'}>
                <PanelBody scroll>
                    <Section header={'Thông tin'}>
                        <FormGroup>
                            <ImageInput onChange={this.handleImageChange} />

                            <FormControlLabel
                                label={'Họ và tên'}
                                control={(
                                    <Input
                                        placeholder={'Nhập họ và tên'}
                                        value={this.faceDetectionStore.searchState.fullName}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('fullName', event);
                                        }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label={'Camera'}
                                control={(
                                    <AdvanceSelect
                                        placeholder="Tất cả"
                                        options={cameras}
                                        value={this.faceDetectionStore.searchState.cameraId}
                                        multi
                                        searchable
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
                                label={'Gương mặt'}
                                control={(
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={this.faceDetectionStore.searchState.accuracy}
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

                            <FormControlLabel
                                direction={'column'}
                                label={'Mặt nạ'}
                                control={(
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={this.faceDetectionStore.searchState.mask}
                                        marks={{
                                            0: '0%',
                                            60: '60%',
                                            80: '80%',
                                            100: '100%',
                                        }}
                                        range
                                        onChange={(value) => this.handleChangeData('mask', value)}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>

                    <Section header={'Dữ liệu'}>
                        <FormGroup>
                            {/* <Radio */}
                            {/*    label="Tất cả" */}
                            {/*    checked={this.faceDetectionStore.searchState.showData[0].isActivate} */}
                            {/*    onChange={() => this.handleChangeTypeActivate(0)} */}
                            {/* /> */}

                            <Radio
                                label="Khoảng thời gian"
                                checked={this.faceDetectionStore.searchState.showData[1].isActivate}
                                onChange={() => this.handleChangeTypeActivate(1)}
                            />

                            <FormGroup>
                                <FormControlLabel
                                    label={'Từ'}
                                    labelWidth={'3rem'}
                                    control={(
                                        <DateTimePicker
                                            value={this.faceDetectionStore.searchState.showData[1].data.from}
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
                                            value={this.faceDetectionStore.searchState.showData[1].data.to}
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
                                    checked={this.faceDetectionStore.searchState.showData[2].isActivate}
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
                                    value={this.faceDetectionStore.searchState.showData[2].data}
                                    onChange={(value) => this.handleChangeTypeData(2, undefined, value)}
                                />
                            </Row>
                        </FormGroup>
                    </Section>

                    <Section header={'Truy vấn không gian'}>
                        <FormGroup>
                            <CheckBox
                                label="Truy vấn không gian"
                                checked={this.faceDetectionStore.spatialSearch}
                                onChange={(val) => this.faceDetectionStore.setSpatialSearch(val)}
                            />
                        </FormGroup>
                    </Section>
                </PanelBody>

                <PanelFooter
                    actions={[
                        {
                            text: 'Tìm kiếm',
                            onClick: this.handleSearch,
                            isLoading: this.faceDetectionStore.isLoading,
                        },
                    ]}
                />
            </FlexPanel>
        );
    }
}


FaceDetectionSearch = withModal(inject('appStore')(observer(FaceDetectionSearch)));

export default FaceDetectionSearch;
