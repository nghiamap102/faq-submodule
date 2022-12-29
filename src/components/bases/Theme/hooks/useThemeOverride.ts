import { useEffect } from 'react';

import { breakpoints } from 'themes/breakpoints';
import { cssVars as camelCssVars } from 'themes/cssVars';
import { camelToKebab } from 'utils/camelKebab';

import { ThemeConfig, CssVarConfig, FontBase, BreakpointKeys, isSingleTheme } from '../model';
import { THEME_SWITCHING_CLASS } from '../ThemeContext';

/**
 * Hook to override global VUI's css variables.
 */
export const useThemeOverride = (themeConfig?: ThemeConfig): void =>
{
    const { fontBase, varConfigs, themeTransitDuration } = themeConfig || {};

    const DATA_STYLESHEET_OVERRIDE = {
        FONT_BASE: 'fontBase',
        CSS_VAR: 'cssVar',
        THEME_TRANSITION: 'themeTransition',
    };

    useEffect(() =>
    {
        return () =>
        {
            removeStyleSheet(DATA_STYLESHEET_OVERRIDE.CSS_VAR);
            removeStyleSheet(DATA_STYLESHEET_OVERRIDE.FONT_BASE);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (varConfigs)
    {
        removeStyleSheet(DATA_STYLESHEET_OVERRIDE.CSS_VAR);
        const styleSheets = transformToStyleSheet(varConfigs);
        appendStyleSheetToHead(styleSheets, DATA_STYLESHEET_OVERRIDE.CSS_VAR);
    }

    if (fontBase)
    {
        removeStyleSheet(DATA_STYLESHEET_OVERRIDE.FONT_BASE);
        const fontBaseMediaQuery = createBreakpointVarStyleSheet(fontBase);
        fontBaseMediaQuery && appendStyleSheetToHead(fontBaseMediaQuery, DATA_STYLESHEET_OVERRIDE.FONT_BASE);
    }
    
    if (themeTransitDuration)
    {
        removeStyleSheet(DATA_STYLESHEET_OVERRIDE.THEME_TRANSITION);
        const fontBaseMediaQuery = createCssVarStyleSheet({ themeTransitDuration }, `.${THEME_SWITCHING_CLASS}`);
        fontBaseMediaQuery && appendStyleSheetToHead(fontBaseMediaQuery, DATA_STYLESHEET_OVERRIDE.THEME_TRANSITION);
    }
};

const transformToStyleSheet = (varConfigs: CssVarConfig[]) =>
{
    const invalidKeysWithTheme: [string, string][] = [];
    const transformedStyleSheet = varConfigs.reduce((combinedStyleSheet, config) =>
    {
        if (isSingleTheme(config))
        {
            const { selectors, id, cssVar } = config;
            const styleSheetOfSelector = selectors?.reduce((styleSheet, selectorConfig) =>
            {
                const { selector, cssVar } = selectorConfig;
                const selectorWithTheme = `.${id} ${selector}`;

                invalidKeysWithTheme.push([selectorWithTheme, getInvalidOverrideKeys(cssVar)]);
                return cssVar ? `${styleSheet}${createCssVarStyleSheet(cssVar, selectorWithTheme)}\n` : styleSheet;
            }, '') || '';
            const styleSheetOfTheme = cssVar ? createCssVarStyleSheet(cssVar, `.${id}`) : '';
            return combinedStyleSheet + styleSheetOfTheme + styleSheetOfSelector;
        }
        else
        {
            const { id, cssVar, cssVarDark, cssVarLight, selectors } = config;

            const MAPPED_THEME_SELECTOR = {
                cssVar: `.${id}`,
                cssVarDark: `.theme-dark.${id}`,
                cssVarLight: `.theme-light.${id}`,
            } as const;

            const styleSheetOfSelector = selectors?.reduce((styleSheet, selectorConfig) =>
            {
                const { selector, cssVar } = selectorConfig;
                const selectorWithTheme = `${MAPPED_THEME_SELECTOR.cssVar} ${selector}`;

                invalidKeysWithTheme.push([selectorWithTheme, getInvalidOverrideKeys(cssVar)]);
                return cssVar ? `${styleSheet}${createCssVarStyleSheet(cssVar, selectorWithTheme)}\n` : styleSheet;
            }, '') || '';

            const styleSheetOfTheme = Object.entries({ cssVar, cssVarDark, cssVarLight })
                .reduce((styleSheet, cssVariable) =>
                {
                    const [curKey, curCssVar] = cssVariable as [keyof typeof MAPPED_THEME_SELECTOR, Record<string, string> | undefined];
                    const selector = MAPPED_THEME_SELECTOR[curKey];

                    invalidKeysWithTheme.push([selector, getInvalidOverrideKeys(curCssVar)]);
                    return curCssVar ? `${styleSheet}${createCssVarStyleSheet(curCssVar, selector)}\n` : styleSheet;
                }, '');

            return combinedStyleSheet + styleSheetOfTheme + styleSheetOfSelector;
        }
    }, '');

    logInvalidOverrideKeys(invalidKeysWithTheme);
    return transformedStyleSheet;
};

const createCssVarStyleSheet = (cssVar: Record<string, string | number>, cssSelector: string) =>
{
    const styleSheetOfSelector = Object.entries(cssVar).reduce((styleSheet, [cssVarKey, cssVarVal]) =>
    {
        const camelCssVarKey = camelToCssVar(cssVarKey);
        return styleSheet + `${camelCssVarKey}: ${cssVarVal};`;
    }, '');
    return `${cssSelector} {${styleSheetOfSelector}}`;
};

const createBreakpointVarStyleSheet = (fontBase: FontBase) =>
{
    const breakpointVars = (Object.entries(fontBase) as [BreakpointKeys, string][])
        .sort((a , b) => breakpoints[a[0]] - breakpoints[b[0]])
        .reduce((bpVar, cur) =>
        {
            const [bp, fontSize] = cur;
            return bpVar + `--font-base-${bp}: ${fontSize};\n`;
        }, '');
    return `:root {${breakpointVars}}`;
};

const appendStyleSheetToHead = (styleSheet: string, dataAttribute: string) =>
{
    if (!window)
    {
        return;
    }

    const css = document.createElement('style');
    css.dataset.vuiOverride = dataAttribute;
    css.appendChild(document.createTextNode(styleSheet));
    document.head.append(css);
};

const removeStyleSheet = (dataAttribute: string) =>
{
    if (!window)
    {
        return;
    }
    const lastDataSet = document.querySelector(`[data-vui-override='${dataAttribute}']`);
    lastDataSet && document.head.removeChild(lastDataSet);
};

const logInvalidOverrideKeys = (mappedInvalidKeys: [string, string][]) =>
{
    const invalidKeyByThemes = mappedInvalidKeys.reduce((acc, cur) =>
    {
        const [selector, overrideKey] = cur;
        return overrideKey.length > 0
            ? acc + `At selector: "${selector}", keys: "${overrideKey}"\n`
            : acc;
    }, '');
    console.warn(invalidKeyByThemes + "These keys will not override VUI's css variable, make sure to use VUI's css variable name for overriding.");
};

const getInvalidOverrideKeys = (cssVar?: Record<string, string>): string =>
{
    return cssVar
        ? Object.keys(cssVar).reduce((invalidVarKeys, cssVarKey) =>
        {
            const isValidKey = camelCssVars?.includes(camelToCssVar(cssVarKey) as typeof camelCssVars[number]);
            return isValidKey ? invalidVarKeys : invalidVarKeys + ` ${cssVarKey}`;
        }, '')
        : '';
};

// primaryHighlightAlpha => --primary-highlight-alpha
const camelToCssVar = (camelCase: string): string => `--${camelToKebab(camelCase)}`;
