import 'components/app/LPR/PlateConfig/PlateConfig.scss';

import React, { Component } from 'react';

import {
    Container,
    NavigationMenu,
    PageTitle,
    BorderPanel, FlexPanel, PanelBody, PanelHeader,
} from '@vbd/vui';

import { PlateConfigWatchList } from 'components/app/LPR/PlateConfig/PlateConfigWatchList';

export default class PlateConfig extends Component
{
    state = {
        feature: 'watch-list',
    };

    menu = [
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
            <Container className={'plate-alert-container plate-config'}>
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
                    className={'plate-alert-content'}
                    flex={1}
                >
                    <PageTitle>
                        {selectedFeature?.name}
                    </PageTitle>
                    {
                        this.state.feature === 'watch-list' && <PlateConfigWatchList />
                    }
                </BorderPanel>
            </Container>
        );
    }
}
