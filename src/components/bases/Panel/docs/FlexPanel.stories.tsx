import { Meta, Story } from '@storybook/react';

import { FlexPanel2, PanelBody2 } from 'components/bases/Panel/Panel';
import { Col2Props } from 'components/bases/Layout/Column';
import { PanelHeader } from 'components/bases/Panel/PanelHeader';
import { PanelFooter } from 'components/bases/Panel/PanelFooter';

export default {
    title: 'Layout/Panel/FlexPanel2',
    component: FlexPanel2,
    args: {
        height: 'full',
    },
    subcomponents: { PanelBody2, PanelHeader, PanelFooter },
    decorators: [(Story) => <div style={{ height: '100vh', margin: '-1rem' }}><Story /></div>],
} as Meta;

export const Default: Story<Col2Props<'div'>> = (args) =>
{
    return (
        <FlexPanel2 {...args}>
            <PanelHeader>
                Header
            </PanelHeader>
            <PanelBody2>
                Body
            </PanelBody2>
            <PanelFooter>
                Footer
            </PanelFooter>
        </FlexPanel2>
    );
};
