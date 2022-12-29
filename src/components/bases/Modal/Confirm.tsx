import React, { ReactNode, useRef } from 'react';

import { Popup, PopupFooter, PopupProps } from 'components/bases/Popup/Popup';
import { Button, EmptyButton } from 'components/bases/Button/Button';
import { T } from 'components/bases/Translate/Translate';

import './Dialog.scss';

export type ConfirmProps = {
    message?: ReactNode,
    loading?: boolean,
    danger?: boolean,
} & Pick<PopupProps, 'title' | 'okText' | 'onOk' | 'cancelText' | 'onCancel' | 'focusOn'>

export const Confirm = (props: ConfirmProps): JSX.Element =>
{
    const { title = 'Xác nhận', message, focusOn = 'ok', danger } = props;
    const { okText = 'Xác nhận', onOk } = props;
    const { cancelText = 'Hủy', onCancel } = props;
    const { loading = false } = props;

    const cancelRef = useRef<HTMLButtonElement>(null);
    const okRef = useRef<HTMLButtonElement>(null);

    return (
        <Popup
            className={'dialog-popup'}
            title={title}
            padding={'2rem'}
            onClose={onCancel}
        >
            {typeof message === 'string' ? <T>{message}</T> : message}

            <PopupFooter>
                <EmptyButton
                    text={cancelText}
                    innerRef={cancelRef}
                    autoFocus={focusOn === 'cancel'}
                    onClick={onCancel}
                />

                <Button
                    innerRef={okRef}
                    color={danger ? 'danger' : 'primary'}
                    text={okText}
                    isLoading={loading}
                    autoFocus={focusOn === 'ok'}
                    onClick={onOk}
                />
            </PopupFooter>
        </Popup>
    );
};
