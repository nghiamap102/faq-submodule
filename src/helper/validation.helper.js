import { isEmpty } from 'helper/data.helper';

const validateType = { required: 'required', regex: 'regex', minLength: 'minLength', maxLength: 'maxLength', min: 'min', max: 'max' };

export class ValidationHelper
{
    static vietnamPhonePattern = /^(\+84|0)([345987])[0-9]{8}$/;
    static emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static indiaPhonePattern = /^\d{10}$/;
    static numberOnlyPattern = /^[0-9]+$/;

    static fullNamePattern = /^[a-zA-Z ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
    static nameIdPattern = /^[a-zA-Z0-9_]+$/;

    constructor(i18nContext)
    {
        this.i18nContext = i18nContext;
    }

    static isEmail(email)
    {
        return ValidationHelper.emailPattern.test(String(email).toLowerCase());
    }

    static isPhoneNumber(phone)
    {
        return ValidationHelper.vietnamPhonePattern.test(String(phone).toLowerCase());
    }

    validateField(validators, field, value)
    {
        const errors = [];
        const rules = validators[field];
        let isValid = true;

        for (const r in rules)
        {
            let checkValue;
            let message = undefined;

            if (typeof (rules[r]) === 'object' && Object.keys(rules[r])?.length)
            {
                checkValue = rules[r].value;
                message = rules[r].message;
            }
            else
            {
                checkValue = rules[r];
            }

            const isRegex = checkValue instanceof RegExp;
            if (isRegex || !isEmpty(checkValue))
            {
                const hasValue = !isEmpty(value);
                switch (r)
                {
                    case 'required':
                        value = typeof (value) === 'string' ? value?.trim() : value;

                        if (checkValue && isEmpty(value))
                        {
                            value = typeof (value) === 'string' ? value?.trim() : value;

                            if (isEmpty(value))
                            {
                                errors.push(this.i18nContext.t(message || 'Trường này là bắt buộc'));
                                isValid = false;
                            }
                        }
                        break;
                    case 'minLength':
                        if (hasValue && value.length < checkValue)
                        {
                            errors.push(this.i18nContext.t(message || 'Trường này phải có độ dài tối thiểu %0% ký tự', [checkValue]));
                            isValid = false;
                        }
                        break;
                    case 'maxLength':
                        if (hasValue && value.length > checkValue)
                        {
                            errors.push(this.i18nContext.t(message || 'Trường này phải có độ dài tối đa %0% ký tự', [checkValue]));
                            isValid = false;
                        }
                        break;
                    case 'minValue':
                        if (hasValue && value < checkValue)
                        {
                            errors.push(this.i18nContext.t(message || 'Trường này phải lớn hơn %0%', [checkValue]));
                            isValid = false;
                        }
                        break;
                    case 'maxValue':
                        if (hasValue && value > checkValue)
                        {
                            errors.push(this.i18nContext.t(message || 'Trường này phải nhỏ hơn %0%', [checkValue]));
                            isValid = false;
                        }
                        break;
                    case 'pattern':
                        if (hasValue && !value.match(checkValue))
                        {
                            errors.push(this.i18nContext.t(message || 'Trường này là định dạng không hợp lệ'));
                            isValid = false;
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        return { errors, isValid };
    }

    validateForm(formData, validators)
    {
        let formValid = true;

        const formErrors = {};

        for (const field in validators)
        {
            const value = formData[field];
            const validation = this.validateField(validators, field, value);

            if (!validation.isValid)
            {
                formValid = false;
            }

            formErrors[field] = validation.errors.join('\r\n') || '';
        }

        return { formErrors, formValid };
    }

    mappingValidators = (properties) =>
    {
        if (properties && properties.length)
        {
            const validatorsFormat = properties.reduce((result, prop) =>
            {
                let validatorVdms = [];
                const validators = {};

                if (prop.Config)
                {
                    const config = typeof (prop.Config) === 'string'
                        ? JSON.parse(prop.Config)
                        : prop.Config;

                    validatorVdms = config.validator;
                }

                // from array validator to object validator( follow validation.helper.js)
                for (const validator of validatorVdms)
                {
                    if (validator && validateType[validator.type])
                    {
                        let type = validator.type;
                        let value = validator.value;

                        switch (validator.type)
                        {
                            case validateType.min:
                                type = 'minValue';
                                break;
                            case validateType.max:
                                type = 'maxValue';
                                break;
                            case validateType.regex:
                                type = 'pattern';
                                value = new RegExp(validator.value);
                                break;
                        }

                        if (validator.message)
                        {
                            validators[type] = { value, message: validator.message };
                        }
                        else
                        {
                            validators[type] = value;
                        }
                    }
                }

                if (!isEmpty(validators))
                {
                    result = { ...result, [prop.ColumnName]: validators };
                }

                return result;
            }, {});

            return validatorsFormat;
        }

        return {};
    };

    mergeErrorTextsToValidators = (errorTexts, validators) =>
    {
        const result = {};
        for (const key in validators)
        {
            if (Object.hasOwnProperty.call(validators, key))
            {
                const element = validators[key];

                element.message = errorTexts[key];
                result[key] = element;
            }
        }

        return result;
    };
}
