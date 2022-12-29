import './DataFilterPanel.scss';

import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { EmptyButton } from 'components/bases/Button/Button';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { TB1 } from 'components/bases/Text/Text';

import { DataToolBarContext } from '../DataToolBarContext';
import { CommonHelper } from 'helper/common.helper';
import { FilterInput } from './FilterInput';

import { getOperators } from 'helper/data.helper';

const WAIT_INTERVAL = 300;

export const DataFilterPanel = (props) =>
{
    const { fields, fieldsShow, filterFields, setFilterFields, isAutoFilter, setAutoFilter, setVisibleActive } = useContext(DataToolBarContext);

    const fieldsShowInfo = fields.filter((f) => fieldsShow.includes(f.ColumnName));

    const handleAddFilter = () =>
    {
        const operators = getOperators(fieldsShowInfo[0]?.DataType);
        const newFilter = {
            Combine: 'AND',
            ColumnName: fieldsShowInfo[0]?.ColumnName,
            DataType: fieldsShowInfo[0]?.DataType,
            Condition: (operators && operators.length > 0) ? operators[0].id : '', // Currently, all data types have operators. Use first by default
            ValueFilter: '',
            id: CommonHelper.uuid(),

        };

        setFilterFields([...filterFields, { ...newFilter }]);
    };

    const handleCancel = () =>
    {
        setVisibleActive(false);
    };

    const handleApply = () =>
    {
        props.onFilter && props.onFilter(filterFields);
        setVisibleActive(false);
    };

    const handleCheckAuto = (checked) =>
    {
        setAutoFilter(checked);

        if (checked)
        {
            props.onFilter && props.onFilter(filterFields);
        }
    };

    return (
        <div className={'data-filter-container'}>
            <div className={'data-filter-condition-content'}>
                {
                    filterFields?.length === 0
                        ? (
                                <TB1 style={{ color: 'gray' }}>
                            Chưa có bộ lọc nào được áp dụng
                                </TB1>
                            )

                        : (
                                <div className={'data-filter-condition-item-container'}>
                                    {
                                        filterFields.map((filterField, index) => (
                                            <FilterField
                                                key={filterField.id}
                                                fields={fieldsShowInfo}
                                                data={filterField}
                                                index={index}
                                                onFilter={props.onFilter}
                                            />
                                        ),
                                        )
                                    }
                                </div>
                            )
                }
            </div>

            <div className={'data-filter-add-condition'}>
                <EmptyButton
                    icon={'plus'}
                    text={'Thêm bộ lọc'}
                    onClick={handleAddFilter}
                />

                {
                    filterFields?.length > 0 && !isAutoFilter && (
                        <div className={'data-filter-action-button'}>
                            <EmptyButton
                                text={'Hủy bỏ'}
                                onClick={handleCancel}
                            />
                            <EmptyButton
                                color={'primary'}
                                text={'Áp dụng'}
                                onClick={handleApply}
                            />
                        </div>
                    )}
            </div>

            {
                filterFields?.length > 0 && (
                    <div className={'data-filter-footer'}>
                        <CheckBox
                            label="Tự động"
                            checked={isAutoFilter}
                            onChange={handleCheckAuto}
                        />
                    </div>
                )}
        </div>
    );
};

DataFilterPanel.propTypes = {
    fields: PropTypes.array,
    onFilter: PropTypes.func,
};


DataFilterPanel.defaultProps = {
    fields: [],
};

let timeout = null;

const FilterField = ({ data, fields, index, onFilter }) =>
{
    const { fieldsShow, filterFields, setFilterFields, isAutoFilter, COMBINE_OPTIONS } = useContext(DataToolBarContext);

    const [operators, setOperators] = useState([]);

    const fieldOptions = fields.filter((f) => fieldsShow.includes(f.ColumnName)).map((field) => ({
        id: field.ColumnName,
        label: field.DisplayName,
    }));

    useEffect(() =>
    {
        setOperators(getOperators(data?.DataType));
    }, []);

    const handleRemove = (index) =>
    {
        const fieldsUpdate = filterFields.filter((field, i) => i !== index);

        if (fieldsUpdate.length === 0)
        {
            onFilter(fieldsUpdate);
        }

        setFilterFields(fieldsUpdate);
    };

    const isFieldValid = (field) =>
    {
        let isValid = true;

        Object.keys(field).forEach((key) =>
        {
            if (!field[key])
            {
                isValid = false;
            }
        });

        return isValid;
    };

    const handleChangeType = (type, value) =>
    {
        const filterFieldsUpdate = [...filterFields];

        filterFieldsUpdate[index][type] = value;

        if (type === 'ColumnName')
        {
            filterFieldsUpdate[index].DataType = fields.find((f) => f.ColumnName === value)?.DataType;
            const operators = getOperators(filterFieldsUpdate[index]?.DataType);
            filterFieldsUpdate[index].Condition = (operators && operators.length > 0) ? operators[0].id : ''; // Currently, all data types have operators. Use first by default
            setOperators(operators);
            filterFieldsUpdate[index].ValueFilter = '';
        }
        else if (type === 'Condition')
        {
            if (value === 'is null' || value === 'is not null')
            {
                filterFieldsUpdate[index].ValueFilter = '';
            }
            else if (value === 'between')
            {
                filterFieldsUpdate[index].ValueFilter = ' AND   ';
            }
        }

        if (isAutoFilter && isFieldValid(data))
        {
            // debounce change
            // if this effect run again, because `value` changed, we remove the previous timeout
            clearTimeout(timeout);

            timeout = setTimeout(() =>
            {
                onFilter(filterFieldsUpdate);
            }, WAIT_INTERVAL);
        }

        setFilterFields(filterFieldsUpdate);
    };

    const handleChangeValueFilter = (value, betweenType) =>
    {
        if (data.Condition !== 'between')
        {
            handleChangeType('ValueFilter', value, index);
        }
        else
        {
            let [formData, toData] = filterFields[index].ValueFilter?.split('AND', 2);

            if (betweenType === 'from')
            {
                formData = value;
            }

            if (betweenType === 'to')
            {
                toData = value;
            }

            value = `${formData} AND ${toData}`;

            handleChangeType('ValueFilter', value, index);
        }
    };

    const configStr = fields.find(f => f.ColumnName === data?.ColumnName)?.Config;
    const config = (configStr) ? JSON.parse(configStr) : {};
    const filter = {
        dataType: data?.DataType,
        combination: data?.Combine,
        columnName: data?.ColumnName,
        operator: data?.Condition,
        value: data?.ValueFilter,
    };

    return (
        <div className={'data-filter-condition-item'}>
            <FilterInput
                index={index}
                filter={filter}
                config={config?.content?.source}
                combinations={COMBINE_OPTIONS}
                columnNames={fieldOptions}
                operators={operators}
                onRemove={(index) => handleRemove(index)}
                onChangeCombination={(value, index) => handleChangeType('Combine', value, index)}
                onChangeColumnName={(value, index) => handleChangeType('ColumnName', value, index)}
                onChangeOperator={(value, index) => handleChangeType('Condition', value, index)}
                onChangeFilterValue={handleChangeValueFilter}
            />
        </div>
    );
};

FilterField.propTypes = {
    data: PropTypes.object,
    field: PropTypes.object,
    index: PropTypes.number,
    onFilter: PropTypes.func,
};

FilterField.defaultProps = {
    data: {},
    field: {},
    index: null,
};
