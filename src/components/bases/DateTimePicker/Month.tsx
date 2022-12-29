import { ReactNode } from 'react';
import clsx from 'clsx';

import './Calendar.scss';

export type MonthProps = {
    selected?: boolean
    valid?: boolean
    label?: ReactNode
    onClick?: () => void
}

export const Month = (props: MonthProps): JSX.Element =>
{
    const { label, selected, valid, onClick } = props;

    const handleClick = () => valid && onClick && onClick();

    return (
        <td
            className={clsx('month-item', selected && 'current-value', !valid && 'invalid')}
            onClick={handleClick}
        >
            <div className={'month-content'}>
                {label}
            </div>
        </td>
    );
};
