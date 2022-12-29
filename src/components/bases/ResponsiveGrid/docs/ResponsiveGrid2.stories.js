import React, { useState } from 'react';

import { ResponsiveGrid, ResponsiveGridItem } from 'components/bases/ResponsiveGrid/ResponsiveGrid';
import { Button } from 'components/bases/Button/Button';

export default {
    title: 'Layout/ResponsiveGrid',
    component: ResponsiveGrid,
};

function Parent({ children, ...props })
{
    const [num, setNum] = useState(1);
    return <div>{children(num, setNum)}</div>;
}

const Template = (args) => (
    <Parent>
        {(num, setNum) => (
            <div style={{ height: '90vh' }}>
                <Button
                    text={'Remove'}
                    onClick={() => setNum(Math.max(num - 1, 0))}
                />
                <Button
                    text={'Add'}
                    onClick={() => setNum(num + 1)}
                />
                <ResponsiveGrid>
                    {
                        Array(num).fill(0).map((num, index) => (
                            <ResponsiveGridItem key={index}>Item {index + 1}</ResponsiveGridItem>
                        ))
                    }
                </ResponsiveGrid>
            </div>
        )}
    </Parent>
);

export const Default = Template.bind({});
Default.args = {};
