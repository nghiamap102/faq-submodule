import './UnderConstructionPage.scss';

import React, { Component } from 'react';
import { inject, observer, Provider } from 'mobx-react';

import { HD2, HD3, Button, Row, Column, Line } from '@vbd/vui';

export class UnderConstructionPage extends Component
{
    appStore = this.props.appStore;

    render()
    {
        return (
            <Provider>
                <Row crossAxisAlignment="center" className={'under-construction-page'}>
                    <Column crossAxisAlignment="center">
                        <Column
                            mainAxisSize={'min'}
                            crossAxisSize={'min'}
                            itemMargin={'lg'}
                            crossAxisAlignment={'center'}
                        >
                            <HD2>Oops!</HD2>
                            <Line
                                color={'var(--border)'}
                                width={'100%'}
                            />
                            <HD3>Under Construction</HD3>
                        </Column>
                        <Row
                            itemMargin={'lg'}
                            crossAxisAlignment={'start'}
                        >
                            <Button
                                icon={'life-ring'}
                                text={'Hỗ trợ'}
                                type={'default'}
                                tooltip={'Liên hệ tư vấn viên'}
                            />
                        </Row>
                    </Column>
                </Row>
            </Provider>
        );
    }
}

UnderConstructionPage = inject('appStore')(observer(UnderConstructionPage));
export default UnderConstructionPage;

