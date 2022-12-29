import { FC, ReactElement } from 'react';
export declare type LineSizesType = {
    rows: number[];
    columns: number[];
};
export declare type GridTemplateType = {
    rowStart: number;
    rowSpan: number;
    colStart: number;
    colSpan: number;
    index: number;
};
export declare type DroppableZonesProps = {
    accept?: string[];
    data?: any[];
    numOfItemPerLine?: number;
    itemDisplay?: (item: any, index: number) => ReactElement;
    onLayoutChange?: (sizes: {
        rows: number[];
        columns: number[];
    }, templates: GridTemplateType[], items: any[]) => void;
    onDataChange?: (data: any[]) => void;
};
export declare type ZoneType = {
    value: any;
    key: string;
};
export declare const DroppableZones: FC<DroppableZonesProps>;
//# sourceMappingURL=DroppableZones.d.ts.map