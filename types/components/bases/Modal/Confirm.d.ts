import { ReactNode } from 'react';
import { PopupProps } from '../../../components/bases/Popup/Popup';
import './Dialog.scss';
export declare type ConfirmProps = {
    message?: ReactNode;
    loading?: boolean;
    danger?: boolean;
} & Pick<PopupProps, 'title' | 'okText' | 'onOk' | 'cancelText' | 'onCancel' | 'focusOn'>;
export declare const Confirm: (props: ConfirmProps) => JSX.Element;
//# sourceMappingURL=Confirm.d.ts.map