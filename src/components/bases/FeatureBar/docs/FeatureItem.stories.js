import { action } from '@storybook/addon-actions';

import { FeatureItem } from 'components/bases/FeatureBar/FeatureItem';

export default {
    title: 'Navigation/FeatureBar/FeatureItem',
    component: FeatureItem,
};

const Template = (args) =>
{
    return (
        <FeatureItem {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    id: 'event',
    icon: 'bell',
    active: false,
    badgeCount: 69,
    onClick: action('onClick'),
};
