import './PageTitle.scss';

import React from 'react';

import { T } from 'components/bases/Translate/Translate';

export const PageTitle = ({ children }) =>
{
    return (
        <div className={'page-title'}>
            <T>{children}</T>
        </div>
    );
};
