import React from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

export enum ChartType {
    Line,
    Doughnut,
    Bar,
}

export interface DisplayChartProps {
    value: any,
    options: {
        chartType: ChartType,
        height: number,
        width?: number,
        isMiniStyle?: boolean,
    },

}

export const DisplayChart: React.FC<DisplayChartProps> = (props) =>
{
    const { options, value } = props;
    const { chartType, height, isMiniStyle } = options;

    const DEFAULT_OPTIONS = {
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: !isMiniStyle,
                },
                ticks: {
                    display: !isMiniStyle,
                },
            },
            y: {
                grid: {
                    display: !isMiniStyle,
                },
                ticks: {
                    display: !isMiniStyle,
                },
            },
        },
        layout: {
            padding: {
                left: 4,
                right: 4,
                top: 12,
                bottom: 12,
            },
        },
    };

    const PRIMARY_COLOR = getComputedStyle(document.body).getPropertyValue('--primary-color');

    const DEFAULT_DATASETS_OPTIONS = {
        borderColor: PRIMARY_COLOR,
        borderWidth: chartType === ChartType.Line ? 1 : 0,
        lineTension: 0,
        backgroundColor: chartType === ChartType.Doughnut
            ? ['red', 'blue', 'yellow', 'green']
            : chartType === ChartType.Bar
                ? PRIMARY_COLOR
                : 'rgba(0,0,0,0)',
        pointRadius: 1,
    };

    const data = {
        ...value,
        datasets: value.datasets.map((e: any) => ({
            ...DEFAULT_DATASETS_OPTIONS,
            ...e,
        })),
    };

    switch (chartType)
    {
        case ChartType.Doughnut:
            return (
                <Doughnut
                    height={height}
                    data={data}
                    options={{
                        ...DEFAULT_OPTIONS,
                        ...options,
                    }}
                />
            );
        case ChartType.Line:
            return (
                <Line
                    data={data}
                    height={height}
                    options={{
                        ...DEFAULT_OPTIONS,
                        ...options,
                    }}
                />
            );
        case ChartType.Bar:
            return (
                <Bar
                    data={data}
                    height={height}
                    options={{
                        ...DEFAULT_OPTIONS,
                        ...options,
                    }}
                />
            );

        default:
            return null;
    }
};
