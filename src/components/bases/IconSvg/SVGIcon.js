import './SVGIcon.scss';

import data1 from './icondata/userinterface.json';
import data2 from './icondata/locationandmap.json';
import data3 from './icondata/direction.json';
import data4 from './icondata/system.json';
import data5 from './icondata/category.json';
import data6 from './icondata/logo.json';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SVG extends Component
{
    render()
    {
        const { name, className, width, height, viewBox, fill, fillRule, xmlns, xmlnsXlink, onClick, stroke, strokeWidth, strokeOpacity } = this.props;

        return (
            <svg
                name={name}
                width={width}
                height={height}
                className={`iconsvg ${className}`}
                fill={fill}
                viewBox={viewBox}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeOpacity={strokeOpacity}
                style={{
                    fillRule: fillRule,
                    xmlns: xmlns,
                    xmlnsXlink: xmlnsXlink,
                    cursor: (onClick ? 'pointer' : '')
                }}
                onClick={onClick}
            >
                {this.props.children || getPath(name)}
            </svg>
        );
    }
}

const getPath = name =>
{
    const data = data1.concat(data2, data3, data4, data5, data6);
    const icon = data.find(icon => icon.name === name);

    if (!icon)
    {
        return <path />;
    }

    return icon.path.map((ic, i) =>
    {
        return (
            <path
                key={i} fill={ic.fill} d={ic.d}
                opacity={ic.opacity}
            />
        );
    });
};

SVG.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    viewBox: PropTypes.string,
    fill: PropTypes.string,
    fillRule: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    strokeOpacity: PropTypes.number,
    xmlns: PropTypes.string,
    xmlnsXlink: PropTypes.string,
    onClick: PropTypes.func
};

SVG.defaultProps = {
    name: 'default',
    className: '',
    width: '24px',
    height: '24px',
    viewBox: '0 0 24 24',
    fill: 'var(--black)',
    fillRule: 'evenodd',
    strokeWidth: 0,
    xmlns: 'http://www.w3.org/2000/svg',
    xmlnsXlink: 'http://www.w3.org/1999/xlink',
    onClick: () =>
    {
    }
};

export class SVGIcon extends Component
{
    render()
    {

        const { disabled, name, className, width, height, borderRadius, backgroundColor, iconColor, size } = this.props;

        return (
            <div
                className={`${className} svg-icon svg-icon--${size}`}
                width={width}
                height={height}
                disabled={disabled}
                style={{ borderRadius: borderRadius, backgroundColor: backgroundColor }}
            >
                <SVG name={name} fill={iconColor} />
            </div>
        );
    }
}

SVGIcon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    borderRadius: PropTypes.string,
    backgroundColor: PropTypes.string
};

SVGIcon.defaultProps = {
    name: '',
    className: '',
    size: 'small',
    borderRadius: '50%',
    iconColor: 'white',
    backgroundColor: 'black',
    disabled: false
};
