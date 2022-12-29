import React from 'react';
import clsx from 'clsx';

import { Typography } from 'components/bases/Text/Text';

import { FieldSetProps } from './model/formType';

import './FormGroup.scss';

/**
* FieldSet inherit html's fieldset element attribute.
* FieldSet component implement html's form accessibility
* It's must be wrapped by Form component (following )
*
* @param legend content of legend
* @param legendTypo variant of legend typography
* @param align alignment of legend content
* @param noBorder show/hide html's legend default border
*/
export const FieldSet:React.FC<FieldSetProps> = (props) =>
{
    const { legendTypo = 'Sub1', align = 'center', noBorder = true, legend, children, ...restFieldSetProps } = props;

    const fieldSetClasses = clsx(noBorder && 'field-set__no-border');
    const legendClasses = clsx('field-set-legend', `field-set-legend__${align}`);

    return (
        <fieldset
            {...restFieldSetProps}
            className={fieldSetClasses}
        >
            {noBorder && <Typography variant={legendTypo}>{legend}</Typography>}
            <legend className={legendClasses}><Typography variant={legendTypo}>{legend}</Typography></legend>
            {children}
        </fieldset>
    );
};
