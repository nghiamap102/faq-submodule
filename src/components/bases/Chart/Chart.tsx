import React, { ForwardedRef, forwardRef } from 'react';
import { Bar, Doughnut, Line, Pie, PolarArea, Radar, Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-moment';

export enum ChartType {
    Line,
    Doughnut,
    Bar,
    Scatter,
    Pie,
    Polar,
    Radar,
}

export type ChartProps = {
    data: any,
    options: Record<string, any>,
    chartType: ChartType,
    height?: number,
    width?: number,
    className?: string,
    plugins?: Record<string, any>,
}

export const Chart = forwardRef((props: ChartProps, ref?: ForwardedRef<any>) =>
{
    const { data, options, chartType, width, height, className, plugins } = props;

    switch (chartType)
    {
        case ChartType.Doughnut:
            return (
                <Doughnut
                    ref={ref}
                    className={className}
                    width={width}
                    height={height}
                    data={data}
                    options={options}
                    plugins={[{ ...ChartDataLabels, ...plugins }]}
                />
            );
        case ChartType.Line:
            return (
                <Line
                    ref={ref}
                    className={className}
                    width={width}
                    height={height}
                    data={data}
                    options={options}
                    plugins={[{ ...ChartDataLabels, ...plugins }]}
                />
            );
        case ChartType.Bar:
            return (
                <Bar
                    ref={ref}
                    className={className}
                    width={width}
                    height={height}
                    data={data}
                    options={options}
                    plugins={[{ ...ChartDataLabels, ...plugins }]}
                />
            );
        case ChartType.Scatter:
            return (
                <Scatter
                    ref={ref}
                    className={className}
                    width={width}
                    height={height}
                    data={data}
                    options={options}
                    plugins={[{ ...ChartDataLabels, ...plugins }]}
                />
            );
        case ChartType.Pie:
            return (
                <Pie
                    ref={ref}
                    className={className}
                    width={width}
                    height={height}
                    data={data}
                    options={options}
                    plugins={[{ ...ChartDataLabels, ...plugins }]}
                />
            );
        case ChartType.Polar:
            return (
                <PolarArea
                    ref={ref}
                    className={className}
                    width={width}
                    height={height}
                    data={data}
                    options={options}
                    plugins={[{ ...ChartDataLabels, ...plugins }]}
                />
            );
        case ChartType.Radar:
            return (
                <Radar
                    ref={ref}
                    className={className}
                    width={width}
                    height={height}
                    data={data}
                    options={options}
                    plugins={[{ ...ChartDataLabels, ...plugins }]}
                />
            );
        default:
            return null;
    }
});

Chart.displayName = 'Chart';
