import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { ToolBarToggleButtonGroup, ToolBarToggleButton } from 'components/bases/ToolBarToggleButton/ToolBarToggleButton';

export default {
    title: 'Inputs/ToolBarToggleButtonGroup',
    component: ToolBarToggleButtonGroup,
    subcomponents: { ToolBarToggleButton },
};

const actions = [
    {
        id: 1,
        active: true,
        icon: 'tool-label',
    },
    {
        id: 2,
        active: true,
        icon: 'tool-add-marker',
    },
    {
        id: 3,
        active: true,
        icon: 'tool-add-line',
    },
];

const Template = (args) =>
{
    const [selectedActionIndex, setSelectedActionIndex] = useState(-1);

    const handleClickAction = (i) =>
    {
        setSelectedActionIndex(i);
        (action('onClick'))(i);
    };

    return (
        <ToolBarToggleButtonGroup {...args}>
            {
                actions.map((action, i) => (
                    <ToolBarToggleButton
                        key={action.id}
                        active={action.active}
                        icon={action.icon}
                        onClick={() => handleClickAction(i)}
                    />
                ),
                )
            }
        </ToolBarToggleButtonGroup>
    );
};

export const Default = Template.bind({});
