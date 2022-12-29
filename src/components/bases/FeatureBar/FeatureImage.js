import './FeatureImage.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Image } from 'components/bases/Image/Image';
import { withI18n } from 'components/bases/I18n/withI18n';

class FeatureImage extends Component
{
    handleClick = (event) =>
    {
        this.props.onClick(this.props, event);
    };

    render()
    {
        return (
            <button
                className={`feature-item feature-image ${this.props.active ? 'active' : ''} ${this.props.className}`}
                title={this.props.t(this.props.tooltip)}
                onClick={this.handleClick}
            >
                <Image
                    src={this.props.src}
                    width={'1.5rem'}
                    height={'1.5rem'}
                    altSrc={'icon.png'}
                />
            </button>
        );
    }
}

FeatureImage.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    src: PropTypes.string.isRequired,
    active: PropTypes.bool,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
};

FeatureImage.defaultProps = {
    id: '',
    className: '',
    badgeCount: null,
    active: false,
    icon: '',
    onClick: () =>
    {
    },
};

FeatureImage = withI18n(FeatureImage);
export { FeatureImage };
