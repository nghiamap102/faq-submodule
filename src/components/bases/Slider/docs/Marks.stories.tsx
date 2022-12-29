import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import { StoryDoc } from 'components/story/blocks';

import { Slider, SingleSliderProps } from '../Slider';
import docs from './Slider.docs.mdx';
import changelog from './Slider.changelog.md';

export default {
    title: 'Inputs/Slider/Marks',
    component: Slider,
    parameters: {
        changelog,
        docs: {
            // eslint-disable-next-line react/display-name
            page: () => (
                <StoryDoc
                    name="Slider"
                    componentName="Slider"
                    component={Slider}
                    status={'released'}
                    description={docs}
                />
            ),
        },
    },
} as Meta;

const SingeTemplate: Story<SingleSliderProps> = (args) =>
{
    const [value, setValue] = useState<number>(args.value ?? 10);

    const handleChangeValue = (value: number) =>
    {
        setValue(value);
        action('onChange')(value);
    };

    const handleAfterChange = (value: number) => action('onAfterChange')(value);

    return (
        <div style={{ width: '80%', margin: 'auto', height: '300px' }}>
            <Slider
                {...args}
                range={false}
                value={value}
                onChange={handleChangeValue}
                onAfterChange={handleAfterChange}
            />
        </div>
    );
};

export const Default = SingeTemplate.bind({});
Default.args = {
    max: 100,
    min: 0,
    step: 1,
    value: 80,
    marks: {
        0: { label: '0°C', style: { color: 'red' } },
        26: '26°C',
        37: '37°C',
        100: '100 độ C',
    },
};

export const SquareMarks = SingeTemplate.bind({});
SquareMarks.args = {
    max: 100,
    min: 0,
    step: 1,
    value: 100,
    typeMark: 'square',
    marks: {
        0: { label: '0°C', style: { color: 'red' } },
        26: '26°C',
        37: '37°C',
        100: '100 độ C',
    },
};

export const LineMarks = SingeTemplate.bind({});
LineMarks.args = {
    max: 100,
    min: 0,
    step: 1,
    value: 100,
    typeMark: 'line',
    marks: {
        0: { label: '0°C', style: { color: 'red' } },
        26: '26°C',
        37: '37°C',
        100: '100 độ C',
    },
};

export const MarksHaveLabelWithStepNull = SingeTemplate.bind({});
MarksHaveLabelWithStepNull.args = {
    max: 100,
    min: 0,
    step: null,
    value: 100,
    marks: {
        0: { label: '0°C', style: { color: 'red' } },
        26: '26°C',
        37: '37°C',
        100: '100 độ C',
    },
};

export const MarksNoLabelWithStep = SingeTemplate.bind({});
MarksNoLabelWithStep.args = {
    max: 100,
    min: 0,
    step: 5,
    value: 100,
    marks: true,
};
