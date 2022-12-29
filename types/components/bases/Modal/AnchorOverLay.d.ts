import React, { ReactNode } from 'react';
import { OverlayPosition, Placement } from '../../../components/bases/Modal/model/overlayType';
import { OverlayProps } from './Overlay';
import './PopOver.scss';
export declare type AnchorOverlayProps = {
    placement?: Placement;
    scroll?: boolean;
    dynamicContent?: boolean;
    children: ReactNode;
} & Omit<OverlayProps, 'overlayMainStyle'> & OverlayPosition;
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
export declare const AnchorOverlay: React.ForwardRefExoticComponent<AnchorOverlayProps & React.RefAttributes<HTMLDivElement | null>>;
//# sourceMappingURL=AnchorOverlay.d.ts.map