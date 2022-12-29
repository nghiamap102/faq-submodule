import React, { Component } from 'react';
import { Property } from 'csstype';
import { AnimationString } from 'react-animated-css';
import { ButtonColor } from '../../../components/bases/Button/Button';
import './Popup.scss';
export declare type PopupProps = {
    className?: string;
    title?: string;
    width?: Property.Width;
    height?: Property.Height;
    padding?: Property.Padding;
    isShowContentOnly?: boolean;
    onBeforeClose?: () => boolean;
    onClose?: () => void;
    onCancel?: () => void;
    onOk?: () => void;
    okType?: ButtonColor;
    okText?: string;
    cancelText?: string;
    animationIn?: AnimationString;
    animationOut?: AnimationString;
    animationDurationIn?: number;
    animationDurationOut?: number;
    scroll?: boolean;
    headerActions?: PopupHeaderAction[];
    escape?: boolean;
    fullscreen?: boolean;
    showCloseIcon?: boolean;
    focusOn?: 'ok' | 'cancel';
};
export declare type PopupHeaderAction = {
    onClick: () => void;
    icon: string;
};
declare type PopupState = {
    isVisible: boolean;
    topPopup: boolean;
};
export declare class Popup extends Component<PopupProps, PopupState> {
    state: {
        isVisible: boolean;
        topPopup: boolean;
    };
    handleClose: () => void;
    setTopPopup: (bool: boolean) => void;
    componentDidMount(): void;
    render(): JSX.Element;
}
declare const PopupFooter: React.FC<{
    className?: string;
}>;
export { PopupFooter };
//# sourceMappingURL=Popup.d.ts.map