import React from 'react';
import { CustomOnChange, IControllableField } from '../Form/model/smartFormType';
import './CheckBox.scss';
export interface CheckBoxProps extends IControllableField, CustomOnChange {
    className?: string;
    label?: string;
    value?: string | number;
    checked?: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
    displayAs?: 'checkbox' | 'radio';
    indeterminate?: boolean;
    id?: string;
    index?: number;
    checkBoxSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
export declare const CheckBox: React.ForwardRefExoticComponent<CheckBoxProps & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=CheckBox.d.ts.map