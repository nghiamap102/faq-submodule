import { useI18n } from '@vbd/vui';
import { ValidationHelper } from 'helper/validation.helper';
import { useState } from 'react';
import { CommonHelper } from 'helper/common.helper';

const useValidator = (validators) =>
{
    // validations result of validate -> {errorMessage, isValid}
    const { t } = useI18n();
    const [validations, setValidations] = useState({});
    const validationHelper = new ValidationHelper({ t });
    
    const validateField = (field, value) =>
    {
        let errorMessage = '';

        const validation = validationHelper.validateField(validators, field, value);
        const isValid = !!validation?.isValid;
        errorMessage = validation?.errors?.length ? validation.errors.join('\r\n') : '';
        
        return { errorMessage, isValid };
    };

    const handleValidateField = (field, value) =>
    {
        const validate = validateField(field, value);
        setValidations(validation => ({ ...validation, [field]: validate }));
    };

    const validateAllField = () =>
    {
        let formValid = true;

        for (const field in validations)
        {
            const validation = validations[field];

            if (validation && !validation.isValid)
            {
                formValid = false;
            }
        }

        return formValid;
    };

    return { validations, onValidateField: handleValidateField, onValidateAllField: validateAllField };
};

export default useValidator;
