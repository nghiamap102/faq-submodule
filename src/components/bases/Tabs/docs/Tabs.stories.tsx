import { Meta, Story } from '@storybook/react';
import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { BrowserRouter } from 'react-router-dom';

import { StoryDoc } from 'components/story/blocks';

import { Tabs, TabsProps } from '../Tabs';
import { Tab } from '../Tab';
import docs from './Tabs.docs.mdx';
import changelog from './Tabs.changelog.md';

export default {
    title: 'Display/Tabs',
    component: Tabs,
    subcomponents: { Tab },
    args: {},
    decorators: [
        (Story) => (<BrowserRouter><Story /></BrowserRouter>),
    ],
    parameters: {
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="Tabs"
                    componentName="Tabs"
                    component={Tabs}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

const Template: Story<TabsProps> = (args) =>
{
    const [selected, setSelected] = useState('tab_1');

    const onSelectEventHandler = (tab_id?: string) =>
    {
        tab_id && setSelected(tab_id);
        (action('onSelect'))(tab_id);
    };

    return (
        <Tabs
            {...args}
            selected={selected}
            onSelect={onSelectEventHandler}
        >
            <Tab
                id='tab_1'
                title='Pikachu'
            >
                Thunderbolt
            </Tab>
            <Tab
                id='tab_2'
                title='Songoku'
            >
                Yellow hair
            </Tab>
        </Tabs>
    );
};

export const Default = Template.bind({});
