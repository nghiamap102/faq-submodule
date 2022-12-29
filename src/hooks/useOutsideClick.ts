import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

type UseOutsideClick<T extends HTMLElement = HTMLElement> = (ref: React.RefObject<T>, callback: () => void) => void
export const useOutsideClick: UseOutsideClick = (ref, callback: () => void) =>
{
    const handleClick = (e: MouseEvent | TouchEvent) =>
    {
        if (ref && ref.current && !ref.current.contains(e.target as Node))
        {
            callback();
        }
    };

    useEffect(() =>
    {
        const eventName = isMobile ? 'touchstart' : 'mousedown';
        document.addEventListener(eventName, handleClick);

        return () =>
        {
            document.removeEventListener(eventName, handleClick);
        };
    });
};
