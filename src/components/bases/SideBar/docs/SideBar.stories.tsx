import { useState } from 'react';
import { Meta, Story } from '@storybook/react';

import { SideBar2 } from 'components/bases/SideBar/SideBar';
import { FeatureBar, FeatureBarTop } from 'components/bases/FeatureBar/FeatureBar';
import { FeatureItem } from 'components/bases/FeatureBar/FeatureItem';
import { Container } from 'components/bases/Container/Container';
import { PanelHeader } from 'components/bases/Panel/PanelHeader';
import { Col2Props } from 'components/bases/Layout/Column';

export default {
    title: 'Layout/SideBar2',
    component: SideBar2,
} as Meta;

const Template: Story<Col2Props<'div'>> = (args) =>
{
    return (
        <>
            <SideBar2 {...args}>
                <div style={{ backgroundColor: 'aquamarine', width: '50%' }}>
                    Child DOM element
                </div>
            </SideBar2>
        </>
    );
};

export const Default = Template.bind({});

export const WithFeatureBar: Story<Col2Props<'div'>> = (args) =>
{
    const [activeFeatureItem, setActiveFeatureItem] = useState('');
    return (
        <Container className={'flex full-height'}>
            <FeatureBar>
                <FeatureBarTop>
                    <FeatureItem
                        id="event"
                        icon="bell"
                        badgeCount={12}
                        active
                        onClick={() => setActiveFeatureItem('event')}
                    />
                    <FeatureItem
                        id="incident"
                        icon="exclamation-triangle"
                        active={false}
                        badgeCount={2}
                        onClick={() => setActiveFeatureItem('incident')}
                    />
                    <FeatureItem
                        id="case"
                        icon="briefcase"
                        active
                        onClick={() => setActiveFeatureItem('case')}
                    />
                </FeatureBarTop>
            </FeatureBar>
            <Container className={'side-feature'}>
                {
                    (activeFeatureItem === 'event') && (
                        <>
                            <SideBar2
                                {...args}
                            >
                                <PanelHeader actions={[]}>
                                Event Panel - Header
                                </PanelHeader>
                            </SideBar2>
                        </>
                    )}
                {
                    (activeFeatureItem === 'incident') && (
                        <>
                            <SideBar2
                                {...args}
                            >
                                <PanelHeader actions={[]}>
                                Incident Panel - Header
                                </PanelHeader>
                            </SideBar2>
                        </>
                    )}
                {
                    (activeFeatureItem === 'case') && (
                        <>
                            <SideBar2
                                {...args}
                            >
                                <PanelHeader actions={[]}>
                                Case Panel - Header
                                </PanelHeader>
                            </SideBar2>
                        </>
                    )}
            </Container>
        </Container>
    );
};
