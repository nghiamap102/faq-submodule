import React, { FC } from 'react';
import { CustomOnChange } from '../../../components/bases/Form/model/smartFormType';
import './DateTimePickerController.scss';
export declare type DateTimePickerControllerProps = {
    value: string;
    className?: string;
    readOnly?: boolean;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    showTimeSelectOnly?: boolean;
    searchable?: boolean;
    name?: string;
    isVisible?: boolean;
    innerRef?: (elm: HTMLInputElement | null) => void;
    onChange: (val: string) => void;
    onClearValueClick: (event: React.MouseEvent<HTMLElement>) => void;
    onControlClick: () => void;
} & CustomOnChange;
export declare const DateTimePickerController: FC<DateTimePickerControllerProps>;
//# sourceMappingURL=DateTimePickerController.d.ts.map