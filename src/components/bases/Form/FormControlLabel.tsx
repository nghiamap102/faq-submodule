import React from 'react';
import clsx from 'clsx';
import { FAIcon } from '@vbd/vicon';

import { Sub2 } from 'components/bases/Text/Text';
import { T } from 'components/bases/Translate/Translate';

import { FormControlLabelProps } from './model/formType';

import './Form.scss';

/**
* FormControlLabel is an UI layer for combining label content with a form field component.
*
* Common control components is AdvanceSelect, CheckBox, DateTimePicker, Input,....
*/
export const FormControlLabel = (props: FormControlLabelProps): JSX.Element =>
{
    const { iconType = 'solid', iconSize = '1rem', labelWidth = '70px', labelLocation = 'left', direction = 'row', rules = [] } = props;
    const { required, dirty, className, control, iconClassName, icon, label, errorText } = props;

    const isInvalid = rules?.length > 0 || errorText;

    const wrapperClasses = clsx('form-control-label', `form-control-${direction}` , className);
    const labelClasses = clsx('form-label', `form-label-align-${labelLocation}`);

    const containerClasses = clsx('form-control-container' ,{
        ['required']: required,
        ['invalid']: isInvalid,
        ['dirty']: dirty,
        ['form-input-number']: React.isValidElement(control) && control.props.type === 'number',
        ['form-input-number-group']: React.isValidElement(control) && Array.isArray(control.props.children) && control.props.children.find((c: Record<string, any>) => c.props?.type === 'number'),
        ['invalid-error']: isInvalid && errorText,
    });

    return (
        <>
            <div className={wrapperClasses}>
                {
                    icon && (
                        <FAIcon
                            icon={icon}
                            className={iconClassName}
                            type={iconType}
                            size={iconSize}
                        />
                    )}

                {
                    label && (
                        <div
                            className={labelClasses}
                            style={{ width: direction === 'row' ? labelWidth : '' }}
                        >
                            <T>{label}</T>
                        </div>
                    )}

                <div className={containerClasses}>
                    {
                        control && React.isValidElement(control)
                            ? React.cloneElement(control, { className: clsx(control.props.className, 'form-control') })
                            : control
                    }
                </div>
            </div>

            {
                isInvalid && (
                    <Sub2
                        color={'danger'}
                        style={{ marginLeft: labelWidth, paddingLeft: '10px', lineHeight: 'unset' }}
                    >
                        <T>{errorText}</T>&nbsp;
                    </Sub2>
                )}
        </>
    );
};
