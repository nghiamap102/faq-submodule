import { FieldValues, UseFormRegister } from 'react-hook-form';
import { Property } from 'csstype';
import { CustomOnChange, IControllableField } from '../../../../components/bases/Form/model/smartFormType';
export declare type InputProps = {
    onChange?: (value: any) => void;
    register?: UseFormRegister<FieldValues>;
    autoFocus?: boolean;
    border?: Property.Border;
    files?: Object;
    multiple?: boolean;
    checked?: boolean;
    id?: string;
} & IControllableField & CustomOnChange & Omit<JSX.IntrinsicElements['input'], 'onChange' | 'ref'>;
export declare type ClearableInputProps = {
    clearable?: boolean;
} & InputProps;
export declare type SearchBoxProps = {
    value?: string;
    autoFocus?: boolean;
    flex?: number;
} & InputProps;
//# sourceMappingURL=inputType.d.ts.map