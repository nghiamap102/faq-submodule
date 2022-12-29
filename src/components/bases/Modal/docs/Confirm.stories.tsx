import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Confirm, ConfirmProps } from 'components/bases/Modal/Confirm';

export default {
    title: 'Overlays/Confirm',
    component: Confirm,
} as Meta;

const Template: Story<ConfirmProps> = (args) =>
{
    return (
        <Confirm
            {...args}
            onOk={action('onOk')}
            onCancel={action('onCancel')}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    title: 'Test title',
    message: 'Test message',
};
