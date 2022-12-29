import { Meta, Story } from '@storybook/react';

import { Panel2, PanelBody2 } from 'components/bases/Panel/Panel';
import { PanelHeader } from 'components/bases/Panel/PanelHeader';
import { PanelFooter } from 'components/bases/Panel/PanelFooter';
import { BoxProps } from 'components/bases/Layout/Box';

export default {
    title: 'Layout/Panel/Panel2',
    component: Panel2,
    subcomponents: { PanelBody2, PanelHeader, PanelFooter },
} as Meta;

export const Default: Story<BoxProps<'div'>> = (args) =>
{
    return (
        <Panel2 {...args}>
            <PanelHeader>
                Header
            </PanelHeader>
            <PanelBody2>
                Body
            </PanelBody2>
            <PanelFooter>
                Footer
            </PanelFooter>
        </Panel2>
    );
};
