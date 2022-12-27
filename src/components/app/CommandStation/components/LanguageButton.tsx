import React from 'react';

import { useI18n, Row, Sub1, FeatureText, FeatureTextProps } from '@vbd/vui';

import useChangeLanguage, { defaultLcId } from './useChangeLanguage';

interface LanguageButtonProps
{
    inMenu?: boolean;
    localeIds?: string[];
    handleChangeLanguage?: (props: FeatureTextProps, event: React.MouseEvent<HTMLElement>) => void;
}

export const LanguageButton: React.FC<LanguageButtonProps> = (props) =>
{
    const { inMenu, localeIds, handleChangeLanguage } = props;

    const { language } = useI18n();
    const changeLanguage = useChangeLanguage({ localeIds: localeIds || defaultLcId });

    const ButtonChangeLanguage = () => (
        <FeatureText
            id="language"
            content={language}
            title={'Chuyển đổi ngôn ngữ'}
            onClick={handleChangeLanguage || changeLanguage}
        />
    );

    return inMenu
        ? (
                <Row crossAxisAlignment="center">
                    <ButtonChangeLanguage />
                    <Sub1>Chuyển đổi ngôn ngữ</Sub1>
                </Row>
            )
        : (
                <ButtonChangeLanguage />
            );
};
