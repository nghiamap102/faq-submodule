import React from 'react';
import { DataTypes } from './DataTypes';
import './DynamicDisplay.scss';
export interface DynamicDisplayProps {
    schema: DataTypes;
    value: any;
    format?: string;
    locale?: string;
    options?: any;
}
export declare const DynamicDisplay: React.FC<DynamicDisplayProps>;
//# sourceMappingURL=DynamicDisplay.d.ts.map