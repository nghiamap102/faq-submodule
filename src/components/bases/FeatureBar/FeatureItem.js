import './FeatureItem.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';

export class FeatureItem extends Component
{
    handleClick = (e) =>
    {
        this.props.onClick(this.props, e);
    };

    render()
    {
        const badge = this.props.badgeCount === 0 ? null : this.props.badgeCount;

        return (
            <button
                className={`feature-item ${this.props.active ? 'active' : ''} ${this.props.className}`}
                badge-count={badge}
                title={this.props.tooltip}
                onClick={this.handleClick}
            >
                {
                    this.props.content || (
                        <FAIcon
                            icon={this.props.icon}
                            size={'1.25rem'}
                        />
                    )}
            </button>
        );
    }
}

FeatureItem.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string.isRequired,
    content: PropTypes.node,
    active: PropTypes.bool,
    badgeCount: PropTypes.number,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
};

FeatureItem.defaultProps = {
    id: '',
    className: '',
    badgeCount: null,
    active: false,
    icon: '',
    onClick: () =>
    {
    },
};
