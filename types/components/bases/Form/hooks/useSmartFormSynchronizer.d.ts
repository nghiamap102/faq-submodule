import { FieldValues, Control } from 'react-hook-form';
interface FormStateSynchronizerArgs<F> {
    /**
     * The form id need to be synchronize
     */
    formId: string;
    /**
     * The react-hook-form's control object.
     *
     * {@link https://react-hook-form.com/api/useform/control react-hook-form control}
     */
    control: Control<F>;
}
/**
* This hook responsibility is save form's state object to localStorage by id.
*
* Reference:
* {@link https://react-hook-form.com/api/useformstate react-hook-form formState}
*/
export declare const useSmartFormSynchronizer: <F extends FieldValues>({ formId, control }: FormStateSynchronizerArgs<F>) => void;
export {};
//# sourceMappingURL=useSmartFormSynchronizer.d.ts.map