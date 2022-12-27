import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Axios from 'axios';

import {
    Button, FormControlLabel, FormGroup, Input, Section,
    Container,
    Panel, PanelBody, PanelFooter,
} from '@vbd/vui';

export const EnvironmentSettings = inject('appStore')(observer((props) =>
{
    const [environment, setEnvironment] = useState({});

    useEffect(() =>
    {
        // Add headers tenant to test if needed
        Axios.get('/api/tenants').then((response) =>
        {
            response?.data && setEnvironment(response.data);
        });
    }, []);

    function onClickSaveEnvironment()
    {
        // Add headers tenant to test if needed
        Axios.put('/api/tenants', environment);
    }

    function jsonToString(data, currentLevel = 0)
    {
        return data && Object.entries(data).map(([key, value]) =>
        {
            return (
                <Container
                    key={key}
                >
                    {
                        typeof value !== 'object' && value !== null
                            ? (
                                    <FormControlLabel
                                        label={key}
                                        labelWidth={'8rem'}
                                        control={(
                                            <Input
                                                className="form-control"
                                                value={value || ''}
                                                onChange={(val) =>
                                                {
                                                    data[key] = val;
                                                    setEnvironment({ ...environment });
                                                }}
                                            />
                                        )}
                                    />
                                )
                            : (
                                    <Container
                                        style={{ paddingLeft: `${currentLevel}rem` }}
                                    >
                                        <Section
                                            header={key}
                                        >
                                            <FormGroup>
                                                {jsonToString(value, currentLevel + 1)}
                                            </FormGroup>
                                        </Section>
                                    </Container>
                                )
                    }
                </Container>
            );
        });
    }

    return (
        <Panel>
            <PanelBody scroll>
                <Container style={{ maxWidth: '50rem' }}>
                    {environment && jsonToString(environment)}
                </Container>
            </PanelBody>
            <PanelFooter>
                <Button
                    color={'primary'}
                    text="Lưu"
                    onClick={onClickSaveEnvironment}
                />
            </PanelFooter>

        </Panel>
    );
}));
