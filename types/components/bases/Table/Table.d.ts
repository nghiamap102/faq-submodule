import React from 'react';
import { Property } from 'csstype';
import './Table.scss';
export declare type TableProps = {
    headers?: TableHeader[];
    className?: string;
    isFixedHeader?: boolean;
    isLoading?: boolean;
};
declare type TableHeader = {
    isUseChild?: boolean;
    child?: React.ReactElement;
    width?: Property.Width;
    col?: number;
    label?: string;
    subCols?: Pick<TableHeader, 'label'>[];
    align?: 'center' | 'left' | 'right';
};
export declare const Table: React.FC<TableProps>;
export {};
//# sourceMappingURL=Table.d.ts.map