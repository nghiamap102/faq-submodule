import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';

import { Toast, ToastStack, ToastProps, ToastStackProps } from './Toast';
import { Alert, AlertProps } from './Alert';
import { Drawer, DrawerProps } from './Drawer';
import { Loading } from './Loading';
import { Confirm, ConfirmProps } from './Confirm';

type Timeout = number | Promise<any>;

const renderModal = (element: ReactElement, options: {timeout?: Timeout} = {}) =>
{
    const { timeout } = options;

    const close = () => destroy(modalRoot);

    const appContainer = document.getElementById('appContainer');
    const modalRoot = document.createElement('modal-root');
    appContainer?.appendChild(modalRoot);

    ReactDOM.render(element, modalRoot);

    if (typeof timeout === 'number')
    {
        setTimeout(close, timeout);
    }
    else if (timeout instanceof Promise)
    {
        Promise.resolve(timeout).finally(() => close());
    }

    return { close };
};

const destroy = (div: Element): void =>
{
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    unmountResult && div.parentNode && div.parentNode.removeChild(div);
};

export const confirm = (props: ConfirmProps): void =>
{
    const { onCancel, onOk, ...resProps } = props;

    function handleClickCancel ()
    {
        onCancel && onCancel();
        render.close();
    }

    function handleClickOk ()
    {
        onOk && onOk();
        render.close();
    }

    const render = renderModal(
        <Confirm
            {...resProps}
            onOk={handleClickOk}
            onCancel={handleClickCancel}
        />,
    );
};

export const alert = (props: AlertProps): void =>
{
    const { onOk, ...restProps } = props;

    function handleClickOk ()
    {
        onOk && onOk();
        render.close();
    }

    const render = renderModal(
        <Alert
            {...restProps}
            onOk={handleClickOk}
        />,
    );
};

export const drawer = (props: DrawerProps): void =>
{
    const { onClose, ...restProps } = props;

    function handleClickOk ()
    {
        onClose && onClose();
        render.close();
    }

    const render = renderModal(
        <Drawer
            {...restProps}
            onClose={handleClickOk}
        />,
    );
};


const toastIcons = {
    'info': 'info-circle',
    'success': 'check-circle',
    'warning': 'exclamation-triangle',
    'error': 'exclamation-circle',
    'default': '',
};

export const toast = (props: ToastProps & ToastStackProps & {timeout?: number}): void =>
{
    const { location, onClick, timeout = 3000, type, ...restProps } = props;

    const icon = props.icon || toastIcons[type] || toastIcons['default'];

    const handleClick = (toastDiv: HTMLDivElement) =>
    {
        onClick && onClick();
        destroy(toastDiv);
    };

    function addToast ()
    {
        const toastDiv = document.createElement('div');
        const toastStack = document.getElementById('toast-stack');

        if (toastStack)
        {
            toastStack.appendChild(toastDiv);

            ReactDOM.render(
                <Toast
                    {...restProps}
                    type={type}
                    icon={icon}
                    onClick={() => handleClick(toastDiv)}
                />,
                toastDiv,
            );

            timeout !== 0 && setTimeout(() => destroy(toastDiv), timeout);
        }
    }

    const div = document.getElementById('toast-stack');

    if (!div)
    {
        renderModal(
            <ToastStack
                location={location}
                id={'toast-stack'}
            />,
        );

        // Wait until React render ToastStack to render Toast
        setTimeout(addToast, 100);
        return;
    }
    addToast();
};

export const spin = (props: {timeout?: Timeout} = {}): {close: () => void} =>
{
    const { timeout } = props;

    const render = renderModal(<Loading fullscreen />, { timeout });

    return render;
};
