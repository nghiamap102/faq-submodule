import { CSSProperties } from 'react';
import {
    BorderProperty,
    SpacingProperty,
    SizingProperty,
    PositionProperty,
    TypographyProperty,
    BackgroundProperty,
    OpacityProperty,
} from '../types';
import { camelToKebab } from 'utils/camelKebab';
import { memoize } from 'themes/memoize';
import { makeStyled } from './makeStyled';

export type SxSelector = {
  [key: string]: SxHasNotSelector;
}

export type SxHasNotSelector =
  & BorderProperty
  & SpacingProperty
  & SizingProperty
  & PositionProperty
  & TypographyProperty
  & BackgroundProperty
  & OpacityProperty;

export type Sx = SxHasNotSelector | SxSelector;

export type SxFamiliarProps =
  | typeof borderKeys
  | typeof spacingOutsideBoxKeys
  | typeof spacingInsideBoxKeys
  | typeof sizingKeys
  | typeof positionKeys
  | typeof textKeys
  | typeof backgroundKeys
  | typeof opacityKeys;

export const borderWidth = ['border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft'] as const;
export const borderRadius = ['borderRadius', 'borderTopRadius', 'borderRightRadius', 'borderBottomRadius', 'borderLeftRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius'] as const;
export const borderKeys = [
    ...borderWidth,
    ...borderRadius,
    'borderColor',
    'borderOpacity',
] as const;

export const spacingOutsideBoxKeys = [ 'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml'] as const;
// spaceBetweenReverse has different value than another of spacing
export const spaceBetweenReverse = ['spaceBetweenXReverse', 'spaceBetweenYReverse'] as const;
export const spacingInsideBoxKeys = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'spaceBetweenX', 'spaceBetweenY', ...spaceBetweenReverse] as const;
export const spacingKeys = [
    ...spacingOutsideBoxKeys,
    ...spacingInsideBoxKeys,
];

export const sizingKeys = ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight'] as const;

export const positions = ['inset', 'insetX', 'insetY', 'top', 'right', 'bottom', 'left'] as const;
export const positionKeys = ['position', ...positions] as const;

export const textKeys = ['color', 'fontSize', 'fontStyle', 'fontWeight', 'textOpacity', 'textAlign', 'textDecoration', 'textTransform', 'textOverflow', 'textTruncate', 'lineHeight', 'letterSpacing', 'verticalAlign', 'whiteSpace', 'workBreak', 'listStyleType', 'listStylePosition'] as const;

export const backgroundKeys = ['bgColor', 'bgOpacity'] as const;
export const opacityKeys = ['opacity'] as const;

// The special cases have sx value is 'none', so the css class name is different sx key name.
const specialCase = {
    textDecoration: 'no-underline',
    textTransform: 'normal-case',
    lineHeight: 'leading-none',
    listStyleType: 'list-none',
} as const;

const separateNumberAsKebab = (value: string) =>
{
    const kebab = camelToKebab(value);
    const match = kebab.match(/\d/);
    const index = match ? match.index : -1;
    if (index === 0 || index === -1)
    {
        return kebab;
    }
    else
    {
        return kebab.slice(0, index) + '-' + kebab.slice(index, kebab.length);
    }
};

const handleBorderPrefix = (name: string) =>
{
    let prefix = name;
    if (name.indexOf('Radius') !== -1)
    {
        prefix = name.replace(/border/, 'rounded');
    }
    return camelToKebab(
        prefix
            .replace(/Color|Radius/, '')
            .replace(/Opacity/, 'Alpha')
            .replace(/Top/, 'T')
            .replace(/Right/, 'R')
            .replace(/Bottom/, 'B')
            .replace(/Left/, 'L')
            .replace(/TopLeft/, 'TL')
            .replace(/TopRight/, 'TR')
            .replace(/BottomRight/, 'BR')
            .replace(/BottomLeft/, 'BL'),
    );
};

const handleBorderValue = (value: string) => separateNumberAsKebab(value.replace(/px|sm/, ''));

const handleInsideBoxPrefix = (name: string) => camelToKebab(name.replace(/Between/, ''));

const handleSizingPrefix = (name: string) =>
{
    return camelToKebab(
        name
            .replace(/width|Width/, 'W')
            .replace(/height|Height/, 'H'),
    );
};

const handlePositionPrefix = (name: string) => camelToKebab(name.replace(/position/, ''));

const handleTextPrefix = (name: string) =>
{
    return camelToKebab(
        name
            .replace(/Weight|textDecoration|textTransform|StyleType|StylePosition/, '')
            .replace(/color|fontSize|textAlign/, 'text')
            .replace(/verticalAlign/, 'align')
            .replace(/textOverflow/, 'overflow')
            .replace(/textTruncate/, 'truncate')
            .replace(/lineHeight/, 'leading')
            .replace(/letterSpacing/, 'tracking')
            .replace(/whiteSpace/, 'whitespace')
            .replace(/workBreak/, 'break')
            .replace(/Opacity/, 'Alpha'),
    );
};

const handleTextValue = (value: string) => separateNumberAsKebab(value.replace(/none/, ''));

const handleBackgroundPrefix = (name: string) => camelToKebab(name.replace(/Color/, ''));

/**
 * Get an atomic css class name from the sx key and value.
 * @param sxKey Property of sx - String
 * @param value Value of sxKey - Number | String | Boolean.
 * @param handlePrefix Optional - Convert prefix String for specific cases - Function
 * @param handleStringValue Optional - Convert value String for specific cases - Function
 * @return String
 * @example
 * 'pt-2 '
 */
const getAtomicClass = memoize((
    sxKey: keyof Sx,
    value: Sx[keyof Sx],
    handlePrefix?: (value: string) => string,
    handleStringValue?: (value: string) => string,
) =>
{
    // fontStyle with value is 'italic'/'normal' are not same as `font-style-suffix`, so handle it separately.
    if (sxKey === 'fontStyle')
    {
        if (value === 'italic')
        {
            return 'italic ';
        }
        else if (value === 'normal')
        {
            return 'not-italic ';
        }
    }

    const val = value === true ? '' : value;
    // Handle the prefix class name of special cases have 'none' value.
    const prefixSpecialCase =
            value === 'none' && specialCase[sxKey as keyof typeof specialCase]?.length
                ? specialCase[sxKey as keyof typeof specialCase]
                : '';
    // Convert the prefix class name to match scss atomic
    const prefix = prefixSpecialCase.length ? prefixSpecialCase : handlePrefix ? handlePrefix(sxKey) : sxKey;

    if (typeof val === 'string')
    {
        const stringVal = handleStringValue ? handleStringValue(val) : val;
        // Positive is common case, so control the positive first, negative later.
        if (stringVal.indexOf('-') !== 0)
        {
            const separator = stringVal === '' || prefix === '' ? '' : '-';
            return prefix + separator + stringVal + ' ';
        }

        return '-' + prefix + stringVal + ' ';
    }

    if (typeof val === 'number')
    {
        if (val >= 0)
        {
            return prefix + '-' + val + ' ';
        }

        return '-' + prefix + val + ' ';
    }
});

type GenClassNameParams = {
    sxFamiliarProps: SxFamiliarProps,
    sx?: Sx,
    handlePrefix?: (value: string) => string,
    handleStringValue?: (value: string) => string,
}

/**
 * Generate the string of atomic class name
 * @param sxFamiliarProps An array of properties sx whose set has similar CSS features - Array
 * @param sx sx prop - Object.
 * @param handlePrefix Optional - Convert prefix String for specific cases - Function
 * @param handleStringValue Optional - Convert value String for specific cases - Function
 * @return String
 * @example
 * 'pt-2 pr-3 pb-4 pl-5 flex '
 */
const genClassName = (params: GenClassNameParams) =>
{
    const { sxFamiliarProps, sx, handlePrefix, handleStringValue } = params;

    if (typeof sx !== 'object')
    {
        return '';
    }

    let className = '';
    const sxKeys = Object.keys(sx) as (keyof Sx)[];

    for (let i = 0; i < sxKeys.length; i++)
    {
        // If key of sx does not include in sxFamiliarProps OR is pseudo selector OR value is object of breakpoints, skip using clsx
        if (sxFamiliarProps.indexOf(sxKeys[i] as never) === -1 || typeof sx[sxKeys[i]] === 'object')
        {
            continue;
        }

        className += getAtomicClass(sxKeys[i], sx[sxKeys[i]], handlePrefix, handleStringValue);
    }
    return className;
};

type UseSx = (sx?: Sx) => {
    sxClass?: string,
    sxOutsideBoxClass?: string,
    sxInsideBoxClass?: string,
    jssOutsideBoxStyled?: CSSProperties,
    jssInsideBoxStyled?: CSSProperties,
    jssStyled?: CSSProperties,
}
/**
 * Convert `sx` system to an object of class names and object styles.
 * @param sx sx prop - Define custom style and responsive.
 * @returns Collection of class names and CSSProperties.
 */
export const useSx: UseSx = (sx) =>
{
    if (!sx)
    {
        return {};
    }

    const border = genClassName({ sxFamiliarProps: borderKeys, sx, handlePrefix: handleBorderPrefix, handleStringValue: handleBorderValue });
    const spacingOutsideBox = genClassName({ sxFamiliarProps: spacingOutsideBoxKeys, sx });
    const spacingInsideBox = genClassName({ sxFamiliarProps: spacingInsideBoxKeys, sx, handlePrefix: handleInsideBoxPrefix });
    const sizing = genClassName({ sxFamiliarProps: sizingKeys, sx, handlePrefix: handleSizingPrefix });
    const position = genClassName({ sxFamiliarProps: positionKeys, sx, handlePrefix: handlePositionPrefix });
    const text = genClassName({ sxFamiliarProps: textKeys, sx, handlePrefix: handleTextPrefix, handleStringValue: handleTextValue });
    const background = genClassName({ sxFamiliarProps: backgroundKeys, sx, handlePrefix: handleBackgroundPrefix, handleStringValue: separateNumberAsKebab });
    const opacity = genClassName({ sxFamiliarProps: opacityKeys, sx });
    const sxOutsideBoxClass = (
        border +
        spacingOutsideBox +
        sizing +
        position +
        background +
        opacity
    ).trim();
    const sxInsideBoxClass = (
        spacingInsideBox +
        text
    ).trim();
    const sxClass = `${sxOutsideBoxClass} ${sxInsideBoxClass}`;
    const { jssOutsideBoxStyled, jssInsideBoxStyled, jssStyled } = makeStyled(sx);

    return {
        sxClass,
        sxOutsideBoxClass,
        sxInsideBoxClass,
        jssOutsideBoxStyled,
        jssInsideBoxStyled,
        jssStyled,
    };
};
