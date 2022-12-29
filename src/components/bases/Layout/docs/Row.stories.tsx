import { Meta, Story } from '@storybook/react';

import { Row2, Row2OwnProps } from 'components/bases/Layout/Row';
import { Box } from 'components/bases/Layout/Box';

export default {
    title: 'Layout/Row - Column/Row',
    component: Row2,
    args: {
        style: { backgroundColor: 'aqua' },
    },
    decorators: [(Story) => <Box sx={{ width: '1/2', height: '1/2' }}><Story /></Box>],
} as Meta;

const Template: Story<Row2OwnProps> = (args) =>
{
    return (
        <Row2
            height='full'
            {...args}
        >
            <Box sx={{ bgColor: 'cyan500' }}>
                Pikachu
            </Box>
            <Box sx={{ bgColor: 'lime500' }}>
                Songoku
            </Box>
        </Row2>
    );
};

export const Default = Template.bind({});

export const Center = Template.bind({});
Center.args = {
    justify: 'center',
    items: 'center',
};
