import React from 'react';
import clsx from 'clsx';

import { T } from 'components/bases/Translate/Translate';

import { FormWrapperProps } from '../model/formType';

import './InputGroup.scss';

export const InputAppend: React.FC<FormWrapperProps> = ({ children, className }) =>
{
    const classes = clsx('input-append', className);

    return (
        <div className={classes}>
            {typeof children === 'string' ? <span><T>{children}</T></span> : children}
        </div>
    );
};
