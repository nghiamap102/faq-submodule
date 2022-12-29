import { useLayoutEffect, useState } from 'react';

export const useWindowSize = () =>
{
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    const [size, setSize] = useState([originalWidth, originalHeight]);

    useLayoutEffect(() =>
    {
        function updateSize()
        {
            if (originalWidth === window.innerWidth && originalHeight === window.innerHeight)
            {
                return;
            }

            setSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', updateSize);

        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [window.innerWidth]);

    return size;
};
