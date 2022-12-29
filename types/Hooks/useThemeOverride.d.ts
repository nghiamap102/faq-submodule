import { breakpoints } from '../themes/breakpoints';
export declare type ThemeConfig = {
    fontBases?: FontBases;
    varConfigs?: CssVar[];
};
export declare type CssVar = {
    /**
     * Define theme's id to mapped with theme's classname
     * @example
     * id: "ogis" mapped to ".theme-ogis"
     */
    id: string;
    /**
     * Define theme's display name,
     * @example
     * name: {
     *  vi: "ogis sáng"
     *  en: "ogis light"
     * }
     */
    name: Record<'en' | 'vi', string>;
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
};
declare type BreakpointKeys = keyof typeof breakpoints;
declare type FontBases = Record<BreakpointKeys, string>;
/**
 * Hook to override global VUI's css variables.
 */
export declare const useThemeOverride: (themeConfig: ThemeConfig) => void;
export {};
//# sourceMappingURL=useThemeOverride.d.ts.map