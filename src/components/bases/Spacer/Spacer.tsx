import React from 'react';
import clsx from 'classnames';

import './Spacer.scss';

export type SpacerProps = {
    direction?: 'vertical' | 'horizontal',
    size?: string,
    divider?: boolean,
    [key: string]: any,
} & JSX.IntrinsicElements['div']

export const Spacer: React.FC<SpacerProps> = (props) =>
{
    const { direction = 'horizontal', size = '1rem', divider, style, className, ...rest } = props;

    const spacerStyle = {
        width: direction === 'horizontal' ? size : '100%',
        height: direction === 'vertical' ? size : '100%',
        ...style,
    };

    const spacerClass = clsx(
        'spacer-component',
        {
            ['spacer-with-horizontal-divider']: divider && direction === 'vertical',
            ['spacer-with-vertical-divider']: divider && direction === 'horizontal',
        },
        className,
    );

    return (
        <div
            className={spacerClass}
            style={spacerStyle}
            {...rest}
        />
    );
};
