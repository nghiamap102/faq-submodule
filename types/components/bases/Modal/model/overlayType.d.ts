import React from 'react';
import { IPopOverPositionSize } from '../../../../components/bases/Modal/model/usePopOverOptionType';
export declare type OverlayPosition = {
    anchorEl: React.MutableRefObject<HTMLElement | null>;
    position?: undefined;
} | {
    anchorEl?: undefined;
    position: IPopOverPositionSize;
};
export declare type UsePortal = (params: UsePortalParams) => UsePortalReturn;
export interface UsePortalParams {
    id?: string;
}
interface UsePortalReturn {
    isMounted: boolean;
    target: HTMLDivElement;
}
export declare type Placement = 'left-top' | 'left' | 'left-bottom' | 'right-top' | 'right' | 'right-bottom' | 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right';
export {};
//# sourceMappingURL=overlayType.d.ts.map