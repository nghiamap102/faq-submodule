/* eslint-disable react/no-multi-comp */
import './FilterInput.scss';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { EmptyButton } from 'components/bases/Button/Button';
import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { DATA_TYPE, getOperators } from 'helper/data.helper';
import { FilterValue } from './FilterValue';

export const FilterInput = (props) =>
{
    const [filter, setFilter] = useState(props.filter || {});

    const filterDebounce = AwesomeDebouncePromise((value) => props.onFilterChange(value), 300);

    // Functions support standalone usage
    const handleChangeOperator = (value) =>
    {
        if (!props.isStandalone)
        {
            props.onChangeOperator && props.onChangeOperator(value, props.index);
        }
        else
        {
            const newFilter = { ...filter };
            newFilter.operator = value;

            if (value === 'between')
            {
                newFilter.value = 'AND';
            }
            setFilter(newFilter);

            if ((value === 'like' || value === '=' || newFilter.dataType === DATA_TYPE.datetime) && (!newFilter.value || newFilter.value === 'AND'))
            {

                return;
            }

            props.onFilterChange && filterDebounce(newFilter);
        }
    };

    const handleChangeFilterValue = (value, betweenType) =>
    {
        if (!props.isStandalone)
        {
            props.onChangeFilterValue && props.onChangeFilterValue(value, betweenType);
        }
        else
        {
            const newFilter = { ...filter };
            if (filter.operator !== 'between')
            {
                newFilter.value = value;
            }
            else
            {
                let [fromData, toData] = filter.value?.split('AND', 2);

                if (betweenType === 'from')
                {
                    fromData = value;
                }

                if (betweenType === 'to')
                {
                    toData = value;
                }
                newFilter.value = `${fromData}AND${toData}`;
            }
            setFilter(newFilter);

            if (newFilter.operator === 'non-select' || (newFilter.operator === 'between' && newFilter.value?.split('AND').filter(item => item).length < 2))
            {
                return;
            }

            props.onFilterChange && filterDebounce(newFilter);
        }
    };

    // FilterInput hold Filter object when standalone
    const usingFilter = (props.isStandalone) ? filter : props.filter || {};

    const {
        combination,
        columnName,
        operator,
        dataType,
    } = usingFilter;

    const operators = props.operators || getOperators(dataType);

    return (
        <div className={`data-filter-input ${(props.showVertical) ? 'vertical' : 'horizontal'}`}>
            {
                !props.isStandalone && (
                    <EmptyButton
                        icon={'times'}
                        iconSize='md'
                        iconColor={'var(--contrast-color)'}
                        onlyIcon
                        onClick={() => props.onRemove(props.index)}
                    />
                )}

            {
                !props.isStandalone && (
                    <div className={'data-filter-combine'}>
                        <AdvanceSelect
                            disabled={props.index === 0}
                            options={props.combinations || []}
                            value={combination}
                            onChange={(value) => props.onChangeCombination && props.onChangeCombination(value, props.index)}
                        />
                    </div>
                )}

            {
                !props.isStandalone && (
                    <div className={'data-filter-columnName'}>
                        <AdvanceSelect
                            width={'11rem'}
                            options={props.columnNames || []}
                            value={columnName}
                            placeholder={'Chọn thuộc tính'}
                            onChange={(value) => props.onChangeColumnName && props.onChangeColumnName(value, props.index)}

                        />
                    </div>
                )}

            <div className={'data-filter-condition'}>
                <AdvanceSelect
                    width={'11rem'}
                    clearable={props.clearable}
                    disabled={operators && operators.length === 1}
                    options={operators}
                    value={operator}
                    placeholder={'Chọn toán tử'}
                    onChange={handleChangeOperator}
                />
            </div>

            <FilterValue
                visible={Boolean(operator)}
                filter={usingFilter}
                config={props.config}
                onChange={handleChangeFilterValue}
            />

        </div>
    );
};

FilterInput.propTypes = {
    // For using as standalone Input
    isStandalone: PropTypes.bool,
    onFilterChange: PropTypes.func,
    showVertical: PropTypes.bool,
    clearable: PropTypes.bool,

    // For using as Filter rows
    index: PropTypes.number,

    combinations: PropTypes.array,
    columnNames: PropTypes.array,
    operators: PropTypes.array,

    onRemove: PropTypes.func,
    onChangeCombination: PropTypes.func,
    onChangeColumnName: PropTypes.func,
    onChangeOperator: PropTypes.func,
    onChangeFilterValue: PropTypes.func,

    // For both
    config: PropTypes.arrayOf(PropTypes.shape({
        Value: PropTypes.string,
        Display: PropTypes.string,
    })),
    filter: PropTypes.shape({
        combination: PropTypes.string,
        dataType: PropTypes.oneOf(Object.values(DATA_TYPE)),
        columnName: PropTypes.string,
        operator: PropTypes.string,
        value: PropTypes.any,
    }),
};

export default FilterInput;
