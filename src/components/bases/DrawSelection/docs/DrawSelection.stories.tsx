import { Meta, Story } from '@storybook/react';

import { DrawSelection, DrawSelectionProps } from '../DrawSelection';

export default {
    title: 'Inputs/DrawSelection',
    component: DrawSelection,
} as Meta;

const Template: Story<DrawSelectionProps> = (args) =>
{
    return (
        <DrawSelection
            defaultSchedule={{
                Monday: [{ from: '00:00', to: '08:00' }, { from: '18:00', to: '24:00' }],
                Tuesday: [{ from: '00:00', to: '08:00' }, { from: '18:00', to: '24:00' }],
                Wednesday: [{ from: '00:00', to: '08:00' }, { from: '18:00', to: '24:00' }],
                Thursday: [{ from: '00:00', to: '08:00' }, { from: '18:00', to: '24:00' }],
                Friday: [{ from: '00:00', to: '08:00' }, { from: '18:00', to: '24:00' }],
                Saturday: [{ from: '00:00', to: '24:00' }],
                Sunday: [{ from: '00:00', to: '24:00' }],
            }}
            numOfItemPerPart={8}
            onSelectEnd={data => console.log(data)}
            {...args}
        />
    );
};

export const Default = Template.bind({});
