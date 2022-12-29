import { breakpoints } from '../../../../themes/breakpoints';
export declare type ThemeConfig = {
    /**
     * Config base font-size by break-points
     * @example
     * fontBase = {
     *  xs: 12px,
     *  desktop: 16px,
     * }
     */
    fontBase?: FontBase;
    /**
     * Configs override css var by theme
    */
    varConfigs: CssVarConfig[];
    /**
     * Define theme transition-duration when switch theme (in millisecond)
     * @example
     * themeTransition = 300
     */
    themeTransitDuration?: number;
};
export declare type CssVarConfig = ThemeSingle | ThemeWithMode;
export declare type ThemeSingle = {
    /**
     * Define theme's id to mapped with theme's classname
     * @example
     * id: "ogis" mapped to ".theme-ogis"
     */
    id: string;
    /**
     * Define common css variable object to override to theme's id, which key is in camelCase
     * @example
     * cssVar: {
     *  primaryHighlightAlpha: 0.5,
     *  baseColor: "blue"
     * }
    */
    cssVar?: Record<string, string>;
    /**
     * Define css variable object by selector, which key is in camelCase
     * @example
     * selectors: [{
     *  selector: '#popup1',
     *  cssVar: {
     *      primaryHighlightAlpha: 0.5,
     *      baseColor: "blue"
     *  },
     * }]
     */
    selectors?: {
        selector: string;
        cssVar: Record<string, string>;
    }[];
    config?: never;
} & ThemeInfo;
export declare type ThemeWithMode = {
    /**
     * Define css variable object to override to theme's id in dark mode , which key is in camelCase
     * @example
     * cssVarDark: {
     *  primaryHighlightAlpha: 0.5,
     *  baseColor: "blue"
     * }
     */
    cssVarDark?: Record<string, string>;
    /**
     * Define css variable object to override to theme's id in light mode , which key is in camelCase
     * @example
     * cssVarLight: {
     *  primaryHighlightAlpha: 0.5,
     *  baseColor: "blue"
     * }
     */
    cssVarLight?: Record<string, string>;
    info: (ThemeInfo & {
        id: string;
    })[];
    name?: never;
    base?: never;
} & Pick<ThemeSingle, 'cssVar' | 'selectors' | 'id'>;
/**
 * Define theme's information
 * @example
 *  {
 *      id: "ogis-light",
 *      base: 'light',
 *      name: {
 *          vi: "Giao diện màu sáng",
 *          en: "ogis light"
 *      }
 *  }
*/
declare type ThemeInfo = {
    base: 'dark' | 'light';
    name: {
        vi: string;
        en: string;
    };
};
export declare type BreakpointKeys = keyof typeof breakpoints;
export declare type FontBase = Partial<Record<BreakpointKeys, string>>;
export declare const isSingleTheme: (varConfig: CssVarConfig) => varConfig is ThemeSingle;
export {};
//# sourceMappingURL=index.d.ts.map