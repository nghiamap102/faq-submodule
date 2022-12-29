import './CheckBoxGroup.scss';

import React from 'react';
import classNames from 'classnames';

export type CheckBoxGroupProps = {
    label?: string,
    className?: string,
    isRequired?: boolean,
    isDisabled?: boolean,
    orientation?: 'horizontal' | 'vertical',
    onChange?: () => void,
}

export const CheckBoxGroup: React.FC<CheckBoxGroupProps> = (props) =>
{
    const {
        label,
        className,
        children,
        isRequired,
        isDisabled,
        orientation = 'horizontal',
        onChange,
    } = props;

    const classes = classNames(
        'checkbox-group__form',
        className ? className : null,
        {
            'checkbox-group--vertical': orientation === 'vertical',
        },
    );

    return (
        <fieldset
            className={classes}
            onChange={onChange}
        >
            {label && (
                <legend className='checkbox-group__label'>
                    {label}
                    &nbsp;
                    {isRequired ? '(required)' : '(optional)'}
                </legend>
            )}
            <div className='checkbox-group__fields'>
                {React.Children.map(children, (child, i) =>
                {
                    if (React.isValidElement(child))
                    {
                        return React.cloneElement(child, { disabled: isDisabled, index: i });
                    }

                    return undefined;
                })}
            </div>
        </fieldset>
    );
};
