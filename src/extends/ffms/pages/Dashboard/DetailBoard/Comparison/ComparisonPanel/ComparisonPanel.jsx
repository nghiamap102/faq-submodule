
import './ComparisonPanel.scss';

import PropTypes from 'prop-types';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';

import PopupWrapper from 'extends/ffms/pages/base/Popup';
import { PopupFooter } from 'extends/ffms/pages/base/Popup';
import { getPeriodTypeName, periodType } from '../util';
import TimeRange from './TimeRange';

import TabBar from 'extends/ffms/pages/base/TabBar';
import SelectionList from 'extends/ffms/pages/base/SelectionList';
import { useI18n } from '@vbd/vui';
import { Button } from '@vbd/vui';

const ComparisonPanel = ({ period, selectedPeriod, applyPeriodCompares, chosen }) =>
{
    const [currentChoices, setCurrentChoices] = useState();

    const [defaultValue, setDefaultValue] = useState();
    const [customValue, setCustomValue] = useState();
    const [defaultTimeRange, setDefaultTimeRange] = useState();
    const [tabs, setTabs] = useState();
    const [tabIndex, setTabIndex] = useState(0);
    const { t } = useI18n();

    useEffect(() =>
    {
        if (!_.isEmpty(selectedPeriod))
        {
            if (period?.type !== periodType.custom)
            {
                const custom = period?.custom?.filter(element => selectedPeriod.find(cus => cus.id === element.id && cus.type === 'custom'));
                const defaultPeriod = period?.default?.find(element => selectedPeriod.find(cus => cus.id === element.id && cus.type === 'default'));
                setCustomValue(_.map(custom, cus => cus.id));
                setDefaultValue(defaultPeriod?.id);
                setDefaultTimeRange(null);
            }
            else
            {
                const defaultTime = {
                    from: _.get(period, 'values.from'),
                    to: _.get(period, 'values.to'),
                };
                const defaultTR = [];
                _.map(selectedPeriod, period =>
                {
                    if (period.periodType === periodType.custom)
                    {
                        defaultTR.push({
                            defaultRange: defaultTime,
                            selectedRange: period.values,
                        });
                    }
                });
                setDefaultTimeRange(defaultTR);
            }
        }
        else
        {
            if (defaultValue || _.size(chosen) === 0)
            {
                setDefaultValue(null);
                setCustomValue(null);
            }
        }
        getTabs();
    }, [selectedPeriod, period, chosen]);

    const changeDefaultPeriod = (items) =>
    {
        const chosen = [];
        _.forEach(items, element =>
        {
            const chosenPeriod = period.default.find(def => def.id === element.id);
            _.forEach(chosenPeriod.values, item =>
            {
                chosen.push({
                    id: `${chosenPeriod.id}${item.year}`,
                    periodType: period.type,
                    type: 'default',
                    label: `${chosenPeriod.label}-${item.year}`,
                    values: item,
                });
            });
        });
       
        setCurrentChoices(_.clone(chosen));
    };

    const changeCustomPeriod = (items) =>
    {
        const chosen = [];
        _.map(items, item=>
        {
            chosen.push({
                ...item,
                periodType: period.type,
                type: 'custom',
            });
        });
       
        setCurrentChoices(_.clone(chosen));
    };

    const changeTimeRange = (timeRanges) =>
    {
        const chosen = [];
        _.map(timeRanges, (timeRange, index) =>
        {
            const from = moment(timeRange.selectedRange.from);
            const to = moment(timeRange.selectedRange.to);
            chosen.push({
                values: timeRange.selectedRange,
                id: `TR${index}`,
                label: `${from.format('MMM D, YYYY')} - ${to.format('MMM D, YYYY')}`,
                periodType: period.type,
            });
        });
        setCurrentChoices(_.clone(chosen));
    };

    const handleClick = async () =>
    {
        applyPeriodCompares(_.clone(currentChoices));
    };
    
    const onSelectModeChange = async (tab) =>
    {
        setTabIndex(tab);
    };
    
    const getTabs = ()=>
    {
        const tabsTmp = [];
        let id = 0;
        if (_.size(period?.default) > 0)
        {
            tabsTmp.push({
                id: id,
                title: `${t(getPeriodTypeName(period.type))} ${t('của Năm')}`,
                options: period?.default,
                defaultValue: defaultValue,
                type: 'default',
            });
            id += 1;
        }
        if (_.size(period?.custom) > 0)
        {
            tabsTmp.push({
                id: id,
                title: `${t(getPeriodTypeName(period.type))} ${t('và Năm')}`,
                options: period?.custom,
                defaultValue: customValue,
                type: 'custom',
            });
            id += 1;
        }
        setTabs(tabsTmp);
    };
    const tIndex = _.size(tabs) > 0 ? (tabIndex > tabs.length - 1 ? 0 : tabIndex) : tabIndex;
    const isDefault = _.size(tabs) > 0 && tabs[tIndex].type == 'default';
    return (
        <PopupWrapper
            trigger={(
                <Button
                    className={'btn-add-period'}
                    label='Thêm giai đoạn'
                    icon='plus'
                    size={'2rem'}
                    color={'primary-color'}
                />
            )}
            modal={false}
            width='30rem'
            padding={'1rem'}
            title={'Chọn giai đoạn'}
        >
         
            <div className='comparison-panel'>
                {
                    _.size(tabs) > 1 && (
                        <TabBar
                            defaultIndex={tIndex}
                            tabs={tabs}
                            className={'comparison-select-mode'}
                            onChange={onSelectModeChange}
                        />
                    )}
                {
                    period?.type === periodType.custom
                        ? (
                                <TimeRange
                                    period={period}
                                    changeTimeRange={changeTimeRange}
                                    defaultTimeRange={defaultTimeRange}
                                />
                            )
                        : _.size(tabs) > 0 && (
                            <SelectionList
                                data={tabs[tIndex].options}
                                multiCheck={!isDefault}
                                defaultValue={isDefault ? defaultValue : customValue}
                                cols={_.size(tabs[tIndex].options) > 20 ? 3 : 2}
                                hasCheckbox
                                onClick={(item)=>isDefault ? changeDefaultPeriod(item) : changeCustomPeriod(item)}
                            />
                        )}
            </div>
         
            
            <PopupFooter>
                <Button
                    label={'Áp dụng'}
                    onClick={handleClick}
                />
            </PopupFooter>
        </PopupWrapper>

    );
};

ComparisonPanel.propTypes = {
    applyPeriodCompares: PropTypes.func,
    chosen: PropTypes.shape({
        push: PropTypes.func,
    }),
    period: PropTypes.shape({
        custom: PropTypes.shape({
            filter: PropTypes.func,
        }),
        default: PropTypes.shape({
            find: PropTypes.func,
        }),
        periodType: PropTypes.any,
        type: PropTypes.any,
        values: PropTypes.any,
    }),
    selectedPeriod: PropTypes.shape({
        find: PropTypes.func,
    }),
};


ComparisonPanel.defaultProps = {

};

export default ComparisonPanel;

