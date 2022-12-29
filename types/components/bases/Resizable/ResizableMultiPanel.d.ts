import { ReactNode } from 'react';
import './ResizableMultiPanel.scss';
export declare type ResizableMultiPanelProps = {
    children: ReactNode[];
    initialSizes?: {
        width?: number | string;
        height?: number | string;
        index?: number;
    }[];
    numOfItemPerLine?: number;
    resizable?: boolean | ({
        direction: 'x' | 'y' | 'both';
        index: number;
        resizable: boolean;
    })[];
    onResize?: (sizes: {
        width: number;
        height: number;
    }[]) => void;
    onResizeEnd?: (sizes: {
        width: number;
        height: number;
    }[]) => void;
};
export declare const ResizableMultiPanel: import("react").ForwardRefExoticComponent<ResizableMultiPanelProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ResizableMultiPanel.d.ts.map