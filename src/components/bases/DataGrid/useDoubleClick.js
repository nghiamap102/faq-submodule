import { useState } from 'react';

export function useDoubleClick(doubleClickCb, clickCb, timeout)
{
    const [clickTimeout, setClickTimeout] = useState();

    return (...args) =>
    {
        if (clickTimeout)
        {
            clearTimeout(clickTimeout);
            setClickTimeout(undefined);
            doubleClickCb(...args);
        }
        else
        {
            setClickTimeout(setTimeout(() =>
            {
                clearTimeout(clickTimeout);
                setClickTimeout(undefined);
                clickCb(...args);
            }, timeout ? timeout : 400));
        }
    };
}
