import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { Tooltip } from 'components/bases/Tooltip/Tooltip';
import { FormControlLabel, FormGroup, InputGroup, InputAppend } from 'components/bases/Form';
import { Input } from 'components/bases/Input';
import { TB1 } from 'components/bases/Text/Text';

export default {
    title: 'Inputs/Tooltip',
    component: Tooltip,
};

const Template = (args) =>
{
    const [value, setValue] = useState('');
    return (
        <>
            <FormGroup>
                <FormControlLabel
                    control={(
                        <InputGroup>
                            <Input
                                placeholder={'Check the tooltip!'}
                                value={value}
                                onChange={(value) =>
                                {
                                    setValue(value);
                                    (action('onChange'))(value);
                                }}
                            />
                            <InputAppend>
                                <Tooltip
                                    content={(
                                        <>
                                            <TB1>Here&apos;s the tooltip</TB1>
                                            <pre>Great!</pre>
                                        </>
                                    )}
                                    {...args}
                                >
                                    ?
                                </Tooltip>
                            </InputAppend>
                        </InputGroup>
                    )}
                />
            </FormGroup>
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    position: 'left',
    trigger: 'hover',
};
