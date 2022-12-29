import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { FAIcon } from '@vbd/vicon';

import { Input } from './Input';
import { ClearableInputProps } from './model/inputType';

import './ClearableInput.scss';

export const ClearableInput = (props: ClearableInputProps): JSX.Element =>
{
    const inputRef = useRef<HTMLInputElement>(null);
    const { type = 'text', step = 1, width = '100%', border = 'block', value, onChange, clearable, disabled, className, height, ...restInputProps } = props;

    const [hasValue, setHasValue] = useState(false);

    useEffect(() =>
    {
        if (hasValue === !!value)
        {
            return;
        }
        setHasValue(!!value);
    }, [value, hasValue]);

    const handleChange = (value: string) =>
    {
        setHasValue(!!value);
        onChange && onChange(value);
    };

    const handleClearValueClick = () =>
    {
        setHasValue(false);
        onChange && onChange('');
    };

    return (
        <div
            style={{ width: '100%' }}
            className="ci-container"
            tabIndex={0}
        >
            <div
                className="ci-control-container"
            >
                <Input
                    {...restInputProps}
                    ref={inputRef}
                    value={value}
                    className={clsx('input-text', className, type === 'range' && 'slider')}
                    type={type}
                    disabled={disabled}
                    step={type === 'date' ? undefined : step}
                    style={{ width, border, height }}
                    onChange={handleChange}
                />
                {
                    clearable && !disabled && hasValue && (
                        <div className="clear">
                            <FAIcon
                                icon={'times'}
                                size={'1rem'}
                                onClick={handleClearValueClick}
                            />
                        </div>
                    )}
            </div>
        </div>
    );
};
