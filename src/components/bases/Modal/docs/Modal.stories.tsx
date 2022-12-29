import { Meta, Story } from '@storybook/react';
import { map } from 'lodash/fp';

import { Button } from 'components/bases/Button';

import { useModal } from '../hooks/useModal';
import { drawer } from '../Modal';
import { ToastProps } from '../Toast';

export default {
    title: 'Overlays/Modal',
} as Meta;

export const Confirm: Story = () =>
{
    const { confirm } = useModal();
    function handleClick()
    {
        confirm({
            title: 'Title',
            message: 'Message',
        });
    }

    return (
        <Button
            text='Confirm'
            onClick={handleClick}
        />
    );
};

export const Toast = (): JSX.Element[] =>
{
    const { toast } = useModal();

    const MAPPED_TOAST: ToastProps[] = [
        { message: 'Toast 1', type: 'info' },
        { message: 'This is a very long toast message. This is a very long toast message.', type: 'info' },
        { message: 'This is info toast', type: 'info' },
        { message: 'This is success toast', type: 'success' },
        { message: 'This is warning toast', type: 'warning' },
        { message: 'This is error toast', type: 'error' },
        { message: 'This is default toast', type: 'default' },
        { child: <Button text='This is custom toast' />, type: 'default' },
    ];

    const renderToastExample = map(({ text, message, type, child }) => (
        <Button
            text={text}
            onClick={() => toast({ message, type, child })}
        />
    ));
  
    return renderToastExample(MAPPED_TOAST);
};

export const Alert: Story = () =>
{
    const { alert } = useModal();
    function handleClick()
    {
        alert({ title: 'Alert Title', message: 'Alert Message' });
    }

    return (
        <Button
            text='Alert'
            onClick={handleClick}
        />
    );
};

export const Drawer: Story = () =>
{
    function drawerOnLeft()
    {
        drawer({
            position: 'left',
            animationIn: 'slideInLeft',
            animationOut: 'slideOutLeft',
            scroll: true,
        });
    }

    function drawerOnRight()
    {
        drawer({
            position: 'right',
            scroll: true,
        });
    }

    return (
        <>
            <Button
                text='Drawer on left'
                onClick={drawerOnLeft}
            />
            <Button
                text='Drawer on right'
                onClick={drawerOnRight}
            />
        </>

    );
};

export const Spinner: Story = () =>
{
    const { spin } = useModal();
    function handleClick()
    {
        spin({ timeout: 2000 });
    }

    return (
        <Button
            text='Spin'
            onClick={handleClick}
        />
    );
};
