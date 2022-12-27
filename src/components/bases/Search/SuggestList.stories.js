import React from 'react';

import { SuggestList } from 'components/bases/Search/SuggestList';
import { SuggestItem } from 'components/bases/Search/SuggestItem';

export default {
    title: 'Bases/Search/SearchList',
    component: SuggestList,
    subcomponents: { SuggestItem },
};

const data = [
    {
        favLocation: 'location',
        isMyLocation: true,
        query: '1',
        hint: 'Hint 1'
    },
    {
        favLocation: 'location',
        isMyLocation: false,
        query: '2',
        hint: 'Hint 2',
    },
    {
        query: '3',
        hint: 'Hint 3',
        history: true,
    },
    {
        query: '4',
        hint: 'Hint 4'
    },
];


const Template = (args) =>
{
    return (
        <SuggestList {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    data,
};

export const HighlightedItem = Template.bind({});
HighlightedItem.args = {
    data,
    highlightIndex: 0,
};
