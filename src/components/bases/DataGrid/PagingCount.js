import './PagingCount.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { T } from 'components/bases/Translate/Translate';

class PagingCount extends Component
{
    render()
    {
        const { total, currentPage, pageSize } = this.props;
        const startIndex = 1 + pageSize * currentPage - pageSize;
        const endIndex = Math.min(total, pageSize * currentPage);

        return (
            <div className={'paging-count'}>
                {total > 0 && <T params={[startIndex, endIndex, total]}>%0% - %1% / %2%</T>}
            </div>
        );
    }
}

PagingCount.propTypes = {
    className: PropTypes.string,
    total: PropTypes.number,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
};

PagingCount.defaultProps = {
    className: '',
    total: 0,
    currentPage: 1,
    pageSize: 10,
};

export { PagingCount };
