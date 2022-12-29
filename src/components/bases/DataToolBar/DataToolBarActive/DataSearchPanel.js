import './DataSearchPanel.scss';

import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { SearchBox } from 'components/bases/Input/SearchBox';

import { DataToolBarContext } from '../DataToolBarContext';

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export const DataSearchPanel = ({ onSearch }) =>
{
    const { valueSearch, setValueSearch } = useContext(DataToolBarContext);
    const [isFocus, setFocus] = useState(false);

    useEffect(() =>
    {
        if (isFocus)
        {
            const timeout = setTimeout(() =>
            {
                if (valueSearch)
                {
                    onSearch(valueSearch);
                }
            }, WAIT_INTERVAL);

            // if this effect run again, because `value` changed, we remove the previous timeout
            return () => clearTimeout(timeout);
        }
    }, [valueSearch]);


    const handleChange = (value) =>
    {
        setValueSearch(value);

        if (value === '')
        {
            onSearch(value);
        }
    };

    const handleKeyDown = (e) =>
    {
        if (e.keyCode === ENTER_KEY)
        {
            if (valueSearch)
            {
                onSearch(valueSearch);
            }
        }
    };

    return (
        <div className={'search-feature-action'}>
            <SearchBox
                placeholder={'Nhập từ khóa để tìm kiếm'}
                onChange={handleChange}
                value={valueSearch}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocus(true)}
            />
        </div>
    );
};

DataSearchPanel.propTypes = {
    onSearch: PropTypes.func,
    fields: PropTypes.array,
    onSort: PropTypes.func
};
