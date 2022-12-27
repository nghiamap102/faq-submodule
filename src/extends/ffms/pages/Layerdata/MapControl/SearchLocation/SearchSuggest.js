import React, { useState } from 'react';
import { Container, SuggestItem } from '@vbd/vui';

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
                        />
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
    },
};
export { SearchSuggest };
