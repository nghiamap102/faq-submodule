import './ThemeIcon.scss';

import PropTypes from 'prop-types';
import React from 'react';

import { FAIcon } from '@vbd/vicon';

export const ThemeIcon = (props) =>
{
    return (
        <FAIcon
            className={`theme-icon ${props.className}`}
            icon={'circle'}
            type={'solid'}
            size={'1.5rem'}
            color={props.color}
            tooltip={props.tooltip || 'Chủ đề'}
        />
    );
};

ThemeIcon.propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
    tooltip: PropTypes.string,
};

ThemeIcon.defaultProps = {
    color: 'white',
    className: '',
};
