import { Meta, Story } from '@storybook/react';
import React, { MouseEventHandler, useState } from 'react';

import { PopOverTooltip } from 'components/bases/Tooltip/PopOverTooltip';
import { ContainField, Field, Info, Label } from 'components/bases/Popup/PopupContentField';

export default {
    title: 'Overlays/PopOverTooltip',
    component: PopOverTooltip,
} as Meta;

const Template: Story = (args) =>
{
    const [tooltip, setTooltip] = useState<JSX.Element | null>(null);

    const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) =>
    {
        setTooltip(
            <PopOverTooltip
                header="Header"
                position={{ x: e.clientX, y: e.clientY }}
                width={180}
            >
                <ContainField>
                    <Field>
                        <Label>Label 1</Label>
                        <Info className="justify-end">0</Info>
                    </Field>
                    <Field>
                        <Label>Label 2</Label>
                        <Info className="justify-end">10</Info>
                    </Field>
                </ContainField>
            </PopOverTooltip>,
        );
    };

    const handleMouseLeave = () =>
    {
        setTooltip(null);
    };

    return (
        <>
            <div
                style={{ width: '100%', height: '100%' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />
            {tooltip}
        </>
    );
};

export const Default = Template.bind({});
