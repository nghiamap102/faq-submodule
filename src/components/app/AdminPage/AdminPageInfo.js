import './AdminPage.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Image,
    Row, Column, Container,
    HD5, Sub1,
} from '@vbd/vui';

class AdminPageInfo extends Component
{
    appStore = this.props.appStore;

    render()
    {
        return (
            <Container onClick={this.props.onClick}>
                <Row
                    className={'admin-info'}
                    crossAxisSize={'min'}
                    itemMargin={'md'}
                    flex={0}
                >
                    <Image
                        width={'50px'}
                        height={'50px'}
                        src={this.appStore.profile.avatar}
                        circle
                    />
                    <Column
                        crossAxisSize={'min'}
                        mainAxisSize={'min'}
                    >
                        <HD5>{this.appStore.profile.displayName}</HD5>
                        <Sub1>{this.appStore.profile.email}</Sub1>
                    </Column>
                </Row>
            </Container>

        );
    }
}

AdminPageInfo = inject('appStore')(observer(AdminPageInfo));
export default AdminPageInfo;
