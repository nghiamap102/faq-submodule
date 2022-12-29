import React, { forwardRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import usePortal from './hooks/usePortal';

import './Overlay.scss';

export type OverlayProps = {
    className?: string;
    innerClassName?: string;
    backdrop?: boolean;
    onBackgroundClick?: React.MouseEventHandler<HTMLDivElement>;
    onBackgroundMouseMove?: React.MouseEventHandler<HTMLDivElement>;
    width?: string | number;
    height?: string | number;
    fullscreen?: boolean;
    id?: string;
    overlayMainStyle?: React.CSSProperties
    hasAnchor?: boolean
    children?: ReactNode
}

export const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) =>
{
    const {
        id,
        className,
        innerClassName,
        children,
        width = '',
        height = 'auto',
        backdrop = true,
        fullscreen,
        onBackgroundClick,
        onBackgroundMouseMove,
        overlayMainStyle = {},
        hasAnchor,
    } = props;

    const { isMounted, target } = usePortal({ id });

    const defaultStyles = {
        width: fullscreen ? '100%' : width,
        maxWidth: fullscreen ? '' : '90%',
        height: fullscreen ? '100%' : height,
        maxHeight: fullscreen ? '' : '90%',
        minWidth: width || 130,
    };

    const wrapperClassNames = clsx(
        'app-overlay',
        {
            'overlay-popover': hasAnchor,
            'no-background': !backdrop,
        },
        className,
    );

    const innerClassNames = clsx(
        'overlay-main',
        {
            'overlay-main--fullscreen': fullscreen,
        },
        innerClassName,
    );

    const content = (
        <div className={wrapperClassNames}>
            {backdrop && (
                <div
                    className={'overlay-background'}
                    onMouseDown={onBackgroundClick}
                    onMouseMove={onBackgroundMouseMove}
                />
            )}
            <div
                ref={ref}
                className={innerClassNames}
                style={{ ...defaultStyles, ...overlayMainStyle }}
            >
                {isMounted && children}
            </div>
        </div>
    );

    return createPortal(content, target);
});
