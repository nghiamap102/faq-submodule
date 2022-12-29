import { ReactNode } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
interface IHookArgs<F> {
    /**
     * React-hook-form's register function, allows you to register an input or select element
     * and apply validation rules to React Hook Form.
     *
     * Reference: {@link https://react-hook-form.com react-hook-form}
     */
    register: UseFormRegister<F>;
    /**
     * An object with field errors.
     */
    errors?: FieldErrors<F>;
    children: ReactNode | ReactNode[];
}
interface IHookReturn {
    controlledChildren: ReactNode | ReactNode[];
}
/**
* This hook responsibility is attach 'register' method and insert 'errors' object to wrapped controllable component.
*
* @return controlledChildren: children with 'register' and 'errors' attached
*/
export declare const useSmartForm: <FormType extends Record<string, unknown>>({ children, register, errors }: IHookArgs<FormType>) => IHookReturn;
export {};
//# sourceMappingURL=useSmartForm.d.ts.map