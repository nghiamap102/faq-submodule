import React from 'react';
import _ from 'lodash';

import { Tag } from '@vbd/vui';

import { getContentByLanguage } from 'extends/ffms/services/DashboardService/util';

import SearchTagBar from './WrapperTags';

const SearchTag = () =>
{
    return (
        <SearchTagBar className="search-tag-bar">
            {
                ({ data, onChange }) =>
                {
                    return _.map(data, item => (
                        <Tag
                            key={item.id}
                            text={getContentByLanguage(item.name) ?? getContentByLanguage(item.label)}
                            onCloseClick={() =>
                            {
                                onChange(item);
                            }}
                        />
                    ));
                }
            }
        </SearchTagBar>

    );
};

export default SearchTag;
