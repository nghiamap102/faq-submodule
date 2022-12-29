import './Tag.scss';

import React from 'react';
import clsx from 'clsx';

import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

export type TagProps =
{
    text?: React.ReactNode
    onCloseClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    color?: string
    size?: 'small' | 'medium' | 'large'
    textStyle?: React.CSSProperties
    isRound?: boolean
    textCase?: 'default' | 'title' | 'upper' | 'lower' | 'sentence' // sentence: capitalize first letter of a string, title: capitalize all first letters
    className?: string
}

export const Tag: React.FC<TagProps> = (props) =>
{
    const { text = '', size = 'small', textCase = 'default', color, textStyle, isRound, className, onCloseClick } = props;

    const style = color ? { backgroundColor: color, ...(textStyle && textStyle) } : undefined;
    const textCaseClass = textCase === 'sentence' ? 'first-letter-up' : `tag--${textCase}`;

    const classes = clsx(
        'tag-container',
        textCase !== 'default' && textCaseClass,
        isRound && 'tag--round',
        size && `tag--${size}`,
        className,
    );

    return text && (
        <div
            className={classes}
            style={style}
        >
            <T>{text}</T>
            {onCloseClick && (
                <button
                    className={'tag-close-button'}
                    onClick={onCloseClick}
                >
                    <FAIcon
                        icon={'times'}
                        size={size === 'small' ? '0.75rem' : '1rem'}
                    />
                </button>
            )}
        </div>
    );
};
