import './Process.scss';

import React, { Component } from 'react';

import {
    Popup,
    Container,
    Button,
} from '@vbd/vui';

export class Process extends Component
{
    render()
    {
        const { title, message, content, onCancel, width } = this.props;

        return (
            <Popup
                className={'process-popup'}
                title={title}
                width={width ? width : '600px'}
                onClose={onCancel}
            >
                <Container className={'process-body'}>
                    {message}
                    {content}
                </Container>

                <Container className={'process-footer'}>
                    <Button
                        text={'Hủy'}
                        onClick={onCancel}
                    />
                </Container>
            </Popup>
        );
    }
}
