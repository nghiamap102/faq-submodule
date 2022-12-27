import React, { useState } from 'react';
import { Button, Input, FormControlLabel, InputGroup } from '@vbd/vui';

import PopupWrapper, { PopupFooter } from 'extends/ffms/pages/base/Popup';
const Example = () =>
{
    const [open, setOpen] = useState(false);

    const handleClick = () =>
    {
        // console.log('handle data');
        setOpen(false);
        return false;
    };

    return (
        <>
            <PopupWrapper
                trigger={<Button label={'Show modal'} />}
                title={'Duplicate'}
                open={open}
                modal
            >
                <FormControlLabel
                    label={'Name'}
                    control={(
                        <InputGroup>
                            <Input
                                type="text"
                            />
                        </InputGroup>
                    )}
                />
                <PopupFooter>
                    <Button
                        label={'Cancel'}
                        close
                    />
                    <Button
                        label={'Duplicate'}
                        color={'primary-color'}
                        onClick={handleClick}
                    />
                </PopupFooter>
            </PopupWrapper>
            <PopupWrapper
                trigger={<Button label={'Show Popover'} />}
            >
                <FormControlLabel
                    label={'Name'}
                    control={(
                        <InputGroup>
                            <Input
                                type="text"
                            />
                        </InputGroup>
                    )}
                />
            </PopupWrapper>
        </>
    );
};


export default Example;
