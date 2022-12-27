import './Menu.scss';
import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = ({ children, onClick, active, className, ...props }) =>
{
    return (
        <div
            className={`menu-item-custom ${active ? 'menu-active' : ''} ${className ?? ''}`}
            onClick={onClick}
            {...props}
        >
            {children ? children : props.label}
        </div>
    );
};

MenuItem.propTypes = {
    label: PropTypes.any,
    children: PropTypes.any,
    onClick: PropTypes.func,
    style: PropTypes.object,
    active: PropTypes.bool,
    className: PropTypes.string
};

export default MenuItem;
