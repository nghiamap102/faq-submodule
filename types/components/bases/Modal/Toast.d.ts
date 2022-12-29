import { ReactNode } from 'react';
import './Toast.scss';
declare type ToastLocation = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right';
export declare type ToastStackProps = {
    id?: string;
    location?: ToastLocation;
    items?: ToastProps[];
};
export declare const ToastStack: (props: ToastStackProps) => JSX.Element;
export declare type ToastProps = {
    id?: string;
    message?: string;
    icon?: string;
    type: 'error' | 'info' | 'success' | 'warning' | 'default';
    child?: ReactNode;
    onClick?: () => void;
};
export declare const Toast: (props: ToastProps) => JSX.Element;
export {};
//# sourceMappingURL=Toast.d.ts.map