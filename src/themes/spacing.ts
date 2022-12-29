import { memoize } from './memoize';

const margin = {
    m: 'margin',
};

const padding = {
    p: 'padding',
};

const directions = {
    t: 'Top',
    r: 'Right',
    b: 'Bottom',
    l: 'Left',
    x: ['Left', 'Right'],
    y: ['Top', 'Bottom'],
};

const spaceBetween = {
    spaceBetweenX: 'mx',
    spaceBetweenY: 'my',
};

const spaceBetweenCssVarReverse = {
    spaceBetweenXReverse: '--space-x-reverse',
    spaceBetweenYReverse: '--space-y-reverse',
};

const spaceBetweenCssVar = {
    ...spaceBetweenCssVarReverse,
    spaceBetweenX: '--space-x-reverse',
    spaceBetweenY: '--space-y-reverse',
};

export const spaceBetweenSelector = {
    spaceBetweenX: '> * + *',
    spaceBetweenY: '> * + *',
    spaceBetweenXReverse: '> * + *',
    spaceBetweenYReverse: '> * + *',
};

export const spacingSystem = {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
};

const getVal = (value: string | number): string =>
{
    value = (value).toString();
    if (value[0] === '-')
    {
        return '-' + spacingSystem[value.slice(1) as keyof typeof spacingSystem];
    }
    return spacingSystem[value as keyof typeof spacingSystem] + ' !important';
};

const getSpaceBetweenVal = (value: string | number, key: string): string[] =>
{
    return ['0', `calc(${value} * calc(1 - var(--space-${key[1]}-reverse)))`, `calc(${value} * var(--space-${key[1]}-reverse))`];
};

const getCssSpacingProperties = (prop: string, abbrProp: any, directions: any) =>
{
    const [a, b] = prop.split('');
    const property = abbrProp[a];
    const direction = directions[b] || '';
    return Array.isArray(direction) ? direction.map((dir) => property + dir) : [property + direction];
};

// memoize() impact:
// Increase performance by ~25%
export const getCssSpacingOutsideProperties = memoize((prop: string): string[] =>
{
    return getCssSpacingProperties(prop, margin, directions);
});

export const getCssSpacingInsideProperties = memoize((prop: string): string[] =>
{
    // It's for space between
    if (spaceBetweenCssVarReverse[prop as keyof typeof spaceBetweenCssVarReverse])
    {
        return [spaceBetweenCssVarReverse[prop as keyof typeof spaceBetweenCssVarReverse]];
    }
    if (spaceBetween[prop as keyof typeof spaceBetween])
    {
        const abbrProp = spaceBetween[prop as keyof typeof spaceBetween];
        return [spaceBetweenCssVar[prop as keyof typeof spaceBetweenCssVar], ...getCssSpacingProperties(abbrProp, margin, directions)];
    }

    return getCssSpacingProperties(prop, padding, directions);
});

export const getCssSpacingValues = memoize((value: string | number, prop: string): string[] =>
{
    const val = getVal(value);

    // It's for space between
    if (spaceBetweenCssVarReverse[prop as keyof typeof spaceBetweenCssVarReverse])
    {
        return ['1'];
    }
    if (spaceBetween[prop as keyof typeof spaceBetween])
    {
        return getSpaceBetweenVal(val, spaceBetween[prop as keyof typeof spaceBetween]);
    }

    if (prop?.length === 2 && Array.isArray(directions[prop[1] as keyof typeof directions]))
    {
        return [val, val];
    }

    return [val];

});
