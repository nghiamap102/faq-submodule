import { isEmpty } from 'helper/data.helper';
import React, { useEffect, useState } from 'react';

import { AdvanceSelect, ClearableInput } from '@vbd/vui';

import useDebounce from 'extends/ffms/pages/hooks/useDebounce';

// if not options advance Selct -> change to input to input data
const SelectOrInput = (props) =>
{

    const { options, className, placeholder, value, onChange, ...rest } = props;

    const getInputValue = (value) =>
    {
        let result = value;
        if ((Array.isArray(value)))
        {
            result = value[0] === 'undefined' ? '' : value[0];
        }

        return result;
    };
    const [inputValue, setInputValue] = useState(getInputValue(value));

    const debouncedInputValue = useDebounce(inputValue, 500);

    useEffect(() =>
    {
        if (debouncedInputValue !== undefined && isEmpty(options))
        {
            onChange(debouncedInputValue);
        }
    }, [debouncedInputValue]);
   

    const handleChangeInput = (value) =>
    {
        if (value === undefined)
        {
            setInputValue('');
            onChange('');
        }
        else
        {
            setInputValue(value);
        }
    };

    if (!isEmpty(options))
    {
        return (
            <AdvanceSelect
                clearable
                {...props}
            />
        );
    }
    else
    {
        return (
            <ClearableInput
                type={'input'}
                className={`form-control ${className}`}
                placeholder={'Nhập giá trị'}
                value={inputValue}
                onChange={handleChangeInput}
                clearable
                {...rest}
            />
        );
    }
};

export default SelectOrInput;
