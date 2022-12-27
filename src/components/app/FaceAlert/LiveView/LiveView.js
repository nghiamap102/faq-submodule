import './LiveView.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Container, BorderPanel, ScrollView } from '@vbd/vui';

import { LiveViewSearch } from './LiveViewSearch';
import { LiveViewContent } from './LiveViewContent';

import { CameraService } from 'services/camera.service';

class LiveView extends Component
{
    faceAlertStore = this.props.appStore.faceAlertStore;

    cameraService = new CameraService();

    state = {
        cameras: [],
    };

    componentDidMount()
    {
        this.cameraService.getStreamCameraList().then((rs) =>
        {
            if (rs)
            {
                const cameras = rs.data.map((c) =>
                {
                    return {
                        id: c.id,
                        name: c.cameraName,
                        type: 'Stream',
                        data: c,
                    };
                });

                this.setState({ cameras });
            }
        });
    }

    handleChange = (camId, key, value) =>
    {
        const cameras = this.state.cameras.slice();
        const camera = cameras.find((cam) => cam.id === camId);

        if (camera)
        {
            camera[key] = value;

            this.setState({ cameras });
        }
    };

    handleClose = (camId) =>
    {
        this.handleChange(camId, 'isLiveView', false);
    };

    render()
    {
        const activeCameras = Array.isArray(this.state.cameras) ? this.state.cameras.filter((c) => c.isLiveView) : [];

        return (
            <Container className={'face-alert-container'}>
                <ScrollView options={{ suppressScrollX: true }}>
                    <LiveViewSearch
                        cameras={this.state.cameras}
                        onChange={this.handleChange}
                    />
                </ScrollView>
                <BorderPanel flex={1}>
                    <LiveViewContent
                        className={this.faceAlertStore.isCollapseSearch ? 'full-content' : ''}
                        cameras={activeCameras}
                        onClose={this.handleClose}
                    />
                </BorderPanel>
            </Container>
        );
    }
}

LiveView = inject('appStore')(observer(LiveView));
export { LiveView };
