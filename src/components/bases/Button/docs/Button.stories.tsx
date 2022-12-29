import { Meta, Story } from '@storybook/react';

import { Button, ButtonProps } from 'components/bases/Button';
import { StoryDoc } from 'components/story/blocks';

import docs from './Button.docs.mdx';
import changelog from './Button.changelog.md';

export default {
    title: 'Inputs/Button',
    component: Button,
    parameters: {
        controls: { expanded: true },
        backgrounds: {
            default: '',
            values: [
                { name: 'twitter', value: '#00aced' },
                { name: 'facebook', value: '#3b5998' },
            ],
        },
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="Button"
                    componentName="Button"
                    component={Button}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
    argTypes: {
        iconColor: { control: 'color' },
        color: { control: 'color' },
        backgroundColor: { control: 'color' },
    },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Primary = Template.bind({});
Primary.args = {
    color: 'primary',
};

export const Success = Template.bind({});
Success.args = {
    color: 'success',
};

export const Info = Template.bind({});
Info.args = {
    color: 'info',
};

export const Danger = Template.bind({});
Danger.args = {
    color: 'danger',
};

export const Warning = Template.bind({});
Warning.args = {
    color: 'warning',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    icon: 'user',
    iconType: 'solid',
    iconLocation: 'right',
};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
};
