import { CSSProperties } from 'react';
import { Sx, SxHasNotSelector, SxFamiliarProps, spacingOutsideBoxKeys, spacingInsideBoxKeys } from './useSx';
import { breakpoints } from 'themes/breakpoints';
import { spaceBetweenSelector, getCssSpacingOutsideProperties, getCssSpacingInsideProperties, getCssSpacingValues } from '../../../../themes/spacing';
import { deepMergeObj, deepMergeAll } from '../../../../themes/deepMergeObj';

type SelectorCssStyled = {
  [key: string]: {
    [key in keyof CSSProperties]: string;
  } | any;
}

type ResponsiveCssStyled = {
    [key: string]: SelectorCssStyled;
}
type MakeResponsiveStyledParams = {
  bps: (keyof typeof breakpoints)[];
  sxKey: keyof SxHasNotSelector;
  sxVal: SxHasNotSelector[keyof SxHasNotSelector];
  getCssProps: (prop: SxFamiliarProps[number]) => (keyof CSSProperties)[];
  getValues: (value: string | number | boolean, p: string) => string[];
  styled: ResponsiveCssStyled;
  cssSelector?: Record<string, string>;
  sxSelector?: string;
}

const makeResponsiveStyled = (params: MakeResponsiveStyledParams) =>
{
    const { bps, sxKey, sxVal, cssSelector, getCssProps, getValues, sxSelector } = params;
    const { styled } = params;

    for (let i = 0; i < bps.length; i++)
    {
        if (typeof sxVal?.[bps[i] as never] === 'string' || typeof sxVal?.[bps[i] as never] === 'number' || typeof sxVal?.[bps[i] as never] === 'boolean')
        {
            const bp = bps[i];
            const media = `@media (min-width: ${breakpoints[bp]}px)`;
            const objStyle: SelectorCssStyled = {};
            sxSelector && (styled[media] = styled[media] || {});

            if (cssSelector?.[sxKey])
            {
                const subSelector = cssSelector[sxKey];
                objStyle[subSelector] = styled[media]?.[subSelector] || {};

                for (let g = 0; g < getCssProps(sxKey).length; g++)
                {
                    const cssP = getCssProps(sxKey)[g];
                    objStyle[subSelector][cssP] = getValues(sxVal[bp as never], sxKey)[g];
                }
            }
            else
            {
                for (let h = 0; h < getCssProps(sxKey).length; h++)
                {
                    objStyle[getCssProps(sxKey)[h]] = getValues(sxVal[bp as never], sxKey)[h];
                }
            }

            if (sxSelector)
            {
                styled[media][sxSelector] = { ...styled[media][sxSelector], ...objStyle };
            }
            else
            {
                styled[media] = { ...styled[media], ...objStyle };
            }
        }
    }
    return styled;
};

type MakeFamiliarStyledParams = {
  sx?: Sx;
  sxFamiliarProps: SxFamiliarProps;
  cssSelector?: Record<string, string>;
  getCssProps: (prop: SxFamiliarProps[number]) => (keyof CSSProperties)[];
  getValues: (value: string | number | boolean, p: string) => string[];
}

const makeFamiliarStyled = (params: MakeFamiliarStyledParams) =>
{
    const { sx, sxFamiliarProps, cssSelector, getCssProps, getValues } = params;

    if (typeof sx !== 'object')
    {
        return {};
    }

    let styled = {} as ResponsiveCssStyled;
    const sxKeys = Object.keys(sx) as (keyof Sx)[];

    for (let i = 0; i < sxKeys.length; i++)
    {
        // Handle sx keys with responsive values
        if (sxFamiliarProps.indexOf(sxKeys[i] as never) >= 0 && typeof sx[sxKeys[i]] === 'object')
        {
            const bps = Object.keys(breakpoints) as (keyof typeof breakpoints)[];

            styled = {
                ...styled,
                ...makeResponsiveStyled({
                    bps,
                    sxKey: sxKeys[i] as keyof SxHasNotSelector,
                    sxVal: sx[sxKeys[i]] as SxHasNotSelector[keyof SxHasNotSelector],
                    getCssProps,
                    getValues,
                    styled,
                    cssSelector,
                }),
            };
        }
        // Handle sx keys as CSS selector
        else
        {
            if (
                typeof sx[sxKeys[i]] !== 'object' ||
                // if value is object but keys of this object are breakpoints
                typeof sx[sxKeys[i]] === 'object' && breakpoints[Object.keys(sx[sxKeys[i]] as Sx)[0] as keyof typeof breakpoints] >= 0
            )
            {
                continue;
            }
            const selector = sxKeys[i] as string;
            const subSx = sx[selector as never] as SxHasNotSelector;
            const subSxKeys = Object.keys(subSx) as (keyof SxHasNotSelector)[];

            for (let a = 0; a < subSxKeys.length; a++)
            {
                if (sxFamiliarProps.indexOf(subSxKeys[a] as never) === -1)
                {
                    continue;
                }

                const sxKey = subSxKeys[a];
                const sxVal = subSx[sxKey];
                const bps = Object.keys(breakpoints) as (keyof typeof breakpoints)[];

                if (typeof sxVal === 'object')
                {
                    styled = { ...styled, ...makeResponsiveStyled({ bps, sxKey, sxVal, getCssProps, getValues, styled, cssSelector, sxSelector: selector }) };
                }
                else if (sxVal !== undefined)
                {
                    const objStyle: SelectorCssStyled = {};
                    objStyle[selector] = styled[selector] || {};

                    for (let g = 0; g < getCssProps(sxKey).length; g++)
                    {
                        const cssP = getCssProps(sxKey)[g];
                        objStyle[selector][cssP] = getValues(sxVal, sxKey)[g];
                    }

                    styled[selector] = { ...styled[selector], ...objStyle[selector] };
                }
            }
        }
    }

    return styled;
};

export const makeStyled = (sx: Sx): {[key: string]: CSSProperties} =>
{
    const spacingOutsideBox = makeFamiliarStyled({
        sx,
        sxFamiliarProps: spacingOutsideBoxKeys,
        getCssProps: getCssSpacingOutsideProperties,
        getValues: getCssSpacingValues,
    });
    const spacingInsideBox = makeFamiliarStyled({
        sx,
        sxFamiliarProps: spacingInsideBoxKeys,
        cssSelector: spaceBetweenSelector,
        getCssProps: getCssSpacingInsideProperties,
        getValues: getCssSpacingValues,
    });
    const jssOutsideBoxStyled = deepMergeAll([spacingOutsideBox]);
    const jssInsideBoxStyled = deepMergeAll([spacingInsideBox]);
    const jssStyled = deepMergeObj(spacingOutsideBox, spacingInsideBox);

    return {
        jssOutsideBoxStyled,
        jssInsideBoxStyled,
        jssStyled,
    };
};
