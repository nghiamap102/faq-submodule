import 'styles/styles.scss';
import '@vbd/vui/dist/vui.css';
// import '@vbd/vicon/dist/vicon.css';

import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import { Provider as MobXProvider } from 'mobx-react';

import {
    I18nProvider, useI18n,
    TenantProvider, useTenant,
    ModalProvider, useModal,
    ThemeProvider,
    FullScreenProvider,
} from '@vbd/vui';

import AppStore from 'components/app/stores/AppStore';
import App from 'components/app/App';

const AppContext = () =>
{
    const tenant = useTenant();

    // const theme = useContext(ThemeContext);

    const i18n = useI18n();

    const modal = useModal();

    const appStore = new AppStore({ tenant, i18n, modal });

    // TODO: enhance, make tracking as an provider GAProvider
    if (tenant.ga && tenant.ga.trackingId)
    {
        ReactGA.initialize(tenant.ga.trackingId);
    }

    return (
        <MobXProvider appStore={appStore}>
            <App />
        </MobXProvider>
    );
};

const getTranslation = (language: string): Object =>
{
    return require('data/translates/' + (language.startsWith('en') ? 'en' : language)) || {};
};

ReactDOM.render(
    <FullScreenProvider>
        <TenantProvider apiURL={'/api/tenant'}>
            <I18nProvider translates={getTranslation}>
                <ThemeProvider>
                    <ModalProvider>
                        <AppContext />
                    </ModalProvider>
                </ThemeProvider>
            </I18nProvider>
        </TenantProvider>
    </FullScreenProvider>
    , document.getElementById('root'),
);
