import React from 'react';
import { AlertProps } from './Alert';
import { ToastProps } from './Toast';
import { ConfirmProps } from './Confirm';
export declare const ModalContext: React.Context<ModalContextValue | null>;
export declare type ModalContextValue = {
    alert: (props: AlertProps) => void;
    confirm: (props: ConfirmProps) => void;
    toast: (props: ToastProps) => void;
    spin: (props: SpinProps) => void;
    menu: (props: any) => void;
};
declare type SpinProps = {
    timeout?: number;
};
declare const ModalProvider: React.FC;
export { ModalProvider };
//# sourceMappingURL=ModalContext.d.ts.map