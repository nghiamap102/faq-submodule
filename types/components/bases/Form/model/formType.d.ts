import React, { ReactNode } from 'react';
import { Property } from 'csstype';
import { TypographyVariant } from '../../../../components/bases/Text/model/textType';
import { UseFormAutoFocusProps } from '../../../../components/bases/Form/hooks/useFormAutoFocus';
export declare type FieldSetProps = {
    legend: string;
    noBorder?: boolean;
    align?: 'left' | 'center' | 'right';
    legendTypo?: TypographyVariant;
} & JSX.IntrinsicElements['fieldset'];
export declare type FormProps = {
    /**
     * Define direction of wrapped components, follow css flex direction property.
     *
     * @default column
     */
    direction?: 'row' | 'column';
} & JSX.IntrinsicElements['form'] & UseFormAutoFocusProps;
export declare type FormGroupProps = {
    className?: string;
    direction?: 'row' | 'column';
};
export interface FormWrapperProps {
    className?: string;
}
export interface FormControlLabelProps {
    className?: string;
    /**
     * Define if controlled field is required.
     * If required = true, the '*' mark will be added after the form label.
     * @default false
     */
    required?: boolean;
    /**
     * Define if controlled field is dirty.
     * If required = true, the controlled form field will be underline.
     * @default false
     */
    dirty?: boolean;
    /**
     * Define controlled component, It's a reactNode (which can be a react component or primitive type).
     * Common control components is: AdvanceSelect, CheckBox, DateTimePicker, Input, RichText,....
     * If control is defined as react component, className 'form-control' will be added to activate controlled form styling.
     */
    control?: React.ReactNode;
    /**
     * Define icon name, follow the font-awesome icon name system with removed 'fa' prefix.
     *
     * {@link https://fontawesome.com/v6.0/icons FontAwesome icon}
     * @example
     * Font-awesome: 'fa-angle-right' -> icon: 'angle-right'
     */
    icon?: string;
    /**
     * Define icon's className for customizing Icon UI
     */
    iconClassName?: string;
    /**
     * Define icon type, follow the font-awesome type system.
     *
     * {@link https://fontawesome.com/v6.0/icons FontAwesome icon}
     * @default solid
     */
    iconType?: 'solid' | 'regular' | 'light';
    /**
     * Define icon size
     * @default 1rem
     * @todo Correct vbd/vicon <FAIcon> type to use 'size' as css FontSize property.
     */
    iconSize?: string;
    /**
     * Define label content.
     */
    label?: string | ReactNode;
    /**
     * Customize label content width
     * @default 70px
     */
    labelWidth?: Property.Width;
    /**
     * Define label location related with controlled component
     * @default left
     */
    labelLocation?: 'left' | 'right';
    /**
     * Define direction of label and controlled component, follow css flex direction property
     * @default row
     */
    direction?: 'row' | 'column';
    /**
     * Define an error text.
     */
    errorText?: string;
    rules?: unknown[];
}
//# sourceMappingURL=formType.d.ts.map