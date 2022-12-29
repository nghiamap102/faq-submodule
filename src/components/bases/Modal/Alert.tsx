import React from 'react';

import { Popup, PopupFooter, PopupProps } from 'components/bases/Popup/Popup';
import { Button } from 'components/bases/Button/Button';
import { T } from 'components/bases/Translate/Translate';

import './Dialog.scss';

export type AlertProps = {
    message: string,
} & Pick<PopupProps, 'title' | 'onOk'>

export const Alert = (props: AlertProps): JSX.Element =>
{

    const { title = 'Thông báo', message, onOk } = props;

    return (
        <Popup
            title={title}
            className={'dialog-popup'}
            onClose={onOk}
        >
            <T>{message}</T>

            <PopupFooter>
                <Button
                    color={'primary'}
                    text={'Đồng ý'}
                    autoFocus
                    onClick={onOk}
                />
            </PopupFooter>
        </Popup>
    );
};
