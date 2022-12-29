import { Meta, Story } from '@storybook/react';
import { Button } from 'components/bases/Button';
import { Col2, Row2 } from 'components/bases/Layout';
import { Link } from 'components/bases/Link/Link';
import { ListItem } from 'components/bases/List';
import { StoryDoc } from 'components/story/blocks';
import docs from './Card.docs.mdx';
import changelog from './Card.changelog.md';

import { Card, CardProps } from '../Card';

export default {
    title: 'Display/Card',
    component: Card,
    decorators: [(Story) => <div style={{ width: '100vw', height: '100vh', margin: '-1rem', padding: '1rem', backgroundColor: 'var(--card-container-bg-color)' }}><Story /></div>],
    parameters: {
        changelog,
        docs: {
            inlineStories: false,
            iframeHeight: 150,
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="Card"
                    componentName="Card"
                    component={Card}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

const Template: Story<CardProps> = (args) =>
{
    return (
        <Row2
            gap={4}
            panel={false}
        >
            <Card
                {...args}
                title='Card 1'
                description='Example of a card description'
            />
            <Card
                {...args}
                title='Card 2'
                description='Example of a card description'
            />
            <Card
                {...args}
                title='Card 3'
                description='Example of a card description'
            />
        </Row2>

    );
};

export const Default = Template.bind({});

export const WithImage = Template.bind({});
WithImage.args = {
    image: 'https://images.unsplash.com/photo-1586902197503-e71026292412?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
    imageWidth: 225,
    imageHeight: 150,
};

export const WithFooter = Template.bind({});
WithFooter.args = {
    footer: (
        <Col2 gap={2}>
            <div>
                <Button
                    text='Details'
                    color='primary'
                />
            </div>
            <Link href=''>Or click this</Link>
        </Col2>

    ),
};

export const Layout = Template.bind({});
Layout.args = {
    layout: 'horizontal',
    icon: 'user',
};

export const Disabled = Template.bind({});
Disabled.args = {
    isDisabled: true,
};

export const CustomChildren = Template.bind({});
CustomChildren.args = {
    children: (
        <>
            <ListItem label={'Item 1'} />
            <ListItem label={'Item 2'} />
            <ListItem label={'Item 3'} />
        </>
    ),
};
