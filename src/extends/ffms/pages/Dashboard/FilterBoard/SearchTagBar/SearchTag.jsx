
import React from 'react';
import _ from 'lodash';
import SearchTagBar from './WrapperTags';
import { Container, ScrollView, Tag } from '@vbd/vui';
import { getContentByLanguage } from 'extends/ffms/services/DashboardService/util';

const SearchTag = ()=>
{
    return (
        <Container className='search-tag-bar'>
            <ScrollView>
                <SearchTagBar>
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
            </ScrollView>
        </Container>

    );
};

export default SearchTag;
