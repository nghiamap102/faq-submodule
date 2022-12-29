import React from 'react';

import { BorderPanel, BorderPanel2 } from 'components/bases/Panel/Panel';

import './AppBody.scss';

export const AppBody: React.FC = ({ children }) =>
{
    return (
        <BorderPanel
            className={'app-body'}
            flex={1}
        >
            {children}
        </BorderPanel>
    );
};

export const AppBody2: React.FC = ({ children }) =>
{
    return (
        <BorderPanel2 className={'app-body'}>
            {children}
        </BorderPanel2>
    );
};
