import './LiveViewContent.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Container,
    ResponsiveGrid, ResponsiveGridItem,
    PanelHeader,
    Camera,
} from '@vbd/vui';

export class LiveViewContent extends Component
{
    handleClose = (camId) =>
    {
        if (this.props.onClose)
        {
            this.props.onClose(camId);
        }
    };

    render()
    {
        return (
            <ResponsiveGrid>
                {
                    this.props.cameras.map((camera) => (
                        <ResponsiveGridItem
                            key={camera.id}
                            className={'live-view-item'}
                        >
                            <Container className={'live-view-item-camera'}>
                                <PanelHeader
                                    actions={[
                                        { icon: 'times', onClick: this.handleClose.bind(this, camera.id) },
                                    ]}
                                >
                                    {camera.name || camera.title}
                                </PanelHeader>
                                <Container className={'live-view-item-body'}>
                                    <Camera
                                        className={'live-view-item-body'}
                                        type={camera.type}
                                        data={camera.data}
                                    />
                                </Container>
                            </Container>
                        </ResponsiveGridItem>
                    ))
                }
            </ResponsiveGrid>
        );
    }
}

LiveViewContent.propTypes = {
    className: PropTypes.string,
    cameras: PropTypes.array,
    onClose: PropTypes.func,
};
