import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Moment } from 'moment';
import { action } from '@storybook/addon-actions';

import { MonthPicker, MonthPickerProps } from 'components/bases/DateTimePicker/MonthPicker';

export default {
    title: 'Inputs/Month Picker',
    component: MonthPicker,
} as Meta;

const Template: Story<MonthPickerProps> = (args) =>
{
    const [value, setValue] = useState<Moment>();

    const handleChange = (value: Moment) =>
    {
        setValue(value);
        (action('onChange'))(value);
    };

    return (
        <MonthPicker
            {...args}
            value={value}
            onChange={handleChange}
        />
    );
};

export const Default = Template.bind({});
