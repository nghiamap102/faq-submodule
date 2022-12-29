import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Moment } from 'moment';

import { Calendar, CalendarProps } from '../Calendar';

export default {
    title: 'Inputs/Calendar',
    component: Calendar,
} as Meta;

const Template: Story<CalendarProps> = (args) =>
{
    const [value, setValue] = useState<Moment | null>(null);

    const handleChange = (value: Moment) =>
    {
        setValue(value);
        (action('onChange'))(value);
    };

    return (
        <Calendar
            {...args}
            value={value}
            onChange={handleChange}
        />
    );
};

export const Default = Template.bind({});

export const HighLight = Template.bind({});
HighLight.args = {
    highlightDates: ['2021-01-11', '2021-01-12'],
};
