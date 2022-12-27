import './PagingDetail.scss';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
    FAIcons, FAIcon,
    AdvanceSelect,
} from '@vbd/vui';

const ItemCountOnPage = [
    { id: 10, value: 10, label: '10' },
    { id: 20, value: 20, label: '20' },
    { id: 30, value: 30, label: '30' },
];

const PagingDetail = ({ onPageChange, totalItem, pageIndex, limit }) =>
{
    const [index, setIndex] = useState(pageIndex);
    const [limitData, setLimitData] = useState(limit);
    const totalPage = Math.ceil(totalItem / limitData);
    useEffect(() =>
    {
        if (pageIndex > totalPage)
        {
            _.isFunction(onPageChange) && onPageChange({ pageIndex: 1, limit });
        }
        else
        {
            setIndex(pageIndex);
        }
    }, [pageIndex]);

    const handleChange = (pageIndex) =>
    {
        if (pageIndex > 0 && pageIndex <= totalPage)
        {
            setIndex(pageIndex);
            _.isFunction(onPageChange) && onPageChange({ pageIndex, limit });
        }
    };

    const handleChangeLimit = (value) =>
    {
        setLimitData(value);
        _.isFunction(onPageChange) && onPageChange({ pageIndex: 1, limit: value });
    };

    return (
        <FAIcons
            className="ic-menu-items paging-detail"
            color="#F4F4F4"
        >
            <div>
                <AdvanceSelect
                    options={ItemCountOnPage}
                    value={limitData}
                    onChange={handleChangeLimit}
                />
            </div>
            <FAIcon
                type={'light'}
                icon={'angle-left'}
                color={'#F4F4F4'}
                title={'Previous'}
                disabled={index == 1}
                onClick={() => handleChange(index - 1)}
            />
            {_.map(_.range(totalPage), item => (
                <div
                    key={(item + 1)}
                    className={`item ${index == (item + 1) && 'active'}`}
                    onClick={() => handleChange((item + 1))}
                >{item + 1}
                </div>
            ))}
            <FAIcon
                type={'light'}
                icon={'angle-right'}
                color={'#F4F4F4'}
                title={'Next'}
                disabled={index == totalPage}
                onClick={() => handleChange(index + 1)}
            />
        </FAIcons>
    );
};
PagingDetail.propTypes = {
    onPageChange: PropTypes.func,
    totalItem: PropTypes.number,
    pageIndex: PropTypes.number,
    limit: PropTypes.number,
};
PagingDetail.defaultProps = {
    limit: 10,
};

export default PagingDetail;
