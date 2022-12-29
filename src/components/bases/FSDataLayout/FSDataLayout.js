import './FSDataLayout.scss';

import React from 'react';
import PropTypes from 'prop-types';

export const FSDataContainer = ({ className, children }) =>
{
    return (
        <div className={`fs-data-container ${className}`}>
            {children}
        </div>
    );
};
FSDataContainer.propTypes = {
    className: PropTypes.string
};

FSDataContainer.defaultProps = {
    className: ''
};

export const FSDataBody = ({ className, children, layout, verticalLine }) =>
{
    return (
        <div className={`fs-data-body ${layout} ${className}`}>
            {children}
        </div>
    );
};
FSDataBody.propTypes = {
    className: PropTypes.string,
    verticalLine: PropTypes.bool,
    layout: PropTypes.string
};

FSDataBody.defaultProps = {
    className: '',
    verticalLine: false,
    layout: ''

};

export const FSDataContent = ({ className, children }) =>
{
    return (
        <div className={`fs-data-content ${className}`}>
            {children}
        </div>
    );
};
FSDataContent.propTypes = {
    className: PropTypes.string
};

FSDataContent.defaultProps = {
    className: ''
};

export const VerticalLine = () =>
{
    return (
        <i className={'vertical-line '}/>
    );
};


