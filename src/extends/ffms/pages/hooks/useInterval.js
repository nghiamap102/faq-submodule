import { useState, useEffect } from 'react';

export default (handler, delay, start) =>
{
    const [intervalId, setIntervalId] = useState();

    useEffect(() =>
    {
        if (!start)
        {
            return;
        }
        const id = setInterval(handler, delay);
        setIntervalId(id);

        return () => clearInterval(id);

    }, [delay]);

    return () => clearInterval(intervalId);

};
