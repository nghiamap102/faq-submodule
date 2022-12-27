import './RatioNumber.scss';
import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'extends/ffms/pages/base/Tooltip';

const RatioNumber = ({ label, value, description, isTooltip })=>
{
    return (
        <Tooltip
            placement="top"
            trigger={isTooltip ? ['click','hover'] : []}
            tooltip={description}
            tag='div'
            className='ratio-number'
        >
            <span>{value}</span>
            <div>{label}</div>
        </Tooltip>
    );
};

RatioNumber.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    description: PropTypes.string,
    isTooltip: PropTypes.bool
};

RatioNumber.defaultProps = {
    isTooltip: false
};

export default RatioNumber;
