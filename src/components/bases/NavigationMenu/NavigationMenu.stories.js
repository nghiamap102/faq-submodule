import React from 'react';
import { action } from '@storybook/addon-actions';

import { NavigationMenu, MenuItem } from 'components/bases/NavigationMenu/NavigationMenu';

export default {
    title: 'Bases/Navigation/NavigationMenu',
    component: NavigationMenu,
    subcomponents: { MenuItem },
};

const menuItems = [
    {
        id: 1,
        name: 'Item 1'
    },
    {
        id: 2,
        name: 'Item 2'
    },
    {
        id: 3,
        name: 'Item 3'
    },
];

const activeItem = 1;

const Template = (args) =>
{
    return (
        <NavigationMenu {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    header: 'Test header',
    menus: menuItems,
    activeMenu: activeItem,
};
