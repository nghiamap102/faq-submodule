import { createUniqueId } from 'utils/uniqueId';

import { DynamicFormComponents, FormFieldComponents, JsonFormDynamicField, WrapperComponents } from '../model/smartFormType';
import { MAPPED_COMPONENTS, WRAPPER_COMPONENTS } from '../constants/smartForm';

type UseJsonToFormParser = (fields: JsonFormDynamicField[]) => { formChildren: JSX.Element[]}
export const useJsonToFormParser: UseJsonToFormParser = (fields) =>
{
    const generateFormChildren = (fields: JsonFormDynamicField[]) => fields.map(field => generateFormChild(field));

    const generateFormChild = (field: JsonFormDynamicField<DynamicFormComponents>) => isWrapperComponent(field)
        ? generateWrapperComponent(field)
        : generateFormFieldComponent(field);

    const generateWrapperComponent = (field: JsonFormDynamicField<WrapperComponents>) =>
    {
        const { props, component, fields } = field;
        const Component = MAPPED_COMPONENTS[component];
        return (
            <Component
                key={createUniqueId()}
                {...props}
            >{generateFormChildren(fields)}
            </Component>
        );
    };

    const generateFormFieldComponent = (field: JsonFormDynamicField<FormFieldComponents>) =>
    {
        const Component = MAPPED_COMPONENTS[field.component];

        const parsedProps = isFormControlLabelComponent(field)
            ? { ...field.props, control: generateFormChild(field.props.control) }
            : field.props;
        return (
            <Component
                key={createUniqueId()}
                {...parsedProps}
            />
        );
    };

    return { formChildren: generateFormChildren(fields) };
};

const isWrapperComponent = (field: any):field is JsonFormDynamicField<WrapperComponents> => WRAPPER_COMPONENTS.includes(field.component);
const isFormControlLabelComponent = (field: any):field is JsonFormDynamicField<'FormControlLabel'> => field.component === 'FormControlLabel';
