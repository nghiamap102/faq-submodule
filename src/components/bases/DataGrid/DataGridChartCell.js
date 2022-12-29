import React from 'react';
import PropTypes from 'prop-types';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

export const DataGridChartCell = (props) =>
{
    const { options, content } = props;
    const { chartType: type, height, width, isMiniStyle } = options;

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
        borderWidth: type === 'line' ? 1 : 0,
        lineTension: 0,
        backgroundColor: type === 'doughnut' ? ['red', 'blue', 'yellow', 'green'] : type === 'bar' ? PRIMARY_COLOR : 'rgba(0,0,0,0)',
        pointRadius: 1,
    };

    const data = {
        ...content,
        datasets: content.datasets.map((e) => ({
            ...DEFAULT_DATASETS_OPTIONS,
            ...e,
        })),
    };

    switch (type)
    {
        case 'doughnut':
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
        case 'line':
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
        case 'bar':
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
            break;
    }
};

DataGridChartCell.propTypes =
{
    content: PropTypes.object,
    options:
    PropTypes.object,
};
