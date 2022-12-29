import './WindowScreen.css';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Moment } from '../Moment/Moment';

import { WindowFixedItem } from './WindowFixedItem';

export class WindowScreen extends Component
{
    state = {
        curTime: new Date(),
    };

    componentDidMount()
    {
        this.countTime = setInterval(() =>
        {
            this.setState({
                curTime: new Date(),
            });
        }, 1000);
    }

    componentWillUnmount()
    {
        clearInterval(this.countTime);
    }

    render()
    {
        return (
            <div className="window" style={{ width: this.props.width, height: this.props.height }}>
                <div className="window-body">
                    {this.props.children}
                </div>
                <div className="window-footer">
                    <div className="window-tool">
                        <div className="window-fixed-items">
                            <WindowFixedItem className="window-item" icon="edit" isNotify />
                            <WindowFixedItem className="window-item" icon="trash" />
                        </div>
                        <div className="window-tool-datetime">
                            <div style={{ textAlign: 'center' }}>
                                <Moment format={'L'}>
                                    {
                                        this.state.curTime
                                    }
                                </Moment>
                            </div>
                            <div style={{ textAlign: 'center', width: '60px', height: '20px', paddingLeft: '18px' }}>
                                <Moment format={'LTS'} style={{ float: 'left' }}>
                                    {
                                        this.state.curTime
                                    }
                                </Moment>
                            </div>
                        </div>
                        <div className="clearfix" />
                    </div>
                    <div className="clearfix" />
                </div>
            </div>
        );
    }
}

WindowScreen.propTypes = {
    className: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
};

WindowScreen.defaultProps = {
    className: '',
    width: '100vw',
    height: '100vh',
};
