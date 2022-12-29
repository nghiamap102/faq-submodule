import { Meta, Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Overlay, OverlayProps } from '../Overlay';

export default {
    title: 'Overlays/Overlay',
    component: Overlay,
} as Meta;

const Template: Story<OverlayProps> = (args) =>
{
    const handleBackgroundClick = action('onBackgroundClick');

    return (
        <>
            <Overlay
                {...args}
                onBackgroundClick={handleBackgroundClick}
            />
        </>
    );
};

export const Default = Template.bind({});
