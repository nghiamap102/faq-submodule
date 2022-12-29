import { Meta, Story } from '@storybook/react';

import { Loading, LoadingProps } from '../Loading';

export default {
    title: 'Overlays/Loading',
    component: Loading,
} as Meta;

const Template: Story<LoadingProps> = (args) =>
{
    return (
        <Loading
            {...args}
            text="Loading text"
        />
    );
};

export const Default = Template.bind({});
