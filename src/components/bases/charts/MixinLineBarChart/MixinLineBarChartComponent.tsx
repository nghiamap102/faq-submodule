import React, { useLayoutEffect, useState, useContext } from 'react';

import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

import { useWindowSize, ThemeContext, Column } from '@vbd/vui';

import { positionToDisplayLabels, positionToDisplayTicks } from '../helper';

export type MixinLineBarChartData = {
    label: string,
    data: any[],
    type: 'line' | 'bar',
    backgroundColor: string,
    borderColor: string,
    fill: boolean | 'start',
    lineTension?: number,
    pointRadius?: number
    borderWidth?: number,
    hidden?: boolean
}

type TooltipItem = {
    label: string,
    value: string,
    datasetIndex: number,
    index: number,
    x: number,
    y: number
}

export type MixinLineBarChartTooltipCallback = {
    label?: (ttItem: any, data: any) => any;
    footer?: (ttItem: TooltipItem[]) => any;
    itemSort?: (a: TooltipItem, b: TooltipItem) => number;
}

type MixinLineBarChartTooltips = {
    mode: 'index' | 'point' | 'nearest' | 'dataset' | 'x' | 'y',
    intersect: boolean,
    callbacks?: MixinLineBarChartTooltipCallback
}

type MixinLineBarChartHoverLine = {
    width?: 'default' | number,
    color?: 'string'
}

type MixinLineBarChartTimeDisplayFormat = {
    month: string,
    quarter: string
    year: string
}

type MixinLineBarChartComponentProps = {
    labels: (string | number)[];
    data: MixinLineBarChartData[],
    showDataLabels?: 'show' | 'none';
    showXAxis?: boolean;
    showYAxis?: boolean;
    showXGridline?: boolean;
    showYGridline?: boolean;
    xMaxRotation?: number;
    xMinRotation?: number;
    yMax?: number;
    yStepSize?: number;
    yPosition: 'left' | 'right',
    yStacked?: boolean,
    xStacked?: boolean,
    tooltips: MixinLineBarChartTooltips,
    hoverLine?: MixinLineBarChartHoverLine,
    timeUnit?: string | keyof MixinLineBarChartTimeDisplayFormat,
    timeUnitRound?: string | keyof MixinLineBarChartTimeDisplayFormat,
    timeUnitFormat?: MixinLineBarChartTimeDisplayFormat,
    xAxisType?: string,
    yTicksDisplayCallback?: (_label: number, _index?: number, _labels?: any[]) => any
};

export const MixinLineBarChartComponent: React.FC<MixinLineBarChartComponentProps> = (props) =>
{
    const [width] = useWindowSize();

    const [mobileDisplay, setMobileDisplay] = useState(width < 576);

    const context = useContext(ThemeContext);

    const colorByTheme = context.theme.base === 'dark' ? 'rgba(255, 255, 255, 0.84)' : 'rgba(0, 0, 0, 0.84)';

    const gridlineColor = context.theme.base === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    useLayoutEffect(() =>
    {
        setMobileDisplay(width < 576);
    }, [width]);

    const { labels, showDataLabels, showXAxis, showYAxis, showXGridline, showYGridline, data, yMax, yStepSize, yPosition, tooltips, hoverLine, yStacked, xStacked } = props;

    const { timeUnit, timeUnitFormat, yTicksDisplayCallback, xAxisType, timeUnitRound, xMaxRotation, xMinRotation } = props;

    let xStep = 0;

    const dLength = labels.length;

    if (dLength <= 10)
    {
        xStep = 1;
    }

    if (dLength > 10 && dLength < 20)
    {
        xStep = 3;
    }

    if (labels.length >= 20)
    {
        xStep = Math.round(labels.length / 5);
    }

    if (mobileDisplay)
    {
        xStep = 7;
    }

    const labelPositions = positionToDisplayLabels(labels, xStep);

    const xTickPositions = positionToDisplayTicks(labels, xStep);

    const defaultYTicksDisplayCallback = (label: number, index: any, labels: any) =>
    {
        if (showYAxis)
        {
            if (label >= 1000)
            {
                return label / 1000 + 'k';
            }

            return label;
        }

        return ' ';
    };

    const options = {
        scales: {
            yAxes: [
                {
                    stacked: yStacked,
                    position: yPosition,
                    ticks: {
                        beginAtZero: true,
                        max: yMax,
                        min: 0,
                        stepSize: yStepSize,
                        padding: 5,
                        fontColor: colorByTheme,
                        callback: yTicksDisplayCallback ? yTicksDisplayCallback : defaultYTicksDisplayCallback,
                        scaleLabel: {
                            display: true,
                            labelString: '1k = 1000',
                        },
                    },

                    gridLines: {
                        display: showYGridline,
                        drawBorder: false,
                        color: gridlineColor,
                        zeroLineColor: gridlineColor,
                    },
                },
            ],
            xAxes: [
                {
                    stacked: xStacked,
                    offset: true,
                    type: xAxisType,
                    distribution: 'series',
                    bounds: 'data',
                    time: {
                        parser: 'MM/DD/YYYY HH:mm',
                        tooltipFormat: 'DD/MM/YYYY',
                        unit: timeUnit ? timeUnit : 'day',
                        round: timeUnitRound ? timeUnitRound : false,
                        unitStepSize: 1,
                        displayFormats: {
                            day: 'DD/MM',
                            month: timeUnitFormat?.month ? timeUnitFormat.month : 'DD/MM/YYYY',
                            quarter: timeUnitFormat?.quarter ? timeUnitFormat.quarter : '[Q]Q/YYYY',
                            year: timeUnitFormat?.year ? timeUnitFormat.year : 'YYYY',
                        },
                    },
                    ticks: {
                        autoSkip: mobileDisplay,
                        maxTicksLimit: mobileDisplay ? 4 : 10,
                        beginAtZero: true,
                        stepSize: 1,
                        source: 'data',
                        padding: 10,
                        maxRotation: typeof xMaxRotation === 'number' ? xMaxRotation : 50,
                        minRotation: typeof xMinRotation === 'number' ? xMinRotation : 0,
                        fontColor: colorByTheme,
                        callback: (label: number, index: any, labels: any) =>
                        {
                            if (showXAxis)
                            {
                                if (mobileDisplay)
                                {
                                    return label;
                                }

                                if (xTickPositions.includes(index))
                                {
                                    return label;
                                }
                            }

                            return ' ';
                        },
                    },
                    gridLines: {
                        display: showXGridline,
                        drawOnChartArea: false,
                        drawTicks: true,
                        offset: true,
                        drawBorder: true,
                        color: gridlineColor,
                        zeroLineColor: gridlineColor,
                    },
                },
            ],
        },
        legend: {
            labels: {
                usePointStyle: true,
                boxWidth: 10,
                fontColor: colorByTheme,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scaleShowVerticalLines: false,
        plugins: {
            datalabels: {
                anchor: 'end',
                color: colorByTheme,
                clamp: true,
                align: 'top',
                font: {
                    weight: 'bold',
                    size: mobileDisplay ? 8 : 12,
                    style: 'italic',
                },
                display: (context: any) =>
                {
                    switch (showDataLabels)
                    {
                        case 'show':
                            return context.dataset.data[context.dataIndex] > 0 && labelPositions.includes(context.dataIndex);
                        case 'none':
                            return null;
                        default:
                            return context.dataset.data[context.dataIndex] > 0 && labelPositions.includes(context.dataIndex);
                    }
                },
            },
            hoverLine: {
                width: hoverLine?.width || 4,
                color: hoverLine?.color || context.theme.base === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)',
            },
        },
        tooltips: tooltips,
        hover: {
            mode: 'index',
            intersect: false,
        },
    };

    const chartData = {
        labels: labels,
        datasets: data,
    };

    return (
        <Column>
            <Bar
                data={chartData}
                options={options}
                plugins={[{
                    id: 'hoverLine',
                    afterDatasetsDraw: (chart: any, x: any, opts: any) =>
                    {
                        const width = opts.width || 1;
                        const color = opts.color || 'black';
                        const ctx = chart.ctx;

                        if (!chart.active || chart.active.length === 0)
                        {
                            return;
                        }

                        const {
                            chartArea: {
                                top,
                                bottom,
                            },
                        } = chart;

                        chart.active.forEach((activeChart: any) =>
                        {
                            const xValue = activeChart._model.x;

                            ctx.lineWidth = width === 'default' ? activeChart._model.width : width;
                            ctx.strokeStyle = color;

                            ctx.beginPath();
                            ctx.moveTo(xValue, top);
                            ctx.lineTo(xValue, bottom);
                            ctx.stroke();
                        });
                    },
                }]}
            />
        </Column>
    );
};
