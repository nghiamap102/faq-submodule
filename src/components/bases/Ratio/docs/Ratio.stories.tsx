import { Meta, Story } from '@storybook/react';

import { Row2 } from 'components/bases/Layout/Row';
import { Ratio, RatioProps } from '../Ratio';

export default {
    title: 'Layout/Ratio',
    component: Ratio,
} as Meta;

const Template: Story<RatioProps> = (args) =>
{
    return (
        <Row2
            justify="center"
            items="center"
        >
            <Row2 width="1/2">
                <Ratio {...args}>
                    <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/LQHsgv8LuhY"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </Ratio>
            </Row2>
        </Row2>
    );
};

export const Default = Template.bind({});
Default.args = {
    width: 560,
    height: 315,
};
