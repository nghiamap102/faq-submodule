import './DescriptionItem.scss';

import React from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

const DescriptionItem = (props) =>
{
    const {
        className,
        icon,
        iconClassName,
        iconType,
        iconSize,
        iconColor,
        direction,
        label,
        labelWidth,
        labelLocation,
    } = props;

    return (
        <div className={`des-item des-item-${direction} ${className}`}>
            {
                icon && (
                    <FAIcon
                        icon={icon}
                        className={iconClassName}
                        type={iconType}
                        size={iconSize}
                        color={iconColor}
                    />
                )
            }
            {
                label && (
                    <div
                        className={`des-item-label des-item-label-align-${labelLocation}`}
                        style={{ flex: direction === 'row' ? `0 0 ${labelWidth}` : '' }}
                    >
                        <T>{label}</T>
                    </div>
                )
            }
            <div>
                {props.children}
            </div>
        </div>
    );
};

DescriptionItem.propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    iconClassName: PropTypes.string,
    iconType: PropTypes.oneOf(['solid', 'regular', 'light']),
    iconSize: PropTypes.string,
    iconColor: PropTypes.string,
    label: PropTypes.any,
    labelWidth: PropTypes.string,
    labelLocation: PropTypes.oneOf(['left', 'right']),
    direction: PropTypes.oneOf(['row', 'column']),
    children: PropTypes.node,
};

DescriptionItem.defaultProps = {
    direction: 'row',
    iconType: 'solid',
    iconSize: '1rem',
    labelWidth: '70px',
    labelLocation: 'left',
    className: '',
};

export { DescriptionItem };
