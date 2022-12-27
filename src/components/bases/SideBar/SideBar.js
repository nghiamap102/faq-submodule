import './SideBar.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BorderPanel } from '@vbd/vui';

export class SideBar extends Component
{
    render()
    {
        return (
            <BorderPanel
                className={`side-bar ${this.props.className}`}
                width={this.props.width}
                flex={this.props.flex}
            >
                {this.props.children}
            </BorderPanel>
        );
    }
}

SideBar.propTypes = {
    className: PropTypes.string,
    width: PropTypes.string,
    flex: PropTypes.number,
};

SideBar.defaultProps = {
    className: '',
    width: '200px',
    flex: 0,
};
