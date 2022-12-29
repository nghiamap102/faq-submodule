import React from 'react';
import clsx from 'clsx';

import { T } from 'components/bases/Translate/Translate';

import './Link.scss';

export type LinkProps = JSX.IntrinsicElements['a']
export const Link: React.FC<LinkProps> = (props) =>
{
    const { target = '_self', children, className, ...anchorProps } = props;
    return (
        <a
            {...anchorProps}
            className={clsx('link', className)}
            target={target}
            rel={'noopener noreferrer'}
        >
            <T>{children}</T>
        </a>
    );
};
