import { Meta, Story } from '@storybook/react';

import { Iframe, IframeProps } from '../Iframe';

export default {
    title: 'Display/Iframe',
    component: Iframe,
} as Meta;

const Template: Story<IframeProps> = (args) =>
{
    return (
        <Iframe {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    background: 'cyan',
    width: '50%',
    height: '50px',
    frameBorder: 1,
};
