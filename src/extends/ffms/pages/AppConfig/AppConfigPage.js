import './AppConfig.scss';
import React from 'react';
import { Container, useI18n ,BorderPanel, FlexPanel, PanelBody, PageTitle, HD1, T, FeatureBarBottom } from '@vbd/vui';
import { Switch, useHistory, useLocation } from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';
import { Helmet } from 'react-helmet';

import AppConfigInfo from './AppConfigInfo';
import AppConfigMenu from './AppConfigMenu';
import ACBottomFeature from './ACBottomFeature';

import * as Routers from 'extends/ffms/routes';
import { RoleRoute } from 'extends/ffms/components/Role/RoleRoute';
import ManagerLayerData from 'extends/ffms/pages/Layerdata/ManagerLayerData';
import { PermissionProvider } from 'extends/ffms/components/Role/Permission/PermissionContext';
import FieldForceStore from 'extends/ffms/FieldForceStore';
import { usePermission } from 'extends/ffms/components/Role/Permission/usePermission';


const AppConfigContent = props =>
{
    const { appConfigStore } = props.fieldForceStore;
    
    const { rootPermission, loading } = usePermission();
    const history = useHistory();
    const location = useLocation();

    const [initLoading, setInitLoading] = React.useState(true);

    React.useEffect(() =>
    {
        if (!loading)
        {
            appConfigStore?.init(rootPermission, history, location);
            setInitLoading(false);
        }
    }, [loading, location.pathname]);

   
    return (
        <>
            <FlexPanel width={'20rem'} className={'admin-left-menu feature-bar'}>
                <AppConfigInfo
                    onClick={()=>
                    {}}
                />

                {
                    !initLoading &&
                    <AppConfigMenu menu={appConfigStore.menu}/>
                }

                <ACBottomFeature/>
            </FlexPanel>


            <BorderPanel
                className={'face-alert-content'}
                flex={1}
            >
                <Switch >
                    {
                        appConfigStore.MenuDefaults.map(menuItem =>(
                            <RoleRoute
                                key={menuItem.id}
                                path={menuItem.path}
                                baseUrl={Routers.APP_CONFIG}
                            >
                                {menuItem.component}
                            </RoleRoute>
                        ))
                    }
                </Switch>

            </BorderPanel>
        </>
    );
};

const AppConfigPage = (props) =>
{
    const { t } = useI18n();
    const AppConfigContentMobx = inject('appStore', 'fieldForceStore')(observer(AppConfigContent));
   
    return (
        <PermissionProvider>
            <Provider fieldForceStore={new FieldForceStore(props.appStore)}>
                <Container className={'app-config-container full-height'}>
                    <Helmet>
                        <title>{t('Thiết lập hệ thống')}</title>
                        <meta
                            name="application-name"
                            content={t('Thiết lập hệ thống')}
                        />
                        <meta
                            name="apple-mobile-web-app-title"
                            content={t('Thiết lập hệ thống')}
                        />
                    </Helmet>

                    <AppConfigContentMobx />
                </Container>
            </Provider>
        </PermissionProvider>
    );
};


export default inject('appStore')(observer(AppConfigPage));
