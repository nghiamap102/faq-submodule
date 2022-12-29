import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Moment } from 'moment';

import { YearPicker, YearPickerProps } from 'components/bases/DateTimePicker/YearPicker';

export default {
    title: 'Inputs/Year Picker',
    component: YearPicker,
} as Meta;

const Template: Story<YearPickerProps> = (args) =>
{
    const [value, setValue] = useState<Moment>();

    const handleChange = (value: Moment) =>
    {
        setValue(value);
        (action('onChange'))(value);
    };

    return (
        <YearPicker
            {...args}
            value={value}
            onChange={handleChange}
        />
    );
};

export const Default = Template.bind({});
