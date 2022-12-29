import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { Paging } from 'components/bases/Paging/Paging';
import { T } from 'components/bases/Translate/Translate';

const PaginationRow = (props) =>
{
    const { total, pageIndex, pageSize, pageSizeOptions, onChangePage, onChangeItemsPerPage } = props;

    const selectOptions = pageSizeOptions?.map((pageSize) => ({ id: pageSize, label: <T params={[pageSize]}>%0% dòng</T> })) || [];

    return (
        <>
            <Paging
                total={total}
                pageSize={pageSize}
                currentPage={pageIndex}
                onChange={onChangePage}
            />
            <AdvanceSelect
                searchable={false}
                options={selectOptions}
                width={'8rem'}
                value={pageSize}
                onChange={onChangeItemsPerPage}
            />
        </>
    );
};

PaginationRow.propTypes = {
    total: PropTypes.number,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number), // [50, 100, 200] An array of page sizes the user can select from. Leave this prop undefined or use an empty array to hide "Rows per page" select button
    onChangePage: PropTypes.func, // (itemsPerPage: number) => void
    onChangeItemsPerPage: PropTypes.func, // (pageIndex: number) => void
};

const usePagination = (total, pagination = {}) =>
{
    const { pageSizeOptions = [10, 20, 50, 100, 200], onChangePage, onChangeItemsPerPage } = pagination;

    const [pageIndex, setPageIndex] = useState(pagination.pageIndex || 1);
    const [pageSize, setPageSize] = useState(pagination.pageSize || 10);

    useEffect(() =>
    {
        if (onChangeItemsPerPage)
        {
            onChangeItemsPerPage(pageSize);
        }
    }, [pageSize]);

    useEffect(() =>
    {
        if (onChangePage)
        {
            onChangePage(pageIndex);
        }
    }, [pageIndex]);

    const selectOptions = pageSizeOptions?.map((pageSize) => ({
        id: pageSize,
        label: `${pageSize} rows`,
    })) || [];

    const SelectPageSize = () => (
        <AdvanceSelect
            options={selectOptions}
            width={'200'}
            value={pageSize}
            onChange={setPageSize}
        />
    );

    const CurrentPaging = () => (
        <Paging
            total={total}
            pageSize={pageSize}
            currentPage={pageIndex}
            onChange={setPageIndex}
        />
    );

    const Row = () => (
        <div className={'pagination-row'}>
            <SelectPageSize />
            <CurrentPaging />
        </div>
    );

    const Pagination = { Select: SelectPageSize, Paging: CurrentPaging, Row };

    return [pageIndex, pageSize, Pagination];
};

export { PaginationRow, usePagination };
