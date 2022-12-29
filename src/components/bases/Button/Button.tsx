import React, { MutableRefObject, ReactElement, ReactNode, Ref, useState } from 'react';
import clsx from 'clsx';

import { FAIcon } from '@vbd/vicon';

import { Tooltip2, Tooltip2Props } from 'components/bases/Tooltip';
import { T } from 'components/bases/Translate/Translate';
import './Button.scss';

export type ButtonVariant = 'fill' | 'fade' | 'outline';
export type ButtonColor = 'default' | 'primary' | 'success' | 'info' | 'danger' | 'warning';

export type ButtonProps = {
    innerRef?: Ref<HTMLButtonElement>
    isLoading?: boolean
    loadingText?: string | ReactElement
    text?: string | ReactElement
    iconType?: 'solid' | 'regular' | 'light'
    iconLocation?: 'left' | 'right'
    onlyIcon?: boolean
    icon?: string
    iconSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    isDefault?: boolean
    className?: string
    color?: ButtonColor
    size?: 'xs' | 'sm' | 'md' | 'lg'
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    tooltip?: ReactNode
    tooltipPosition?: Tooltip2Props['placement']
    hideTooltipArrow?: boolean
    isRound?: boolean
    pressed?: boolean
    variant?: ButtonVariant
    fullWidth?: boolean
    minWidth?: number
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = (props) =>
{
    const {
        innerRef,
        isLoading = false,
        loadingText,
        text = 'Button',
        iconType = 'light',
        iconLocation = 'left',
        onlyIcon = false,
        icon,
        iconSize = 'sm',
        isDefault = false,
        className,
        color = 'default',
        size = 'md',
        onClick,
        disabled = false,
        tooltip,
        isRound = false,
        pressed,
        variant = 'fill',
        fullWidth = false,
        minWidth,
        type = 'button',
        tooltipPosition,
        hideTooltipArrow,
        ...buttonProps
    } = props;

    const [buttonEl, setButtonEl] = useState<HTMLButtonElement | null>(null);

    const iconNode = (
        <FAIcon
            icon={icon}
            type={iconType}
        />
    );

    const iconClasses = clsx(
        isDefault && className,
        size && `btn--${size}`,
        onlyIcon && 'btn--only-icon',
        icon && `btn--icon-${iconSize}`,
    );

    const buttonClasses = clsx(
        'btn',
        `btn--${color}`,
        pressed && 'btn--active',
        variant && `btn--${variant}`,
        isRound && 'btn--round',
        fullWidth && 'btn--full-width',
        isLoading && 'btn--loading',
        iconClasses,
        className,
    );

    const contentClasses = clsx(
        'inline-flex justify-center items-center',
        !onlyIcon && iconLocation && `btn--icon-${iconLocation}`,
    );

    const translatedText = typeof text === 'string' ? <T>{text}</T> : text;
    const translatedLoadingText = typeof loadingText === 'string' ? <T>{loadingText}</T> : loadingText;

    return (
        <>
            <button
                ref={node =>
                {
                    !!innerRef && (isCallBackRef(innerRef) ? innerRef(node) : (innerRef as MutableRefObject<HTMLButtonElement | null>).current = node);
                    setButtonEl(node);
                }}
                className={isDefault ? onlyIcon ? iconClasses : className : buttonClasses}
                disabled={disabled || isLoading}
                style={{ minWidth /* stylelint-disable-line value-keyword-case */ }}
                aria-pressed={pressed}
                aria-disabled={disabled || isLoading}
                type={type}
                onClick={(e) =>
                {
                    e.stopPropagation();
                    !isLoading && onClick && onClick(e);
                }}
                {...buttonProps}
            >
                {isLoading && (
                    <svg>
                        {isRound
                            ? (
                                    <rect
                                        x='0'
                                        y='0'
                                        rx='0'
                                        ry='0'
                                    />
                                )
                            : (
                                    <rect
                                        rx='0'
                                        ry='0'
                                    />
                                )
                        }
                    </svg>
                )}

                <span className={contentClasses}>
                    {icon && iconLocation === 'left' && (typeof icon === 'string' ? iconNode : icon)}

                    {!onlyIcon && isLoading && <span className='btn__text'>{translatedLoadingText ? translatedLoadingText : translatedText}</span>}

                    {!onlyIcon && !isLoading && <span className='btn__text'>{translatedText}</span>}

                    {icon && iconLocation === 'right' && (typeof icon === 'string' ? iconNode : icon)}
                </span>
            </button>
            
            {!!tooltip && (
                <Tooltip2
                    triggerEl={buttonEl}
                    placement={tooltipPosition}
                    hideArrow={hideTooltipArrow}
                    tooltip={tooltip}
                />
            )}
        </>
    );
};

export type EmptyButtonProps = Omit<ButtonProps, 'variant' | 'pressed'>

const EmptyButton: React.FC<EmptyButtonProps> = (props) =>
{
    const {
        className,
        text = '',
        // noSpace, // TODO: not ready
        ...rest
    } = props;

    const classes = clsx(
        'btn--empty',
        // noSpace && 'p-0',
        className,
    );

    return (
        <Button
            className={classes}
            text={text}
            {...rest}
        />
    );
};

type IconButtonVariant = ButtonVariant | 'empty';
export type IconButtonProps = Omit<ButtonProps, 'variant' | 'onlyIcon' | 'text' | 'loadingText' | 'iconLocation' | 'fullWidth' | 'minWidth'> & {
    variant?: IconButtonVariant;
}

const IconButton: React.FC<IconButtonProps> = (props) =>
{
    const {
        className,
        variant = 'outline',
        color = 'default',
        isRound = true,
        ...rest
    } = props;

    const classes = clsx(
        variant !== 'empty' && 'btn-icon',
        className,
    );

    const View = variant === 'empty' ? EmptyButton : Button;

    return (
        <View
            className={classes}
            color={color}
            isRound={isRound}
            onlyIcon
            {...(variant === 'empty' ? {} : { variant })}
            {...rest}
        />
    );
};

export { Button, EmptyButton, IconButton };

export const isCallBackRef = <E extends HTMLElement = HTMLElement>(ref: Exclude<React.ForwardedRef<E>, null>): ref is (instance: E | null) => void => !('current' in ref);
