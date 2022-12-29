import { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { RichText, RichTextProps } from 'components/bases/Text';
import { action } from '@storybook/addon-actions';

export default {
    title: 'Display/Text/RichText',
    component: RichText,
    args: {},
} as Meta;

const Template: Story<RichTextProps> = (args) =>
{
    const [value, setValue] = useState('');
    const onChangeEventHandler = (value: string) =>
    {
        setValue(value);
        (action('onChange'))(value);
    };

    return (
        <RichText
            {...args}
            value={value}
            onChange={onChangeEventHandler}
        />
    );
};

export const Default = Template.bind({});
