import { Meta, Story } from '@storybook/react';

import { Spacer, SpacerProps } from 'components/bases/Spacer/Spacer';

export default {
    title: 'Layout/Spacer',
    component: Spacer,
} as Meta;

const Template: Story<SpacerProps> = (args) =>
{
    return (
        <>
            <div>Dummy item 1</div>
            <Spacer {...args} />
            <div>Dummy item 1</div>
        </>
    );
};

export const Vertical = Template.bind({});
Vertical.args = {
    direction: 'vertical',
    size: '1rem',
};
