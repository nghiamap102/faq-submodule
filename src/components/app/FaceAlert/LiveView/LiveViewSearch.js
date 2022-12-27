import React, { Component } from 'react';

import {
    Container,
    FAIcon,
    CheckBox,
    FormGroup,
} from '@vbd/vui';

export class LiveViewSearch extends Component
{
    handleChangeData = (id, key, value) =>
    {
        if (this.props.onChange)
        {
            this.props.onChange(id, key, value);
        }
    };

    render()
    {
        return (
            <Container className={'live-view-search'}>
                {
                    Array.isArray(this.props.cameras) && this.props.cameras.map((camera) => (
                        <Container
                            key={camera.id}
                            className={'camera-item'}
                        >
                            <FormGroup className={'camera-name'}>
                                <CheckBox
                                    label={camera.name}
                                    checked={camera.isChoosing}
                                    onChange={() => this.handleChangeData(camera.id, 'isChoosing', !camera.isChoosing)}
                                />
                            </FormGroup>
                            <Container className={'camera-status'}>
                                <FAIcon
                                    type={'solid'}
                                    icon={!camera.isLiveView ? 'video-slash' : 'video'}
                                    color={camera.isLiveView ? 'var(--success-color)' : ''}
                                    onClick={() => this.handleChangeData(camera.id, 'isLiveView', !camera.isLiveView)}
                                />
                            </Container>
                        </Container>
                    ),
                    )
                }
            </Container>
        );
    }
}
