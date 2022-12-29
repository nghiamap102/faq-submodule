import React from 'react';

import { TenantProvider } from 'components/bases/Tenant/TenantContext';
import { I18nProvider } from 'components/bases/I18n/I18nContext';
import { themeList, ThemeProvider } from 'components/bases/Theme/ThemeContext';
import { ModalProvider } from 'components/bases/Modal/ModalContext';
import './styles.scss'
import '@vbd/vicon/dist/vicon.css';
import 'styles/styles.scss';

export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: themeList[0].name,
        toolbar: {
            icon: 'circle',
            items: themeList.map((item) => item.name)
        }
    }
};

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    layout: 'fullscreen',
    controls: {expanded: true},
    backgrounds: {
        grid: {
            disable: true
        },
        disable: true
    }
};

function getThemeByName(name)
{
    let result;

    themeList.forEach(function (item)
    {
        if (item.name && item.name === name)
        {
            result = item;
        }
    });

    return result;
}

const getTranslation = (language) =>
{
    return {};
};

const withAppProvider = (Story, {globals}) =>
{
    const theme = getThemeByName(globals.theme);

    return (
        <TenantProvider>
            <ThemeProvider theme={theme}>
                <I18nProvider translates={getTranslation}>
                    <ModalProvider>
                        <Story />
                    </ModalProvider>
                </I18nProvider>
            </ThemeProvider>
        </TenantProvider>
    );
};

const withAppWrapper = (Story, {viewMode}) => { return <Story /> }

export const decorators = [
    withAppProvider,
    withAppWrapper
]
