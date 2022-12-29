import React from 'react';
import { OverlayProps } from '../../../components/bases/Modal/Overlay';
import { AnchorOverlayProps } from '../../../components/bases/Modal/AnchorOverlay';
import './PopOver.scss';
export declare type PopOverProps = {
    anchorEl: React.MutableRefObject<HTMLDivElement | null>;
    displayRaw?: boolean;
} & Pick<OverlayProps, 'className' | 'width' | 'height' | 'backdrop' | 'onBackgroundClick' | 'onBackgroundMouseMove'> & Pick<AnchorOverlayProps, 'placement' | 'dynamicContent'>;
export declare const PopOver: React.FC<PopOverProps>;
//# sourceMappingURL=PopOver.d.ts.map