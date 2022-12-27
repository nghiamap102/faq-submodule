import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import _isEmpty from 'lodash/isEmpty';
import _omit from 'lodash/omit';
import _chunk from 'lodash/chunk';

import { Container, withI18n, HD3 } from '@vbd/vui';

class HistorySpeedChart extends Component
{
    historyStore = this.props.fieldForceStore.historyStore;

    updateTimeSeriesHandle (e, el)
    {
        if (el && el.length > 0)
        {
            // Get DataIndex from element
            const { dataIndex } = el[0].$datalabels[0].$context;
            const datapoint = this.historyStore.chartDataByMinute[dataIndex];
            // console.log(datapoint);

            this.historyStore.sliderHandle = moment(datapoint.time);
        }
    }

    render()
    {
        const { selectedEntry } = this.historyStore;
        const rawData = selectedEntry.displayData;

        // Fill the blank hourspaces
        const chartData = [];
        if (rawData && !_isEmpty(rawData))
        {
            const rawDataTimeMap = rawData.reduce((all, e) =>
            {
                all[e.ts * 1000] = e;
                return all;
            }, {});
            const rawDataDateStart = moment(rawData[0].ts * 1000).startOf('day').valueOf();
            const rawDataDateEnd = moment(rawData[0].ts * 1000).endOf('day').valueOf();
            for (let i = rawDataDateStart; i <= rawDataDateEnd; i += 1000)
            {
                if (rawDataTimeMap[i])
                {
                    chartData.push({
                        ..._omit(rawDataTimeMap[i], 'time'),
                        time: rawDataTimeMap[i].ts * 1000,
                    });
                }
                else
                {
                    chartData.push({
                        time: i,
                        speed: 0,
                    });
                }
            }
        }

        // Convert to data averaged by minute
        const chartDataByMinute = [];
        const chartDataByMinutesChunked = _chunk(chartData, 60);
        for (let i = 0; i < chartDataByMinutesChunked.length; i += 1)
        {
            const dataChunk = chartDataByMinutesChunked[i];
            let sumOfChunk = 0;
            for (let j = 0; j < dataChunk.length; j += 1)
            {
                sumOfChunk += (dataChunk[j].speed);
            }
            // Filter out the actual seconds that has data in it
            const dataLength = dataChunk.filter(d => d.speed > 0);
            chartDataByMinute.push({
                time: dataChunk[dataChunk.length - 1].time,
                speed: sumOfChunk / dataLength.length,
            });
        }
        this.historyStore.chartDataByMinute = chartDataByMinute;

        // show background chart
        const rawEntryData = selectedEntry.rawData;
        const chartEntryData = [];
        if (rawEntryData && !_isEmpty(rawEntryData))
        {
            const rawDataTimeMap = rawEntryData.reduce((all, e) =>
            {
                all[e.ts * 1000] = e;
                return all;
            }, {});
            const rawDataDateStart = moment(rawEntryData[0].ts * 1000).startOf('day').valueOf();
            const rawDataDateEnd = moment(rawEntryData[0].ts * 1000).endOf('day').valueOf();
            for (let i = rawDataDateStart; i <= rawDataDateEnd; i += 1000)
            {
                if (rawDataTimeMap[i])
                {
                    chartEntryData.push({
                        ..._omit(rawDataTimeMap[i], 'time'),
                        time: rawDataTimeMap[i].ts * 1000,
                    });
                }
                else
                {
                    chartEntryData.push({
                        time: i,
                        speed: 0,
                    });
                }
            }
        }
        const chartEntry = [];
        const chartEntryMinutesChunked = _chunk(chartEntryData, 60);
        for (let i = 0; i < chartEntryMinutesChunked.length; i += 1)
        {
            const dataChunk = chartEntryMinutesChunked[i];
            let sumOfChunk = 0;
            for (let j = 0; j < dataChunk.length; j += 1)
            {
                sumOfChunk += (dataChunk[j].speed);
            }
            const dataLength = dataChunk.filter(d => d.speed > 0);
            chartEntry.push({
                time: dataChunk[dataChunk.length - 1].time,
                speed: sumOfChunk / dataLength.length,
            });
        }

        return (
            <Container className={'speed-chart'}>
                <HD3>Biểu đồ tốc độ</HD3>
                <Bar
                    // height={130}
                    data={{
                        labels: chartDataByMinute.map((e) =>
                        {
                            return new Date(e.time);
                        }),
                        datasets: [
                            {
                                label: this.props.t('Tốc độ'),
                                responsive: true,
                                data: chartDataByMinute.map((e) =>
                                {
                                    return (e.speed * 3.6).toFixed(3);
                                }),
                                borderWidth: 0,
                                backgroundColor: '#3DCAD4',
                                hoverBackgroundColor: '#F5C800',
                                order: 2,
                            },
                            {
                                label: `${this.props.t('Tốc độ')} `,
                                data: chartEntry.map((e) =>
                                {
                                    return (e.speed * 3.6).toFixed(3);
                                }),
                                borderWidth: 0,
                                backgroundColor: 'rgba(255,255,255,.1)',
                                order: 1,
                            },
                        ],
                    }}
                    // getElementAtEvent={element => this.updateTimeSeriesHandle(element)}
                    options={{
                        onClick: this.updateTimeSeriesHandle.bind(this),
                        layout: {
                            padding: {
                                right: 20,
                                bottom: 10,
                            },
                        },
                        maintainAspectRatio: false, // set height to px

                        plugins: {
                            datalabels: {
                                display: false, // hide data value
                            },
                        },
                        tooltips: {
                            callback: {
                                label: function (tooltipItems)
                                {
                                    return tooltipItems.yLabel.toString() + ' km/h';
                                },
                            },
                            enabled: true,
                        },
                        legend: {
                            display: false, // hide title
                            position: 'top',
                            align: 'start',
                            labels: {
                                fontStyle: 'boild',
                                fontColor: 'gray',
                            },
                        },
                        scales: {
                            yAxes: [
                                {
                                    stacked: false,
                                    ticks: {
                                        min: 0,
                                        stepSize: 10,
                                        beginAtZero: false,
                                        fontColor: 'gray',
                                        fontSize: 11,
                                        minUnit: 'minute',
                                        callback: function (value)
                                        {
                                            return value;
                                        },
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'km/h',
                                        fontColor: 'gray',
                                        fontSize: 11,
                                    },
                                    gridLines: {
                                        drawOnChartArea: false,
                                    },
                                },
                            ],
                            xAxes: [
                                {
                                    stacked: false,
                                    type: 'time',
                                    distribution: 'series',
                                    barThickness: 1, // number (pixels) or 'flex'
                                    maxBarThickness: 15, // number (pixels),
                                    ticks: {
                                        display: false, // this will remove only the label,
                                        fontColor: 'darkgray',
                                        fontSize: 9,
                                    },
                                    gridLines: {
                                        drawOnChartArea: false,
                                    },
                                },
                            ],
                        },
                    }}
                />
            </Container>
        );
    }
}

HistorySpeedChart = withI18n(inject('fieldForceStore', 'appStore')(observer(HistorySpeedChart)));
export { HistorySpeedChart };

