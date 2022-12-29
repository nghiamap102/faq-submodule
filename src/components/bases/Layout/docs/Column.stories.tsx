import { Meta, Story } from '@storybook/react';

import { Col2, Col2OwnProps } from 'components/bases/Layout/Column';

export default {
    title: 'Layout/Row - Column/Column',
    component: Col2,
    parameters: {},
    args: {
        height: 'full',
        sx: {
            bgColor: 'cyan500',
        },
    },
    decorators: [(Story) => <div style={{ width: '50vw', height: '50vh' }}><Story /></div>],
} as Meta;

const Template: Story<Col2OwnProps> = (args) =>
{
    return (
        <Col2 {...args}>
            <div style={{ backgroundColor: 'aquamarine' }}>
                Pikachu
            </div>
            <div style={{ backgroundColor: 'lime' }}>
                Songoku
            </div>
        </Col2>
    );
};

export const Default = Template.bind({});

export const Center = Template.bind({});
Center.args = {
    justify: 'center',
    items: 'center',
};
