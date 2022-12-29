import React, { createContext, useContext, useState } from 'react';

import { TenantContext } from '../Tenant/TenantContext';
import enData from './languages/en.json';

export const I18nContext = createContext();

const I18nProvider = (props) =>
{
    const tenantContext = useContext(TenantContext);

    const [locale, setLocale] = useState(localStorage.getItem('locale') || tenantContext.config['locale'] || 'vi');
    const [language, setLanguage] = useState(localStorage.getItem('language') || tenantContext.config['language'] || 'vi');

    const translates = { ...getVuiTranslate(language), ...props.translates(language) };

    if (language !== 'en')
    {
        require('moment/locale/' + language);
    }

    const handleSetLocale = (lo) =>
    {
        // keep it here for backward compatibility
    };

    const handleSetLanguage = (newLanguage) =>
    {
        // newLanguage here can be 'en', 'vi', 'en-in'... So it actually is a locale

        localStorage.setItem('language', newLanguage);

        // also set locale
        localStorage.setItem('locale', newLanguage);

        // no more reload window, now it all react base on context, still bug in store context (misuse of translation context)
        // window.location.reload();

        setLanguage(newLanguage);
    };

    const addTranslate = (key, value) =>
    {
        translates[key] = value;
    };

    const addTranslates = (trans) =>
    {
        if (Array.isArray(trans))
        {
            trans.forEach((d) =>
            {
                translates[d.key] = d.value;
            });
        }
    };

    const translate = (text, params, domain) =>
    {
        if (typeof text !== 'string')
        {
            return text;
        }

        let output = text;
        if (translates)
        {
            if (domain && translates[domain] && translates[domain][text])
            {
                output = translates[domain][text];
            }
            else if (translates[text])
            {
                output = translates[text] ;
            }
        }

        if (Array.isArray(params))
        {
            params.forEach((p, index) =>
            {
                output = output.replace(`%${index}%`, p);
            });
        }

        return output;
    };

    return (
        <I18nContext.Provider
            value={{
                locale, setLocale: handleSetLocale,
                language, setLanguage: handleSetLanguage,
                t: translate,
                addTranslate, addTranslates,
            }}
        >
            {props.children}
        </I18nContext.Provider>
    );
};

const getVuiTranslate = (language) =>
{
    const MAPPED_LANGUAGE = {
        en: enData,
    };

    try
    {
        return MAPPED_LANGUAGE[language] ? enData : {};
    }
    catch (error)
    {
        console.log(error);
        return {};
    }
};

export { I18nProvider };
