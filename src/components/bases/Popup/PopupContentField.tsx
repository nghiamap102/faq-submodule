import React from 'react';
import clsx from 'clsx';
import { Property } from 'csstype';

import './PopupContentField.scss';

import { T } from 'components/bases/Translate/Translate';

export const ContainField: React.FC = ({ children }) => (<div className={'popup-contain'}>{children}</div>);

export type PopupFieldProps = {
    className?: string
    layout?: 'horizontal' | 'vertical'
}

export const Field: React.FC<PopupFieldProps> = ({ children, className, layout = 'vertical' }) =>
{
    return (
        <div className={clsx('popup-field', layout === 'horizontal' && 'pf-horizontal', className)}>
            {children}
        </div>
    );
};

export type PopupLabelProps = {
    width?: Property.Width
}

export const Label: React.FC<PopupLabelProps> = ({ children, width = '120px' }) =>
{
    return (
        <div
            className={'popup-label'}
            title={children as string}
            style={{ ...width && { flex: `0 0 ${width}` } }}
        >
            <T>{children}</T>
        </div>
    );
};

export type PopupInfoProps = {
    className?: string
    color?: Property.Color
}

export const Info: React.FC<PopupInfoProps> = ({ color, className, children }) =>
{
    return (
        <div
            style={{ color }}
            className={clsx('popup-info', className)}
        >
            <T>{children}</T>
        </div>
    );
};
