import React from 'react';
import { PropTypes } from 'prop-types';

import { Row2 } from 'components/bases/Layout/Row';
import { PaginationRow } from 'components/bases/DataGrid/PaginationRow';
import { PagingCount } from 'components/bases/DataGrid/PagingCount';
import { Spacer } from 'components/bases/Spacer/Spacer';
import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

const DataGridBottomBar = (props) =>
{
    const { total = props.items?.length, pagination, externalPaginationRow } = props;

    if (!pagination)
    {
        return <></>;
    }

    return (
        <div className={'toolbar'}>
            <Row2
                justify='end'
                items='center'
                gap={2}
                sx={{ p: 2 }}
            >
                {props.isLoading && (
                    <>
                        <T>Loading</T>
                        <FAIcon
                            icon={'spinner'}
                            size={'1rem'}
                            spin
                        />
                    </>
                )}
                {!pagination?.useInfiniteScroll && (
                    <>
                        <PagingCount
                            total={total}
                            pageSize={pagination?.pageSize}
                            currentPage={pagination?.pageIndex}
                        />
                        {pagination && !externalPaginationRow && (
                            <>
                                <Spacer
                                    style={{ marginLeft: 'auto' }}
                                    size={'1.5rem'}
                                />
                                <PaginationRow
                                    total={total}
                                    {...pagination}
                                />
                            </>
                        )}
                    </>
                )
                }
            </Row2>
        </div>
    );
};

DataGridBottomBar.propTypes = {
    isLoading: PropTypes.bool,
};

export { DataGridBottomBar };
