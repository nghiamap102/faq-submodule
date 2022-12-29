import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Alert, AlertProps } from 'components/bases/Modal/Alert';

export default {
    title: 'Overlays/Alert',
    component: Alert,
} as Meta;

const Template: Story<AlertProps> = (args) =>
{
    return (
        <Alert
            {...args}
            onOk={action('onOk')}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    title: 'Test title',
    message: 'Test message',
};
