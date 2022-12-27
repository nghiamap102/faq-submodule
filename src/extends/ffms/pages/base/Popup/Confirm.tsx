import './Confirm.scss';

import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';

import { Button, EmptyButton, Popup, PopupFooter, T } from '@vbd/vui';

interface ConfirmProps
{
    title?: string,
    body?: any,
    width?:string,
    height?:string,
    okText?: string,
    onOk?: () => void,

    cancelText?: string,
    onCancel?: () => void
}

type Timeout = number | Promise<any>;
const renderModal = (element: ReactElement, options: {timeout?: Timeout} = {}) =>
{
    const { timeout } = options;

    function close ()
    {
        destroy(div);
    }

    const modalRoot = document.getElementById('modal-root');
    const div = document.createElement('div');
    modalRoot?.appendChild(div);

    ReactDOM.render(element, div);

    if (timeout)
    {
        if (typeof timeout === 'number')
        {
            setTimeout(() => close(), timeout);
        }
        else
        {
            Promise.resolve(timeout).finally(() => close());
        }
    }

    return {
        close,
    };
};

function destroy (div: Element)
{
    const unmountResult = ReactDOM.unmountComponentAtNode(div);

    if (unmountResult && div.parentNode)
    {
        div.parentNode.removeChild(div);
    }

    return;
}

export function ConfirmPopup (props: ConfirmProps)
{
    const { title = 'Xác nhận', body } = props;
    const { okText = 'Xác nhận', onOk } = props;
    const { cancelText = 'Hủy', onCancel } = props;

    return (
        <Popup
            className={'dialog-popup'}
            title={title}
            padding={'2rem'}
            onClose={onCancel}
            {... props.width && { width: props.width }}
            {... props.height && { height: props.height }}
        >
            {typeof body === 'string' ? <T>{body}</T> : body}

            <PopupFooter>
                <EmptyButton
                    text={cancelText}
                    onClick={onCancel}
                />

                <Button
                    color={'primary'}
                    text={okText}
                    onClick={onOk}
                />
            </PopupFooter>
        </Popup>
    );
}

export function confirm (props: ConfirmProps)
{
    const { onCancel, onOk } = props;

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
        <ConfirmPopup
            {...props}
            onOk={handleClickOk}
            onCancel={handleClickCancel}
        />,
    );
}
