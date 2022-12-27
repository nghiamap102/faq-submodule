import { useI18n, useModal, FeatureTextProps } from '@vbd/vui';

import allLocales from './allLocales';

interface IParams
{
    localeIds: string[];
}

interface IMenu
{
    label: string;
    icon: string;
    onClick: () => void;
}

type ILanguageMenuFiltering = (localeIds: string[]) => IMenu[];
type IHandleChangeLanguage = (props: FeatureTextProps, event: React.MouseEvent<HTMLElement>) => void;
type IUseChangeLanguage = (params: IParams) => IHandleChangeLanguage;

export const defaultLcId = allLocales.map((locale) => locale.lcId);

const useChangeLanguage: IUseChangeLanguage = (params) =>
{
    const { menu } = useModal();
    const { language, setLanguage } = useI18n();
    let menuActions: IMenu | any[] = [];

    const languageMenuFiltering: ILanguageMenuFiltering = (localeIds) =>
    {
        const array: IMenu | any[] = [];

        localeIds.map((lcId) =>
        {
            array.push({
                label: allLocales.map((locale) => locale.lcId === lcId && locale.locale),
                icon: language === lcId ? 'check' : '',
                onClick: () => setLanguage(lcId),
            });
        });

        return array;
    };

    if (params?.localeIds.length)
    {
        menuActions = languageMenuFiltering(params.localeIds);
    }
    else
    {
        menuActions = languageMenuFiltering(defaultLcId);
    }

    const handleChangeLanguage: IHandleChangeLanguage = (_, event) =>
    {
        menu({
            id: 'language-menu',
            isTopLeft: true,
            position: { x: event.clientX, y: event.clientY },
            actions: menuActions,
        });
    };

    return handleChangeLanguage;
};

export default useChangeLanguage;
