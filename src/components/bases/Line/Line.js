import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Line extends Component
{
    render()
    {
        return (
            <div
                className={this.props.className}
                style={{
                    backgroundColor: this.props.color,
                    width: this.props.width,
                    height: this.props.height
                }}
            />
        );
    }
}

Line.propTypes = {
    className: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string,
    color: PropTypes.string
};

Line.defaultProps = {
    className: '',
    height: '1px',
    width: '',
    color: 'white'
};
