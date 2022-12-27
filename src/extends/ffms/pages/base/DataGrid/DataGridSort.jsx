import './DataGrid.scss';
import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

const sortDefine = {
    desc: 'fa-sort-up',
    asc: 'fa-sort-down',
    none: 'fa-sort'
};

const DataGridSort = ({ onChange, column, sort, children, className }) =>
{

    const [data, setData] = useState(sort);
    const handleChange = (e, sort) =>
    {
        setData(sort);
        _.isFunction(onChange) && onChange({ column, sort });
    };

    const getSort = () =>
    {
        switch (data)
        {
            case 'desc':
                return 'asc';
            case 'asc':
                return null;
            default:
                return 'desc';
        }
    };

    return (
        <div
            onClick={(e) => handleChange(e, getSort())}
            className={`${className ?? ''}`}
        >
            { children}{' '}
            <i
                className={`fad ${sortDefine[data ?? 'none']}`}
            />
        </div >
    );
};

DataGridSort.propTypes = {
    onChange: PropTypes.func,
    column: PropTypes.string,
    sort: PropTypes.string
};

export default DataGridSort;
