import './ControlToggle.scss';

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ToggleContent from '../ToggleContent/ToggleContent';

const ControlToggle = ({ control, children, onClick, className, visible,duration }) =>
{
    const ref = useRef(null);

    return (
        <div
            ref={ref}
            className={className + ' toggle-container'}
        >
            <div onClick={onClick} >
                {control && control}
            </div>

            <ToggleContent
                anchorEl={ref}
                isVisible={visible}
                className={className}
                duration={duration}
            >
                { children && children }
            </ToggleContent>
        </div>
    );
};

ControlToggle.propTypes = {
    className: PropTypes.string,
    duration: PropTypes.number,

    visible: PropTypes.bool.isRequired,
    control: PropTypes.element.isRequired,

    onClick: PropTypes.func,
    onBackgroundClick: PropTypes.func,

    children: PropTypes.element,
};
ControlToggle.defaultProps = {
    className: '',
    duration: 500,
    onClick: ()=>
    {},
    onBackgroundClick: ()=>
    {},
};

export default ControlToggle;

