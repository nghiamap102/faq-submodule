import './RatioNumber.scss';
import React from 'react';
import PropTypes from 'prop-types';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

const RatioNumber = ({ label, value, description, isTooltip })=>
{
    return (
        <PopperTooltip
            placement="top"
            trigger={isTooltip ? ['click','hover'] : []}
            tooltip={description}
            tag='div'
            tagClassName='ratio-number'
        >
            <span>{value}</span>
            <div>{label}</div>
        </PopperTooltip>
    );
};

RatioNumber.propTypes = {
    label: PropTypes.string,
    value: PropTypes.any,
    description: PropTypes.string,
    isTooltip: PropTypes.bool,
};

RatioNumber.defaultProps = {
    isTooltip: false,
};

export default RatioNumber;
