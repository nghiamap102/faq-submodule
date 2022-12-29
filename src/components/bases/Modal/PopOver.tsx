import React from 'react';

import { OverlayProps } from 'components/bases/Modal/Overlay';
import { AnchorOverlay, AnchorOverlayProps } from 'components/bases/Modal/AnchorOverlay';

import './PopOver.scss';

export type PopOverProps = {
    anchorEl: React.MutableRefObject<HTMLDivElement | null>
    displayRaw?: boolean
} & Pick<OverlayProps, 'className' | 'width' | 'height' | 'backdrop' | 'onBackgroundClick' | 'onBackgroundMouseMove'>
  & Pick<AnchorOverlayProps, 'placement' | 'dynamicContent'>

export const PopOver: React.FC<PopOverProps> = ({ children, ...rest }) =>
{
    return (
        <AnchorOverlay
            innerClassName={'popover-container'}
            {...rest}
        >
            {children}
        </AnchorOverlay>
    );
};

