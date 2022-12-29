import React, { useEffect, useState } from 'react';
import moment, { Moment, MomentInput } from 'moment';
import clsx from 'clsx';
import chunk from 'lodash/chunk';
import range from 'lodash/range';

import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

import { Day } from './Day';
import { MonthPicker, MonthPickerProps } from './MonthPicker';
import { YearPicker } from './YearPicker';

import './Calendar.scss';

export type CalendarProps = {
    className?: string
    value: Moment | null
    onChange?: (value: Moment) => void
    onMonthYearChange?: (value: Moment) => void
    highlightDates?: MomentInput[]
    disabled?: boolean
} & Pick<MonthPickerProps, 'minDate' | 'maxDate'>

export const Calendar = (props: CalendarProps): JSX.Element =>
{
    const { value, minDate, maxDate, onChange, onMonthYearChange, highlightDates } = props;

    const currentValue = value?.clone() || moment();

    const [display, setDisplay] = useState<Moment>(currentValue);
    const [picker, setPicker] = useState<'date' | 'month' | 'year'>('date');

    useEffect(() =>
    {
        setDisplay(currentValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const getDate = (day: number, week: number): Moment =>
    {
        const prevMonth = week === 0 && day > 7;
        const nextMonth = week >= 4 && day <= 14;

        const m = display.clone();

        if (prevMonth)
        {
            m.subtract(1, 'month');
        }
        if (nextMonth)
        {
            m.add(1, 'month');
        }

        m.date(day);

        return m;
    };

    const selectDate = (day: number, week: number) =>
    {
        const m = getDate(day, week);
        onChange && onChange(m);
    };

    const prevMonth = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();

        const value = display.clone().subtract(1, 'month');

        setDisplay(value);
        onMonthYearChange && onMonthYearChange(value);
    };

    const nextMonth = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();

        const value = display.clone().add(1, 'month');

        setDisplay(value);
        onMonthYearChange && onMonthYearChange(value);
    };

    const nextYear = () =>
    {
        const value = display.clone().add(1, 'year');

        setDisplay(value);
        props.onMonthYearChange && props.onMonthYearChange(value);
    };

    const prevYear = () =>
    {
        const value = display.clone().subtract(1, 'year');

        setDisplay(value);
        props.onMonthYearChange && props.onMonthYearChange(value);
    };

    const handleChangeDisplay = (value: Moment) =>
    {
        setPicker('date');

        setDisplay(value);
        props.onMonthYearChange && props.onMonthYearChange(value);
    };

    const isMinValid = (m: Moment, minMoment: MomentInput) =>
    {
        return !minMoment || (m && m.isSameOrAfter(minMoment, 'day'));
    };

    const isMaxValid = (m: Moment, maxMoment: MomentInput) =>
    {
        return !maxMoment || (m && m.isSameOrBefore(maxMoment, 'day'));
    };

    const d1 = display.clone().subtract(1, 'month').endOf('month').date();
    const d2 = display.clone().date(1).day();
    const d3 = display.clone().endOf('month').date();

    const days = ([] as number[]).concat(
        range(d1 - d2 + 1, d1 + 1),
        range(1, d3 + 1),
        range(1, 42 - d3 - d2 + 1),
    );

    const weeks = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const disabled = props.disabled;

    return (
        <>
            { (picker === 'date') && (
                <div className={clsx('m-calendar', props.className)}>
                    <div className="toolbar">
                        <div className="button-group">
                            <button
                                type="button"
                                className="prev-month"
                                disabled={disabled}
                                onClick={prevYear}
                            >
                                <FAIcon icon='angle-double-left' />
                            </button>
                            <button
                                type="button"
                                className="prev-month"
                                disabled={disabled}
                                onClick={prevMonth}
                            >
                                <FAIcon icon='angle-left' />
                            </button>
                        </div>
                        <span className="current-date">
                            <button onClick={() => setPicker('month')}>{display.format('MMMM')}</button>
                            <button onClick={() => setPicker('year')}>{display.format('YYYY')}</button>
                        </span>
                        <div className="button-group">
                            <button
                                type="button"
                                className="next-month"
                                disabled={disabled}
                                onClick={nextMonth}
                            >
                                <FAIcon icon='angle-right' />
                            </button>
                            <button
                                type="button"
                                className="prev-month"
                                disabled={disabled}
                                onClick={nextYear}
                            >
                                <FAIcon icon='angle-double-right' />
                            </button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                {weeks.map((w, i) => <td key={i}><T>{w}</T></td>)}
                            </tr>
                        </thead>

                        <tbody>
                            {
                                chunk(days, 7).map((row, week) => (
                                    <tr key={week}>
                                        {
                                            row.map((day) =>
                                            {
                                                let isHighlighted = false;
                                                const current = getDate(day, week);

                                                if (Array.isArray(highlightDates) && highlightDates.find((x) => moment(x).format('DD/MM/YYYY') === current.format('DD/MM/YYYY')))
                                                {
                                                    isHighlighted = true;
                                                }

                                                return (
                                                    <Day
                                                        key={current.format('DD-MM-YYYY')}
                                                        className={isHighlighted ? 'highlight' : `${current.isSame(moment(), 'date') ? 'today' : ''}`}
                                                        day={day}
                                                        week={week}
                                                        valid={isMaxValid(current, maxDate) && isMinValid(current, minDate)}
                                                        currentValue={current.isSame(currentValue, 'day')}
                                                        onClick={() => !disabled && selectDate(day, week)}
                                                    />
                                                );
                                            })}
                                    </tr>
                                ),
                                )}
                        </tbody>
                    </table>
                </div>
            )}

            {(picker === 'month') && (
                <MonthPicker
                    value={display}
                    minDate={minDate}
                    maxDate={maxDate}
                    onChange={handleChangeDisplay}
                />
            )}

            {(picker === 'year') && (
                <YearPicker
                    value={display}
                    minDate={minDate}
                    maxDate={maxDate}
                    onChange={handleChangeDisplay}
                />
            )}
        </>
    );
};
