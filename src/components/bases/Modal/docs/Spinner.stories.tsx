import { Meta, Story } from '@storybook/react';

import { Spinner, SpinnerProps } from '../Spinner';

export default {
    title: 'Overlays/Spinner',
    component: Spinner,
} as Meta;

const Template: Story<SpinnerProps> = (args) =>
{
    return (
        <div><Spinner {...args} /></div>
    );
};

export const Default = Template.bind({});
