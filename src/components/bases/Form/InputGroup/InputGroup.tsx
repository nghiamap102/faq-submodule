import React from 'react';
import clsx from 'clsx';

import { FormWrapperProps } from '../model/formType';

import './InputGroup.scss';

export const InputGroup:React.FC<FormWrapperProps> = ({ children, className }) =>
{
    const classes = clsx('form-input-group', className);

    return (
        <div className={classes}>
            {children}
        </div>
    );
};
