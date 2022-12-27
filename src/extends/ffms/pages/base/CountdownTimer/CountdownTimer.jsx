import './CountdownTimer.scss';

import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const formatTime = (time) => `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;

const CountdownTimer = ({ number, onComplete, interval }) =>
{
    const [time, setTime] = useState(0);
    const circleRef = useRef(null);
    const RESET_INTERVAL_S = number * 60;
    const [loading, setLoading] = useState(false);

    useEffect(()=>
    {
        setLoading(true);
        return setCounterChange();
    },[interval, number]);

    const setCounterChange = ()=>
    {

        if (interval && circleRef.current)
        {
            setTimeout(() =>
            {
                setLoading(false);
                circleRef.current.style.animationDuration = `${RESET_INTERVAL_S}`;
                setTime(0);
            }, 0);

            const timerId = setInterval(() =>
            {
                setTime((t) =>
                {
                    if (t + 1 >= RESET_INTERVAL_S)
                    {
                        _.isFunction(onComplete) && onComplete('OK');
                        return 0;
                    }

                    return t + 1;
                });
           
            }, 1000);
            return () => clearInterval(timerId);
        }
    };

    const timeRemain = RESET_INTERVAL_S - (time % RESET_INTERVAL_S);

    return (
        interval &&
        <div className='countdown'>
            <div>{formatTime(timeRemain)}</div>
            {!loading &&
            <svg >
                <circle
                    ref={circleRef}
                    r="18"
                    cx="20"
                    cy="20"
                />
            </svg>
            }
        </div>
    );
};

CountdownTimer.propTypes = {
    number: PropTypes.number,
    onComplete: PropTypes.func,
    interval: PropTypes.bool,
};


export default CountdownTimer;
