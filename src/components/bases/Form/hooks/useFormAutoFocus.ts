import { useEffect } from 'react';

import { FORM_GROUP_BASE_CLASSNAME } from 'components/bases/Form/constants/formGroup';

export type UseFormAutoFocusProps = {
    /**
     * Enable/disable auto-focus feature
     *
     * @default false
     */
  autoFocus?: boolean
}

/**
* Hook to control form's autofocus feature.
*/
export const useFormAutoFocus = ({ autoFocus }:UseFormAutoFocusProps):void =>
{
    useEffect(() =>
    {
        if (!autoFocus || typeof window === 'undefined')
        {
            return;
        }

        const firstInputInsideFormGroup = document.querySelector<HTMLElement>(`form.${FORM_GROUP_BASE_CLASSNAME} [data-autofocus=true]`);
        firstInputInsideFormGroup?.focus();
    }, [autoFocus]);
};
