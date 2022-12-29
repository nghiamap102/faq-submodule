import './ToolBarToggleButton.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ToolBarToggleButton extends Component
{
    render()
    {
        return (
            <div
                className={`tgb-container ${this.props.active ? 'active' : ''} ${this.props.disabled ? 'disabled' : ''}`}
                onClick={this.props.disabled
                    ? () =>
                        {
                        }
                    : this.props.onClick}
            >
                <span className="tgb-button">
                    <i className={`tgb-icon ${this.props.icon}`} />
                </span>
            </div>
        );
    }
}

ToolBarToggleButton.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

ToolBarToggleButton.defaultProps = {
    className: '',
    disabled: false,
};

export class ToolBarToggleButtonGroup extends Component
{
    render()
    {
        const children = React.Children.map(this.props.children, child =>
        {
            return React.cloneElement(child, {
                disabled: this.props.disabled,
            });
        });
        return (
            <div className={`tgb-group ${this.props.disabled ? 'disable' : ''}`}>
                {children}
            </div>
        );
    }
}

ToolBarToggleButtonGroup.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

ToolBarToggleButtonGroup.defaultProps = {
    className: '',
    disabled: false,
};
