import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';

import { PopperTooltip } from 'components/bases/Tooltip/PopperTooltip';
import { FormControlLabel, FormGroup, InputGroup, InputAppend } from 'components/bases/Form';
import { Input } from 'components/bases/Input';

export default {
    title: 'Inputs/PopperTooltip',
    component: <></>,
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
                                <PopperTooltip
                                    tooltip={'Great!'}
                                    trigger={['hover']}
                                    placement={'bottom'}
                                >
                                    ?
                                </PopperTooltip>
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
