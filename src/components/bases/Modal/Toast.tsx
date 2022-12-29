import React, { ReactNode } from 'react';
import { Animated } from 'react-animated-css';
import { FAIcon } from '@vbd/vicon';

import { Container } from 'components/bases/Container/Container';

import './Toast.scss';

type ToastLocation = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right'
export type ToastStackProps = {
    id?: string,
    location?: ToastLocation,
    items?: ToastProps[]
}

export const ToastStack = (props: ToastStackProps): JSX.Element =>
{
    const { id, location = 'top-right', items } = props;

    return (
        <Container
            id={id}
            className={`toast-items toast-location-${location}`}
        >
            {Array.isArray(items) && items.map((toast, index) => (
                <Toast
                    key={toast.id || index}
                    message={toast.message}
                    type={toast.type}
                    icon={toast.icon}
                    onClick={toast.onClick}
                />
            ))}
        </Container>
    );
};

export type ToastProps = {
    id?: string,
    message?: string,
    icon?: string,
    type: 'error' | 'info' | 'success' | 'warning' | 'default',
    child?: ReactNode,
    onClick?: () => void
}

export const Toast = (props: ToastProps): JSX.Element =>
{
    const { message, type, onClick, icon, child } = props;

    return (
        <Animated
            animationIn="slideInRight"
            animationOut="slideOutLeft"
            animationInDuration={250}
            isVisible
        >
            <Container
                className={`toast toast-${type}`}
                style={{ cursor: onClick ? 'pointer' : '' }}
                onClick={onClick}
            >
                {child || (
                    <Container
                        className={'toast-container '}
                    >
                        {icon && (
                            <FAIcon
                                className={'toast-icon'}
                                icon={icon}
                            />
                        )}
                        <Container className={'toast-message'}>{message}</Container>
                    </Container>
                )}
            </Container>
        </Animated>
    );
};
