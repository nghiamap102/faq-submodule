import './FaceConfig.scss';

import React, { Component } from 'react';

import {
    NavigationMenu,
    PageTitle,
    BorderPanel, FlexPanel, PanelBody, PanelHeader,
    Resizable,
} from '@vbd/vui';

import { FaceConfigWatchList } from 'components/app/FaceAlert/FaceConfig/FaceConfigWatchList';
import { FaceConfigCameraGroup } from 'components/app/FaceAlert/FaceConfig/FaceConfigCameraGroup';
import { FaceConfigCameraStream } from 'components/app/FaceAlert/FaceConfig/FaceConfigCameraStream';

export default class FaceConfig extends Component
{
    state = {
        feature: 'camera-stream',
    };

    menu = [
        {
            id: 'camera-stream',
            name: 'Camera',
        },
        {
            id: 'camera-group',
            name: 'Nhóm Camera',
        },
        {
            id: 'watch-list',
            name: 'Danh sách theo dõi',
        },
    ];

    handleMenuChange = (menu) =>
    {
        this.setState({ feature: menu });
    };

    render()
    {
        const selectedFeature = this.menu.find((m) => m.id === this.state.feature);

        return (
            <Resizable
                defaultSizes={[320]}
                minSizes={[300]}
                className={'face-alert-container face-config'}
            >
                <FlexPanel width={'18rem'}>
                    <PanelHeader>Thiết lập</PanelHeader>
                    <PanelBody>
                        <NavigationMenu
                            menus={this.menu}
                            activeMenu={this.state.feature}
                            onChange={this.handleMenuChange}
                        />
                    </PanelBody>
                </FlexPanel>

                <BorderPanel
                    className={'face-alert-content'}
                    flex={1}
                >
                    <PageTitle>
                        {selectedFeature?.name}
                    </PageTitle>

                    {this.state.feature === 'watch-list' && <FaceConfigWatchList />}

                    {this.state.feature === 'camera-group' && <FaceConfigCameraGroup />}

                    {this.state.feature === 'camera-stream' && <FaceConfigCameraStream />}
                </BorderPanel>
            </Resizable>
        );
    }
}
