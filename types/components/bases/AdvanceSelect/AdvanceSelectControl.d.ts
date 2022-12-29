import { FC, MouseEvent, MutableRefObject } from 'react';
import { AdvanceSelectOption } from './AdvanceSelect';
export declare type AdvanceSelectControlProps = {
    defaultOptions?: AdvanceSelectOption[];
    searchMode?: 'local' | 'remote';
    disabled?: boolean;
    searchable?: boolean;
    value: string | string[];
    options: AdvanceSelectOption[];
    multi?: boolean;
    placeholder: string;
    isVisible: boolean;
    defaultValue?: string | string[];
    isNoneSelect: boolean;
    isLoading?: boolean;
    clearable?: boolean;
    selectedOptions: AdvanceSelectOption[];
    searchKey?: string;
    controlRef: MutableRefObject<HTMLDivElement | null>;
    readOnly?: boolean;
    onSearchKey?: (key: string) => void;
    onOptionsChange?: (ops: AdvanceSelectOption[]) => void;
    onTagRemoved: (event: MouseEvent<HTMLButtonElement>, val: string) => void;
    onClear?: () => void;
    onControlClick: () => void;
    onRemoteFetch?: (key: string) => void;
};
export declare const AdvanceSelectControl: FC<AdvanceSelectControlProps>;
//# sourceMappingURL=AdvanceSelectControl.d.ts.map