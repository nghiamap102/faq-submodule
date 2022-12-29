import React from 'react';
import clsx from 'clsx';

import { FormGroupProps } from './model/formType';

import './FormGroup.scss';

/**
* FormGroup add padding to wrapped children.
*
* FormGroup is not related with html based form, it's responsibility is for layout only.
*/
export const FormGroup: React.FC<FormGroupProps> = (props) =>
{
    const { direction = 'column', children, className } = props;
    return (
        <div className={clsx('form-group', `form-group-${direction}`, className)}>
            {children}
        </div>
    );
};
