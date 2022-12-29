import { Meta, Story } from '@storybook/react';

import { ListItem, ListItemProps } from 'components/bases/List/List';
import CloseBlueIcon from 'images/icon/close_blue.png';
import { action } from '@storybook/addon-actions';
import { EmptyButton } from 'components/bases/Button/Button';

export default {
    title: 'Display/List/ListItem',
    component: ListItem,
} as Meta;

const Template: Story<ListItemProps> = (args) =>
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
                    size="sm"
                    icon="ellipsis-v"
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
