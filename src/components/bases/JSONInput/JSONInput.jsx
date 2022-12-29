import React, { useContext } from 'react'
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { themeList, ThemeContext } from '../Theme/ThemeContext';

export const JSONInputEditor = (props) => {
    const themeContext = useContext(ThemeContext);

    const themeBase = themeList.find((theme) => themeContext.theme === theme).base;
    
    return <JSONInput locale={locale} theme={themeBase === 'light' ? 'light_mitsuketa_tribute' : 'dark_vscode_tribute'} {...props}></JSONInput>;
}