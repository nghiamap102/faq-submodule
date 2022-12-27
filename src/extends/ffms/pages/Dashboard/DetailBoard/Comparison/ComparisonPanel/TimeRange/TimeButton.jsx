import PropTypes from 'prop-types';
import './TimeRange.scss';
import React, { useState, useEffect } from 'react';
import { FAIcon } from '@vbd/vicon';

const TimeButton = ({ icon,onClick }) =>
{
    return (
        <>
            <button
                className="time-button"
                text=''
                onClick={onClick}
            >
                <FAIcon
                    icon={icon}
                    
                />
            </button>
        </>
    );
};

TimeButton.propTypes = {
  icon: PropTypes.any,
  onClick: PropTypes.any
}

export default TimeButton;

