import { Component } from 'react';
import PropTypes from 'prop-types';

class AutoLogout extends Component
{
    logoutTimeout = null;
    events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];
    timeout = this.props.minutes * 60 * 1000;

    componentDidMount()
    {
        this.events.forEach((event) =>
        {
            document.addEventListener(event, this.resetUserActivityTimeout);
        });

        // init logout timeout
        this.logoutTimeout = setTimeout(this.onLogout, this.timeout);
    }

    onClearInActiveTimeOut = () =>
    {
        if (this.logoutTimeout)
        {
            clearTimeout(this.logoutTimeout);
        }
    };

    onLogout = () =>
    {
        this.events.forEach((event) =>
        {
            document.removeEventListener(event, this.resetUserActivityTimeout);
        });

        this.onClearInActiveTimeOut();

        if (this.props.onLogout)
        {
            this.props.onLogout();
        }
    };

    // reset timout when user is active
    resetUserActivityTimeout = () =>
    {
        this.onClearInActiveTimeOut();
        this.logoutTimeout = setTimeout(this.onLogout, this.timeout);
    };

    render()
    {
        return this.props.children;
    }
}

AutoLogout.propTypes = {
    minutes: PropTypes.number,
    onLogout: PropTypes.func.isRequired
};

AutoLogout.defaultProps = {
    minutes: 30 // minutes
};

export { AutoLogout };
