import React, { ReactNode } from 'react';
import './Overlay.scss';
export declare type OverlayProps = {
    className?: string;
    innerClassName?: string;
    backdrop?: boolean;
    onBackgroundClick?: React.MouseEventHandler<HTMLDivElement>;
    onBackgroundMouseMove?: React.MouseEventHandler<HTMLDivElement>;
    width?: string | number;
    height?: string | number;
    fullscreen?: boolean;
    id?: string;
    overlayMainStyle?: React.CSSProperties;
    hasAnchor?: boolean;
    children?: ReactNode;
};
export declare const Overlay: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Overlay.d.ts.map