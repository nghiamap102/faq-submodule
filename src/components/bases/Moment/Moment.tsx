import React from 'react';
import ReactMoment, { MomentProps as ReactMomentProps } from 'react-moment';

import { useI18n } from '../I18n/useI18n';

export const Moment: React.FC<ReactMomentProps> = (props) =>
{
    const { language } = useI18n();

    return (
        <ReactMoment
            locale={language}
            {...props}
        />
    );
};
