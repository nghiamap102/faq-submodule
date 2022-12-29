import { FC, ReactNode } from 'react';
import './ResizableGrid.scss';
export declare type GridTemplate = {
    rowStart?: number;
    rowSpan?: number;
    colStart?: number;
    colSpan?: number;
    index?: number;
};
export declare type ResizableGridProps = {
    className?: string;
    lineSizes?: {
        rows?: number[];
        columns?: number[];
    };
    gridTemplates?: GridTemplate[];
    children: ReactNode[];
    numOfItemPerLine: number;
    onResize?: (data: {
        rows: number[];
        columns: number[];
    }) => void;
    onResizeEnd?: (data: {
        rows: number[];
        columns: number[];
    }) => void;
};
export declare const ResizableGrid: FC<ResizableGridProps>;
//# sourceMappingURL=ResizableGrid.d.ts.map