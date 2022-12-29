import './Paging.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';

class Paging extends Component
{
    getPager = (totalItems, currentPage = 1, _pageSize = 10) =>
    {
        // calculate total pages
        const totalPages = _pageSize <= 0 ? 1 : Math.ceil(totalItems / _pageSize);
        let startPage, endPage;

        if (totalPages <= 3)
        {
            startPage = 1;
            endPage = totalPages;
        }
        else
        {
            if (currentPage <= 2)
            {
                startPage = 1;
                endPage = 3;
            }
            else if (currentPage + 1 >= totalPages)
            {
                startPage = totalPages - 2;
                endPage = totalPages;
            }
            else
            {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * _pageSize;
        const endIndex = Math.min(startIndex + _pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        const pages = [];
        for (let i = startPage; i < endPage + 1; i++)
        {
            pages.push(i);
        }

        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: _pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages,
        };
    };

    changePage = (page, isChange) =>
    {
        if (isChange && typeof this.props.onChange === 'function')
        {
            this.props.onChange(page);
        }
    };

    render()
    {
        const { total, currentPage, pageSize } = this.props;
        const pager = this.getPager(total, currentPage, pageSize);

        return (
            <>
                {
                    pager && pager.pages && pager.pages.length > 0 && (
                        <ul className={`pagination ${this.props.className}`}>
                            {this.props.showFirstLast && (
                                <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                                    <a onClick={() => this.changePage(1, pager.currentPage !== 1)}>
                                        <FAIcon
                                            icon={'angle-double-left'}
                                            size={'0.875rem'}
                                        />
                                    </a>
                                </li>
                            )}

                            <li className={pager.currentPage === 1 ? 'disabled' : ''}>
                                <a onClick={() => this.changePage(pager.currentPage - 1, pager.currentPage !== 1)}>
                                    <FAIcon
                                        icon={'angle-left'}
                                        size={'0.875rem'}
                                    />
                                </a>
                            </li>

                            {pager.pages.map((p, index) => (
                                <li
                                    key={index}
                                    className={pager.currentPage === p ? 'active' : ''}
                                >
                                    <a onClick={() => this.changePage(p, true)}>{p}</a>
                                </li>
                            ))}

                            <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                                <a onClick={() => this.changePage(pager.currentPage + 1, pager.currentPage !== pager.totalPages)}>
                                    <FAIcon
                                        icon={'angle-right'}
                                        size={'0.875rem'}
                                    />
                                </a>
                            </li>

                            {this.props.showFirstLast && (
                                <li className={pager.currentPage === pager.totalPages ? 'disabled' : ''}>
                                    <a onClick={() => this.changePage(pager.totalPages, pager.currentPage !== pager.totalPages)}>
                                        <FAIcon
                                            icon={'angle-double-right'}
                                            size={'0.875rem'}
                                        />
                                    </a>
                                </li>
                            )}
                        </ul>
                    )
                }
            </>
        );
    }
}

Paging.propTypes = {
    className: PropTypes.string,
    total: PropTypes.number,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    showFirstLast: PropTypes.bool,
    onChange: PropTypes.func,
};

Paging.defaultProps = {
    className: '',
    total: 0,
    currentPage: 1,
    pageSize: 10,
    showFirstLast: true,
    onChange: () =>
    {
    },
};

export { Paging };
