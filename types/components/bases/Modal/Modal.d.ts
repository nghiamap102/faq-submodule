import { ToastProps, ToastStackProps } from './Toast';
import { AlertProps } from './Alert';
import { DrawerProps } from './Drawer';
import { ConfirmProps } from './Confirm';
declare type Timeout = number | Promise<any>;
export declare const confirm: (props: ConfirmProps) => void;
export declare const alert: (props: AlertProps) => void;
export declare const drawer: (props: DrawerProps) => void;
export declare const toast: (props: ToastProps & ToastStackProps & {
    timeout?: number;
}) => void;
export declare const spin: (props?: {
    timeout?: Timeout;
}) => {
    close: () => void;
};
export {};
//# sourceMappingURL=Modal.d.ts.map