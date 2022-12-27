import React from 'react';
import PropTypes from 'prop-types';

import { Container } from '@vbd/vui';

const Circle = ({ color, className }) =>
{
    return (
        <Container
            className={className}
            style={{
                borderRadius: '50%',
                height: '1rem',
                minHeight: '1rem',
                width: '1rem',
                minWidth: '1rem',
                backgroundColor: color,
            }}
        />
    );
};

Circle.propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
};

export default Circle;
