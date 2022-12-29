import { FC, ReactNode } from 'react';
import { AnchorOverlayProps } from '../../../components/bases/Modal';
import './Tooltip2.scss';
export declare type TriggerType = 'hover' | 'click';
export declare type Tooltip2Props = {
    tooltip?: ReactNode;
    className?: string;
    hideArrow?: boolean;
    trigger?: TriggerType[];
    triggerEl: HTMLElement | null;
    tooltipEl?: HTMLElement | null;
} & Pick<AnchorOverlayProps, 'placement'>;
export declare const Tooltip2: FC<Tooltip2Props>;
//# sourceMappingURL=Tooltip2.d.ts.map