
import './AppConfig.scss';

import React, { Component, useState } from 'react';
import { inject, observer } from 'mobx-react';
import * as Routers from 'extends/ffms/routes';

import { Image, Column, HD5, Sub1, useTenant, Expanded, useModal, HD6, FeatureBarBottom } from '@vbd/vui';
import { useHistory } from 'react-router';


const AdminPageMenu = (props) =>
{
    const { appConfigStore } = props.fieldForceStore;
    const { logo, title, subtitle, logoSrc } = appConfigStore.tenantConfig;
    const history = useHistory();

    React.useEffect(() =>
    {
        if (!logoSrc)
        {
            const src = logo.startsWith('/') ? logo : `/api/media/logo?name=${logo}`;
            const update = { ...appConfigStore.tenantConfig, logoSrc: src };
            appConfigStore.set('tenantConfig', update);
        }
    }, [appConfigStore.tenantConfig]);
    

    const handleBackHome = ()=>
    {
        history.push(Routers.FFMS);
    };
   

    return (
        <Column
            className={'app-config-info'}
            crossAxisSize={'min'}
            itemMargin={'md'}
            mainAxisAlignment = 'center'
            crossAxisAlignment='center'

            // onClick={}
        >
            <Image
                className={'app-logo'}
                width={'70px'}
                height={'70px'}
                src={logoSrc}
                circle
                onClick={handleBackHome}
            />
            <Column
                crossAxisSize={'min'}
                mainAxisSize={'min'}
            >
                <HD5>{title}</HD5>
                <Sub1 style={{ textAlign: 'center' }}>{subtitle}</Sub1>
            </Column>

         
        </Column>
    );
};

export default inject('appStore', 'fieldForceStore')(observer(AdminPageMenu));
