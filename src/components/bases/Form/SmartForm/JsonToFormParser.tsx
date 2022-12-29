import React, { memo } from 'react';

import ConditionalWrapper from 'components/bases/HOC/ConditionalWrapper';
import { Section } from 'components/bases/Section/Section';

import { SmartForm } from './SmartForm';
import { useJsonToFormParser } from '../hooks/useJsonToFormParser';
import { JsonToFormDefinition } from '../model/smartFormType';

export type JsonToFormParserProps = {
    /**
    * Form definition define the structure of generated form.
    * @example
    *  definition = {
        id: 'form-id,
        mode: 'onChange',
        onSubmit: handleSubmit,
        formName: 'Register',
        fields: [
            fields: [
                {
                    component: 'FormControlLabel',
                    props: {
                        icon: 'user',
                        label: 'Username',
                        labelLocation: 'left',
                        control: {
                            component: 'Input',
                            props: {
                                rules: { required: true },
                                name: 'username',
                                type: 'text',
                            },
                        },
                    },
                },
                {
                    component: 'FormControlLabel',
                    props: {
                        label: 'Password',
                        control: {
                            component: 'Input',
                            props: {
                                name: 'user-password',
                                type: 'password',
                                defaultValue: 'abc@xyz.com',
                            },
                        },
                    },
                },
            ],
        }
     */
    definition: JsonToFormDefinition
}

/**
* JsonToFormParser is a form generator which create React Elements base on form definition props.
*
* @example
* <JsonToFormParser definition={definition} />
*/
const JsonToFormParser = memo(function JsonToFormParser({ definition }: JsonToFormParserProps): JSX.Element
{
    const { fields, formName, ...smartFormProps } = definition;
    const { formChildren } = useJsonToFormParser(fields);

    return (
        <ConditionalWrapper
            condition={!!formName}
            wrapper={(children) => <Section header={formName as string}>{children}</Section>}
        >
            <SmartForm {...smartFormProps}>
                {formChildren}
            </SmartForm>
        </ConditionalWrapper>
    );
});

export { JsonToFormParser };
