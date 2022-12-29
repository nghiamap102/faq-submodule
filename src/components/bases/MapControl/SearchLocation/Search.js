import React, { useContext, useState } from 'react';
// import { Container } from 'components/bases/Container/Container';
// import { FAIcon } from 'components/bases/Icon/FAIcon';
// import { InputAppend, InputGroup, Input } from 'components/bases/Form';
// import { SearchSuggest } from './SearchSuggest';
// import { DirectionService } from 'services/direction.service';
// import { MapContext } from '../MapContext';

import './Search.scss';

const Search = (props) =>
{
    // const [keyword, setKeyword] = useState('');
    // const [suggestData, setSuggestData] = useState([]);
    // const { mapState } = useContext(MapContext);
    // const directionService = new DirectionService();
    // const onInputChange = (val) =>
    // {
    //     setKeyword(val);
    //     getSuggest(val);
    // };
    // const onInputFocus = () =>
    // {
    //
    // };
    // const onInputFocusOut = () =>
    // {
    // };
    //
    // const getSuggest = async (key) =>
    // {
    //     if (key.length >= 3)
    //     {
    //         const res = await directionService.searchAllDebounced(key, mapState.getBounds(mapState.map), 10);
    //         if (res.docs.length && key.length >= 3)
    //         {
    //             setSuggestData(res.docs);
    //         }
    //         else
    //         {
    //             setSuggestData([]);
    //         }
    //     }
    //     else// if (searchText.length == 0) // user clear all search text
    //     {
    //         setSuggestData([]);
    //     }
    // };
    //
    // const onSuggestClick = (item) =>
    // {
    //     setKeyword(item.name);
    //     setSuggestData([]);
    //     props.onSuggestClick(item);
    // };
    //
    // const onClear = () =>
    // {
    //     setKeyword('');
    //     setSuggestData([]);
    //     props.onClear();
    // };
    // return (
    //     <Container className={`search-container ${suggestData.length ? 'expanded' : ''}`}>
    //         <Container className={'search-input-container'}>
    //             <InputGroup>
    //                 <InputAppend>
    //                     {
    //                         keyword.length
    //                             ? (
    //                                     <FAIcon
    //                                         icon="times"
    //                                         size="13px"
    //                                         onClick={onClear}
    //                                     />
    //                                 )
    //                             : (
    //                                     <FAIcon
    //                                         icon="search"
    //                                         size="13px"
    //                                     />
    //                                 )
    //                     }
    //                 </InputAppend>
    //                 <Input
    //                     value={keyword}
    //                     placeholder={'Tìm vị trí'}
    //                     onChange={onInputChange}
    //                     onFocus={onInputFocus}
    //                     onFocusOut={onInputFocusOut}
    //                 />
    //                 <InputAppend>
    //                     <FAIcon
    //                         icon="close"
    //                         size="13px"
    //                     />
    //                 </InputAppend>
    //             </InputGroup>
    //         </Container>
    //         <Container className={'search-suggest-container'}>
    //             <SearchSuggest
    //                 data={suggestData}
    //                 handleClick={onSuggestClick}
    //             />
    //         </Container>
    //     </Container>
    // );
};

Search.defaultProps = {
    onSuggestClick: () =>
    {

    },
    onClear: () =>
    {
    },
};

export { Search };
