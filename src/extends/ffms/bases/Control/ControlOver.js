import './ControlOver.scss';

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { PopOver } from '@vbd/vui';

const ControlOver = ({
    className,
    control,
    visible,
    children,

    anchor,
    offset,

    onBackgroundClick,
    onClick,
    placement = 'right-top',
}) =>
{
    const ref = useRef();

    return (
        <div
            ref={ref}
            className={className}
        >
            <div
                onClick={onClick}
            >
                {control && control}
            </div>

            {
                visible && (
                    <PopOver
                        width ={'fix-content'}
                        anchorEl={ref}
                        anchor={anchor}
                        offset={offset}
                        minWidth={'160px'}
                        placement={placement}
                        onBackgroundClick={onBackgroundClick}
                    >
                        {children}
                    </PopOver>
                )}
        </div>
    );
};

ControlOver.propTypes = {
    className: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    control: PropTypes.element.isRequired,
    children: PropTypes.element.isRequired,
    onClick: PropTypes.func,
    onBackgroundClick: PropTypes.func,
    anchor: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    offset: PropTypes.array,
    placement: PropTypes.oneOf(['left-top' | 'left' | 'left-bottom' | 'right-top' | 'right' | 'right-bottom' | 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right']),
};
ControlOver.defaultProps = {
    className: '',
    mode: 'click',
    onClick: ()=>
    {},
    onBackgroundClick: ()=>
    {},
};

export default ControlOver;

