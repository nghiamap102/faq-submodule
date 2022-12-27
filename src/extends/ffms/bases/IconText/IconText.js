import './IconText.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { useI18n } from '@vbd/vui';

const IconText = (props) =>
{
    const { t } = useI18n();
    const { border, size, color, backgroundColor, disabled, onClick, tooltip } = props;
    const sizeNumb = parseFloat(size);
    const sizeUnit = size.match(/[a-zA-Z]+/g);


    const handleClick = (event) =>
    {
        props.onClick && props.onClick(props, event);
    };

    let content = props.icon;

    if (content && content.length > 2)
    {
        content = content.substr(0, 2);
    }
    return (
        <div
            className={`text-container ${props.className}`}
            style={{
                fontSize: size,
                color: color,
                width: (sizeNumb * 2) + sizeUnit,
                height: (sizeNumb * 2) + sizeUnit,
                lineHeight: (sizeNumb * 2) + sizeUnit,
                backgroundColor: backgroundColor,
                cursor: disabled ? 'not-allowed' : (onClick ? 'pointer' : ''),
                ...border !== 'none' && { border: '1px solid var(--text-color)' },
                ...border === 'circle' && { borderRadius: '0.75rem' },
            }}
            title={t(tooltip)}
            onClick={disabled ? null : handleClick}
        >
            {content}
        </div>
    );
};

IconText.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,

    icon: PropTypes.string.isRequired,
    size: PropTypes.string,
    backgroundColor: PropTypes.string,
    border: PropTypes.oneOf['none', 'normal', 'circle'],

    title: PropTypes.string,
    onClick: PropTypes.func,
};

IconText.defaultProps = {
    id: '',
    className: '',
    icon: '',
    color: 'var(--contrast-color)',
    size: '0.75rem',
    border: 'none',

    onClick: () =>
    {
    },
};

export default IconText;
