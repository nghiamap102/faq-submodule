import './SpaceRain.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    PanelHeader, FlexPanel, PanelBody,
    Tab, Tabs,
} from '@vbd/vui';

import { SpaceRainSearch } from './SpaceRainSearch/SpaceRainSearch';

class SpaceRain extends Component
{
    spacerainStore = this.props.appStore.spacerainStore;

    render()
    {
        return (
            <FlexPanel
                className={'spacerain'}
                flex={1}
            >
                <PanelHeader>
                    SpaceRain - Vigilant ©
                </PanelHeader>
                <PanelBody>
                    <Tabs
                        selected={this.spacerainStore.tabSelected}
                        onSelect={(tabSelected) => this.spacerainStore.setTab(tabSelected)}
                    >
                        <Tab
                            id="spacerain-search"
                            title="Tìm kiếm"
                        >
                            <SpaceRainSearch />
                        </Tab>
                    </Tabs>
                </PanelBody>
            </FlexPanel>
        );
    }
}

SpaceRain = inject('appStore')(observer(SpaceRain));
export default SpaceRain;
