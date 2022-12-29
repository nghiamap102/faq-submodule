import React, { createContext, forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { CommonHelper } from 'helper/common.helper';
import { Container } from 'components/bases/Container/Container';
import ContextMenu, { ContextMenuProps } from 'components/bases/ContextMenu/ContextMenu';

import { Alert, AlertProps } from './Alert';
import { Toast, ToastProps, ToastStackProps } from './Toast';
import { Confirm, ConfirmProps } from './Confirm';
import { Loading } from './Loading';

export const ModalContext = createContext<ModalContextValue | null>(null);

const toastIcons: Record<Pick<ToastProps,'type'>['type'], string> = {
    'info': 'info-circle',
    'success': 'check-circle',
    'warning': 'exclamation-triangle',
    'error': 'exclamation-circle',
    'default': '',
};

export type ModalContextValue = {
    alert: (props: AlertProps) => void
    confirm: (props: ConfirmProps) => void
    toast: (props: ToastProps) => void
    spin: (props: SpinProps) => void
    // Todo: Correcting ContextMenu type
    menu: (props: any) => void
}

type SpinProps = {
    timeout?: number
}

/**
 * This component was created to avoid render on ModalContext causing re-render the whole app
 */
// eslint-disable-next-line react/display-name
const ModalController = forwardRef<ModalContextValue>((props, ref) =>
{
    const [modals, setModals] = useState<JSX.Element[]>([]);
    const [toasts, setToasts] = useState<JSX.Element[]>([]);

    const add = (modal:JSX.Element) =>
    {
        setModals([...modals, modal]);
    };

    const remove = (modal: JSX.Element) =>
    {
        setModals(modals => modals.filter((m) => m !== modal));
    };

    const addToast = (toast: JSX.Element) =>
    {
        setToasts([...toasts, toast]);
    };

    const removeToast = (toast: JSX.Element) =>
    {
        setToasts(toasts => toasts.filter((t) => t !== toast));
    };

    useImperativeHandle(ref, () => ({
        alert(props: AlertProps)
        {
            const { onOk } = props;

            function handleClickOk()
            {
                onOk && onOk();
                remove(modal);
            }

            const modal = (
                <Alert
                    key={CommonHelper.uuid()}
                    {...props}
                    onOk={handleClickOk}
                />
            );

            add(modal);
        },
        confirm(props: ConfirmProps)
        {
            // const modal = { type: 'confirm', props };
            const { onCancel, onOk } = props;

            const handleClickCancel = () =>
            {
                onCancel && onCancel();
                remove(modal);
            };

            const handleClickOk = () =>
            {
                onOk && onOk();
                remove(modal);
            };

            const modal = (
                <Confirm
                    key={CommonHelper.uuid()}
                    {...props}
                    onOk={handleClickOk}
                    onCancel={handleClickCancel}
                />
            );

            add(modal);
        },
        toast(props: ToastProps & ToastStackProps & SpinProps)
        {
            const { onClick, timeout = 3000 } = props;

            const icon = props.icon || toastIcons[props.type] || toastIcons['default'];

            const handleClick = () =>
            {
                onClick && onClick();
                remove(toast);
            };

            const toast = (
                <Toast
                    key={CommonHelper.uuid()}
                    {...props}
                    icon={icon}
                    onClick={handleClick}
                />
            );

            addToast(toast);

            timeout !== 0 && setTimeout(() => removeToast(toast), timeout);
        },
        spin(props: SpinProps)
        {
            const { timeout } = props;

            const modal = <Loading fullscreen />;

            add(modal);

            if (timeout)
            {
                if (typeof timeout === 'number')
                {
                    setTimeout(() => remove(modal), timeout);
                }
                else
                {
                    // timeout is a promise, it's confusing, change later
                    Promise.resolve(timeout).finally(() => remove(modal));
                }
            }
        },
        menu(props: ContextMenuProps)
        {
            const { onClose } = props;

            const handleClose = () =>
            {
                onClose && onClose();
                remove(modal);
            };

            const modal = (
                <ContextMenu
                    key={CommonHelper.uuid()}
                    {...props}
                    onClose={handleClose}
                />
            );

            add(modal);
        },
    }));

    return (
        <>
            {modals}
            <Container
                className={'toast-items toast-location-top-right'}
            >
                {toasts}
            </Container>
        </>
    );
});

const ModalProvider: React.FC = (props) =>
{
    const modalRef = useRef<ModalContextValue>(null);

    const value = {
        alert: (props: AlertProps) => modalRef?.current?.alert(props),
        confirm: (props: ConfirmProps) => modalRef?.current?.confirm(props),
        toast: (props: ToastProps) => modalRef?.current?.toast(props),
        spin: (props: SpinProps) => modalRef?.current?.spin(props),
        menu: (props: ContextMenuProps) => modalRef?.current?.menu(props),
    };

    return (
        <ModalContext.Provider value={value}>
            <Container id="appContainer">
                {props?.children}
            </Container>
            <ModalController ref={modalRef} />
        </ModalContext.Provider>
    );
};

export { ModalProvider };
