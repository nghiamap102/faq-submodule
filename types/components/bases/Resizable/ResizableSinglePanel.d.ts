import React, { ReactNode } from 'react';
import './ResizableSinglePanel.scss';
export declare type ResizableSinglePanelProps = {
    type?: 'horizontal' | 'vertical';
    children: ReactNode[];
    minSizes?: number[];
    className?: string;
    height?: string;
    width?: string;
    resizable?: boolean | {
        index: number;
        resizable: boolean;
    }[];
    onResize?: (sizes: {
        width: number;
        height: number;
    }[]) => void;
    onResizeEnd?: (sizes: {
        width: number;
        height: number;
    }[]) => void;
    defaultSizes?: (string | number | null)[];
};
export declare const ResizableSinglePanel: React.ForwardRefExoticComponent<ResizableSinglePanelProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ResizableSinglePanel.d.ts.map