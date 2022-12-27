import React from 'react';
import PropTypes from 'prop-types';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import {
    useI18n, DateTimePicker, AdvanceSelect, Input, CheckBox, FormControlLabel, RichText,
} from '@vbd/vui';

import { DataTypes, isEmpty } from 'helper/data.helper';
import { MapControl } from 'extends/ffms/pages/Layerdata/MapControl/MapControl';
export function DynamicFormField(props)
{
    const { t } = useI18n();
    let minDate, maxDate;
    const { property, label, required, readOnly, className, placeholder, name, value, options, onChange, onRemoteChange, onBlur, errorText, rules, ...rest } = props;

    const onRemoteChangeDebounced = new AwesomeDebouncePromise(onRemoteChange.bind(this), 300);
    const config = property.Config ? typeof (property.Config) === 'string' ? JSON.parse(property.Config) : property.Config : {};

    let isRequired = required;
    if (isEmpty(isRequired) && property)
    {
        isRequired = property.IsRequire;
    }

    let isReadOnly = readOnly;
    if (isEmpty(isReadOnly) && property)
    {
        isReadOnly = property.IsReadOnly;
    }


    let InputComponent = (
        <Input
            className={className}
            placeholder={placeholder}
            name={name}
            value={isEmpty(value) ? '' : value}
            onBlur={onBlur}
            onChange={onChange}
            readOnly={isReadOnly}
            {...rest}
        />
    );
    switch (property.DataType)
    {
        case DataTypes.Boolean: // Checkbox
            InputComponent = (
                <>
                    <CheckBox
                        checked={value ? true : false}
                        onChange={isReadOnly ? null : onChange}
                        {...rest}
                    />
                </>
            );
            break;
        case DataTypes.Number: // Number
            InputComponent = (
                <Input
                    className={className}
                    placeholder={placeholder}
                    name={name}
                    type='number'
                    value={isEmpty(value) ? 0 : value}
                    readOnly={isReadOnly}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...rest}
                />
            );
            break;
        case DataTypes.String:
            InputComponent = (
                <Input
                    className={className}
                    placeholder={placeholder}
                    name={name}
                    value={isEmpty(value) ? '' : value}
                    readOnly={isReadOnly}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...rest}
                />
            );
            break;
        case DataTypes.Real: // Float/Double
            InputComponent = (
                <Input
                    className={className}
                    placeholder={placeholder}
                    name={name}
                    type='number'
                    step={0.1}
                    value={isEmpty(value) ? 0 : value}
                    readOnly={isReadOnly}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...rest}
                />
            );
            break;
        case DataTypes.DateTime: // Datetime
        {
            const validator = config.validator;
            minDate = validator?.find(x => x?.type === 'min')?.value;
            maxDate = validator?.find(x => x?.type === 'max')?.value;
            InputComponent = (
                <DateTimePicker
                    className={className}
                    placeholder={'Chọn ngày'}
                    name={name}
                    type={'date'}
                    value={isEmpty(value) ? '' : value}
                    disabled={isReadOnly}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...minDate && { minDate }}
                    {...maxDate && { maxDate }}
                    {...rest}
                />
            );
            break;
        }
        case DataTypes.BigString: // Area field
            InputComponent = (
                <RichText
                    className={className}
                    placeholder={placeholder}
                    value={isEmpty(value) ? '' : value}
                    readOnly={isReadOnly}
                    color='black'
                    rows={4}
                    onChange={onChange}
                    {...rest}
                />
            );
            break;
        case DataTypes.Map: // Map
        case DataTypes.MapVN2000:
            {
                let geoJsonValue = value;

                if (value && typeof value !== 'string')
                {
                    geoJsonValue = JSON.stringify(value);
                }

                InputComponent = (
                    <MapControl
                        placeholder={placeholder ? placeholder : 'Nhấp để đặt vị trí'}
                        value={geoJsonValue || ''}
                        readOnly={props.disabled}
                        onChange={onChange}
                        {...rest}
                    />
                );
            }
            break;
        case DataTypes.Text: // Rich Text
            InputComponent = (
                <RichText
                    className={className}
                    placeholder={placeholder}
                    value={isEmpty(value) ? '' : value}
                    readOnly={isReadOnly}
                    color='black'
                    rows={4}
                    onChange={onChange}
                    {...rest}
                />
            );
            break;
        case DataTypes.List:// Combo-box
        {
            const config = (typeof (property.Config) === 'string' ? JSON.parse(property.Config) : property.Config) || {};
            const { mode } = config.content || {};
            InputComponent = (
                <AdvanceSelect
                    value={isEmpty(value) ? (property.multi ? [] : '') : value}
                    options={options}
                    disabled={isReadOnly}
                    placeholder={placeholder ? placeholder : (property && t('Chọn %0%...', [property.DisplayName]))}
                    clearable
                    hasSearch
                    searchMode={mode === 'layer' ? 'remote' : 'local'}
                    multi={property.multi}
                    onChange={onChange}
                    onRemoteFetch={onRemoteChangeDebounced}
                    onClear={() => onChange()}
                    {...rest}
                />
            );
            break;
        }
    }
    return (
        <FormControlLabel
            required={isRequired}
            label={label || (property && property.DisplayName)}
            control={InputComponent}
            rules={rules}
            errorText={errorText}
        />
    );
}

DynamicFormField.propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array, // [{id, label}]
    value: PropTypes.any,
    property: PropTypes.object,
    required: PropTypes.bool,
    errorText: PropTypes.string,
    hidden: PropTypes.bool,

    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onRemoteChange: PropTypes.func,
};

DynamicFormField.defaultProps = {
    className: 'form-control',
    placeholder: '',
    name: '',
    options: [],
    onBlur: () =>
    { },
    onChange: () =>
    { },
    onRemoteChange: () =>
    { },
};

export default DynamicFormField;
