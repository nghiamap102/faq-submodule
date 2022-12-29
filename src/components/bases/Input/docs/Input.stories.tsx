import { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Input } from '../Input';
import { InputProps } from '../model/inputType';

export default {
    title: 'Inputs/Input',
    component: Input,
} as Meta;

const Template: Story<InputProps> = ({ ...args }) =>
{
    const [value, setValue] = useState(args.value ? args.value : '');

    function handleChange(value: any)
    {
        setValue(value);
        (action('onChange'))(value);
    }

    return (
        <Input
            {...args}
            value={value}
            onChange={handleChange}
        />
    );
};

export const Default = Template.bind({});


