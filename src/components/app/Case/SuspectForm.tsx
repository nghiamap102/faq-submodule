import React, { useEffect, useState } from 'react';

import {
    FormControlLabel, FormGroup, Input,
    Container, Row, Column,
    Section,
} from '@vbd/vui';
import { SuspectData } from './CaseFormPopup';
export type SuspectsFormProps = {
    onChange?: Function,
    data?: SuspectData[],
    onRemove: Function,
}

const SuspectsForm: React.FC<SuspectsFormProps> = (props) =>
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
    const [suspectsState, setSuspectsState] = useState<any>(data);

    useEffect(() =>
    {
        setSuspectsState(data);
    }, [data]);

    const buildSuspectForm = (suspect: SuspectData, index: number) =>
    {
        return (
            <Section
                key={index}
                header={`Đối tượng ${index + 1}`}
                actions={[
                    {
                        icon: 'times',
                        onClick: () =>
                        {
                            onRemove(suspect);
                        },
                    },
                ]}
            >
                <FormGroup>
                    <FormControlLabel
                        label={'ID đối tượng'}

                        control={(
                            <Input
                                placeholder={''}
                                value={suspect.ID_DOITUONG}
                                disabled
                                onChange={(value: any) =>
                                {
                                    suspectsState[index] = {
                                        ...suspectsState[index],
                                        ID_DOITUONG: value,
                                    };
                                    onChange([...suspectsState]);
                                }}
                            />
                        )}
                        required
                    />
                    <FormControlLabel
                        label={'Họ và tên'}
                        control={(
                            <Input
                                accept={'text'}
                                placeholder={'Nhập họ và tên'}
                                value={suspect.HOVATEN}
                                onChange={(value: any) =>
                                {
                                    suspectsState[index] = {
                                        ...suspectsState[index],
                                        HOVATEN: value,
                                    };
                                    onChange([...suspectsState]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Số căn cước'}
                        control={(
                            <Input
                                type={'number'}
                                placeholder={'Nhập số căn cước'}
                                value={suspect.SO_CANCUOC || ''}
                                onChange={(value: any) =>
                                {
                                    suspectsState[index] = {
                                        ...suspectsState[index],
                                        SO_CANCUOC: value,
                                    };
                                    onChange([...suspectsState]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Nơi thường trú'}
                        control={(
                            <Input
                                placeholder={'Nơi thường trú'}
                                value={suspect.NOI_THUONGTRU}
                                onChange={(value: any) =>
                                {
                                    suspectsState[index] = {
                                        ...suspectsState[index],
                                        NOI_THUONGTRU: value,
                                    };
                                    onChange([...suspectsState]);
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label={'Số điện thoại'}
                        control={(
                            <Input
                                placeholder={'Nhập số điện thoại'}
                                value={suspect.DIENTHOAI}
                                onChange={(value: any) =>
                                {
                                    suspectsState[index] = {
                                        ...suspectsState[index],
                                        DIENTHOAI: value,
                                    };
                                    onChange([...suspectsState]);
                                }}
                            />
                        )}
                    />
                </FormGroup>
            </Section>
        );
    };

    const emptySuspectComponent = () =>
    {
        return (
            <Container style={{
                height: '350px',
            }}
            >
                <Row
                    mainAxisAlignment={'center'}
                    crossAxisAlignment={'center'}
                    crossAxisSize={'max'}
                >
                    <i>Chưa nhập số lượng đối tượng</i>
                </Row>
            </Container>
        );
    };

    const buildSuspectForms = () =>
    {
        return suspectsState.length
            ? suspectsState.map((suspect: SuspectData, index: number) => buildSuspectForm(suspect, index))
            : emptySuspectComponent();
    };

    return (
        <Column>
            {buildSuspectForms()}
        </Column>
    );
};

export default SuspectsForm;
