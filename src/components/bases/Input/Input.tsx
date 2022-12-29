import React, { ChangeEventHandler, forwardRef, useState, useRef, MutableRefObject } from 'react';
import clsx from 'clsx';
import { FAIcon } from '@vbd/vicon';

import { useI18n } from 'components/bases/I18n/useI18n';
import { Sub1 } from 'components/bases/Text/Text';
import { isCallBackRef } from 'utils';

import { InputProps } from './model/inputType';

import './Input.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) =>
{
    const { customOnChange, placeholder, step, width, height, className, border, onChange, errorText, type, checked, id, style, ...inputProps } = props;
    const inputRef = useRef(null) as MutableRefObject<HTMLInputElement | null>;
    const { t } = useI18n();
    const [hidden, setHidden] = useState(true);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    {
        customOnChange && customOnChange(event);
        !customOnChange && onChange && (type === 'checkbox' || type === 'radio' ? onChange(event) : onChange(event.target.value));
    };
    
    const stepUp = () =>
    {
        if (!inputRef.current)
        {
            return;
        }
        inputRef.current.stepUp();
        inputRef.current.focus();
        props.onChange && props.onChange(inputRef.current.value);
    };

    const stepDown = () =>
    {
        if (!inputRef.current)
        {
            return;
        }
        inputRef.current.stepDown();
        inputRef.current.focus();
        props.onChange && props.onChange(inputRef.current.value);
    };

    const inputClasses = clsx(className ,{
        'slider': props.type === 'range',
        'input-password': props.type === 'password',
        'input-number': props.type === 'number',
    });

    return (
        <>
            <input
                ref={(e) =>
                {
                    !!ref && (isCallBackRef(ref) ? ref(e) : ref.current = e);
                    inputRef.current = e;
                }}
                {...inputProps}
                id={id}
                className={inputClasses}
                type={type === 'password' ? (hidden ? 'password' : 'text') : type}
                placeholder={t(placeholder)}
                step={type === 'date' ? undefined : step}
                style={{ ...style, width: width, border: border, height: height }}
                checked={(type === 'checkbox' || type === 'radio') && checked}
                data-autofocus
                onChange={handleChange}
            />

            {errorText && (
                typeof errorText === 'string'
                    ? <Sub1 color={'danger'}>{errorText}</Sub1>
                    : errorText.map((text: string, index: number) => (
                        <>
                            <Sub1
                                key={`error-${index}`}
                                color={'danger'}
                            >
                                {text}
                            </Sub1>
                            <br />
                        </>
                    ))
            )}

            {type === 'password' && (
                <div className="input-password-icon">
                    <FAIcon
                        icon={hidden ? 'eye-slash' : 'eye'}
                        type="light"
                        size={'1rem'}
                        onClick={() => setHidden(hidden => !hidden)}
                    />
                </div>
            )}

            { type === 'number' && !props.disabled && !props.readOnly && (
                <div className={'step-control'}>
                    <FAIcon
                        icon={'angle-up'}
                        type={'light'}
                        size={'1rem'}
                        onClick={stepUp}
                    />
                    <FAIcon
                        icon={'angle-down'}
                        type={'light'}
                        size={'1rem'}
                        onClick={stepDown}
                    />
                </div>
            )}
        </>
    );
});

Input.displayName = 'Input';
