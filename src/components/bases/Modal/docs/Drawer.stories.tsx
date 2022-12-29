import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Drawer, DrawerProps } from 'components/bases/Modal/Drawer';

export default {
    title: 'Overlays/Drawer',
    component: Drawer,
} as Meta;

const Template: Story<DrawerProps> = (args) =>
{
    return (
        <Drawer
            {...args}
            onClose={action('onClose')}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    animationIn: 'slideInLeft',
    animationOut: 'slideOutLeft',
};
