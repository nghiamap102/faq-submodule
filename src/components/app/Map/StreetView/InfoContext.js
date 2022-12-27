import React from 'react';
import { inject, observer } from 'mobx-react';

import { Container, ListItem } from '@vbd/vui';

const InfoContext = (props) =>
{
    const { streetViewData } = props.appStore.streetViewStore;

    if (!streetViewData)
    {
        return null;
    }

    return (
        <Container className={'street-view-info'}>
            <ListItem
                iconClass={'info'}
                label={streetViewData?.street}
                sub={streetViewData.datetime_taken}
            />
        </Container>
    );
};

export default inject('appStore')(observer(InfoContext));

