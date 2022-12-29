import React, { useState } from 'react';
import { SuggestItem } from 'components/bases/Search/SuggestItem';
import { Container } from 'components/bases/Container/Container';

const SearchSuggest = (props) =>
{
    const { data } = props;
    return (
        <Container>
            {
                data.map((d, i) =>
                {
                    d.hint = d.address;
                    d.query = d.name;
                    return (
                        <SuggestItem
                            key={i}
                            data={d}
                            onClick={() => props.handleClick(d)}
                        >
                        </SuggestItem>
                    );
                })
            }
        </Container>
    );
};
SearchSuggest.defaultProps = {
    data: [],
    handleClick: () =>
    {
    }
};
export { SearchSuggest };
