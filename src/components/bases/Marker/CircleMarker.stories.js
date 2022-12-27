import React, { useState, useEffect } from 'react';
import { action } from '@storybook/addon-actions';

import { CircleMarker } from 'components/bases/Marker/CircleMarker';
import { Container } from 'components/bases/Container/Container';

export default {
    title: 'Bases/Map/Marker/CircleMarker',
    component: CircleMarker,
};

const Template = (args) =>
{
    return (
        <Container style={{ padding: '50px' }}>
            <CircleMarker
                {...args}
                onClick={action('onClick')}
            />
        </Container>
    );
};

export const Default = Template.bind({});
Default.args = {
    color: 'cyan',
    backgroundColor: 'lime',
};
