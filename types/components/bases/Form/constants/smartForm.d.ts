import { ElementType } from 'react';
import { DynamicFormComponents, WrapperComponents, DefaultErrorMsgKey } from '../model/smartFormType';
export declare const MAPPED_COMPONENTS: Record<DynamicFormComponents, ElementType>;
export declare const CUSTOMIZE_ONCHANGE_COMPONENTS: (React.JSXElementConstructor<any> | string)[];
export declare const CONTROLLABLE_CHILDREN: (React.JSXElementConstructor<any> | string)[];
export declare const WRAPPER_COMPONENTS: WrapperComponents[];
export declare const CIRCULAR_OBJECT_IN_FORM_STATE: string[];
export declare const LOCAL_STORAGE_KEYS: {
    formState: string;
};
export declare const DEFAULT_ERROR_MESSAGE: Record<DefaultErrorMsgKey, string>;
//# sourceMappingURL=smartForm.d.ts.map