import React, { useEffect, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

import { Form } from '../Form';
import { SmartFormProps } from '../model/smartFormType';
import { useSmartForm, useSmartFormSynchronizer, useFormStateTaker } from '../hooks';

/**
* SmartForm is a Form wrapper with implement 'react-hook-form' library logic to wrapped children.
*
* Supported react-hook-form's feature: config defaultValues, mode, show error handling, retrieve data when submit.
*
* Supported form's components:
* - Wrapper component: Container, Row, Column, FieldSet,
*   InputGroup, InputAppend, InputPrepend
* - Controllable components: Input, RichText
*
* Reference: {@link https://react-hook-form.com react-hook-form}
*/
export const SmartForm = <FormType extends Record<string, unknown> = FieldValues>(props: SmartFormProps<FormType>): JSX.Element =>
{
    const { children, id, mode = 'onChange', onSubmit, defaultValues, ...formGroupProps } = props;

    const { register, handleSubmit, control, setValue, getValues } = useForm<FormType>({ mode, defaultValues: useMemo(() => defaultValues, [defaultValues]) });

    const formState = useFormStateTaker<FormType>({ formId: id });
    useSmartFormSynchronizer<FormType>({ formId: id, control });

    const { controlledChildren } = useSmartForm<FormType>({ children, register, errors: formState?.errors });

    useEffect(() =>
    {
        // Sync default values with formValue
        for (const [key, value] of Object.entries(defaultValues ?? {}))
        {
            const isUserChanges = getValues(key as any) !== value;
            !isUserChanges && setValue(key as any, value as any);
        }
    });
    
    return (
        <Form
            {...formGroupProps}
            id={id}
            onSubmit={handleSubmit(onSubmit)}
        >
            {controlledChildren}
        </Form>
    );
};
