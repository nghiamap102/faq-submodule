import './NotFoundPage.scss';

import React, { Component } from 'react';
import { T } from 'components/bases/Translate/Translate';
import { HD1, Sub1 } from 'components/bases/Text/Text';
import { Button } from 'components/bases/Button/Button';
import { Row } from 'components/bases/Row/Row';
import { withTenant } from 'components/app/Tenant/withTenant';

class NotFoundPage extends Component
{
    render()
    {
        return (
            <div className={'not-found-page'}>
                <Row
                    mainAxisSize={'min'}
                    crossAxisSize={'min'}
                    itemMargin={'lg'}
                    crossAxisAlignment={'center'}
                >
                    <HD1>404</HD1>
                    <Sub1><T>Không tìm thấy trang</T></Sub1>
                </Row>
                <div>
                    <Button
                        text={'Trang chủ'}
                        color={'primary'}
                        onClick={() =>
                        {
                            window.location.href = this.props.tenantConfig.home || '/';
                        }}
                    />
                </div>
            </div>
        );
    }
}

NotFoundPage = withTenant(NotFoundPage);

export default NotFoundPage;
