import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    T,
    AppBody,
} from '@vbd/vui';

import { LiveViewContent } from 'components/app/FaceAlert/LiveView/LiveViewContent';

class CameraWall extends Component
{
    state = {
        cameras: [],
    };

    componentDidMount()
    {
        let cameras = JSON.parse(localStorage.getItem('cameras-wall'));

        if (cameras)
        {
            cameras = cameras.map((camera) =>
            {
                return {
                    id: camera.id,
                    name: camera.title,
                    type: camera.type,
                    data: camera,
                };
            });

            this.setState({ cameras });
        }
    }

    handleClose = (camId) =>
    {
        const cameras = this.state.cameras.filter((camera) => camera.id !== camId);
        this.setState({ cameras });
    };

    render()
    {
        return this.state.cameras.length === 0
            ? (
                    <Container>
                        <h1><T>Chưa có camera được chọn</T></h1>
                    </Container>
                )
            : (
                    <AppBody>
                        <LiveViewContent
                            cameras={this.state.cameras}
                            onClose={this.handleClose}
                        />
                    </AppBody>
                );
    }
}

CameraWall = inject('appStore')(observer(CameraWall));
export default CameraWall;
