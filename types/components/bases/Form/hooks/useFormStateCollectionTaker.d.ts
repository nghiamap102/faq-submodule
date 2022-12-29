import { FormStateCollection } from '../model/smartFormType';
/**
* This hook responsibility is retrieve formSate collection from localStorage.
*
* Form state collection format: { [formId]: formState }
* @example const {formA: FormAState, formB: FormBState} = useFormStateCollectionTaker()
*
* Reference:
* {@link https://react-hook-form.com/api/useformstate react-hook-form formState}
*/
export declare const useFormStateCollectionTaker: () => FormStateCollection;
export declare const getFormStateCollection: () => FormStateCollection;
//# sourceMappingURL=useFormStateCollectionTaker.d.ts.map