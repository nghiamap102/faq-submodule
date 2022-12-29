import { MouseEventHandler } from 'react';
import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ContextMenu, { ContextMenuProps } from '../ContextMenu';
import { useModal } from 'components/bases/Modal/hooks/useModal';
import { Button } from 'components/bases/Button/Button';

export default {
    title: 'Overlays/ContextMenu',
    component: ContextMenu,
} as Meta;

const Template: Story<ContextMenuProps> = (args) =>
{
    const { menu } = useModal();

    const handleClose = () =>
    {
        (action('onClose'))();
    };

    args.onClose = handleClose;

    const handleOpen: MouseEventHandler<HTMLButtonElement> = (event) =>
    {
        args.id = 'storybook-context-menu';
        args.position = {
            x: event.clientX,
            y: event.clientY,
        };

        menu(args);
    };

    return (
        <>
            <Button
                text='Open context menu'
                onClick={handleOpen}
            />
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    width: 200,
    maxHeight: 500,
    header: 'Go to:',
    isCloseOnBlur: true,
    actions: [
        {
            label: 'Home',
            icon: 'home',
            onClick: () => action('onClickContextMenuItem'),
        },
        {
            label: '-',
        },
        {
            label: 'Sign out',
            icon: 'sign-out',
            onClick: () => action('onClickContextMenuItem'),
        },
    ],
};
