import React from 'react';
import { SVGIcon } from '@vbd/vicon';

export default {
    title: 'Icons/SVG Icon',
    component: SVGIcon,
    parameters: {
        controls: { expanded: true },
    },
    argTypes: {
        iconColor: {
            control: 'color',
        },
        backgroundColor: {
            control: 'color',
        },
        borderRadius: {
            control: 'range',
        },
    },
};

const Template = (args) => <SVGIcon {...args} />;

export const XXLarge = Template.bind({});
XXLarge.args = {
    name: 'map',
    size: 'xxlarge',
};

