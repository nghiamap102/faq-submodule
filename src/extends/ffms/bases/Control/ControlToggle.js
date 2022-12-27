import './ControlToggle.scss';

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import ToggleContent from 'extends/ffms/bases/ToggleContent/ToggleContent';

const ControlToggle = ({ control, children, onClick, className, visible,duration }) =>
{
    const ref = useRef(null);

    return (
        <div
            ref={ref}
            className={(className ? className : '') + ' toggle-container'}
            onClick={onClick}
        >
            <div>
                {control && control}
            </div>

            {
                children && (
                    <ToggleContent
                        anchorEl={ref}
                        isVisible={visible}
                        className={className}
                        duration={duration}
                    >
                        { children }
                    </ToggleContent>
                )
            }
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
    duration: 500,
    onClick: ()=>
    {},
    onBackgroundClick: ()=>
    {},
};

export default ControlToggle;

