import { Meta, Story } from '@storybook/react';

import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { CheckBoxGroup, CheckBoxGroupProps } from 'components/bases/CheckBox/CheckBoxGroup';

export default {
    title: 'Inputs/CheckboxGroup',
    component: CheckBoxGroup,
    subcomponents: { CheckBoxGroup },
} as Meta;

const CheckboxTemplate: Story<CheckBoxGroupProps> = (args) =>
{
    return (
        <>
            <CheckBoxGroup
                {...args}
            >
                <CheckBox
                    label="Option 1"
                    value="option 1"
                    name="options"
                />
                <CheckBox
                    label="Option 2"
                    value="option 2"
                    name="options"
                />
                <CheckBox
                    label="Option 3"
                    value="option 3"
                    name="options"
                />
            </CheckBoxGroup>

        </>
    );
};

const RadioTemplate: Story<CheckBoxGroupProps> = (args) =>
{
    return (
        <>
            <CheckBoxGroup
                {...args}
            >
                <CheckBox
                    displayAs="radio"
                    label="Option 1"
                    value="option 1"
                    name="options"
                />
                <CheckBox
                    displayAs="radio"
                    label="Option 2"
                    value="option 2"
                    name="options"
                />
                <CheckBox
                    displayAs="radio"
                    label="Option 3"
                    value="option 3"
                    name="options"
                />
            </CheckBoxGroup>

        </>
    );
};

export const Checkbox = CheckboxTemplate.bind({});
export const Radio = RadioTemplate.bind({});
