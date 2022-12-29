import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

import { TenantContext } from 'components/bases/Tenant/TenantContext';
import { useThemeOverride } from './hooks/useThemeOverride';
import { isSingleTheme, ThemeConfig, ThemeSingle } from './model';

export interface Theme {
    id: string
    name: string
    base: string
    className: string
}

interface ThemesContext {
    theme: Theme;
    setTheme: (theme: Theme, saveLocal?: boolean) => void;
}

export const themeList: Theme[] = [
    // Theme for Ogis project - test the class theme-mobile
    { id: 'ogis-light', name: 'Ogis light', base: 'light', className: 'theme-ogis theme-mobile' },
    { id: 'ogis-dark', name: 'Ogis dark', base: 'dark', className: 'theme-ogis theme-mobile' },
    { id: 'theme-blue', name: 'Xanh tối', base: 'dark', className: 'theme-blue' },
    { id: 'theme-red', name: 'Đỏ tối', base: 'dark', className: 'theme-red' },
    { id: 'theme-steel', name: 'Thép tối', base: 'dark', className: 'theme-steel' },
    { id: 'theme-gray', name: 'Xám tối', base: 'dark', className: 'theme-gray' },
    { id: 'theme-red', name: 'Đỏ sáng', base: 'light', className: 'theme-red' },
    { id: 'theme-green', name: 'Xanh lá', base: 'light', className: 'theme-green' },
    { id: 'theme-purple', name: 'Tím', base: 'light', className: 'theme-purple' },
];

export const ThemeContext = createContext<ThemesContext>({
    theme: themeList[0],
    setTheme: () => null,
});

export const THEME_SWITCHING_CLASS = 'theme-switching';

interface ThemeProviderProps {
    theme?: Theme;
}

const ThemeProvider: React.FC<ThemeProviderProps> = (props) =>
{
    const { theme, children } = props;
    const [isTheme, setTheme] = useState<Theme>(themeList[0]);
    const [themes, setThemes] = useState<Theme[]>(themeList);
    const timeout = useRef<NodeJS.Timeout>();

    const tenantContext = useContext(TenantContext);
    useThemeOverride(tenantContext.config?.themeConfig);

    const themeName = localStorage.getItem('theme') || tenantContext.config?.theme;

    useEffect(() =>
    {
        const themeConfig = tenantContext.config.themeConfig;
        if (themeConfig)
        {
            const newThemeList = createThemeFromConfig(themeConfig);
            return setThemes(newThemeList);
        }
        tenantContext.config?.themeList && setThemes(tenantContext.config.themeList);
    }, [tenantContext.config.themeConfig, tenantContext.config.themeList]);

    useEffect(() =>
    {
        const initTheme = themes.find((theme) => theme.id === themeName) || themes[0];
        handleThemeChange(theme || initTheme, !!theme);
    }, [theme, themes]);

    const handleThemeChange = (theme: Theme | string, saveLocal = true) =>
    {
        timeout.current && clearTimeout(timeout.current);
        const themeTransitDuration = tenantContext.config.themeConfig?.themeTransitDuration || 900;
        const bodyClassName = getBodyClassName(theme);

        document.body.className = `${bodyClassName} ${THEME_SWITCHING_CLASS}`;
        timeout.current = setTimeout(() => document.body.className = bodyClassName, themeTransitDuration);

        if (saveLocal)
        {
            localStorage.setItem('theme', typeof theme === 'string' ? theme : theme.id);
        }

        const newTheme = typeof theme !== 'string' ? theme : themes.find(({ id }) => id === theme);
        newTheme && setTheme(newTheme);
    };

    const getBodyClassName = (theme: Theme | string): string =>
    {
        // Fallback old tenant api, still use 'themeList'
        if (typeof theme !== 'string')
        {
            return `theme-base theme-${theme.base} ${theme.className}`;
        }
        else
        {
            const themeSelected = themes.find(({ id }) => id === theme);
            return themeSelected ? `theme-base theme-${themeSelected.base} ${themeSelected.className}` : 'theme-base';
        }
    };

    const createThemeFromConfig = (themeConfig: ThemeConfig) =>
    {
        const fromConfigToTheme = (config: ThemeSingle) => ({ name: config.name.vi, base: config.base, id: config.id });
        return themeConfig.varConfigs.reduce((themes ,config) =>
        {
            const newThemes = isSingleTheme(config) ? [fromConfigToTheme(config)] : config.info.map(fromConfigToTheme);
            return [...themes, ...(newThemes.map(theme => ({ ...theme, className: config.id })))];
        }, [] as Theme[]);
    };

    return (
        <ThemeContext.Provider value={{ theme: isTheme, setTheme: handleThemeChange }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeProvider };
