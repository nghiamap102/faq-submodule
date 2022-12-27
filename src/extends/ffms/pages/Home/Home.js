import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'extends/ffms/theme/theme.scss';
import 'extends/ffms/theme/mode-theme.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Provider } from 'mobx-react';
import { Helmet } from 'react-helmet';

import { Container, withTenant } from '@vbd/vui';

import { AppConstant } from 'constant/app-constant';
import LayerService from 'services/layer.service';
import { AdministrativeService } from 'services/administrative.service';

import { FileManager } from 'components/app/MapManager/FileManager';
import WindowPopupManager from 'components/app/WindowScreen/WindowPopupManager';

import SideFeature from 'extends/ffms/pages/Home/SideFeature';
import OverlayPopupManager from 'extends/ffms/components/OverlayPopup/OverlayPopupManager';
import { PermissionProvider } from 'extends/ffms/components/Role/Permission/PermissionContext';
import FieldForceStore from 'extends/ffms/FieldForceStore';

class Home extends Component
{
    constructor(props)
    {
        super(props);

        this.fieldForceStore = new FieldForceStore(this.props.appStore);

        LayerService.apiURL = AppConstant.vdms.url;
        AdministrativeService.apiURL = AppConstant.vdms.url;
    }

    render()
    {
        return (
            <PermissionProvider>
                <Provider fieldForceStore={this.fieldForceStore}>
                    <Container className={'flex full-height'}>
                        <Helmet>
                            <title>{this.props.tenantConfig?.title || ''} - Skedulomatic</title>
                        </Helmet>

                        <SideFeature />

                        <FileManager/>
                        <OverlayPopupManager/>
                        <WindowPopupManager />
                    </Container>
                </Provider>
            </PermissionProvider>
        );
    }
}

Home = withTenant(inject('appStore')(observer(Home)));

export default Home;
