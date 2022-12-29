import { Meta, Story } from '@storybook/react';

import { AppBody } from '../AppBody';

export default {
    title: 'Layout/AppBody',
    component: AppBody,
    decorators: [(Story) => <div style={{ margin: '-1rem' }}><Story /></div>],
} as Meta;

const Template: Story = (args) =>
{
    return (
        <AppBody>
            AppBody inner elements
        </AppBody>
    );
};

export const Default = Template.bind({});
