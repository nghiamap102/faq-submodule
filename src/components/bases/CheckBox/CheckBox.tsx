import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { T } from 'components/bases/Translate/Translate';
import { Input } from 'components/bases/Input/Input';
import { createUniqueId } from 'utils/uniqueId';
import { CustomOnChange, IControllableField } from '../Form/model/smartFormType';

import './CheckBox.scss';

export interface CheckBoxProps extends IControllableField, CustomOnChange {
    className?: string
    label?: string
    value?: string | number
    checked?: boolean
    onChange?: (value: boolean) => void
    disabled?: boolean
    displayAs?: 'checkbox' | 'radio'
    indeterminate?: boolean
    id?: string
    index?: number
    checkBoxSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>((props, ref) =>
{
    const { className, label, checked, onChange, disabled, displayAs = 'checkbox', indeterminate = false, id, checkBoxSize = 'md', ...checkboxProps } = props;

    const handleChange = (e: React.FormEvent<HTMLElement>) =>
    {
        e.stopPropagation();
        !disabled && onChange && onChange(!checked);
    };

    const uniqueId = createUniqueId();

    const wrapperClassName = clsx(className, 'checkbox-form' , disabled && 'disabled');
    const checkBoxClassName = clsx({
        ['checkbox-input']: displayAs === 'checkbox',
        ['radio-input']: displayAs !== 'checkbox',
        ['checked']: checked,
        ['disabled']: disabled,
        ['indeterminate']: indeterminate && displayAs === 'checkbox',
        [`checkbox--icon-${checkBoxSize}`]: checkBoxSize,
    });

    return (
        <>
            <div className={wrapperClassName}>
                <label
                    className='checkbox-item'
                    htmlFor={id ? id : `checkbox-${uniqueId}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Input
                        ref={ref}
                        id={id ? id : `checkbox-${uniqueId}`}
                        type={displayAs === 'checkbox' ? 'checkbox' : 'radio'}
                        disabled={disabled}
                        checked={checked}
                        onChange={handleChange}
                        {...checkboxProps}
                    />

                    <span className={checkBoxClassName} />

                    <span className="checkbox-label">
                        <T>{label}</T>
                    </span>
                </label>
            </div>
        </>
    );
});

CheckBox.displayName = 'CheckBox';
