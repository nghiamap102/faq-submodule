import React from 'react';
import 'chartjs-adapter-moment';
export declare enum ChartType {
    Line = 0,
    Doughnut = 1,
    Bar = 2,
    Scatter = 3,
    Pie = 4,
    Polar = 5,
    Radar = 6
}
export declare type ChartProps = {
    data: any;
    options: Record<string, any>;
    chartType: ChartType;
    height?: number;
    width?: number;
    className?: string;
    plugins?: Record<string, any>;
};
export declare const Chart: React.ForwardRefExoticComponent<ChartProps & React.RefAttributes<any>>;
//# sourceMappingURL=Chart.d.ts.map