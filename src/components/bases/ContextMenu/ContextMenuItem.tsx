import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { FAIcon } from '@vbd/vicon';

import { IContactMenuAction } from 'components/bases/ContextMenu/ContextMenu';
import { T } from 'components/bases/Translate/Translate';

export type ContextMenuItemProps = {
    index: number;
    onClose: () => void;
} & IContactMenuAction

export const ContextMenuItem = (props: ContextMenuItemProps) =>
{
    const {
        label,
        className,
        disabled,
        iconStyle,
        iconClassName,
        icon,
        to,
        style,
        index,
        sub,
        onClick,
        onClose,
    } = props;

    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() =>
    {
        ref.current?.addEventListener((isMobile ? 'touchstart' : 'mousedown'), handleOnClickAction);
        return () => ref.current?.removeEventListener((isMobile ? 'touchstart' : 'mousedown'), handleOnClickAction);
    }, []);

    const handleMouseEnter = () =>
    {
        ref.current?.focus();
    };

    const handleOnClickAction = (e: MouseEvent | TouchEvent) =>
    {
        !disabled && onClick && onClick(e);
        !disabled && onClose();
    };

    if (!label)
    {
        return null;
    }

    if (label === '-')
    {
        return (
            <div
                className="action-menu-horizontal-line"
            />
        );
    }

    return (
        <React.Fragment key={index}>

            <div
                ref={ref}
                className={clsx('action-menu-entry', className, disabled && 'disabled')}
                style={style}
                onMouseEnter={handleMouseEnter}
            >
                <div
                    className={clsx('action-menu-entry-icon', iconClassName)}
                    style={iconStyle}
                >
                    {
                        icon && typeof icon === 'string'
                            ? (
                                    <FAIcon
                                        type={'regular'}
                                        icon={icon}
                                        size={'1rem'}
                                    />
                                )
                            : icon
                    }
                </div>
                <div className={'action-menu-entry-text'}>
                    <div className="ml-ellipsis">
                        {to
                            ? (
                                    <Link to={to}>
                                        <T>{label}</T>
                                    </Link>
                                )
                            : (
                                    <T>{label}</T>
                                )}
                    </div>

                    {sub && (
                        <div className="action-menu-sub ml-ellipsis">
                            <T>{sub}</T>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};
