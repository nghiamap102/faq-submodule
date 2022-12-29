import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FAIcon } from '@vbd/vicon';

export class WindowFixedItem extends Component
{
    state = {
        notifyTop: -15,
    };

    notifyDirection = 1;

    componentDidMount ()
    {
        this.notifyInternal = setInterval(() =>
        {
            const top = this.state.notifyTop;
            if (top < -18 && this.notifyDirection === 0)
            {
                this.notifyDirection = 1;
            }
            else if (top > -15 && this.notifyDirection === 1)
            {
                this.notifyDirection = 0;
            }

            this.setState({
                notifyTop: (top + (this.notifyDirection === 1 ? 2 : -2)),
            });
        }, 100);
    }

    componentWillUnmount ()
    {
        clearInterval(this.notifyInternal);
    }

    render ()
    {
        return (
            <div style={{ position: 'relative', display: 'inline', cursor: 'pointer' }}>
                {
                    this.props.isNotify &&
                    <div
                        style={{
                            position: 'absolute',
                            top: this.state.notifyTop + 'px',
                            right: '5px',
                            padding: '0px 5px',
                            backgroundColor: 'red',
                            zIndex: 2,
                        }}
                    >
                        <FAIcon
                            icon={this.props.notifyIcon}
                            size="10pt"
                            color="white"
                        />
                    </div>
                }
                <FAIcon
                    className={this.props.className}
                    icon={this.props.icon}
                    size="20pt"
                    color="white"
                    onClick={this.props.onClick}
                />
            </div>
        );
    }
}

WindowFixedItem.propTypes = {
    /** Class of Icon */
    className: PropTypes.string,
    /** Icon name */
    icon: PropTypes.string.isRequired,
    /** Notify Icon */
    notifyIcon: PropTypes.string.isRequired,
    /** Enable/Disable notify of this marker */
    isNotify: PropTypes.bool,
    /** Callback function when click icon */
    onClick: PropTypes.func,
};

WindowFixedItem.defaultProps = {
    className: '',
    icon: '',
    notifyIcon: 'exclamation',
    isNotify: false,
    onClick: () =>
    {
    },
};
