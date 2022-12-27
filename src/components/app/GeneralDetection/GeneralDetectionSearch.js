import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Enum from 'constant/app-enum';
import { FaceAlertService } from 'services/face-alert.service';
import { CommonHelper } from 'helper/common.helper';

import
{
    AdvanceSelect, CheckBox, Radio, DateTimePicker, Button, Slider,
    FormControlLabel, FormGroup,
    Input, InputGroup, Section, InputAppend, ImageInput,
    FlexPanel, PanelBody, PanelFooter,
    Row, Container,
    Tooltip,
    TB1, T,
    withModal, withI18n,
} from '@vbd/vui';

import { CARS, COLORS, OBJECTS } from './common';

const searchGuide = `    * - đại diện cho 0 hoặc nhiều ký tự bất kỳ.
    ? - đại diện cho một ký tự đơn bất kỳ.
    @ - đại diện cho một chữ cái đơn bất kỳ.
    # - đại diện cho một số đơn bất kỳ.
[...] - đại diện cho nhiều ký tự trong dấu ngoặc
        + Vd: [38B] chỉ ra bất kỳ sự kết hợp của
        các ký tự 3, 8, và B. Nghĩa là các số sau
        có thể khớp ABC12[3], ABC12[8], ABC12[B]
`;

const defaultItem = { id: '', label: 'Tất cả' };
const transformedColors = [defaultItem, ...Object.keys(COLORS).map(k => ({ id: k, label: COLORS[k] }))];
const transformedObjects = [defaultItem, ...Object.keys(OBJECTS).map(k => ({ id: k, label: OBJECTS[k] }))];
const transformedCars = [defaultItem, ...CARS.map(c => ({ id: c, label: c }))];

class GeneralDetectionSearch extends Component
{
    state = {
        plateNumberInputAppendValue: 0,
    };

    generalDetectionStore = this.props.appStore.generalDetectionStore;
    faceAlertSvc = new FaceAlertService();
    plateDetectService = this.props.service;

    constructor(props)
    {
        super(props);

        this.imageRefs = {};
    }

    handleInputKeyDown = (e) =>
    {
        if (e.key === 'Enter' || e.keyCode === 13)
        {
            this.handleSearch();
        }
    };

    handleChangeData = (key, value) =>
    {
        this.generalDetectionStore.setSearchState(key, value);

        if (key === 'systemName')
        {
            this.generalDetectionStore.setSearchState('cameraId', '');
            if (!this.generalDetectionStore.cameras[value])
            {
                this.plateDetectService.getCameras(value).then((rs) =>
                {
                    if (rs.result === Enum.APIStatus.Success)
                    {
                        this.generalDetectionStore.setCameras(value, rs.data);
                    }
                });
            }
        }
    };

    handleSearch = () =>
    {
        if (typeof this.props.onSearch === 'function')
        {
            const plateNumber = this.generalDetectionStore.searchState.plateNumber;

            this.generalDetectionStore.setSearchState('plateNumberSearch', plateNumber);

            this.props.onSearch(this.state);
        }
    };

    handleChangeTypeActivate = (index) =>
    {
        const showData = this.generalDetectionStore.searchState.showData;

        for (let i = 0; i < showData.length; i++)
        {
            showData[i].isActivate = i === index;
        }

        this.generalDetectionStore.setSearchState('showData', showData);
    };

    handleChangeTypeData = (index, key, data) =>
    {
        const showData = this.generalDetectionStore.searchState.showData;

        if (key === undefined)
        {
            showData[index].data = data;
        }
        else
        {
            showData[index].data[key] = data;
        }

        this.generalDetectionStore.setSearchState('showData', showData);
    };

    handleImageChange = (detect, field, file, image, orientation) =>
    {
        if (file)
        {
            field.imagePath = file.name;
            field.imageData = image;

            this.generalDetectionStore.setSearchData(detect);

            this.faceAlertSvc.getFaceIds(file, orientation).then((rs) =>
            {
                if (!rs || rs.error)
                {
                    field.value = []; // If false. Set faceIds is empty
                }

                if (rs && rs.face)
                {
                    let faces = [];

                    if (rs.face.length > 0)
                    {
                        faces = faces.concat(rs.face[0].ListCandidate?.map((c) => c.ID));
                    }

                    field.value = faces;
                }
            });
        }
        else
        {
            field.imagePath = '';
            field.imageData = '';
            field.value = [];

            this.generalDetectionStore.setSearchData(detect);
        }
    };

    handleAddSearch = (event) =>
    {
        const types = {
            Unknown: undefined,
            AdvanceSelect: 'advance-select',
        };

        const eventTypes = [...new Set(this.generalDetectionStore.metaData.filter(m => m.QueryType).map((d) => d.EventType))];

        this.props.menu({
            id: 'add-search-menu',
            isTopLeft: true,
            position: { x: event.clientX, y: event.clientY },
            actions: eventTypes.map((eventType) =>
            {
                return {
                    label: eventType,
                    onClick: () =>
                    {
                        const searchDataFields = this.generalDetectionStore.metaData.filter((d) => d.EventType === eventType && d.QueryType);
                        const language = this.props.language;

                        this.generalDetectionStore.setSearchData({
                            id: CommonHelper.uuid(),
                            type: eventType,
                            fields: searchDataFields.map((f) =>
                            {
                                let type = types.Unknown;
                                let typeValue;
                                let value = '';

                                function fieldNamesHandler(fieldNames)
                                {
                                    if (fieldNames.includes(f['FieldName']))
                                    {
                                        type = types.AdvanceSelect;

                                        switch (f['FieldName'])
                                        {
                                            case 'Color':
                                                typeValue = transformedColors;
                                                value = transformedColors[0].id;
                                                break;
                                            case 'Brand':
                                                typeValue = transformedCars;
                                                value = transformedCars[0].id;
                                                break;
                                            case 'Info':
                                                typeValue = transformedObjects;
                                                value = transformedObjects[0].id;
                                                break;
                                            default:
                                                typeValue = null;
                                                value = '';
                                                break;
                                        }
                                    }
                                }

                                switch (f['EventType'])
                                {
                                    case 'Object':
                                        fieldNamesHandler(['Color', 'Brand', 'Info']);
                                        break;
                                    case 'LPR':
                                        fieldNamesHandler(['Color']);
                                        break;
                                    default:
                                        break;
                                }

                                return {
                                    label: f['FieldDisplay.Value'] && f['FieldDisplay.Locale'] ? f['FieldDisplay.Value'][f['FieldDisplay.Locale'].indexOf(language)] : f.FieldName,
                                    key: f.FieldName,
                                    queryType: f.QueryType,
                                    value,
                                    typeValue,
                                    type,
                                };
                            }),
                        });
                    },
                };
            }),
        });
    };

    handleChangeSearch = (data) =>
    {
        this.generalDetectionStore.setSearchData(data);
    };

    handleDeleteSearch = (data) =>
    {
        this.generalDetectionStore.deleteSearchData(data.id);
    };

    render()
    {
        const systemName = this.generalDetectionStore.searchState.systemName;

        let cameras = (systemName === '' ? this.generalDetectionStore.cameras['all'] : this.generalDetectionStore.cameras[systemName]) || [];
        cameras = cameras.filter(c => c.id).map((c) => ({ id: c.id, label: c.name }));

        let searchPart;
        const status = this.generalDetectionStore.searchState.status;

        if (status === 1)
        {
            searchPart = <Container className={'general-detect-search'}><T>Đang xử lý...</T></Container>;
        }
        else
        {
            searchPart =
                <Button
                    className={'general-detect-search'}
                    color={'primary'}
                    text={'Tìm kiếm'}
                    onClick={this.handleSearch}
                />;
        }

        return (
            <FlexPanel width={'20rem'}>
                <PanelBody scroll>
                    <Section
                        header={'Tìm kiếm'}
                        actions={[
                            {
                                title: 'Thêm mới',
                                icon: 'plus',
                                onClick: this.handleAddSearch,
                            },
                        ]}
                    >
                        <FormGroup>
                            {this.generalDetectionStore.searchState.searchData?.map((d, i) =>
                                <Section
                                    key={d.id}
                                    header={<T params={[i + 1, this.props.t(d.type)]}>Điều kiện %0% (%1%)</T>}
                                    actions={[
                                        {
                                            title: 'Xóa',
                                            icon: 'trash-alt',
                                            onClick: () => this.handleDeleteSearch(d),
                                        },
                                    ]}
                                >
                                    {d.fields.map((f) =>
                                        <React.Fragment key={`${d.id}.${f.key}`}>
                                            {f.queryType === 'Face' ?
                                                <ImageInput
                                                    onChange={(file, image, orientation) => this.handleImageChange(d, f, file, image, orientation)}
                                                    imageData={f.imageData}
                                                    value={f.value}
                                                    removeImage={() => this.removeImage(d, f)}
                                                />
                                                :
                                                <FormControlLabel
                                                    label={f.label}
                                                    control={
                                                        <>
                                                            {f.type ?
                                                                <AdvanceSelect
                                                                    placeholder="Tất cả"
                                                                    options={f.typeValue}
                                                                    onChange={(value) =>
                                                                    {
                                                                        let temp = value;
                                                                        if (Array.isArray(temp))
                                                                        {
                                                                            temp = temp.join(', ');
                                                                        }
                                                                        f.value = temp;
                                                                        this.handleChangeSearch(d);
                                                                    }}
                                                                    value={f.value}
                                                                    searchable
                                                                    multi={true}
                                                                /> :
                                                                <InputGroup>
                                                                    <Input
                                                                        value={f.value}
                                                                        onChange={(event) =>
                                                                        {
                                                                            f.value = event;
                                                                            this.handleChangeSearch(d);
                                                                        }}
                                                                    />

                                                                    {f.queryType === 'WildCard' && (
                                                                        <InputAppend>
                                                                            <Tooltip
                                                                                content={
                                                                                    <>
                                                                                        <TB1>Ký tự đại diện</TB1>
                                                                                        <pre>{searchGuide}</pre>
                                                                                    </>
                                                                                }
                                                                                position={'bottom'}
                                                                                trigger={'click'}
                                                                            >?
                                                                            </Tooltip>
                                                                        </InputAppend>
                                                                    )}
                                                                </InputGroup>
                                                            }
                                                        </>
                                                    }
                                                />
                                            }
                                        </React.Fragment>,
                                    )}
                                </Section>,
                            )}
                        </FormGroup>
                    </Section>

                    <Section header={'Thông tin'}>
                        <FormGroup>
                            {
                                cameras?.length > 0 &&
                                <FormControlLabel
                                    label={'Camera'}
                                    control={
                                        <AdvanceSelect
                                            placeholder="Tất cả"
                                            searchable
                                            options={cameras}
                                            onChange={(value) => this.handleChangeData('cameraId', value)}
                                            value={this.generalDetectionStore.searchState.cameraId}
                                            multi
                                        />
                                    }
                                />
                            }
                        </FormGroup>
                    </Section>

                    <Section header={'Độ chính xác'}>
                        <FormGroup>
                            <FormControlLabel
                                direction={'column'}
                                label={'Chung cho tất cả đối tượng'}
                                control={
                                    <Slider
                                        range
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={this.generalDetectionStore.searchState.accuracy}
                                        marks={{
                                            0: '0%',
                                            60: '60%',
                                            80: '80%',
                                            100: '100%',
                                        }}
                                        onChange={(value) => this.handleChangeData('accuracy', value)}
                                    />
                                }
                            />
                        </FormGroup>
                    </Section>

                    <Section header={'Dữ liệu'}>
                        <FormGroup>
                            {/*<Radio*/}
                            {/*    label="Tất cả"*/}
                            {/*    checked={this.generalDetectionStore.searchState.showData[0].isActivate}*/}
                            {/*    onChange={() => this.handleChangeTypeActivate(0)}*/}
                            {/*/>*/}

                            <Radio
                                label="Khoảng thời gian"
                                checked={this.generalDetectionStore.searchState.showData[1].isActivate}
                                onChange={() => this.handleChangeTypeActivate(1)}
                            />

                            <FormGroup>
                                <FormControlLabel
                                    label={'Từ'}
                                    labelWidth={'3rem'}
                                    control={
                                        <DateTimePicker
                                            showTimeSelect
                                            onChange={(event) =>
                                            {
                                                this.handleChangeTypeData(1, 'from', event);
                                            }}
                                            value={this.generalDetectionStore.searchState.showData[1].data.from}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    label={'Đến'}
                                    labelWidth={'3rem'}
                                    control={
                                        <DateTimePicker
                                            showTimeSelect
                                            onChange={(event) =>
                                            {
                                                this.handleChangeTypeData(1, 'to', event);
                                            }}
                                            value={this.generalDetectionStore.searchState.showData[1].data.to}
                                        />
                                    }
                                />
                            </FormGroup>

                            <Row mainAxisAlignment={'space-between'}>
                                <Radio
                                    label="Cách đây"
                                    checked={this.generalDetectionStore.searchState.showData[2].isActivate}
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
                                    onChange={(value) => this.handleChangeTypeData(2, undefined, value)}
                                    value={this.generalDetectionStore.searchState.showData[2].data}
                                />
                            </Row>
                        </FormGroup>
                    </Section>
                    <Section header={'Truy vấn không gian'}>
                        <FormGroup>
                            <CheckBox
                                label="Truy vấn không gian"
                                checked={this.generalDetectionStore.spatialSearch}
                                onChange={(val) => this.generalDetectionStore.setSpatialSearch(val)}
                            />
                        </FormGroup>
                    </Section>
                </PanelBody>

                <PanelFooter>
                    <Container className={this.generalDetectionStore.searchState.status === 2 ? 'success' : 'alert'}>
                        <T>{searchPart}</T>
                    </Container>
                </PanelFooter>
            </FlexPanel>
        );
    }
}

GeneralDetectionSearch.propTypes = {
    service: PropTypes.any,
    onSearch: PropTypes.func,
};

GeneralDetectionSearch = withI18n(withModal(inject('appStore')(observer(GeneralDetectionSearch))));
export default GeneralDetectionSearch;
