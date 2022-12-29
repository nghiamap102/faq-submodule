import * as React from 'react';
export declare const teardown: (doc: Document) => void;
export interface UseIsFocusVisibleResult<E extends HTMLElement> {
    isFocusVisibleRef: React.MutableRefObject<boolean>;
    onBlur: (event: React.FocusEvent<any>) => void;
    onFocus: (event: React.FocusEvent<any>) => void;
    ref: React.Ref<E>;
}
export declare const useIsFocusVisible: <E extends HTMLElement = HTMLElement>() => UseIsFocusVisibleResult<E>;
//# sourceMappingURL=useIsFocusVisible.d.ts.map