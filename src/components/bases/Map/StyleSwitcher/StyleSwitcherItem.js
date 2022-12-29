import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Image } from 'components/bases/Image/Image';
import { TB1 } from 'components/bases/Text/Text';

export default class StyleSwitcherItem extends Component
{
    static propTypes = {
        mapStyle: PropTypes.object.isRequired,
        isActive: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired
    };

    render()
    {
        const { onClick, isActive, mapStyle } = this.props;
        const { label, image } = mapStyle;

        return (
            <div
                className={`style-switcher-popup-item ${isActive ? 'active' : ''} `}
                onClick={() => onClick(mapStyle)}
            >
                <Image
                    className={'style-switcher-popup-image'}
                    id={'image'}
                    src={image}
                    alt={label}
                    width={'60px'}
                    height={'60px'}
                />
                <TB1 className={'style-switcher-popup-label'}>{label}</TB1>
            </div>
        );
    }
}
