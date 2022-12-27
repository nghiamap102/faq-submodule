import './DataList.scss';
import { Column } from '@vbd/vui';
import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import {
    Container, Row, EmptyData, Expanded, SearchBox, Paging, Button,
} from '@vbd/vui';
import Loading from 'extends/ffms/pages/base/Loading';

const DataList = ({ items, searching, actionHeader, renderItem, loading, loadMore, pagination = {} }) =>
{
    const { pageSize: size, pageIndex: index, pageTotal: total, onChangePage } = pagination;

    useLayoutEffect(() =>
    {
        if (items)
        {
            if (items?.length === 0 && total > size)
            {
                const skip = (index - 1) * size;
                // total - skip <= size  ----> last page
                onChangePage(total - skip <= size ? index - 1 : index);
            }
        }

    }, [items]);

    const ListItem = ({ items, renderItem }) =>
    {
        return (
            <React.Fragment>
                {
                    items?.length > 0 && items.map((account) =>
                    {
                        return renderItem(account);
                    })
                }
            </React.Fragment>
        );
    };

    return (
        <>
            <Row crossAxisSize={'min'} itemMargin={'sm'}>
                {
                    searching &&
                   <SearchBox
                       placeholder={'Nhập từ khóa để tìm kiếm'}
                       value={searching.searchKey}
                       onChange={searching.onSearch}
                   />
                }

                {!searching && <Expanded flex={1}/>}

                {
                    actionHeader &&
                    <Container > {actionHeader} </Container>
                }
            </Row>

            <Container className={'data-list-container'}>
                <Column >

                    {(items?.length === 0 && total <= size) && <EmptyData />}

                    {loading?.isLoading && <Loading /> }

                    <ListItem
                        className={'data-list-container'}
                        items={items}
                        renderItem={renderItem}
                    />

                    {
                        loadMore?.isLoadMore &&
                        <Button
                            className={'btn-load-more'}
                            text={'Tải thêm'}
                            onClick={loadMore.onLoadMore}
                        />
                    }

                </Column>
            </Container>

            {
                pagination &&
                <Container className={'data-list-footer'}>
                    <Paging
                        total={pagination.pageTotal}
                        currentPage={pagination.pageIndex}
                        pageSize={pagination.pageSize}
                        onChange={pagination.onChangePage}
                    />
                </Container>
            }
        </>
    );
};

DataList.prototype = {
    className: PropTypes.string,

    // Data
    items: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.shape({
        // Infinite Scroll
        pageIndex: PropTypes.number,
        pageSize: PropTypes.number,
        pageTotal: PropTypes.number,
        onChangePage: PropTypes.func, // (itemsPerPage: number) => void
    }),

    loader: PropTypes.shape({
        isLoadMore: PropTypes.bool,
        onLoadMore: PropTypes.func,
    }),

    loading: PropTypes.shape({
        isLoading: PropTypes.bool,
        onRefresh: PropTypes.func,
    }),

    // Search feature
    searching: PropTypes.shape({
        searchKey: PropTypes.string,
        onSearch: PropTypes.func,
    }),

    actionHeader: PropTypes.element,
};


const AutoPagination = (props) =>
{
    return (
        <Paging
            total={props.total}
            currentPage={props.currentPage}
            pageSize={props.pageSize}
            onChange={props.onChange}
        />
    );
};
export default DataList;
