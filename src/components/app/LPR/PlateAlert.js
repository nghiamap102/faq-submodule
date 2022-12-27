import React from 'react';
import { inject, observer, Provider } from 'mobx-react';

import {
    Tab, Tabs,
    FlexPanel, PanelBody, PanelHeader,
} from '@vbd/vui';

import PlateConfig from './PlateConfig/PlateConfig';
import { PlateDetection } from './PlateDetection/PlateDetection';
import { PlateGallery } from './PlateGallery/PlateGallery';
import { PlateImport } from './PlateImport/PlateImport';
import { PlateAccomplice } from './PlateAccomplice/PlateAccomplice';
import PlateGalleryAddOrUpdate from './PlateGallery/PlateGalleryAddOrUpdate';
import AddOrUpdatePlateGalleryWatchList from './PlateGallery/AddOrUpdatePlateGalleryWatchList';

import { PlateAlertStore } from './PlateAlertStore';

import './PlateAlert.scss';

const PLATE_TAB = {
    DETECT: 'detect',
    GALLERY: 'gallery',
    IMPORT: 'import',
    CONFIG: 'config',
    ACCOMPLICE: 'accomplice',
};

const plateAlertStore = new PlateAlertStore();

let PlateAlert = (props) =>
{
    return (
        <Provider plateAlertStore={plateAlertStore}>
            <FlexPanel
                className={'plate-alert'}
                flex={1}
            >
                <PanelHeader>Nhận dạng biển số xe - Vigilant ©</PanelHeader>
                <PanelBody>
                    <Tabs
                        selected={plateAlertStore.tabSelected}
                        renderOnActive
                        onSelect={(tabSelected) => plateAlertStore.setTab(tabSelected)}
                    >
                        <Tab
                            route={PLATE_TAB.DETECT}
                            title="Phát hiện"
                        >
                            <PlateDetection />
                        </Tab>
                        <Tab
                            route={PLATE_TAB.GALLERY}
                            title="Thư viện"
                        >
                            <PlateGallery />
                        </Tab>
                        <Tab
                            route={PLATE_TAB.IMPORT}
                            title="Nhập liệu"
                        >
                            <PlateImport />
                        </Tab>
                        <Tab
                            route={PLATE_TAB.CONFIG}
                            title="Thiết lập"
                        >
                            <PlateConfig />
                        </Tab>

                        <Tab
                            route={PLATE_TAB.ACCOMPLICE}
                            title="Đồng phạm"
                        >
                            <PlateAccomplice />
                        </Tab>
                    </Tabs>
                </PanelBody>

                <AddOrUpdatePlateGalleryWatchList />
                <PlateGalleryAddOrUpdate />
            </FlexPanel>
        </Provider>
    );
};

PlateAlert = inject('appStore')(observer(PlateAlert));
export default PlateAlert;
