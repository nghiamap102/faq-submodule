import React, { HTMLAttributes, isValidElement, ReactNode } from 'react';
import clsx from 'clsx';

import { FAIcon } from '@vbd/vicon';

import { createUniqueId } from 'utils';
import { Link } from 'components/bases/Link/Link';
import { Col2, Row2 } from 'components/bases/Layout';
import { Tag } from 'components/bases/Tag';

import './Card.scss';
import { Ratio } from '../Ratio/Ratio';

export type TagProps = {
    color?: string
    label?: string
    size?: 'small' | 'medium' | 'large'
    textColor?: string
}

export type CardLayoutProps = {
    /**
     * Change to "horizontal" if you need the icon to be left of the content.
     * Horizontal layouts cannot be used in conjunction with `footer`, or `textAlign`.
     * @default
     * vertical
     */
    layout?: 'vertical' | 'horizontal';
}

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title' | 'onTitleClick'> & CardLayoutProps & {
    /**
     * Card title
     */
    title: string;
    /**
     * Description content. Placed within a `<p>` tag
     */
    description?: string;
    /**
     * The className of card container
     */
    className?: string;
    /**
     * Card icon
     */
    icon?: ReactNode;
    /**
     * Use only if you want to forego a button or a link in the footer and make the whole card clickable
     */
    onTitleClick?: React.MouseEventHandler<HTMLButtonElement> | React.MouseEventHandler<HTMLAnchorElement>;
    /**
     * Whether the card is disabled, can not be clicked
     * @default
     * false
     */
    isDisabled?: boolean;
    /**
     * Link of card
     */
    href?: string;
    /**
     * Specifies where to open the linked card
     */
    target?: '_self' | '_blank' | '_parent' | '_top';
    /**
     * Accepts a url in ReactNode for a custom image component
     */
    image?: ReactNode;
    /**
     * The width of image, to calculate ratio of width and height
     */
    imageWidth?: number;
     /**
     * The height of image, to calculate ratio of width and height
     */
    imageHeight?: number;
    /**
     * Custom footer of card
     */
    footer?: ReactNode;
    /**
     * Changes alignment of the title and description
     * @default
     * left
     */
    textAlign?: 'center' | 'left' | 'right';
    /**
     * Card tag
     */
    tag?: TagProps;
    /**
     * If `false`, the card will not have the shadow
     * @default
     * true
     */
    hasShadow?: boolean;
    /**
     * Custom children
     */
    children?: ReactNode;
};

export const Card = (props: CardProps) =>
{
    const {
        title,
        description,
        icon,
        isDisabled = false,
        href,
        target,
        image,
        imageWidth = 150,
        imageHeight = 100,
        layout = 'vertical',
        footer,
        children,
        className,
        textAlign = 'left',
        tag,
        hasShadow = true,
        onTitleClick,
    } = props;

    const isHorizontal = layout === 'horizontal' || (image && icon);
    let imageNode, iconNode, optionalCardTop, cardTitle;
    if (image && layout === 'vertical')
    {
        if (isValidElement(image) || typeof image === 'string')
        {
            imageNode = (
                <div className="vui-card__image">
                    <Ratio
                        width={imageWidth}
                        height={imageHeight}
                    >
                        {isValidElement(image)
                            ? image
                            : (
                                    <img
                                        src={image}
                                        alt=''
                                    />
                                )}
                    </Ratio>
                </div>
                
            );
        }
        else
        {
            imageNode = null;
        }
    }

    if (icon)
    {
        iconNode = (
            <div className='vui-card__icon'>
                {typeof icon === 'string'
                    ? (
                            <FAIcon
                                icon={icon}
                            />
                        )
                    : icon}
            </div>
        );
    }

    if (imageNode || iconNode)
    {
        optionalCardTop = (
            <div className='vui-card__top'>
                {imageNode ? imageNode : !isHorizontal && iconNode}
            </div>
        );
    }

    let titleRef: HTMLAnchorElement | HTMLButtonElement | null = null;

    if (!isDisabled && href)
    {
        cardTitle = (
            <Link
                ref={(ref) => titleRef = ref}
                className="vui-card__title--link"
                href={href}
                target={target}
                onClick={onTitleClick as React.MouseEventHandler<HTMLAnchorElement>}
            >
                {title}
            </Link>
        );
    }
    else if (isDisabled || onTitleClick)
    {
        cardTitle = (
            <button
                ref={(ref) => titleRef = ref}
                className="vui-card__title--button"
                disabled={isDisabled}
                onClick={onTitleClick as React.MouseEventHandler<HTMLButtonElement>}
            >
                {title}
            </button>
        );
    }
    else
    {
        cardTitle = title;
    }

    const isClickable = !isDisabled && (onTitleClick || href);

    const classes = clsx(
        'vui-card',
        isDisabled && 'vui-card--isDisabled',
        `vui-card--${textAlign}Align`,
        isHorizontal && 'vui-card--horizontal',
        hasShadow && 'vui-card--hasShadow',
        isClickable && 'vui-card--isClickable',
        className,
    );
    const ariaId = createUniqueId();

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) =>
    {
        titleRef && titleRef !== e.target && titleRef.click();
    };

    return (
        <div
            id={`card${ariaId}`}
            className={classes}
            onClick={isClickable ? handleCardClick : undefined}
        >
            {optionalCardTop}
            <Row2
                className='vui-card__content'
                gap={4}
            >
                {isHorizontal && iconNode}
                <Col2
                    gap={2}
                >
                    <div
                        className="vui-card__title"
                    >
                        {cardTitle}
                    </div>

                    {description && (
                        <div
                            className="vui-card__description"
                        >
                            <p>{description}</p>
                        </div>
                    )}

                    {children && <div className="vui-card__children">{children}</div>}
                </Col2>
            </Row2>

            {tag && (
                <div className='vui-card__tag'>
                    {
                        tag.color
                            ? (
                                    <Tag
                                        textCase={'sentence'}
                                        text={tag.label}
                                        color={tag.color}
                                        size={tag.size ?? 'medium'}
                                        textStyle={{ color: tag.textColor }}
                                        isRound
                                    />
                                )
                            : <div>{tag.label}</div>
                    }
                </div>
            )}


            {layout === 'vertical' && footer && (
                <div className="vui-card__footer">{footer}</div>
            )}
        </div>
    );
};
