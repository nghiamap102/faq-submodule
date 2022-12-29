import React from 'react';
import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

import './Nav.scss';

interface NavProps {
    className?: string,
    direction?: 'column' | 'row',
    width?: string | number,
    height?: string | number,
    fontSize?: string | number,
    actions?: [] | {
        icon?: string,
        iconPosition?: 'start' | 'end',
        iconSize?: string,
        iconType?: 'solid' | 'regular' | 'light',
    
        label?: string,
        labelPosition?: 'left' | 'right' | 'center',
    
        onClick?: void,
    }[],
}

export const Nav = (props: NavProps) =>
{
    const {
        className,
        direction = 'column',
        width = 'auto',
        height = 'auto',
        fontSize = '1rem',
        actions = [],
    } = props;

    return (
        <div className={`nav nav--direction-${direction} ${className}`} style={{ width: width, height: height, fontSize: fontSize }}>
            {actions.map((action, i) =>
                <NavItem
                    key={i}
                    icon={action.icon}
                    iconPosition={action.iconPosition}
                    iconSize={action.iconSize}
                    iconType={action.iconType}
                    label={action.label}
                    labelPosition={action.labelPosition}
                    onClick={action.onClick}
                />,
            )}
        </div>
    );
};

interface NavItemProps {
    icon?: string,
    iconPosition?: 'start' | 'end',
    iconSize?: string,
    iconType?: 'solid' | 'regular' | 'light',

    label?: string,
    labelPosition?: 'left' | 'right' | 'center',

    direction?: 'row' | 'column',

    onClick?: void,
    
}

export const NavItem = (props: NavItemProps) =>
{
    const {
        icon,
        iconPosition = 'start',
        iconSize = '1rem',
        iconType = 'regular',

        label,
        labelPosition = 'center',

        direction = 'row',

        onClick = () =>
        {},
    } = props;

    return (
        <div onClick={onClick} className={`nav-item nav-item__direction-${direction}`}>
            {icon && iconPosition === 'start' ? (
                <div className={`nav-item__icon icon-position--${iconPosition}`}>
                    <FAIcon icon={icon} type={iconType} size={iconSize}/>
                </div>
            ) : ''}

            {label ? (
                <div className={`nav-item__label label-position--${labelPosition}`}>
                    <T>{label}</T>
                </div>
            ) : ''}

            {icon && iconPosition === 'end' ? (
                <div className={`nav-item__icon icon-position--${iconPosition}`}>
                    <FAIcon icon={icon} type={iconType} size={iconSize}/>
                </div>
            ) : ''}
        </div>
    );
};
