import React from 'react';
import { useI18n } from 'components/bases/I18n/useI18n';

export const withI18n = (Component) =>
{
    return (props) =>
    {
        const i18n = useI18n();

        return <Component {...i18n} {...props} />;
    };
};
