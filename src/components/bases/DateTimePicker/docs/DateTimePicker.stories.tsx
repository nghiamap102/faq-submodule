import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Moment } from 'moment';
import { action } from '@storybook/addon-actions';
import { StoryDoc } from 'components/story/blocks';

import { DateTimePicker, DateTimePickerProps } from '../DateTimePicker';
import docs from './DateTimePicker.docs.mdx';
import changelog from './DateTimePicker.changelog.md';

export default {
    title: 'Inputs/Datetime Picker',
    component: DateTimePicker,
    parameters: {
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="DateTimePicker"
                    componentName="DateTimePicker"
                    component={DateTimePicker}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

const Template: Story<DateTimePickerProps> = (args) =>
{
    const [value, setValue] = useState<Moment>();
    const [rangeTime, setRangeTime] = useState<[number, number]>();

    const handleChange = (value?: Moment, rangeTime?: [number, number]) =>
    {
        setValue(value);
        rangeTime && setRangeTime(rangeTime);
        (action('onChange'))(value);
    };

    return (
        <DateTimePicker
            {...args}
            value={value}
            rangeTime={rangeTime}
            onChange={handleChange}
        />
    );
};

export const Default = Template.bind({});

export const RangeDateTime = Template.bind({});
RangeDateTime.args = {
    showTimeRange: true,
};
