import update from 'immutability-helper';
import { inject, observer } from 'mobx-react';
import moment from 'moment';

import { PlateDetectService } from 'components/app/LPR/PlateDetection/PlateDetectService';
import { SpatialSearchMap } from 'components/app/SpatialSearch/SpatialSearchMap';
import { TB1, Tooltip, T, Slider, Section, useResizeMap, Popup, PopupFooter, FlexPanel, Row, Container, DateTimePicker, FormGroup, FormControlLabel, AdvanceSelect, Radio, Button, Input, CheckBox, InputGroup, InputAppend, Label } from '@vbd/vui';

import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { PlateAccompliceService } from '../PlateAccompliceService';
import { searchGuide } from '../../PlateDetection/PlateDetectionSearch';

interface PlateAccompliceQuery {
    plateNumber: string;
    feature?: number[];
    cameraId: string | string[];
    systemName: string;
    accuracy: [number, number];
    showData: [
        {
            id: 0,
            isActivate: boolean,
            data?: any
        },
        {
            id: 1,
            isActivate: boolean,
            data: {
                from: Date,
                to: Date
            }
        },
        {
            id: 2,
            isActivate: boolean,
            data: number
        }
    ],
    geoData?: any
}

const defaultQuery: PlateAccompliceQuery = {
    plateNumber: '',
    feature: undefined,
    cameraId: [],
    systemName: '',
    accuracy: [0.8, 1],
    showData: [
        {
            id: 0,
            isActivate: false,
            data: undefined,
        },
        {
            id: 1,
            isActivate: false,
            data: {
                from: moment().add(-1, 'months').startOf('date').toDate(),
                to: moment().toDate(),
            },
        },
        {
            id: 2,
            isActivate: true,
            data: 168,
        },
    ],
};

interface PlateAccompliceAddSessionProps {
    onClose: () => void;
    plateAlertStore?: any;
}


export let PlateAccompliceAddSessionPopup = (props: PlateAccompliceAddSessionProps) =>
{
    const resizeMap = useResizeMap();
    const spatialSearchStore = props.plateAlertStore?.spatialSearchStore;
    const systems = props.plateAlertStore?.systems?.map((c:{id: string, name: string}) => ({ id: c.id, label: c.name }));

    const [query, setQuery] = useState<PlateAccompliceQuery>(defaultQuery);
    const [spacialSearch, setSpacialSearch] = useState(false);
    const [isValidForm, setIsValidForm] = useState(false);

    useEffect(() =>
    {
        if (!query.plateNumber)
        {
            setIsValidForm(false);
        }
        else if (!isInOneMonth(query.showData[1].data.from, query.showData[1].data.to))
        {
            setIsValidForm(false);
        }
        else
        {
            setIsValidForm(true);
        }

    }, [query.plateNumber, query.showData[1].data.from, query.showData[1].data.to]);

    const { data: cameras } = useQuery('cameras', async () =>
    {
        const service = new PlateDetectService();
        const res = await service.getCameras();
        return res.data?.map((c: {id: string, name: string}) => ({ id: c.id, label: c.name }));
    }, { initialData: [] });

    const isInOneMonth = (from: Date, to: Date) =>
    {
        return moment(to).subtract(1, 'months').subtract(1, 'days').isBefore(moment(from));
    };


    const handleMapRender = (newMap: any) =>
    {
        const { map, onMap, onDelay } = resizeMap;
        if (newMap !== map)
        {
            newMap.resize();
            onMap(newMap);
            onDelay(300);
        }
    };
    return (
        <Popup
            className={'dialog-popup'}
            title={'Tìm kiếm khuôn mặt'}
            padding={'2rem'}
            width={'80rem'}
            height={'40rem'}
            onClose={props.onClose}
        >
            <Container style={{ display: 'flex' }}>
                <FlexPanel width='20rem'>
                    <Section header={'Thông tin'}>
                        <FormGroup>
                            <FormControlLabel
                                label={'Họ và tên'}
                                control={(
                                    <InputGroup>
                                        <Input
                                            placeholder={'Nhập biển số'}
                                            value={query.plateNumber}
                                            onChange={(plateNumber) => setQuery(update(query, { plateNumber: { $set: plateNumber } }))}
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
                                        value={query.systemName}
                                        searchable
                                        onChange={(systemName) => setQuery(update(query, { systemName: { $set: String(systemName) } }))}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label={'Camera'}
                                control={(
                                    <AdvanceSelect
                                        placeholder="Tất cả"
                                        options={cameras}
                                        value={query.cameraId}
                                        multi
                                        searchable
                                        onChange={(cameraId) => setQuery(update(query, { cameraId: { $set: cameraId } }))}
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
                                        value={query.accuracy}
                                        marks={{
                                            0: '0%',
                                            60: '60%',
                                            80: '80%',
                                            100: '100%',
                                        }}
                                        range
                                        onChange={(accuracy: [number, number]) => setQuery(update(query, { accuracy: { $set: accuracy } }))}
                                        onAfterChange={undefined}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>

                    <Section header={'Dữ liệu'}>
                        <FormGroup>
                            <Radio
                                label="Khoảng thời gian"
                                checked={query.showData[1].isActivate}
                                onChange={() => setQuery(update(query, { showData: { [1]: { isActivate: { $set: true } }, [2]: { isActivate: { $set: false } } } }))}
                            />

                            <FormGroup>
                                <FormControlLabel
                                    label={'Từ'}
                                    labelWidth={'3rem'}
                                    control={(
                                        <DateTimePicker
                                            value={query.showData[1].data.from}
                                            showTimeSelect
                                            onChange={(value: Date) => setQuery(update(query, { showData: { [1]: { data: { from: { $set: value } } } } }))}
                                        />
                                    )}
                                />
                                <FormControlLabel
                                    label={'Đến'}
                                    labelWidth={'3rem'}
                                    control={(
                                        <DateTimePicker
                                            value={query.showData[1].data.to}
                                            showTimeSelect
                                            onChange={(value: Date) => setQuery(update(query, { showData: { [1]: { data: { to: { $set: value } } } } }))}

                                        />
                                    )}
                                />
                                {
                                    !isInOneMonth(query.showData[1].data.from, query.showData[1].data.to) &&
                                    (
                                        <Label style={{ color: 'red' }}>
                                            Khoảng thời gian không được vượt quá 30 ngày
                                        </Label>
                                    )
                                }
                            </FormGroup>

                            <Row mainAxisAlignment={'space-between'}>
                                <Radio
                                    label="Cách đây"
                                    checked={query.showData[2].isActivate}
                                    onChange={() => setQuery(update(query, { showData: { [1]: { isActivate: { $set: false } }, [2]: { isActivate: { $set: true } } } }))}
                                />
                                <AdvanceSelect
                                    options={[
                                        { id: '6', label: <T params={['6']}>%0% tiếng</T> },
                                        { id: '12', label: <T params={['12']}>%0% tiếng</T> },
                                        { id: '24', label: <T params={['1']}>%0% ngày</T> },
                                        { id: '168', label: <T params={['7']}>%0% ngày</T> },
                                        { id: '720', label: <T params={['30']}>%0% ngày</T> },
                                    ]}
                                    value={String(query.showData[2].data)}
                                    onChange={(value) => setQuery(update(query, { showData: { [2]: { data: { $set: Number(value) } } } }))}
                                />
                            </Row>
                        </FormGroup>
                    </Section>

                    <Section header={'Truy vấn không gian'}>
                        <FormGroup>
                            <CheckBox
                                label="Truy vấn không gian"
                                checked={spacialSearch}
                                onChange={setSpacialSearch}
                            />
                        </FormGroup>
                    </Section>
                </FlexPanel>
                <Container style={{ paddingLeft: '2rem' }}>
                    <FlexPanel
                        width='54rem'
                        height='40rem'
                    >
                        <SpatialSearchMap
                            store={spatialSearchStore}
                            onMapRender={handleMapRender}
                        />
                    </FlexPanel>
                </Container>
            </Container>
            <PopupFooter>

                <Button
                    color={'primary'}
                    text={'Tìm kiếm'}
                    disabled={!isValidForm}
                    onClick={async () =>
                    {
                        spacialSearch && (query.geoData = spatialSearchStore.buildGeoQuery());
                        await PlateAccompliceService.createSession({ query: { ...query, accuracy: [Math.round(query.accuracy[0] * 100), Math.round(query.accuracy[1] * 100)] } });
                        props.onClose();
                    }}
                />
            </PopupFooter>
        </Popup>
    );
};

PlateAccompliceAddSessionPopup = inject('plateAlertStore')(observer(PlateAccompliceAddSessionPopup));
