import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { LazyLoadList } from 'components/bases/LazyLoadList/LazyLoadList';
import CloseBlueIcon from 'images/icon/close_blue.png';
import CloseWhiteIcon from 'images/icon/close_white.png';

export default {
    title: 'Display/List/LazyLoadList',
    component: LazyLoadList,
} as Meta;

const items = [
    {
        'label': 'Item 1',
        'description': 'This is item 1',
        'icon': '',
    },
    {
        'label': 'Item 2',
        'description': 'This is item 2',
        'icon': CloseBlueIcon,
    },
    {
        'label': 'Item 3',
        'description': 'This is item 3',
        'icon': CloseWhiteIcon,
    },
];

const Template: Story = (args) =>
{
    // Reset event handler
    Object.keys(args).forEach((prop) =>
    {
        if (new RegExp('^on.*').test(prop))
        {
            args[prop] = action(prop + '');
        }
    });

    args.items = items;
    args.titleField = 'label';
    args.subTitleField = 'description';
    args.iconUrlField = 'icon';

    return (
        <LazyLoadList {...args} />
    );
};

export const Default = Template.bind({});
