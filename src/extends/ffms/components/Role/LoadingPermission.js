import './LoadingPermission.scss';
import React, { useRef, useState, useEffect } from 'react';
import { ProgressBar } from '@vbd/vui';

export const LoadingPermission = () =>
{
    const waitTimer = 20;
    const stopCounter = 20;
    const [counter, setCounter] = useState(0);
    const timer = useRef(null);

    useEffect(() =>
    {
        if (counter <= stopCounter)
        {
            timer.current = setInterval(() => setCounter((c) => c + 1), waitTimer);
        }
        return () =>
        {
            clearInterval(timer.current);
        };
    }, [counter]);
    
    return (
        <ProgressBar
            className={counter > stopCounter ? 'loading-permission overload' : 'loading-permission'}
            width={'100vw'}
            total={stopCounter}
            value={counter}
        />
    );
};
