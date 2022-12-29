import { FieldValues, FormState } from 'react-hook-form';

import { useFormStateCollectionTaker } from './useFormStateCollectionTaker';

interface FormStateTakerArgs {
  formId: string
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
export const useFormStateTaker = <F extends FieldValues>({ formId }: FormStateTakerArgs): FormState<F> | undefined =>
{
    const collection = useFormStateCollectionTaker();
    return collection[formId] as FormState<F> | undefined;
};
