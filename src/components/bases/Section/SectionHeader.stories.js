import React from 'react';

import { SectionHeader } from './SectionHeader';

export default {
    title: 'Layout/Section/SectionHeader',
    component: SectionHeader,
};

const Template = (args) =>
{
    return (
        <SectionHeader {...args}>
            SectionHeader inner text
        </SectionHeader>
    );
};

export const Default = Template.bind({});
