import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import range from 'lodash/range';
import chunk from 'lodash/chunk';
import { FAIcon } from '@vbd/vicon';

import { MonthPickerProps } from './MonthPicker';

import './Calendar.scss';
import clsx from 'clsx';

export type YearPickerProps = {
    className?: string
    value?: Moment
    onChange?: (value: Moment) => void
} & Pick<MonthPickerProps, 'minDate' | 'maxDate'>

export const YearPicker = (props: YearPickerProps): JSX.Element =>
{
    const { value, onChange, minDate, maxDate } = props;
    
    const currentValue = value?.clone() || moment();

    const getYears = (currentYear: number): number[] =>
    {
        return ([] as number[]).concat(
            range(currentYear - 7, currentYear),
            [currentYear],
            range(currentYear + 1, currentYear + 8),
        );
    };

    const [center, setCenter] = useState<number>(currentValue.get('year'));
    const [years, setYears] = useState(getYears(center) || []);

    const handleClick = (year: number) =>
    {
        const newMoment = currentValue.set('year', year);
        onChange && onChange(newMoment);
    };

    const prevBatch = () =>
    {
        setCenter(center - 15);
        setYears(getYears(center - 15));
    };

    const nextBatch = () =>
    {
        setCenter(center + 15);
        setYears(getYears(center + 15));
    };

    const isMinValid = (y: number) => !minDate || minDate.get('year') <= y;

    const isMaxValid = (y: number) => !maxDate || maxDate.get('year') >= y;

    return (
        <div className={`m-calendar ${props.className}`}>
            <div className="toolbar">
                <button
                    type="button"
                    className="prev-month"
                    onClick={prevBatch}
                >
                    <FAIcon
                        type='solid'
                        icon='angle-left'
                    />
                </button>
                <button
                    type="button"
                    className="next-month"
                    onClick={nextBatch}
                >
                    <FAIcon
                        type='solid'
                        icon='angle-right'
                    />
                </button>
            </div>

            <table>
                <tbody>
                    {
                        chunk(years, 3).map((row, row_index) => (
                            <tr key={row_index}>
                                {
                                    row.map((i) => (
                                        <Year
                                            key={i}
                                            label={i}
                                            valid={isMinValid(i) && isMaxValid(i)}
                                            selected={i === currentValue.get('year')}
                                            onClick={() => handleClick(i)}
                                        />
                                    ),
                                    )}
                            </tr>
                        ),
                        )}
                </tbody>
            </table>
        </div>
    );
};

type YearProps = {
    label: number
    valid?: boolean
    selected?: boolean
    onClick: () => void
}

const Year = (props: YearProps): JSX.Element =>
{
    const { label, valid, selected, onClick } = props;

    const handleClick = () => valid && onClick();

    return (
        <td
            className={clsx('year-item', selected && 'current-value', !valid && 'invalid')}
            onClick={handleClick}
        >
            <div className={'year-content'}>
                {label}
            </div>
        </td>
    );
};
