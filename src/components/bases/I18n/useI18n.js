import { useContext } from 'react';
import { I18nContext } from './I18nContext';
import { DomainContext } from './DomainContext';

export const useI18n = () =>
{
    const i18n = useContext(I18nContext);
    const domainContext = useContext(DomainContext);
    const domain = domainContext?.['domain'];

    if (!i18n)
    {
        throw new Error('useI18n must be within I18nProvider');
    }

    const language = i18n?.language || 'vi';

    const t = (text, params = []) =>
    {
        return i18n ? i18n.t(text, params, domain) : text;
    };

    const setLocale = () =>
    {
        i18n && i18n.setLocale();
    };

    const setLanguage = (lang) =>
    {
        i18n && i18n.setLanguage(lang);
    };

    const addTranslates = (trans) =>
    {
        i18n && i18n.addTranslates(trans);
    };

    return {
        language,
        setLocale,
        setLanguage,
        addTranslates,
        t,
    };
};
