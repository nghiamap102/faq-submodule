import './MapContextGroup.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Button } from '@vbd/vui';

class CameraWallButton extends Component
{
    render()
    {
        const listActive = this.props.appStore.markerStore.listActive.filter((marker) => marker.type === 'Snapshot' || marker.type === 'Mjpeg' || marker.type === 'Stream');

        return listActive.length > 0 &&
            <Button
                className={'mcg-button'}
                text={`Tường camera (${listActive.length})`}
                isDefault
                onClick={() =>
                {
                    localStorage.setItem('cameras-wall', JSON.stringify(listActive));
                    window.open('/cameras-wall');
                }}
                icon={'external-link'}
            />;
    }
}

CameraWallButton = inject('appStore')(observer(CameraWallButton));
export { CameraWallButton };
