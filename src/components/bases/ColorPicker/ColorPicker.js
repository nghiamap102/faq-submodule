import './ColorPicker.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SketchPicker } from 'react-color';

import { AnchorOverlay } from 'components/bases/Modal/AnchorOverlay';

export class ColorPicker extends Component
{
    state = {
        displayColorPicker: false,
    };

    controlRef = React.createRef(null);

    handleClick = () =>
    {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () =>
    {
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color) =>
    {
        if (typeof this.props.onChange === 'function')
        {
            this.props.onChange(color[this.props.changeType]);
        }
    };

    handleClosePopup = () =>
    {
        this.setState({ displayColorPicker: false });
    }

    render()
    {
        return (
            <div className={'custom-color-picker'}>
                <div
                    ref={this.controlRef}
                    className={'color-container'}
                    onClick={this.handleClick}
                >
                    <div
                        className={'color-content'}
                        style={{ backgroundColor: this.props.value }}
                    />
                </div>
                {
                    this.state.displayColorPicker && (
                        <AnchorOverlay
                            anchorEl={this.controlRef}
                            onBackgroundClick={this.handleClosePopup}
                        >
                            <div className={'color-popup'}>
                                <div
                                    className={'color-popup-cover'}
                                    onClick={this.handleClose}
                                />
                                <SketchPicker
                                    color={this.props.value}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </AnchorOverlay>
                    )
                }
            </div>


        );
    }
}

ColorPicker.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    changeType: PropTypes.oneOf(['hex', 'hsl', 'hsv', 'rgb']),
    onChange: PropTypes.func,
};

ColorPicker.defaultProps = {
    className: '',
    value: 'black',
    changeType: 'hex',
    onChange: () =>
    {
    },
};
