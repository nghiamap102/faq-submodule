import React from 'react';
import { IPopOverPositionSize } from 'components/bases/Modal/model/usePopOverOptionType';

export type OverlayPosition = { anchorEl: React.MutableRefObject<HTMLElement | null> , position?: undefined } | { anchorEl?: undefined, position: IPopOverPositionSize }

export type UsePortal = (params: UsePortalParams) => UsePortalReturn;

export interface UsePortalParams {
    id?: string;
}

interface UsePortalReturn {
    isMounted: boolean;
    target: HTMLDivElement;
}

export type Placement = 'left-top' | 'left' | 'left-bottom' | 'right-top' | 'right' | 'right-bottom' | 'top-left' | 'top' | 'top-right' | 'bottom-left' | 'bottom' | 'bottom-right'
