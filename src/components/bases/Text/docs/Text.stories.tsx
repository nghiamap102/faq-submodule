import { Meta, Story } from '@storybook/react';

import { TB1, TB2, HD1, HD2, HD3, HD4, HD5, HD6, Sub1, Sub2 } from 'components/bases/Text/Text';

export default {
    title: 'Display/Text',
    argTypes: {
        className: {
            type: { name: 'string', required: false },
            control: {
                type: 'text',
            },
        },
        style: {
            type: { name: 'string', required: false },
            control: {
                type: 'text',
            },
        },
        onClick: {
            type: { name: 'function', required: false },
        },
    },
} as Meta;

export const Default: Story = (args) =>
{
    return (
        <>
            <p><TB1>TB1 component</TB1></p>
            <p><TB2>TB2 component</TB2></p>
            <p><HD1>HD1 component</HD1></p>
            <p><HD2>HD2 component</HD2></p>
            <p><HD3>HD3 component</HD3></p>
            <p><HD4>HD4 component</HD4></p>
            <p><HD5>HD5 component</HD5></p>
            <p><HD6>HD6 component</HD6></p>
            <p><Sub1>Sub1 component</Sub1></p>
            <p><Sub2>Sub2 component</Sub2></p>
        </>
    );
};
