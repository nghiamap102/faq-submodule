import './ProgressLinear.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ProgressLinear extends Component
{
    render()
    {
        const { width, loading, trackColor, loadingColor, backgroundColor } = this.props;
        return (
            <div
                className="progress-linear-wrap"
                style={{ borderColor: backgroundColor, width: width }}
            >
                <div
                    className="progress-linear"
                    style={{ backgroundColor: loading ? 'transparent' : `${trackColor}` }}
                >
                    {
                        loading &&
                        <div
                            className="loading-progress" role="progressbar"
                            style={{ backgroundColor: backgroundColor, width: width }}
                        >
                            <div
                                className="loading-progress-bar loading-track1"
                                style={{ backgroundColor: loadingColor }}
                            />
                            <div
                                className="loading-progress-bar loading-track2"
                                style={{ backgroundColor: loadingColor }}
                            />
                        </div>
                    }
                </div>
            </div >
        );
    }
}

ProgressLinear.propTypes = {
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    loading: PropTypes.bool,
    trackColor: PropTypes.string,
    loadingColor: PropTypes.string,
    backgroundColor: PropTypes.string,
};

ProgressLinear.defaultProps = {
    className: '',
    width: '100%',
    height: '10px',
    loading: true,
    trackColor: 'blue',
    loadingColor: 'red',
    backgroundColor: 'lightgray',
};
