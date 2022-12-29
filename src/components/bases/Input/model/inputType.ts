import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Property } from 'csstype';

import { CustomOnChange, IControllableField } from 'components/bases/Form/model/smartFormType';

export type InputProps = {
    onChange?: (value: any) => void, // Override

    // ADD
    register?: UseFormRegister<FieldValues>
    autoFocus?: boolean,
    border?: Property.Border,
    files?: Object,
    multiple?: boolean,
    checked?: boolean,
    id?: string,
} & IControllableField & CustomOnChange & Omit<JSX.IntrinsicElements['input'], 'onChange' | 'ref'>

export type ClearableInputProps = {
    clearable?: boolean
} & InputProps;

export type SearchBoxProps = {
    value?: string,
    autoFocus?: boolean
    flex?: number
} & InputProps
