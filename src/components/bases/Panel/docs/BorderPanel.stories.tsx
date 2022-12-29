import { Meta, Story } from '@storybook/react';

import { Col2Props } from 'components/bases/Layout/Column';
import { Row2 } from 'components/bases/Layout/Row';

import { BorderPanel2 } from '../Panel';

export default {
    title: 'Layout/Panel/BorderPanel2',
    component: BorderPanel2,
    args: {
        height: 'full',
    },
    subcomponents: { Row2 },
    decorators: [(Story) => <div style={{ height: '100vh', margin: '-1rem' }}><Story /></div>],
} as Meta;

export const Default: Story<Col2Props<'div'>> = (args) =>
{
    return (
        <BorderPanel2 {...args}>
            <Row2>
                <BorderPanel2>
                    Child 1
                </BorderPanel2>
                <BorderPanel2>
                    Child 2
                </BorderPanel2>
            </Row2>
        </BorderPanel2>
    );
};

export const Nested: Story<Col2Props<'div'>> = (args) =>
{
    return (
        <Row2 {...args}>
            <BorderPanel2 width={16}>
                left menu
            </BorderPanel2>
            <BorderPanel2>
                <Row2>
                    <BorderPanel2>
                        Child 1
                        <BorderPanel2>Child 1 of child 1</BorderPanel2>
                        <BorderPanel2>Child 2 of child 1</BorderPanel2>
                    </BorderPanel2>
                </Row2>
            </BorderPanel2>
        </Row2>
    );
};
