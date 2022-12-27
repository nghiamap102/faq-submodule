import './GeneralDetection.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    PanelHeader, FlexPanel, PanelBody,
    T,
    Tab, Tabs,
} from '@vbd/vui';

import { GeneralDetection } from './GeneralDetection';

class GeneralDetectionPage extends Component
{
    gdStore = this.props.appStore.generalDetectionStore;

    render()
    {
        return (
            <FlexPanel
                className={'genaral-detection'}
                flex={1}
            >
                <PanelHeader>
                    <T>Nhận dạng tổng hợp</T> - Vigilant ©
                </PanelHeader>
                <PanelBody>
                    <Tabs
                        selected={this.gdStore.tabSelected}
                        onSelect={(tabSelected) => this.gdStore.setTab(tabSelected)}
                    >
                        <Tab
                            id="object-detection"
                            title="Phát hiện"
                        >
                            <GeneralDetection />
                        </Tab>
                    </Tabs>
                </PanelBody>
            </FlexPanel>
        );
    }
}

GeneralDetectionPage = inject('appStore')(observer(GeneralDetectionPage));
export default GeneralDetectionPage;
