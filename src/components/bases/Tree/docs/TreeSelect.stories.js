import React from 'react';

import { TreeSelect } from 'components/bases/Tree/TreeSelect';

export default {
    title: 'Display/TreeSelect',
    component: TreeSelect,
};

const treeData = [];

for (let k = 0; k < 3; k++)
{
    const root = {
        id: 'root' + k,
        label: 'Root ' + k,
        canCheck: false,
        checkingType: 0,
        child: [],
    };

    for (let i = 0; i < 10; i++)
    {
        const child = {
            id: 'child' + k + i,
            label: 'Child ' + i,
            canCheck: true,
            checkingType: 0,
            child: [],
        };

        for (let j = 0; j < 10; j++)
        {
            child.child.push(
                {
                    id: 'grandchild' + k + i + j,
                    label: 'Grand Child ' + j,
                    canCheck: true,
                    checkingType: 0,
                    child: [],
                },
            );
        }

        root.child.push(child);
    }

    treeData.push(root);
}

const Template = (args) =>
{
    return (
        <TreeSelect {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    data: treeData,
    onChecked: (console.log),
};
