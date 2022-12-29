import { useRef } from 'react';

export function useDoubleClick(doubleClickCb: Function, clickCb: Function, timeout: number = 400) : Function
{
    const clickTimeout = useRef<any>(null);

    return (...args: any) =>
    {
        if (clickTimeout?.current)
        {
            clearTimeout(clickTimeout.current);
            clickTimeout.current = null;
            doubleClickCb(...args);
        }
        else
        {
            clickCb(...args);
            clickTimeout.current = setTimeout(() =>
            {
                clearTimeout(clickTimeout.current);
                clickTimeout.current = null;
            }, timeout);
        }
    };
}
