import clsx from 'clsx';

export type DayProps = {
    className?: string
    day: number
    week: number
    currentValue?: boolean
    valid?: boolean
    onClick?: () => void
}

export const Day = (props: DayProps): JSX.Element =>
{
    const { day, week, currentValue, className, valid, onClick } = props;

    const prevMonth = week === 0 && day > 7;
    const nextMonth = week >= 4 && day <= 14;

    const tdClasses = clsx({
        'prev-month': prevMonth,
        'next-month': nextMonth,
        'current-value': currentValue,
        'invalid': !valid,
    });

    const handleClick = () =>
    {
        valid && onClick && onClick();
    };

    return (
        <td
            className={tdClasses}
            onClick={handleClick}
        >
            <div className={clsx('day-content', className)}>
                {day}
            </div>
        </td>
    );
};
