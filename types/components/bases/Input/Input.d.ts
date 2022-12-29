import React from 'react';
import './Input.scss';
export declare const Input: React.ForwardRefExoticComponent<{
    onChange?: ((value: any) => void) | undefined;
    register?: import("react-hook-form").UseFormRegister<import("react-hook-form").FieldValues> | undefined;
    autoFocus?: boolean | undefined;
    border?: import("csstype").Property.Border<0 | (string & {})> | undefined;
    files?: Object | undefined;
    multiple?: boolean | undefined;
    checked?: boolean | undefined;
    id?: string | undefined;
} & import("../Form/model/smartFormType").IControllableField<Record<string, unknown>> & import("../Form/model/smartFormType").CustomOnChange & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref" | "onChange"> & React.RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Input.d.ts.map