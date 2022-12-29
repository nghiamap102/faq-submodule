import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { Select, SelectOption } from 'components/bases/Select/Select';

export default {
    title: 'Inputs/Select',
    component: Select,
    subcomponents: { SelectOption },
};

const Template = (args) =>
{
    const [value, setValue] = useState('');
    const onChangeEventHandler = (value) =>
    {
        setValue(value);
        (action('onChange'))(value);
    };

    return (
        <Select
            {...args}
            value={value}
            onChange={onChangeEventHandler}
        >
            <SelectOption
                value="a"
                text="A"
            />
            <SelectOption
                value="b"
                text="B"
            />
        </Select>
    );
};

export const Default = Template.bind({});
