import './DescriptionGroup.scss';

import PropTypes from 'prop-types';
import React from 'react';

export const DescriptionGroup = ({ direction = 'column', children, className = '' }) =>
{
    return (
        <div
            className={`des-group des-group-${direction} ${className}`}
        >
            {children}
        </div>
    );
};

DescriptionGroup.propTypes = {
    className: PropTypes.string,
    direction: PropTypes.oneOf(['row', 'column']),
};
