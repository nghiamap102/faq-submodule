import React from 'react';
import clsx from 'clsx';

import { T } from 'components/bases/Translate/Translate';
import { TypographyProps, TextProps, TypographyVariant } from './model/textType';

import './Text.scss';

export const MAPPED_TEXT_VARIANT_CLASSES: Record<TypographyVariant, string> = {
    TB1: 'tb tb1',
    TB2: 'tb tb2',
    HD1: 'hd hd1',
    HD2: 'hd hd2',
    HD3: 'hd hd3',
    HD4: 'hd hd4',
    HD5: 'hd hd5',
    HD6: 'hd hd6',
    Sub1: 'sub sub1',
    Sub2: 'sub sub2',
};


const Typography: React.FC<TypographyProps> = (props) =>
{
    const { className, color, secondary, children, variant, ...restProps } = props;

    const validSecondaryVariants: TypographyVariant[] = ['TB1', 'TB2'];
    const typographyClasses = clsx(
        className,
        MAPPED_TEXT_VARIANT_CLASSES[variant],
        color && `sub-${color}`,
        validSecondaryVariants.includes(variant) && secondary && 'tb-secondary',
    );

    return (
        <span
            className={typographyClasses}
            {...restProps}
        >
            <T>{children}</T>
        </span>
    );
};

const TB1:React.FC<TextProps> = (props) => (
    <Typography
        variant='TB1'
        {...props}
    />
);

const TB2: React.FC<TextProps> = (props) => (
    <Typography
        variant='TB2'
        {...props}
    />
);

const HD1: React.FC<TextProps> = (props) => (
    <Typography
        variant='HD1'
        {...props}
    />
);

const HD2: React.FC<TextProps> = (props) => (
    <Typography
        variant='HD2'
        {...props}
    />
);

const HD3: React.FC<TextProps> = (props) => (
    <Typography
        variant='HD3'
        {...props}
    />
);

const HD4: React.FC<TextProps> = (props) => (
    <Typography
        variant='HD4'
        {...props}
    />
);

const HD5: React.FC<TextProps> = (props) => (
    <Typography
        variant='HD5'
        {...props}
    />
);

const HD6: React.FC<TextProps> = (props) => (
    <Typography
        variant='HD6'
        {...props}
    />
);

const Sub1: React.FC<TextProps> = (props) => (
    <Typography
        variant='Sub1'
        {...props}
    />
);

const Sub2: React.FC<TextProps> = (props) => (
    <Typography
        variant='Sub2'
        {...props}
    />
);

export { TB1, TB2, HD1, HD2, HD3, HD4, HD5, HD6, Sub1, Sub2, Typography };
