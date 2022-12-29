import { Meta, Story } from '@storybook/react';

import { Separator, SeparatorProps } from '../Separator';

export default {
    title: 'Layout/Separator ',
    component: Separator,
    parameters: {},
    args: {
        displayAs: 'backslash',
    },
    decorators: [(Story: any): React.ReactElement => <div style={{ width: '50vw', height: '50vh' }}><Story /></div>],
} as Meta;

const Template: Story<SeparatorProps> = (args): React.ReactElement =>
{
    return (
        <Separator {...args} />
    );
};

export const Default = Template.bind({});
