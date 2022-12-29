import React from 'react';
import { FAIcon } from '@vbd/vicon';
import { Panel2 } from 'components/bases/Panel/Panel';

export default {
    title: 'Icons/Font Awesome Icon',
    component: FAIcon,
    parameters: {
        controls: { expanded: true },
    },
    argTypes: {
        color: {
            control: 'color',
        },
        backgroundColor: {
            control: 'color',
        },
    },
};

const Template = (args) => <Panel2><FAIcon {...args} /></Panel2>;

export const Default = Template.bind({});
Default.args = {
    icon: 'user',
    color: 'red',
    size: '48px',
};

export const Spin = Template.bind({});
Spin.args = {
    icon: 'spinner-third',
    color: 'red',
    type: 'duotone',
    spin: true,
    size: '48px',
};
