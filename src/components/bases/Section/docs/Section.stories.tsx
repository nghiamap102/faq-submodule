import { Meta, Story } from '@storybook/react';

import { Section } from '../Section';
import { SectionProps } from '../model';

export default {
    title: 'Layout/Section/Section',
    component: Section,
} as Meta;

const Template: Story<SectionProps> = (args) =>
{
    return (
        <Section {...args}>
            Section inner text
        </Section>
    );
};

export const Default = Template.bind({});
