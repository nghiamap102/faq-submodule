import React from 'react';
import { DataTypes } from '../../../components/bases/DynamicDisplayForm/DataTypes';
import { TagProps } from '../../../components/bases/Tag/Tag';
export interface DynamicFieldProps {
    schema: DataTypes;
    value: any;
    options?: any;
    onChange: Function;
    onChangeDone?: Function;
    onClose?: Function;
    className?: string;
    onChangeFiles?: Function;
    autoFocus?: boolean;
    changeImmediately?: boolean;
}
export interface IOption extends TagProps {
    label: string;
    id: string;
    textColor?: string;
}
export declare const DynamicField: React.FC<DynamicFieldProps>;
//# sourceMappingURL=DynamicField.d.ts.map