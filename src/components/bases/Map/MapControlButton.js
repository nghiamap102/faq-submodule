import './MapControlButton.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'components/bases/Button/Button';

export class MapControlButton extends Component
{
    render()
    {
        return (
            <Button
                className={`map-control map-control-button ${this.props.active ? 'active' : ''}`}
                innerRef={this.props.innerRef}
                size={'sm'}
                iconSize={'md'}
                icon={this.props.icon}
                onlyIcon
                onClick={this.props.onClick}
            />
        );
    }
}

MapControlButton.propTypes = {
    active: PropTypes.bool,
    onClick: PropTypes.func,
    icon: PropTypes.string,
};
