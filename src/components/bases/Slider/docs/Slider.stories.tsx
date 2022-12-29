import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { Meta, Story } from '@storybook/react';
import { FAIcon } from '@vbd/vicon';
import { StoryDoc } from 'components/story/blocks';

import { Slider, RangeSliderProps, SingleSliderProps } from '../Slider';
import docs from './Slider.docs.mdx';
import changelog from './Slider.changelog.md';
import { RangeTime } from 'components/bases/DateTimePicker/RangeTime';
import moment from 'moment';

export default {
    title: 'Inputs/Slider',
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
    };

    const handleAfterChange = (value: number) => action('onAfterChange')(value);

    return (
        <div style={{ width: '80%', margin: '50px auto 0', height: '300px' }}>
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

const RangeTemplate: Story<RangeSliderProps> = (args) =>
{
    const [value, setValue] = useState<[number, number] | [number]>(args.value ?? [0, 10]);

    const handleChangeValue = (value: [number, number]) =>
    {
        setValue(value);
    };

    const handleAfterChange = (value: [number, number]) => action('onAfterChange')(value);

    const getDisplayMap = (min: number, max: number, step: number) =>
    {
        const _step = step ? step : 1;
        const rulerStep = 100 / ((max - min) / _step); // 0% = min, 100% = max

        const map: Record<number, any> = {};
        let j = 0;
        for (let i = min; i <= max; i = i + _step)
        {
            j += 1;
            map[(j - 1) * rulerStep] = i;
        }
        
        return map;
    };

    return (
        <div style={{ width: '80%', margin: 'auto', height: '300px' }}>
            <Slider
                {...args}
                value={value}
                displayMap={getDisplayMap(43, 78, 1)}
                range
                onChange={handleChangeValue}
                onAfterChange={handleAfterChange}
            />
        </div>
    );
};

const RangeTimeTemplate: Story<RangeSliderProps> = (args) =>
{
    return (
        <div style={{ width: '80%', margin: 'auto' }}>
            <RangeTime
                disabled={false}
                timeFormat={'hh:mm A'}
                inDate={moment('2022-04-06T19:15:00.000Z')}
                timeStart={moment('2022-04-06T19:15:00.000Z')}
                timeEnd={moment('2022-04-07T14:45:00.000Z')}
                stepWithType={15}
            />
        </div>
    );
};


export const Default = SingeTemplate.bind({});
Default.args = {
    min: 0,
    max: 100,
    value: 20,
};

export const Wrapper = SingeTemplate.bind({});
Wrapper.args = {
    max: 100,
    min: 0,
    step: 1,
    value: 100,
    wrapper: { left: <div>React Element</div>, right: 4567 },
};

export const Reverse = SingeTemplate.bind({});
Reverse.args = {
    min: 0,
    max: 100,
    step: 1,
    value: 20,
    reverse: true,
};

export const SizeAndStyle = SingeTemplate.bind({});
SizeAndStyle.args = {
    min: 0,
    max: 100,
    thumbSize: '32px',
    thumbColor: '#000',
    rangeSize: '20px',
    rangeColor: '#000',
    railStyle: {
        background: 'var(--primary-color)',
        opacity: '0.3',
    },
};

export const Disabled = SingeTemplate.bind({});
Disabled.args = {
    min: 0,
    max: 100,
    step: 4,
    value: 20,
    disabled: true,
    marks: true,
};

export const Step = SingeTemplate.bind({});
Step.args = {
    min: 0,
    max: 100,
    step: 8,
    value: 20,
};

export const CustomThumb = SingeTemplate.bind({});
CustomThumb.args = {
    max: 100,
    min: 0,
    step: 1,
    value: 100,
    thumbCustom: (
        <FAIcon
            icon={'times'}
            size={'1.125rem'}
            backgroundColor={'white'}
            color={'black'}
        />
    ),
};

export const CustomThumbRange = RangeTemplate.bind({});
CustomThumbRange.args = {
    max: 100,
    min: 0,
    step: 1,
    value: [0,80],
    range: true,
    thumbCustom: {
        start: (
            <FAIcon
                icon={'play'}
                size={'1.125rem'}
                backgroundColor={'white'}
                color={'black'}
            />
        ),
        end: (
            <FAIcon
                icon={'star'}
                size={'1.125rem'}
                backgroundColor={'white'}
                color={'black'}
            />
        ),
    },
};

export const Indicator = SingeTemplate.bind({});
Indicator.args = {
    min: 0,
    max: 100,
    step: 1,
    value: 20,
    showIndicator: true,
    displayMap: {
        0: 'Indicator 1',
        20: 'Indicator 2',
        50: 'Indicator 3',
    },
};

export const RangeIndicator = RangeTemplate.bind({});
RangeIndicator.args = {
    min: 43,
    max: 78,
    step: 1,
    value: [43, 78],
    showIndicator: true,
};

export const DisableSwap = RangeTemplate.bind({});
DisableSwap.args = {
    max: 100,
    min: 0,
    step: 1,
    value: [20,80],
    disableSwap: true,
};

export const Vertical = SingeTemplate.bind({});
Vertical.args = {
    max: 100,
    min: 0,
    step: 1,
    value: 20,
    orientation: 'vertical',
};

export const RangeTimeSlider = RangeTimeTemplate.bind({});
