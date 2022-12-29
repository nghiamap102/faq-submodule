import React from 'react';
import { Property } from 'csstype';
export declare type ContainerProps = {
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    flex?: number;
    width?: Property.Width;
    height?: Property.Height;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseUp?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseMove?: (event: React.MouseEvent<HTMLDivElement>) => void;
    children?: React.ReactNode;
};
export declare const Container: React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Container.d.ts.map