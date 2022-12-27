import './StackedChart.scss';

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { PanelBody, T, useI18n, ScrollView } from '@vbd/vui';
import Loading from 'extends/ffms/pages/base/Loading';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

import { numberToText } from 'extends/ffms/services/utilities/helper';
import { options } from './Options';

const staticHeight = 120;
const widthRow = 29;

const StackedChart = ({ fieldForceStore, data, title }) =>
{
    const { t } = useI18n();
    const { types, values, labels } = data;
    const [dataset, setDataset] = useState([]);
    const [optionCustom, setOptionCustom] = useState(options);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const charRef = useRef(null);

    const dashboardStore = _.get(fieldForceStore, 'dashboardStore');

    useEffect(() =>
    {
        handleChange();
        getCustomOption();
        window.addEventListener('resize', handleChange);
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleChange);
    }, [data, dashboardStore.displayLegend]);

    useEffect(() =>
    {
        handleChange();
    }, [dashboardStore.paging]);

    useEffect(() =>
    {
        getCustomOption();
        return watchThemeChange();
    }, []);

    useEffect(()=>
    {
        if (charRef.current)
        {
            const chartInstance = charRef.current?.chartInstance;
            chartInstance?.update();
        }
    },[size]);

    const setHeightChart = (numberOfItem) =>
    {
        if (numberOfItem > 0)
        {
            const panelChartEl = document.querySelector('.wrapper-detail canvas');
            const wrapperEl = document.querySelector('.wrapper-detail');
            const tableDetail = document.querySelector('.table-detail-chart');
            const detailHeader = document.querySelector('.detail-header');
            
            if (panelChartEl)
            {
                const rectDetail = detailHeader.getBoundingClientRect();
                const chartInstance = charRef?.current?.chartInstance;
                const widthBySizeItem = _.size(labels) * widthRow + chartInstance?.chartArea.left ?? 0;
                const widthPanel = wrapperEl.parentElement.getBoundingClientRect().width;

                const height = (widthRow * numberOfItem) + rectDetail.height + staticHeight;
                panelChartEl.height = document.documentElement.clientHeight - height;
                panelChartEl.width = (widthBySizeItem > widthPanel ? widthBySizeItem : widthPanel);
                
                wrapperEl.style.height = `${document.documentElement.clientHeight - height}px`;
                wrapperEl.style.width = tableDetail.style.width = `${panelChartEl.width}px`;
              
                setSize({ width: panelChartEl.width, height: panelChartEl.height });
            }
        }
    };
    

    const watchThemeChange = () =>
    {
        try
        {
            // The mutation observer
            const ob = new MutationObserver(function ()
            {
                getCustomOption(true);
            });
            return ob.observe(document.body, {
                attributes: true,
                attributeFilter: ['class'],
            });
        }
        catch (error)
        {
            // console.log('Browser not support');
        }
    };

    const getPaging = ()=>
    {
        const pageIndex = 1;
        const limit = Number.MAX_SAFE_INTEGER;
        return { pageIndex, limit };
    };

    const handleChange = () =>
    {
        const { pageIndex, limit } = getPaging();
        const datasets = [];

        _.map(types, (type, index) =>
        {
            const value = [];
            _.map(
                _(values)
                    .drop((pageIndex - 1) * limit)
                    .take(limit)
                    .value(),
                (item) =>
                {
                    value.push(item[index] ? item[index] : 0);
                },
            );
            const item = {
                label: `${t(type.typeName)}`,
                backgroundColor: type.color,
                data: value,
                maxBarThickness: 40,
                unit: `${t(title)}`,
                borderWidth: 0,
            };
            datasets.push(item);
        });
        const newLabel = _(labels)
            .drop((pageIndex - 1) * limit)
            .take(limit)
            .value();
        setDataset({
            labels: newLabel,
            datasets: datasets,
        });
        setHeightChart(_.size(datasets));
    };

    const getCustomOption = (a = false) =>
    {
        const style = getComputedStyle(document.body);
        /* Tootip color */
        const primaryColor = style.getPropertyValue('--primary');
        const textColor = style.getPropertyValue('--text-color');
        const border = style.getPropertyValue('--border');

        const newOptions = _.cloneDeep(options);
        // Set background color
        _.set(newOptions, 'tooltips.backgroundColor', primaryColor);
        // Set text color label
        _.set(newOptions, 'tooltips.callbacks.labelTextColor', () =>
        {
            return '#fff';
        });
        // Color label yAxis
        _.set(newOptions, 'scales.yAxes[0].ticks.fontColor', textColor);
        _.set(newOptions, 'scales.yAxes[0].gridLines.color', border);
        _.set(newOptions, 'scales.xAxes[0].gridLines.color', border);
        if (_.size(data.values) > 0)
        {
            const maxValue = _.max(_.map(data.values, value=>(_.sum(value))));
            _.set(newOptions, 'scales.yAxes[0].ticks.suggestedMax', Math.round(maxValue + (maxValue * 0.05)));
            _.set(newOptions, 'scales.yAxes[0].scaleLabel.labelString', title);
        }
        // Color Title yAxis
        _.set(newOptions, 'scales.yAxes[0].scaleLabel.fontColor', textColor);

        _.set(newOptions, 'scales.xAxes[0].ticks.fontColor', textColor);
        
        // Show Label center bar chart
        // !toJS(dashboardStore.displayLegend) && _.set(newOptions, 'plugins.datalabels.display', false);
        // toJS(dashboardStore.displayLegend) && _.set(newOptions, 'tooltips.mode', 'point');

        _.set(newOptions, 'version', (new Date()).getTime());
        setOptionCustom({ ...newOptions });
    };

        
    if (toJS(dashboardStore.loading))
    {
        return (
            <PanelBody className='empty-detail-chart'>
                <Loading/>
            </PanelBody>
        );
    }
    
    if (_.size(data.labels) == 0)
    {
        return (
            <PanelBody className='empty-detail-chart'>
                <T>Không có dữ liệu phân tích</T>
            </PanelBody>
        );
    }
    

    return (
        <>
            
            <div className="chartWrapper">
                <ScrollView>
                    <div className="wrapper-detail">
                        <Bar
                            ref={charRef}
                            style={{}}
                            data={dataset}
                            options={optionCustom}
                            width={size.width}
                            height={size.height}
                            plugins={[ChartDataLabels]}
                        />
                    </div>
                    {_.size(labels) > 0 && (
                        <>
                            <table className="table-detail-chart">
                                <tbody>
                                    {_.map(_.cloneDeep(_.get(dataset, 'datasets', [])).reverse(), (item, index) => (
                                        <tr key={index}>
                                            <PopperTooltip
                                                placement="top"
                                                trigger={['click', 'hover']}
                                                tooltip={t(item.label)}
                                                tag="th"
                                                tagClassName="legend-y-axis"
                                            >
                                                <div
                                                    className="legend-circle"
                                                    style={{ backgroundColor: item.backgroundColor }}
                                                />
                                            </PopperTooltip>
                                            {_.map(_.get(item, 'data'), (value, index) => (
                                                <td key={index} title={numberToText(value)}>{value > 0 ? numberToText(value) : '-'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </ScrollView>
                {/* <canvas
                    className='myYAxis' id="myChartAxis"
                    width="0"
                /> */}
            </div>
        </>
    );
};

StackedChart.propTypes = {
    data: PropTypes.any,
    title: PropTypes.string,
    maxValue: PropTypes.number,
    fieldForceStore: PropTypes.any,
};

StackedChart.defaultProps = {
    title: 'Jobs',
};

export default inject('fieldForceStore')(observer(StackedChart));
