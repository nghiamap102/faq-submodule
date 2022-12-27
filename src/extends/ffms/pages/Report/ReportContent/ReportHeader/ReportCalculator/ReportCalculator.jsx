import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { Button } from '@vbd/vui';
import { buildCalculationTree, addOrUpdateItemValue } from 'extends/ffms/services/ReportService/util';
import Menu, { MenuItem } from 'extends/ffms/pages/base/Menu';
import SelectionItem from 'extends/ffms/pages/base/SelectionItem/SelectionItem';
import { toJS } from 'mobx';


const enumMapping = {
    Count: 'COUNT',
    Sum: 'SUM',
    Average: 'AVG',
    Min: 'MIN',
    Max: 'MAX',
};

const ReportCalculator = ({ fieldForceStore }) =>
{
    const reportStore = _.get(fieldForceStore, 'reportStore');
    const [calculationConfig, setCalculationConfig] = useState(_.clone(reportStore.calculationConfig));


    const handleClick = () =>
    {
        const calculation = _.get(reportStore, 'reportTemplate.calculation');
        const result = buildCalculationTree(reportStore.calculationConfig, calculation);
        setCalculationConfig(result);
    };

    const onClick = (item, cal) =>
    {
        const calculationItem = { ...item, text: item.name, checked: cal.checked, function: enumMapping[cal.id] };
        const curCalculation = _.get(reportStore, 'reportTemplate.calculation');
        // _.unset(item, 'checked');
        // _.unset(item, 'value');
        // let temp = toJS(reportStore.calculation);
        const calculation = addOrUpdateItemValue(curCalculation, calculationItem);
        const reportTemplate = reportStore.reportTemplate;
        reportStore.setReportTemplate({ ...reportTemplate, calculation });
    };

    const setCalculationReportStore = () =>
    {

    };
    useEffect(() =>
    {

        if (!_.isEmpty(reportStore.calculationConfig))
        {
            const calculation = _.get(reportStore, 'reportTemplate.calculation');
            const result = buildCalculationTree(toJS(reportStore.calculationConfig), toJS(calculation));
            setCalculationConfig(_.values(result));
        }

    }, [reportStore.reportTemplate, reportStore.calculationConfig]);


    return (
        <Menu
            trigger={
                <Button label='Calculator' />
            }
            placement='bottom-end'
            onClick={handleClick}
            hideArrow
            onClose={(e) => setCalculationReportStore()}
        >
            {
                _.map(calculationConfig, (group, index) => (
                    <>
                        <MenuItem
                            key={index}
                            label={group.title}
                            className={'menu-title'}
                        />
                        {
                            _.map(group.items, (item) =>
                                <MenuItem
                                    key={item.key}
                                    placement='left'
                                    label={item.name}
                                    style={{ paddingLeft: '15px' }}
                                    hideArrow
                                >
                                    {
                                        reportStore.calculation && _.map(item.operator, (cal) =>
                                            <MenuItem
                                                key={cal.key}
                                                label={
                                                    <>
                                                        <SelectionItem
                                                            showHover={false}
                                                            key={cal.id}
                                                            text={cal.label}
                                                            checked={enumMapping[cal.id] === item.function}
                                                            hasCheckbox
                                                            borderBottom={false}
                                                            onClick={({ checked }) => onClick(item, { ...cal, checked })}
                                                        />
                                                    </>
                                                }
                                            />,
                                        )
                                    }
                                </MenuItem>,
                            )
                        }
                    </>
                ))
            }
        </Menu >

    );
};

ReportCalculator.propTypes = {
    fieldForceStore: PropTypes.any,
};

export default inject('fieldForceStore')(observer(ReportCalculator));

