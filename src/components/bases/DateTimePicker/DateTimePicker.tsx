import React, { useState, useRef, useEffect, forwardRef } from 'react';
import clsx from 'clsx';
import moment, { Moment, MomentInput } from 'moment';
import ReactMoment from 'react-moment';

import { useI18n } from 'components/bases/I18n/useI18n';
import { AnchorOverlay } from 'components/bases/Modal/AnchorOverlay';
import { CustomOnChange, IControllableField } from 'components/bases/Form/model/smartFormType';
import { isCallBackRef } from 'utils';

import { DateTimePickerController } from './DateTimePickerController';
import { InputMoment } from './InputMoment';
import useFormat from './useFormat';

import './DateTimePicker.scss';

export type DateTimePickerProps =
{
    className?: string
    onChange?: (value?: Moment, rangeTime?: [number, number]) => void
    value?: Moment
    rangeTime?: [number, number]// not support editable dtg
    disabled?: boolean
    showTimeSelect?: boolean
    showTimeSelectOnly?: boolean
    showTimeRange?: boolean // not support editable dtg
    clearable?: boolean
    placeholder?: string
    minDate?: MomentInput
    maxDate?: MomentInput
    minTime?: MomentInput // not support editable dtg
    maxTime?: MomentInput // not support editable dtg
    isVisible?: boolean
    readOnly?: boolean
} & CustomOnChange & IControllableField // SmartForm

export const DateTimePicker = forwardRef<HTMLInputElement, DateTimePickerProps>((props, ref) =>
{
    const { className, onChange, customOnChange, rangeTime, minDate, maxDate, minTime, maxTime } = props;
    const { showTimeSelect, showTimeSelectOnly, showTimeRange, disabled, clearable, isVisible, readOnly } = props;
    const { value, placeholder, name } = props;

    const { formatValue, setFormat, setInput } = useFormat();
    const { t, language } = useI18n();

    const inputRef = useRef<HTMLInputElement | null>();
    const containerRef = useRef<HTMLDivElement>(null);

    const [visible, setVisible] = useState(isVisible);
    const [localValue, setLocalValue] = useState<Moment | null>(null);
    const [localRangeTime, setLocalRangeTime] = useState<[number, number]>([0, 24]);
    const [inputValue, setInputValue] = useState<string | null>(null);
    const [isFormat, setIsFormat] = useState(true);
    const [tab, setTab] = useState(0);

    useEffect(() =>
    {
        if (rangeTime && rangeTime.length === 2)
        {
            let start = rangeTime[0];
            let end = rangeTime[1];

            if (start > end)
            {
                start = end;
                end = rangeTime[0];
            }

            if (start < 0 || start > 23)
            {
                start = 0;
            }

            if (end < 0 || end > 23)
            {
                end = 23;
            }

            setLocalRangeTime([start, end]);
        }

        value && setLocalValue(moment(value));
    }, []);

    // DateTimePicker received a new date whenever Edit Form was called, but have no method to set the new date to the input box, so here it is
    useEffect(() =>
    {
        if (!onChange && !value)
        {
            return;
        }

        if (!value)
        {
            return setLocalValue(null);
        }

        if (moment(value).diff(localValue, 'minutes') !== 0 && value)
        {
            setLocalValue(moment(value));
        }
    }, [onChange, value]);

    const closeControl = () => setVisible(false);

    const handleControlClick = () => (!disabled && !readOnly) && setVisible(prev => !prev);

    const handleChange = (val?: Moment, rangeTime?: [number,number]) =>
    {
        if (!showTimeSelect && !showTimeSelectOnly && val)
        {
            val = val.startOf('date');
        }

        // fake event, purpose to assign target for event, not to fire event, search for another approach later
        const event = new Event('input', { bubbles: true });
        inputRef.current && inputRef.current.dispatchEvent(event);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        event.target.value = val;

        customOnChange && customOnChange(event as any);

        rangeTime && setLocalRangeTime(rangeTime);
        setLocalValue(val ?? null);
        setIsFormat(true);
        onChange && onChange(val, rangeTime);

        visible && !(showTimeSelectOnly || (showTimeSelect && tab === 1)) && closeControl();
        !isFormat && setIsFormat(true);
    };

    const formatValueControl = () =>
    {
        if (!localValue)
        {
            return '';
        }

        let valueFormat = '';

        const localLocaleValue = localValue.clone().locale(language);

        if (showTimeSelectOnly)
        {
            valueFormat = localLocaleValue.format('LT');
        }
        else
        {
            if (showTimeRange)
            {
                const values: string[] = [];
                localRangeTime.forEach((time) =>
                {
                    const dateAdjust = (time > 24) ? localValue.get('date') + 1 : (time < 0 ? localValue.get('date') - 1 : localValue.get('date'));
                    const timeAdjust = (time > 24) ? time - 24 : (time < 0 ? time + 24 : time);

                    values.push(moment().set('date', dateAdjust).hour(timeAdjust).minute(0).format('L hA'));
                });

                valueFormat = values.join(' - ');
            }
            else if (showTimeSelect)
            {
                valueFormat = localLocaleValue.format('L LT');
            }
            else
            {
                valueFormat = localLocaleValue.format('L');
            }
        }

        return valueFormat;
    };

    const handleClearValueClick = (e: React.MouseEvent<HTMLElement>) =>
    {
        e.stopPropagation();
        setLocalValue(null);
        onChange && onChange();
    };

    const handleValue = (val: string) =>
    {
        customOnChange && customOnChange(val as any);
        setIsFormat(false);

        const longDateFormatL = moment.localeData().longDateFormat('L');
        const longDateFormatLT = longDateFormatL + ' HH:mm';
        const timeFormat = 'HH:mm';
        const format = showTimeSelectOnly ? timeFormat : longDateFormatLT;
        setFormat(format);

        const defaultDate = props.value ? moment(props.value) : moment();

        let resultVal = formatValue(val);
        const cloneValue = resultVal;

        if (showTimeSelectOnly)
        {
            resultVal = defaultDate.format(longDateFormatL) + ' ' + resultVal;
        }

        const compareValue = moment.utc(resultVal, longDateFormatLT);
        if (minDate)
        {
            const formattedMinDate = moment.utc(moment(minDate).format(longDateFormatLT), longDateFormatLT);
            const isBefore = moment(compareValue).isBefore(formattedMinDate);
            resultVal = isBefore ? moment(formattedMinDate).format(format) : resultVal;
        }
        else if (maxDate)
        {
            const formattedMaxDate = moment.utc(maxDate, longDateFormatLT);
            const isAfter = moment(compareValue).isAfter(formattedMaxDate);
            resultVal = isAfter ? moment(formattedMaxDate).format(format) : resultVal;
        }

        const formattedValue = moment.utc(resultVal, longDateFormatLT);

        onChange && (formattedValue.isValid() ? onChange(formattedValue) : onChange());

        setInputValue(cloneValue);
        setTab(cloneValue.length >= longDateFormatL.length ? 1 : 0);
    };

    const valueFormat = formatValueControl();

    return (
        <div
            ref={containerRef}
            style={{ width: '100%' }}
            className={clsx('dtp-container', disabled && 'dtp-container-disabled')}
            tabIndex={0}
        >
            <DateTimePickerController
                innerRef={el =>
                {
                    !!ref && isCallBackRef(ref) && ref(el);
                    inputRef.current = el;
                    el && setInput(el);
                }}
                className={className}
                isVisible={visible}
                placeholder={t(placeholder)}
                value={(isFormat || (inputValue && !visible)) ? valueFormat : (typeof inputValue === 'string' ? inputValue : valueFormat)}
                disabled={disabled}
                name={name}
                clearable={clearable}
                showTimeSelectOnly={showTimeSelectOnly}
                readOnly={readOnly}
                searchable
                // onSearch={val => setState({ searchKey: val })}
                onChange={handleValue}
                onClearValueClick={handleClearValueClick}
                onControlClick={handleControlClick}
            />

            {
                visible && !disabled && (
                    <AnchorOverlay
                        anchorEl={containerRef}
                        className='dtp-overlay'
                        width={'20rem'}
                        backdrop={false}
                    >
                        <InputMoment
                            moment={localValue}
                            rangeTime={localRangeTime}
                            minStep={1}
                            hourStep={1} // default
                            showTimeSelect={showTimeSelect && !showTimeRange} // default
                            showTimeSelectOnly={showTimeSelectOnly && !showTimeRange}
                            showTimeRange={showTimeRange}
                            {...(minDate && { minDate: moment(minDate) })}
                            {...(maxDate && { maxDate: moment(maxDate) })}
                            {...(minTime && { minTime: moment(minTime) })}
                            {...(maxTime && { minTime: moment(maxTime) })}
                            tab={tab}
                            onTab={setTab}
                            onChange={handleChange}
                        />
                    </AnchorOverlay>
                )}
        </div>
    );
});
