import React from 'react';
export declare enum ChartType {
    Line = 0,
    Doughnut = 1,
    Bar = 2
}
export interface DisplayChartProps {
    value: any;
    options: {
        chartType: ChartType;
        height: number;
        width?: number;
        isMiniStyle?: boolean;
    };
}
export declare const DisplayChart: React.FC<DisplayChartProps>;
//# sourceMappingURL=DisplayChart.d.ts.map