import './SVGIcon.scss';

import data1 from './icondata/datatype.json';
import data2 from './icondata/category.json';
import data3 from './icondata/newicon.json';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class SVGIconPath extends Component
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
                    cursor: (onClick ? 'pointer' : ''),
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
    const data = data1.concat(data2, data3);
    const icon = data.find(icon => icon.name === name);

    if (!icon)
    {
        return <path />;
    }

    return icon.path.map((ic, i) =>
    {
        return (
            <path
                key={i}
                fill={ic.fill}
                d={ic.d}
                opacity={ic.opacity}
            />
        );
    });
};

SVGIconPath.propTypes = {
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
    onClick: PropTypes.func,
};

SVGIconPath.defaultProps = {
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
    },
};
