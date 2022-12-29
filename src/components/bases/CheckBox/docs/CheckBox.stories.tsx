import { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { CheckBox, CheckBoxProps } from 'components/bases/CheckBox/CheckBox';

export default {
    title: 'Inputs/Checkbox',
    component: CheckBox,
    subcomponents: { CheckBox },
} as Meta;

const Template: Story<CheckBoxProps> = (args) =>
{
    const [checked, setChecked] = useState(false);
    const onChangeEventHandler = (value: boolean) =>
    {
        setChecked(value);
        (action('onChangeEventHandler'))();
    };

    return (
        <CheckBox
            {...args}
            checked={checked}
            onChange={onChangeEventHandler}
        />
    );
};

export const Default = Template.bind({});
