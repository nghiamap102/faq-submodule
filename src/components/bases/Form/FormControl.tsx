import React from 'react';
import clsx from 'clsx';

import { FormWrapperProps } from './model/formType';

import './FormControl.scss';

export const FormControl: React.FC<FormWrapperProps> = ({ children, className }) =>
{
    const classes = clsx('form-control', className);

    return (
        <div className={classes}>
            {children}
        </div>
    );
};
