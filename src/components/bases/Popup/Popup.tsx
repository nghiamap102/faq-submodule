import React, { Component } from 'react';
import clsx from 'clsx';
import { Property } from 'csstype';
import { Animated, AnimationString } from 'react-animated-css';

import { FAIcon } from '@vbd/vicon';
import { Overlay } from 'components/bases/Modal/Overlay';
import { T } from 'components/bases/Translate/Translate';
import { Button, EmptyButton, ButtonColor } from 'components/bases/Button/Button';
import { Col2 } from 'components/bases/Layout/Column';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';

import { PopupManager } from './PopupManager';

import './Popup.scss';

const popupManager = PopupManager.init();

export type PopupProps = {
    className?: string
    title?: string
    width?: Property.Width
    height?: Property.Height
    padding?: Property.Padding
    isShowContentOnly?: boolean
    onBeforeClose?: () => boolean
    onClose?: () => void
    onCancel?: () => void
    onOk?: () => void
    okType?: ButtonColor
    okText?: string
    cancelText?: string
    animationIn?: AnimationString
    animationOut?: AnimationString
    animationDurationIn?: number
    animationDurationOut?: number
    scroll?: boolean
    headerActions?: PopupHeaderAction[]
    escape?: boolean
    fullscreen?: boolean
    showCloseIcon?: boolean
    focusOn?: 'ok' | 'cancel'
}

export type PopupHeaderAction = {
    onClick: () => void
    icon: string
}

type PopupState = {
    isVisible: boolean
    topPopup: boolean
}

export class Popup extends Component<PopupProps, PopupState>
{
    state = {
        isVisible: true,
        topPopup: true,
    };

    handleClose = (): void =>
    {
        const isClose = !this.props.onBeforeClose || this.props.onBeforeClose();

        if (isClose)
        {
            this.setState({ isVisible: false });
            const { onClose, animationDurationOut } = this.props;

            setTimeout(() =>
            {
                this.props.escape && popupManager.remove(this);
                onClose && onClose();
            }, animationDurationOut);
        }
    };

    // This method will be call in PopupManager class
    setTopPopup = (bool: boolean): void => this.setState({ topPopup: bool })

    componentDidMount():void
    {
        const isEscapable = this.props.escape || true;
        isEscapable && popupManager.add(this);
    }

    render(): JSX.Element
    {
        const { isShowContentOnly, scroll = true, showCloseIcon = true, focusOn = 'ok' } = this.props;
        const { animationIn = 'fadeIn', animationOut = 'zoomOut', animationDurationIn = 250, animationDurationOut = 250 } = this.props;
        const { cancelText = 'Hủy', onCancel } = this.props;
        const { okText = 'Xác nhận', okType = 'primary', onOk } = this.props;
        const { title = '', headerActions } = this.props;
        const { width = 'fit-content', height = 'auto' , padding = '1rem', className } = this.props;

        let children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];

        const footer = children.find((child) => (child as React.ReactElement)?.type === PopupFooter);
        children = children.filter((child) => (child as React.ReactElement)?.type !== PopupFooter);

        const content = (
            <Animated
                className={clsx('popup-container', showCloseIcon && 'with-close-icon')}
                // className={'popup-container'}
                animationIn={animationIn}
                animationOut={animationOut}
                animationInDuration={animationDurationIn}
                animationOutDuration={animationDurationOut}
                isVisible={this.state.isVisible}
            >
                {!isShowContentOnly && (
                    <div className="popup-header">
                        <h3><T>{title}</T></h3>
                    </div>
                )}
                <div className="popup-header-actions">
                    {headerActions && headerActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                        >
                            <FAIcon
                                icon={action.icon}
                                size={'1.25rem'}
                            />
                        </button>
                    ))}
                    {showCloseIcon && (
                        <button onClick={this.handleClose}>
                            <FAIcon
                                icon="times"
                                size={'1.25rem'}
                            />
                        </button>
                    )}
                </div>
                {scroll
                    ? (
                            <ScrollView
                                className="popup-body"
                                style={{ padding }}
                            >{children}
                            </ScrollView>
                        )
                    : (<Col2 className="popup-body">{children}</Col2>)
                }
                {footer || onCancel || onOk
                    ? (
                            <div className="popup-footer">
                                {footer
                                    ? footer
                                    : (
                                            <PopupFooter>
                                                {onCancel && (
                                                    <EmptyButton
                                                        text={cancelText}
                                                        autoFocus={focusOn === 'cancel'}
                                                        onClick={() =>
                                                        {
                                                            this.handleClose();
                                                            onCancel();
                                                        }}
                                                    />
                                                )}
                                                {onOk && (
                                                    <Button
                                                        color={okType}
                                                        autoFocus={focusOn === 'ok'}
                                                        text={okText}
                                                        onClick={() =>
                                                        {
                                                            this.handleClose();
                                                            onOk();
                                                        }}
                                                    />
                                                )}
                                            </PopupFooter>
                                        )
                                }
                            </div>
                        )
                    : scroll && <div className="empty-popup-footer" />
                }
            </Animated>
        );

        return (
            <Overlay
                className={clsx(className, !this.state.topPopup && 'previous-popup')}
                width={width}
                height={height}
                onBackgroundClick={this.handleClose}
            >
                {content}
            </Overlay>
        );
    }
}

const PopupFooter: React.FC<{className?: string}> = ({ className, children }) =>
{
    return (
        <div className={clsx('popup-footer-content', className)}>
            {children}
        </div>
    );
};

export { PopupFooter };
