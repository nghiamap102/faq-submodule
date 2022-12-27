import React, { useState } from 'react';

import { SideBar } from 'components/bases/SideBar/SideBar';
import { FeatureBar, FeatureBarTop } from 'components/bases/FeatureBar/FeatureBar';
import { FeatureItem } from 'components/bases/FeatureBar/FeatureItem';
import { Container } from 'components/bases/Container/Container';
import { PanelHeader } from 'components/bases/Panel/PanelHeader';

export default {
    title: 'Bases/Layout/SideBar',
    component: SideBar,
};

const Template = (args) =>
{
    return (
        <>
            <SideBar {...args}>
                <div style={{ backgroundColor: 'aquamarine', width: '50%' }}>
                    Child DOM element
                </div>
            </SideBar>
        </>
    );
};

export const Default = Template.bind({});

export const WithFeatureBar = (args) =>
{
    const [activeFeatureItem, setActiveFeatureItem] = useState('');
    return (
        <Container className={'flex full-height'}>
            <FeatureBar>
                <FeatureBarTop>
                    <FeatureItem
                        id="event"
                        icon="bell"
                        active
                        badgeCount={12}
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
                    (activeFeatureItem === 'event') &&
                    <>
                        <SideBar
                            {...args}
                        >
                            <PanelHeader actions={[]}>
                                Event Panel - Header
                            </PanelHeader>
                        </SideBar>
                    </>
                }
                {
                    (activeFeatureItem === 'incident') &&
                    <>
                        <SideBar
                            {...args}
                        >
                            <PanelHeader actions={[]}>
                                Incident Panel - Header
                            </PanelHeader>
                        </SideBar>
                    </>
                }
                {
                    (activeFeatureItem === 'case') &&
                    <>
                        <SideBar
                            {...args}
                        >
                            <PanelHeader actions={[]}>
                                Case Panel - Header
                            </PanelHeader>
                        </SideBar>
                    </>
                }
            </Container>
        </Container>
    );
};
