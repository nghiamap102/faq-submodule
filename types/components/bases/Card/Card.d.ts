import React, { HTMLAttributes, ReactNode } from 'react';
import './Card.scss';
export declare type TagProps = {
    color?: string;
    label?: string;
    size?: 'small' | 'medium' | 'large';
    textColor?: string;
};
export declare type CardLayoutProps = {
    /**
     * Change to "horizontal" if you need the icon to be left of the content.
     * Horizontal layouts cannot be used in conjunction with `footer`, or `textAlign`.
     * @default
     * vertical
     */
    layout?: 'vertical' | 'horizontal';
};
export declare type CardProps = Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'title' | 'onTitleClick'> & CardLayoutProps & {
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
export declare const Card: (props: CardProps) => JSX.Element;
//# sourceMappingURL=Card.d.ts.map