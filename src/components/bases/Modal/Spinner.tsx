import React, { CSSProperties } from 'react';
import clsx from 'clsx';

import './Spinner.scss';

export type ISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type SpinnerProps = {
    className?: string;
    color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
    size?: ISize;
}

interface ISpinnerStyle extends CSSProperties {
    '--line-color': string;
}

export const Spinner = (props: SpinnerProps): React.ReactElement =>
{
    const { className, size = 'md', color = 'primary' } = props;

    const classNames = clsx(
        'spinner',
        {
            [`size-${size}`]: size,
        },
        className);

    const spinnerStyle: ISpinnerStyle = { '--line-color': color ? `var(--${color}-color)` : '' };

    return (
        <svg
            className={classNames}
            style={spinnerStyle}
            viewBox="0 0 50 50"
        >
            <circle
                className="spinner__ring"
                cx="25"
                cy="25"
                r="22.5"
            />
            <circle
                className="spinner__line"
                cx="25"
                cy="25"
                r="22.5"
            />
        </svg>
    );
};
