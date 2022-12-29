import React, { ReactNode } from 'react';
import './Tooltip.scss';
import { Placement } from '../Modal/model/overlayType';
declare type TooltipTrigger = 'hover' | 'click';
declare type TooltipProps = {
    trigger?: TooltipTrigger[];
    content?: string | ReactNode;
    position?: Extract<Placement, 'top' | 'left' | 'right' | 'bottom'>;
};
export declare const Tooltip: React.FC<TooltipProps>;
export {};
//# sourceMappingURL=Tooltip.d.ts.map