/* eslint-disable react/no-multi-comp */
import React from 'react';
import PropTypes from 'prop-types';

import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { Input } from 'components/bases/Input';
import { TB1 } from 'components/bases/Text/Text';
import { DATA_TYPE } from 'helper/data.helper';

export const FilterValue = (props) =>
{
    const renderBooleanValueFilter = (filter) =>
    {
        return (
            <AdvanceSelect
                options={[{ id: true, label: 'Có' }, { id: false, label: 'Không' }]}
                placeholder={'Chọn giá trị'}
                value={filter.value}
                onChange={props.onChange}
            />
        );
    };

    const renderNumberValueFilter = (filter) =>
    {
        const typeInput = filter.dataType === DATA_TYPE.datetime ? 'date' : 'number';

        if (filter.operator !== 'between')
        {
            return renderInput(filter, typeInput);
        }
        else
        {
            return (
                <div
                    className={'field-value-between-date'}
                >
                    {renderInput(filter, typeInput, 'from')}
                    <TB1>Và</TB1>
                    {renderInput(filter, typeInput, 'to')}
                </div>
            );
        }
    };

    const renderInput = (filter, typeInput = 'text', betweenType = '') =>
    {
        const [fromData, toData] = betweenType ? filter.value.split('AND') : [null, null];

        let value;

        if (betweenType && betweenType === 'from')
        {
            value = fromData;
        }

        if (betweenType && betweenType === 'to')
        {
            value = toData;
        }

        return (
            <Input
                className={'form-control data-filter-value'}
                height={'100%'}
                type={typeInput}
                placeholder={'Nhập giá trị'}
                value={betweenType ? value.split(' ').join('') : filter.value}
                onChange={(value) => props.onChange(value, betweenType)}
            />
        );
    };

    const renderSpecialValueFilter = (filter, config) =>
    {
        if (filter.columnName.includes('ID'))
        {
            return renderInput(filter);
        }
        else
        {
            const valueOptions = (config || []).map((f) => ({ id: f?.Value, label: f?.Display }));

            return (
                <AdvanceSelect
                    options={valueOptions}
                    placeholder={'Chọn giá trị'}
                    value={filter.value}
                    onChange={props.onChange}
                />
            );
        }
    };

    const renderValueFilter = (filter, config) =>
    {
        if (filter.operator === 'is null' || filter.operator === 'is not null')
        {
            return null;
        }

        switch (filter.dataType)
        {
            case DATA_TYPE.boolean:
                return renderBooleanValueFilter(filter);
            case DATA_TYPE.integer:
            case DATA_TYPE.float:
            case DATA_TYPE.datetime:
                return renderNumberValueFilter(filter);
            case DATA_TYPE.string:
            case DATA_TYPE.text:
            case DATA_TYPE.document:
                return renderInput(filter);
            case DATA_TYPE.array:
                return renderSpecialValueFilter(filter, config);
            default:
                return null;
        }
    };

    return (
        <>
            {
                props.visible && (
                    <div className={'data-filter-value'}>
                        {renderValueFilter(props.filter, props.config)}
                    </div>
                )}
        </>

    );
};

FilterValue.propTypes = {
    visible: PropTypes.bool,
    filter: PropTypes.object,
    config: PropTypes.array,
    onChange: PropTypes.func,
};


export default FilterValue;
