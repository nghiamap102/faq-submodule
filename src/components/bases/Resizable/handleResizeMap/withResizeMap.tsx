import { FC, ComponentType } from 'react';
import { useResizeMap } from './useResizeMap';

export const withResizeMap = <P extends object>(Component: ComponentType<P>): FC<P> => (props) =>
{
    const resizeMap = useResizeMap();
    return (
        <Component
            {...resizeMap}
            {...props}
        />
    );
};
