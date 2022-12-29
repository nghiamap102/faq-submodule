import React, { Component } from 'react';
import { T } from 'components/bases/Translate/Translate';

export class CallTimer extends Component
{
    state = {
        timer: 0,
        dot: 0,
    };

    constructor(props)
    {
        super(props);

        this.timeCounter();
    }

    timeCounter = () =>
    {
        const me = this;

        setTimeout(function ()
        {
            let { dot, timer } = me.state;

            if (me.props.active)
            {
                timer++;
            }
            else
            {
                timer = 0;

                if (me.props.starting)
                {
                    if (dot > 3)
                    {
                        dot = 0;
                    }

                    dot++;
                }
            }

            me.setState({ timer, dot });
            me.timeCounter();

        }, 1000);
    };

    getCallStatus = () =>
    {
        if (this.props.active)
        {
            let minutes = Math.floor(this.state.timer / 60.0);
            let seconds = this.state.timer % 60;

            if (minutes < 10)
            {
                minutes = '0' + minutes;
            }

            if (seconds < 10)
            {
                seconds = '0' + seconds;
            }

            return (minutes + ':' + seconds);
        }
        else if (this.props.starting)
        {
            return 'Calling' + Array(this.state.dot).join('.');
        }
    };

    render()
    {
        return <span><T>{this.getCallStatus()}</T></span>;
    }
}
