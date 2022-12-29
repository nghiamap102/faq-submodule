import { useRef, useEffect, useState } from 'react';

type IOnMap = (map: any) => void
type IDelay = (delay: number) => void
type IRun = () => void
type IResizeMap = () => {onMap: IOnMap, onDelay: IDelay, run: IRun, map: any}

export const useResizeMap: IResizeMap = () =>
{
    const timeoutRef = useRef<NodeJS.Timeout>();
    const delayRef = useRef<number>(0);
    const [map, setMap] = useState<any>();

    useEffect(() =>
    {
        return () => timeoutRef.current && clearTimeout(timeoutRef.current);
    }, []);

    const run: IRun = () =>
    {
        if (!map)
        {
            return;
        }

        timeoutRef.current && clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => map.resize(), delayRef.current);
    };

    const onMap: IOnMap = (map) => setMap(map);
    const onDelay: IDelay = (delay) => delayRef.current = delay;

    return { onMap, onDelay, run, map };
};
