import React from 'react';

import { ListItem } from 'components/bases/List/List';
import CloseBlueIcon from 'images/icon/close_blue.png';
import { action } from '@storybook/addon-actions';
import { EmptyButton } from 'components/bases/Button/Button';

export default {
    title: 'Bases/List/ListItem',
    component: ListItem,
};

const Template = (args) =>
{
    const handleMenuClick = () =>
    {
        (action('onMenuClick'))();
    };

    return (
        <ListItem
            {...args}
            trailing={(
                <EmptyButton
                    size='sm'
                    icon='ellipsis-v'
                    onlyIcon
                    onClick={handleMenuClick}
                />
            )}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    iconUrl: CloseBlueIcon,
    icon: <div>Icon</div>,
};
