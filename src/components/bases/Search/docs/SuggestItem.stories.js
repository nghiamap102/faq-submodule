import React from 'react';

import { SuggestItem } from 'components/bases/Search/SuggestItem';

export default {
    title: 'Inputs/Search/SearchList/SuggestItem',
    component: SuggestItem,
};

const Template = (args) =>
{
    return (
        <SuggestItem {...args} />
    );
};

const data = {
    iconClass: '',
    history: true,
    query: 'Query string',
    hint: 'Hint string',
};

export const Default = Template.bind({});
Default.args = {
    data,
    history: true,
};
