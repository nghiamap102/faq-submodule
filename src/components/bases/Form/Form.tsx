import React from 'react';
import clsx from 'clsx';

import { FORM_GROUP_BASE_CLASSNAME } from './constants/formGroup';
import { FormProps } from './model/formType';
import { useFormAutoFocus } from './hooks/useFormAutoFocus';

import './Form.scss';

/**
* Form inherit html's form element attribute.
*
* It is required wrapper to implement FieldSet component.
*
* Supported feature:
* - Html form feature: submit on enter.
* - Autofocus on it's first wrapped form field in DOM.
*/
export const Form: React.FC<FormProps> = (props) =>
{
    const {
        direction = 'column',
        onSubmit = () => null,
        children,
        className,
        autoFocus,
        ...restFormProps
    } = props;

    useFormAutoFocus({ autoFocus });

    const classes = clsx(FORM_GROUP_BASE_CLASSNAME, `form-group-${direction}`, className);

    return (
        <form
            {...restFormProps}
            className={classes}
            onSubmit={onSubmit}
        >
            {children}
            <input
                type="submit"
                hidden
            />
        </form>
    );
};

