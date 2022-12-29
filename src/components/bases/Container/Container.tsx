import React, { forwardRef } from 'react';
import { Property } from 'csstype';

import { T } from 'components/bases/Translate/Translate';

export type ContainerProps = {
    id?: string
    className?: string
    style?: React.CSSProperties
    flex?: number
    width?: Property.Width
    height?: Property.Height
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseUp?: (event: React.MouseEvent<HTMLDivElement>) => void
    onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void
    children?: React.ReactNode
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>((props, ref) =>
{
    const { id, className, onClick, children, width, style, height, flex, ...containerProps } = props;

    return (
        <div
            {...containerProps}
            ref={ref}
            id={id}
            className={className}
            style={{ ...style, ...(width && { width }), ...(height && { height }), ...(!width && !height && { flex }) }}
            onClick={onClick}
        >
            {typeof children === 'string' ? <T>{children}</T> : children}
        </div>
    );
});

Container.displayName = 'Container';
