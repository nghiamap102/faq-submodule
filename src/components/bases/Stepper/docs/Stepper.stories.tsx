import { Meta, Story } from '@storybook/react';

import { Step, Stepper } from 'components/bases/Stepper';
import { StepperProps } from '../model';

export default {
    title: 'Display/Stepper',
    component: Stepper,
    subcomponents: { Step },
} as Meta;

const Template: Story<StepperProps> = (args) =>
{
    return (
        <Stepper
            {...args}
        >
            <Step
                title='Step 1'
                subTitle='Sub title'
                description='This is a finish step.'
            />
            <Step
                title='Step 2'
                description='This is a current step.'
            />
            <Step
                title='Step 3'
                description='This is a waiting step.'
            />
            <Step
                title='Step 4'
                description='This step is error'
                status='error'
            />
        </Stepper>
    );
};

export const Default = Template.bind({});
Default.args = {
    current: 1,
};
