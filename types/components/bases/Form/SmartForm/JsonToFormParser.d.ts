import React from 'react';
import { JsonToFormDefinition } from '../model/smartFormType';
export declare type JsonToFormParserProps = {
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
    definition: JsonToFormDefinition;
};
/**
* JsonToFormParser is a form generator which create React Elements base on form definition props.
*
* @example
* <JsonToFormParser definition={definition} />
*/
declare const JsonToFormParser: React.NamedExoticComponent<JsonToFormParserProps>;
export { JsonToFormParser };
//# sourceMappingURL=JsonToFormParser.d.ts.map