import React from 'react';
export interface Theme {
    id: string;
    name: string;
    base: string;
    className: string;
}
interface ThemesContext {
    theme: Theme;
    setTheme: (theme: Theme, saveLocal?: boolean) => void;
}
export declare const themeList: Theme[];
export declare const ThemeContext: React.Context<ThemesContext>;
export declare const THEME_SWITCHING_CLASS = "theme-switching";
interface ThemeProviderProps {
    theme?: Theme;
}
declare const ThemeProvider: React.FC<ThemeProviderProps>;
export { ThemeProvider };
//# sourceMappingURL=ThemeContext.d.ts.map