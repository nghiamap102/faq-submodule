import React from 'react';
export declare const RichText: React.ForwardRefExoticComponent<{
    defaultValue?: string | undefined;
    placeholder?: string | undefined;
    className?: string | undefined;
    color?: import("csstype").Property.Color | undefined;
    rows?: number | undefined;
    value?: string | undefined;
    disabled?: boolean | undefined;
    onChange?: ((value: string) => void) | undefined;
    border?: import("csstype").Property.Border<0 | (string & {})> | undefined;
} & import("../Form/model/smartFormType").IControllableField<Record<string, unknown>> & import("../Form/model/smartFormType").CustomOnChange & Omit<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref" | "onChange"> & React.RefAttributes<HTMLTextAreaElement>>;
//# sourceMappingURL=RichText.d.ts.map