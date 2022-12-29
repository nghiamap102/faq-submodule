import React, { forwardRef, useRef, ReactNode } from 'react';

import { OverlayPosition, Placement } from 'components/bases/Modal/model/overlayType';

import { ScrollView } from '../ScrollView/ScrollView';
import { Overlay, OverlayProps } from './Overlay';
import { useAnchorHandle } from './hooks/useAnchorHandle';

import './PopOver.scss';

export type AnchorOverlayProps = {
    placement?: Placement
    scroll?: boolean
    dynamicContent?: boolean
    children: ReactNode
} & Omit<OverlayProps, 'overlayMainStyle'> & OverlayPosition

/**
 * AnchorOverlay component execute useAnchorHandle hook to calculate children position
 *
 * @param placement Define placement of children compare to anchor coordinate.
 * @param scroll Enable/Disable automatic adding scroll-bar feature.
 * @param anchorEl The anchor element ref which contain coordinate (x, y) and size (width, height) for calculate where wrapped element should locale
 * @param position The coordinate point (x,y) for wrapped element locate
 * @param wrappedEl This is OverlayMain div which is the container of AnchorOverlay's wrapped element.
 * @returns Overlay component width detected child position
 */

export const AnchorOverlay = forwardRef<HTMLDivElement | null, AnchorOverlayProps>((props, ref) =>
{
    const { anchorEl, position, children, placement, scroll = true, dynamicContent, ...rest } = props;
    const wrappedEl = useRef<HTMLDivElement | null>(null);

    const { overlayMainStyle, scrollBarStyle } = useAnchorHandle({
        wrappedElement: wrappedEl.current,
        anchorElement: anchorEl?.current,
        anchorPosition: position,
        placement,
        dynamicContent,
    });

    return (
        <Overlay
            {...rest}
            ref={(element) =>
            {
                if (typeof ref === 'function')
                {
                    ref(element);
                }
                else if (ref)
                {
                    ref.current = element;
                }

                wrappedEl.current = element;
            }}
            overlayMainStyle={overlayMainStyle}
            hasAnchor
        >
            {scroll && scrollBarStyle && <ScrollView>{children}</ScrollView>}
            {(!scroll || !scrollBarStyle) && children}
        </Overlay>
    );
});
