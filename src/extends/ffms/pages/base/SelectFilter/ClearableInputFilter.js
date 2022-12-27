import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ClearableInput } from '@vbd/vui';

const ClearableInputFilter = (props)=>
{
    const { value, onChange } = props;
    const [data, setData] = useState(value);

    useEffect(()=>
    {
        setData(value);
    },[value]);

    return (
        <ClearableInput
            {...props}
            value={data}
            clearable
            onChange={(value)=>
            {
                setData(value);
                _.isFunction(onChange) && onChange(value);
            }}
        />);
};

ClearableInputFilter.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
};

export default ClearableInputFilter;
