import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { ColorPicker } from 'components/bases/ColorPicker/ColorPicker';

export default {
    title: 'Inputs/Color Picker',
    component: ColorPicker,
};

const Template = (args) =>
{
    const [value, setValue] = useState();

    const onChangeEventHandler = (value) =>
    {
        setValue(value);
        (action('onChange'))();
    };

    return (
        <>
            <p style={{ padding: '10px', fontSize: '30' }}>Value: {JSON.stringify(value)}</p>
            <ColorPicker {...args} value={value} onChange={onChangeEventHandler} />
        </>
    );
};

export const Hex = Template.bind({});
Hex.args = {
    changeType: 'hex',
};

export const HSL = Template.bind({});
HSL.args = {
    changeType: 'hsl',
};

export const HSV = Template.bind({});
HSV.args = {
    changeType: 'hsv',
};

export const RGB = Template.bind({});
RGB.args = {
    changeType: 'rgb',
};


