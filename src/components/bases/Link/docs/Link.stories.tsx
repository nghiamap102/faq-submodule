import { Meta, Story } from '@storybook/react';

import { Link, LinkProps } from 'components/bases/Link/Link';

export default {
    title: 'Navigation/Link',
    component: Link,
} as Meta;

const Template: Story<LinkProps> = (args) =>
{
    return (
        <Link {...args}>
            Google
        </Link>
    );
};

export const Default = Template.bind({});
Default.args = {
    href: 'https://www.google.com',
    target: '_blank',
};
