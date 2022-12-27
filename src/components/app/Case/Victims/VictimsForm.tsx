import React, { useEffect, useState } from 'react';

import {
    Row, Column, Container,
    FormControlLabel, FormGroup, Input,
    AdvanceSelect, Section,
} from '@vbd/vui';

import { LayerHelper } from 'services/utilities/layerHelper';
import { VictimData } from '../CaseFormPopup';

export type VictimsFormProps = {
    onChange?: Function,
    data?: any,
    onRemove: Function
}

const VictimsForm: React.FC<VictimsFormProps> = (props) =>
{
    const {
        data,
        onChange = () =>
        {
        },
        onRemove = () =>
        {
        },
    } = props;

    const [victimsState, setVictimsState] = useState<any>(data);
    const [optionsFieldData, setOptionsFieldData] = useState<any>({ TINH_TRANG: [] });

    useEffect(() =>
    {
        LayerHelper.getOptions('CHITIETNANNHAN').then(rs =>
        {
            if (rs)
            {
                setOptionsFieldData(rs);
            }
        });
    }, []);

    useEffect(() =>
    {
        setVictimsState(data);
    }, [data]);

    const buildVictimForm = (v: any, index: number) =>
    {
        return (
            <Section
                key={index}
                header={`Nạn nhân ${index + 1}`}
                actions={[
                    {
                        icon: 'times',
                        title: '',
                        className: '',
                        onClick: () =>
                        {
                            onRemove(v);
                        },
                    },
                ]}
            >
                <FormGroup>
                    <FormControlLabel
                        label={'ID nạn nhân'}
                        control={(
                            <Input
                                value={victimsState[index].ID_NANNHAN}
                                disabled
                                onChange={(value: string) =>
                                {
                                    victimsState[index] = {
                                        ...victimsState[index],
                                        ID_NANNHAN: value,
                                    };

                                    onChange([...victimsState]);
                                }}
                            />
                        )}
                        required
                    />
                    <FormControlLabel
                        label={'Họ và tên'}
                        control={(
                            <Input
                                placeholder={'Nhập họ và tên'}
                                value={v.HOVATEN}
                                onChange={(value: string) =>
                                {
                                    victimsState[index] = {
                                        ...victimsState[index],
                                        HOVATEN: value,
                                    };

                                    onChange([...victimsState]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Số căn cước'}
                        control={(
                            <Input
                                placeholder={'Nhập số căn cước'}
                                value={v.SO_CANCUOC}
                                type={'number'}
                                onChange={(value: string) =>
                                {
                                    victimsState[index] = {
                                        ...victimsState[index],
                                        SO_CANCUOC: value,
                                    };
                                    onChange([...victimsState]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Nơi thường trú'}
                        control={(
                            <Input
                                placeholder={'Nhập nơi thường trú'}
                                value={v.NOI_THUONGTRU}
                                onChange={(value: string) =>
                                {
                                    victimsState[index] = {
                                        ...victimsState[index],
                                        NOI_THUONGTRU: value,
                                    };

                                    onChange([...victimsState]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Nơi tạm trú'}
                        control={(
                            <Input
                                placeholder={'Nhập nơi tạm trú'}
                                value={v.NOI_TAMTRU}
                                onChange={(value: any) =>
                                {
                                    victimsState[index] = {
                                        ...victimsState[index],
                                        NOI_TAMTRU: value,
                                    };
                                    onChange([...victimsState]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Số điện thoại'}
                        control={(
                            <Input
                                placeholder={'Nhập số điện thoại'}
                                value={v.DIENTHOAI}
                                onChange={(value: string) =>
                                {
                                    victimsState[index] = {
                                        ...victimsState[index],
                                        DIENTHOAI: value,
                                    };

                                    onChange([...victimsState]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Tình trạng'}
                        control={(
                            <AdvanceSelect
                                placeholder={'Chọn tình trạng nạn nhân'}
                                options={optionsFieldData.TINH_TRANG}
                                value={v.TINH_TRANG}
                                onChange={(value: any) =>
                                {
                                    victimsState[index] = {
                                        ...victimsState[index],
                                        TINH_TRANG: value,
                                    };

                                    onChange([...victimsState]);
                                }}
                            />
                        )}
                    />
                </FormGroup>
            </Section>
        );
    };

    const emptyVictimComponent = () =>
    {
        return (
            <Container style={{ height: '350px' }}>
                <Row
                    mainAxisAlignment={'center'}
                    crossAxisAlignment={'center'}
                    crossAxisSize={'max'}
                >
                    <i>Chưa nhập số lượng nạn nhân</i>
                </Row>
            </Container>
        );
    };

    const buildVictimForms = () =>
    {
        return victimsState.length
            ? victimsState.map((victim: VictimData, index: number) => buildVictimForm(victim, index))
            : emptyVictimComponent();
    };

    return (
        <Column>
            {buildVictimForms()}
        </Column>
    );
};

export default VictimsForm;
