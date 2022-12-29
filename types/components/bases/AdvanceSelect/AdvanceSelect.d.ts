import './AdvanceSelect.scss';
import React, { ReactNode } from 'react';
import { CustomOnChange, IControllableField } from '../../../components/bases/Form/model/smartFormType';
export declare type AdvanceSelectOption = {
    id: string;
    label: ReactNode;
    inputDisplay?: ReactNode;
    dropdownDisplay?: ReactNode;
};
export declare type SearchModeProps = {
    searchMode: 'remote';
    onRemoteFetch: (searchKey: string) => void;
} | {
    searchMode?: 'local';
    onRemoteFetch?: (searchKey: string) => void;
};
export declare type AdvanceSelectProps = IControllableField & CustomOnChange & {
    options: AdvanceSelectOption[];
    selectedOptions?: AdvanceSelectOption[];
    flex?: number;
    width?: string;
    searchable?: boolean;
    isLoading?: boolean;
    hasDividers?: boolean;
    disabled?: boolean;
    multi?: boolean;
    clearable?: boolean;
    isVisible?: boolean;
    value?: string | string[];
    defaultValue?: string | string[];
    noneSelectValue?: string;
    placeholder?: string;
    onChange?: (value?: string | string[], currentSelect?: string) => void;
    onClear?: () => void;
    onTextChange?: (value: string) => void;
    onSearch?: (searchKey: string) => void;
    onDropdownClosed?: () => void;
    onControlClick?: () => void;
    textChangeDelay?: number;
    tagRemoveConfirm?: boolean;
};
export declare const AdvanceSelect: React.MemoExoticComponent<React.ForwardRefExoticComponent<(IControllableField<Record<string, unknown>> & CustomOnChange & {
    options: AdvanceSelectOption[];
    selectedOptions?: AdvanceSelectOption[] | undefined;
    flex?: number | undefined;
    width?: string | undefined;
    searchable?: boolean | undefined;
    isLoading?: boolean | undefined;
    hasDividers?: boolean | undefined;
    disabled?: boolean | undefined;
    multi?: boolean | undefined;
    clearable?: boolean | undefined;
    isVisible?: boolean | undefined;
    value?: string | string[] | undefined;
    defaultValue?: string | string[] | undefined;
    noneSelectValue?: string | undefined;
    placeholder?: string | undefined;
    onChange?: ((value?: string | string[] | undefined, currentSelect?: string | undefined) => void) | undefined;
    onClear?: (() => void) | undefined;
    onTextChange?: ((value: string) => void) | undefined;
    onSearch?: ((searchKey: string) => void) | undefined;
    onDropdownClosed?: (() => void) | undefined;
    onControlClick?: (() => void) | undefined;
    textChangeDelay?: number | undefined;
    tagRemoveConfirm?: boolean | undefined;
} & SearchModeProps) & React.RefAttributes<HTMLElement>>>;
//# sourceMappingURL=AdvanceSelect.d.ts.map