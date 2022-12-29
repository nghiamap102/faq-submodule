import { FieldValues, FormState } from 'react-hook-form';
interface FormStateTakerArgs {
    formId: string;
}
/**
* This hook responsibility is retrieve formSate by formId from localStorage.
*
* Form state collection format: { [formId]: formState }
* @example const formState = useFormStateTaker({ formId: 'my-form })
*
* Reference:
* {@link https://react-hook-form.com/api/useformstate react-hook-form formState}
*/
export declare const useFormStateTaker: <F extends FieldValues>({ formId }: FormStateTakerArgs) => FormState<F> | undefined;
export {};
//# sourceMappingURL=useFormStateTaker.d.ts.map