import React from 'react';
import { DataTypes } from './DataTypes';
export interface DynamicFormProps {
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
export declare const DynamicForm: React.FC<DynamicFormProps>;
//# sourceMappingURL=DynamicForm.d.ts.map