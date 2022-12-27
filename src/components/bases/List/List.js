import './ListItem.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from 'components/bases/Icon/FAIcon';
import { T } from 'components/bases/Translate/Translate';

const ICON_POSITION_ENUM = {
    top: 'flex-start',
    middle: 'center',
    bottom: 'flex-end',
};

export class ListItem extends Component
{
    render()
    {
        return (
            <div
                className={`${this.props.disableSelection ? 'list-item-reader' : 'list-item-container'} ${this.props.active ? 'active' : ''} ${this.props.className || ''}`}
                onClick={this.props.onClick}
            >
                <div
                    className="list-item-icon"
                    style={{ alignSelf: ICON_POSITION_ENUM[this.props.iconPosition] }}
                >
                    <div className="list-icon list-item-icon-inner">
                        {
                            this.props.iconUrl && (
                                <img
                                    alt={'icon-url'}
                                    src={this.props.iconUrl}
                                />
                            )}

                        {
                            this.props.iconClass && (
                                <FAIcon
                                    icon={this.props.iconClass}
                                    color={this.props.iconColor}
                                    type={this.props.iconType}
                                    size={'1.125rem'}
                                />
                            )}

                        {this.props.icon && this.props.icon}
                    </div>
                </div>

                <div className="list-item-content">
                    <div className="list-item-title ml-ellipsis">
                        <T>{this.props.label}</T>
                        {this.props.isImportant && <span style={{ color: 'red' }}>&nbsp;(*)</span>}
                    </div>

                    {
                        this.props.sub && (
                            <div className="list-item-subtitle-line ml-ellipsis">
                                <div className="list-item-subtitle">
                                    <T>{this.props.sub}</T>
                                </div>
                            </div>
                        )}
                </div>

                {this.props.trailing && (
                    <div className="list-item-secondary">
                        {this.props.trailing}
                    </div>
                )}

            </div>
        );
    }
}

ListItem.propTypes = {
    className: PropTypes.string,
    active: PropTypes.bool,
    isImportant: PropTypes.bool,
    iconUrl: PropTypes.string,
    iconClass: PropTypes.string,
    iconColor: PropTypes.string,
    iconType: PropTypes.oneOf(['solid', 'regular', 'light']),
    icon: PropTypes.node,
    label: PropTypes.any,
    sub: PropTypes.any,
    // true to disable selection model
    disableSelection: PropTypes.bool,
    iconPosition: PropTypes.oneOf(['top', 'middle', 'bottom']),
    trailing: PropTypes.node,
};

ListItem.defaultProps = {
    isImportant: false,
    disableSelection: false,
    iconType: 'light',
    iconPosition: 'middle',
};
