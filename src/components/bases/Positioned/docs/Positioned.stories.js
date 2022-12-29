import React from 'react';

import { Positioned } from 'components/bases/Positioned/Positioned';
import { Expanded } from 'components/bases/Expanded/Expanded';
import { Container } from 'components/bases/Container/Container';

export default {
    title: 'Layout/Positioned',
    component: Positioned,
};

const Template = (args) =>
{
    return (
        <Positioned {...args}>
            Child DOM elements
        </Positioned>
    );
};

export const TopLeft = Template.bind({});
TopLeft.args = {
    left: '10em',
    top: '10em',
};

export const BottomRight = Template.bind({});
BottomRight.args = {
    right: '10em',
    bottom: '10em',
};
