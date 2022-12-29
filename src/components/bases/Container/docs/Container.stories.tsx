import { Meta, Story } from '@storybook/react';

import { Container, ContainerProps } from '../Container';

export default {
    title: 'Layout/Container',
    component: Container,
} as Meta;

const Template: Story<ContainerProps> = (args) =>
{
    return (
        <Container {...args}>
            Inner DOM element
        </Container>
    );
};

export const Default = Template.bind({});


