import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Pannellum } from 'pannellum-react';

export class Panorama extends Component
{
    render()
    {
        const { width, height } = this.props;

        return (
            <Pannellum
                width={width}
                height={height}
                image={this.props.img}
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
                showZoomCtrl={false}
            />
        );
    }
}

Panorama.propTypes = {
    img: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
};

Panorama.defaultProps = {
    img: '',
    width: '100%',
    height: '100%',
};
