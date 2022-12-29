import React, { useState } from 'react';
import { Input } from 'components/bases/Input';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { DateTimePicker } from 'components/bases/DateTimePicker/DateTimePicker';
import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { FileInput } from 'components/bases/File/FileInput';
import { DataTypes } from 'components/bases/DynamicDisplayForm/DataTypes';
import { InputAppend, InputGroup } from 'components/bases/Form';
import { Row2 } from 'components/bases/Layout/Row';
import { EmptyButton } from 'components/bases/Button/Button';
import { Tag, TagProps } from 'components/bases/Tag/Tag';
import { MapStateProvider } from 'components/bases/MapControl/MapContext';
import { MapControlContainer } from 'components/bases/MapControl/MapControl';
import { MultilineInput } from 'components/bases/MultilineInput/MultilineInput';

export interface DynamicFieldProps {
    schema: DataTypes;
    value: any,
    options?: any,
    onChange: Function;
    onChangeDone?: Function;
    onClose?: Function;
    className?: string;
    // DataTypes.File
    onChangeFiles?: Function;
    autoFocus?: boolean;
    changeImmediately?: boolean;
}

export interface IOption extends TagProps {
    label: string,
    id: string,
    textColor?: string,
}

export const DynamicField: React.FC<DynamicFieldProps> = (props) =>
{
    const {
        className, schema, options, autoFocus,
        onChange, onChangeFiles, onChangeDone, onClose,
        changeImmediately,
    } = props;

    const [value, setValue] = useState(props.value);

    if (!schema)
    {
        return null;
    }
    const handleChange = (value: any) =>
    {
        setValue(value);
        onChange && onChange(value);
    };

    const inputJsx = (() =>
    {
        switch (schema)
        {
            case DataTypes.Boolean:
                return (
                    <CheckBox
                        checked={value}
                        onChange={handleChange}
                    />
                );

            case DataTypes.Currency:
            case DataTypes.Numeric:
                return (
                    <Input
                        type="number"
                        step={1}
                        defaultValue={value}
                        autoFocus={autoFocus}
                        onChange={handleChange}
                    />
                );

            case DataTypes.Real:
                return (
                    <Input
                        type="number"
                        step={0.01}
                        defaultValue={value}
                        autoFocus={autoFocus}
                        onChange={handleChange}
                    />
                );

            case DataTypes.Date:
                return (
                    <DateTimePicker
                        value={value}
                        isVisible={autoFocus}
                        showTimeRange
                        onChange={handleChange}
                    />
                );
            case DataTypes.Datetime:
                return (
                    <DateTimePicker
                        value={value}
                        isVisible={autoFocus}
                        showTimeRange
                        onChange={handleChange}
                    />
                );

            case DataTypes.Text:
                return (
                    <Input
                        type="text"
                        defaultValue={value}
                        autoFocus={autoFocus}
                        onChange={handleChange}
                        onBlur={event => onClose && onClose(event)}
                    />
                );

            case DataTypes.File:
                return (
                    <FileInput onChangeFiles={onChangeFiles} />
                );

            case DataTypes.List: {
                const config = JSON.parse(options || '{}');
                const selectOptions = (Array.isArray(config?.content?.source) ? config?.content?.source : []).map((op: any) => ({
                    id: op.Value,
                    label: op.Display,
                }));

                return (
                    <AdvanceSelect
                        options={selectOptions}
                        value={value}
                        isVisible={autoFocus}
                        onChange={handleChange}
                    />
                );
            }

            case DataTypes.Select: {
                // const defaultColor = 'var(--default-color)';
                const selectOptions = options.map((option: IOption) => ({
                    label: option.color
                        ? (
                                <Tag
                                    textCase={'sentence'}
                                    text={option.label}
                                    color={option.color}
                                    size={option.size ?? 'medium'}
                                    textStyle={{ color: option.textColor }}
                                    isRound
                                />
                            )
                        : option.color,
                    id: option.id,
                }));

                return (
                    <AdvanceSelect
                        options={selectOptions}
                        value={value}
                        isVisible={autoFocus}
                        searchable={false}
                        onChange={handleChange}
                    />
                );
            }

            case DataTypes.Map:
            case DataTypes.MapVN2000:
            {
                let geoJsonValue = value;

                if (value && typeof value !== 'string')
                {
                    geoJsonValue = JSON.stringify(value);
                }

                return (
                    <MapStateProvider
                        initState={{
                            open: true,
                        }}
                    >
                        <MapControlContainer
                            placeholder={'Nhấp để đặt vị trí'}
                            value={geoJsonValue || ''}
                            onChange={handleChange}
                        />
                    </MapStateProvider>
                );
            }

            default:
                return (
                    <MultilineInput
                        maxTextareaHeight="5rem"
                        value={value}
                        autoFocus
                        onChange={handleChange}
                    />
                );
        }
    })();

    return (
        <>
            {
                changeImmediately
                    ? { ...inputJsx, props: { ...inputJsx.props, className } }
                    : (
                            <InputGroup className={className}>
                                {
                                    { ...inputJsx, props: { ...inputJsx.props } }
                                }
                                <InputAppend>
                                    <Row2 items='center'>

                                        <EmptyButton
                                            icon='check'
                                            iconSize='xxl'
                                            onlyIcon
                                            onClick={(e: any) =>
                                            {
                                                e.stopPropagation();
                                                onChangeDone && onChangeDone(value);
                                            }}
                                        />
                                        <EmptyButton
                                            icon='times'
                                            iconSize='xxl'
                                            onlyIcon
                                            onClick={(e: any) =>
                                            {
                                                e.stopPropagation();
                                                onChangeDone && onChangeDone(undefined);
                                            }}
                                        />
                                    </Row2>

                                </InputAppend>
                            </InputGroup>
                        )
            }
        </>
    );
};
