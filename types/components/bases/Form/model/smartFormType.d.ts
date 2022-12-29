import { ReactNode } from 'react';
import { RegisterOptions, FieldValues, Mode, UnpackNestedValue, DeepPartial, FormState } from 'react-hook-form';
import { RichTextProps } from '../../../../components/bases/Text/model/textType';
import { CheckBoxProps } from '../../../../components/bases/CheckBox';
import { AdvanceSelectProps } from '../../../../components/bases/AdvanceSelect';
import { ButtonProps } from '../../../../components/bases/Button/Button';
import { InputProps } from '../../../../components/bases/Input/model/inputType';
import { ColumnProps, RowProps, Col2Props, Row2Props } from '../../../../components/bases/Layout';
import { ContainerProps } from '../../../../components/bases/Container';
import { FieldSetProps, FormControlLabelProps, FormProps, FormWrapperProps } from './formType';
import { MultilineInputProps } from '../../../../components/bases/MultilineInput/MultilineInput';
export interface IControllableField<F = Record<string, unknown>> {
    name?: string;
    rules?: RegisterOptions<F>;
    errorText?: string | string[];
}
export interface CustomOnChange {
    customOnChange?: React.ChangeEventHandler<HTMLElement>;
}
export declare type DefaultErrorMsgKey = keyof Pick<RegisterOptions, 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'validate'>;
export declare type FormStateCollection = Record<string, FormState<FieldValues>>;
export interface SmartFormProps<F extends Record<string, unknown> = FieldValues> extends Omit<FormProps, 'onSubmit' | 'id'> {
    /**
     * Config default values object. Format: {[key]: value}, which key is form field name, value is form field value.
     *
     * @example
     * defaultValues = {name: "Tony", age: 18}
     */
    defaultValues?: UnpackNestedValue<DeepPartial<F>>;
    /**
     * Id of wrapped form, It is required for SmartForm to mark which form is submitted,
     *
     * @required
     */
    id: string;
    /**
     * Submit function, retrieve form fields data.
     *
     * @param data an object which contain all wrapped form field data. Format: {[key]: value}, which key is form field name, value is form field value
     * @required
     */
    onSubmit: (data: UnpackNestedValue<F>) => void;
    /**
     * React-hook-form's mode, define when should react-hook-form validate user input.
     *
     * Supported mode: onBlur, onChange, onSubmit, onTouched.
     */
    mode?: Mode;
    children?: ReactNode | ReactNode[];
}
export interface JsonToFormDefinition extends SmartFormProps {
    formName?: string;
    fields: JsonFormDynamicField[];
}
export declare type JsonFormDynamicField<Components extends DynamicFormComponents = DynamicFormComponents> = {
    [Component in Components]: {
        component: Component;
        props: MappedFormComponentProps[Component];
    } & {
        holder: Component extends FormFieldComponents ? {
            fields?: never;
        } : {
            fields: JsonFormDynamicField[];
        };
    }['holder'];
}[Components];
export declare type DynamicFormComponents = FormFieldComponents | WrapperComponents;
export declare type FormFieldComponents = 'Input' | 'FormControlLabel' | 'EmptyButton' | 'Button' | 'CheckBox' | 'RichText' | 'AdvanceSelect' | 'DateTimePicker' | 'MultilineInput';
export declare type WrapperComponents = 'FieldSet' | 'Container' | 'Row' | 'Column' | 'Row2' | 'Col2' | 'InputGroup' | 'InputAppend' | 'InputPrepend';
declare type MappedFormComponentProps = {
    Input: InputProps;
    FormControlLabel: Omit<FormControlLabelProps, 'control'> & {
        control: JsonFormDynamicField<Exclude<DynamicFormComponents, 'FormControlLabel'>>;
    };
    FieldSet: FieldSetProps;
    Button: ButtonProps;
    EmptyButton: ButtonProps;
    InputGroup: FormWrapperProps;
    InputAppend: FormWrapperProps;
    InputPrepend: FormWrapperProps;
    RichText: RichTextProps;
    CheckBox: CheckBoxProps;
    AdvanceSelect: AdvanceSelectProps;
    Row: RowProps;
    Column: ColumnProps;
    Row2: Row2Props<'div'>;
    Col2: Col2Props<'div'>;
    Container: ContainerProps;
    DateTimePicker: Record<string, unknown>;
    MultilineInput: MultilineInputProps;
};
export {};
//# sourceMappingURL=smartFormType.d.ts.map