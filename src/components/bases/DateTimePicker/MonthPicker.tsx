import clsx from 'clsx';
import chunk from 'lodash/chunk';

import moment, { Moment } from 'moment';

import { Month } from './Month';

export type MonthPickerProps = {
    className?: string
    value?: Moment
    onChange?: (moment: Moment) => void
    minDate?: Moment
    maxDate?: Moment
}

export const MonthPicker = (props: MonthPickerProps): JSX.Element =>
{
    const { className, value, onChange, minDate, maxDate } = props;

    const currentValue = value?.clone() || moment();

    const handleClick = (month_index: number) =>
    {
        const newMoment = currentValue.clone().set('month', month_index);
        onChange && onChange(newMoment);
    };

    const isMinValid = (m: Moment) =>
    {
        return !minDate || (m && m.isSameOrAfter(minDate, 'month'));
    };

    const isMaxValid = (m: Moment) =>
    {
        return !maxDate || (m && m.isSameOrBefore(maxDate, 'month'));
    };

    const isCurrent = (m: Moment) =>
    {
        return m && m.isSame(currentValue, 'month');
    };

    return (
        <div className={clsx('m-calendar', className)}>
            <table>
                <tbody>
                    {/* Month list */}
                    {
                        chunk(Array(12), 3).map((row, row_index) => (
                            <tr key={row_index}>
                                {
                                    row.map((i, col_index) =>
                                    {
                                        const monthIndex = row_index * 3 + col_index;
                                        const current = currentValue.clone().set('month', monthIndex);

                                        return (
                                            <Month
                                                key={col_index}
                                                label={current.format('MMMM')}
                                                valid={isMinValid(current) && isMaxValid(current)}
                                                selected={isCurrent(current)}
                                                onClick={() => handleClick(monthIndex)}
                                            />
                                        );
                                    })}
                            </tr>
                        ),
                        )}
                </tbody>
            </table>
        </div>
    );
};
