import './MapContextGroup.scss';

import React, { Component } from 'react';

import { Container } from '@vbd/vui';

import { InviteButton } from 'components/app/MapContextButton/InviteButton';
import { CameraWallButton } from 'components/app/MapContextButton/CameraWallButton';

export class MapContextGroup extends Component
{
    render()
    {
        return (
            <Container className={'mcg-container'}>
                <InviteButton />
                <CameraWallButton />
            </Container>
        );
    }
}
