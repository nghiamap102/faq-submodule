import './Paging.scss';

import React from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';

const LargeDataPaging = (props) =>
{
    const changePage = (page) =>
    {
        (page !== currentPage) && props.onChange && props.onChange(page);
    };

    const { currentPage, className, isLast } = props;

    return (
        <>
            <ul className={`pagination ${className}`}>
                <li className={currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => changePage(1)}>
                        <FAIcon
                            icon={'angle-double-left'}
                            size={'1.25rem'}
                        />
                    </a>
                </li>

                <li className={currentPage === 1 ? 'disabled' : ''}>
                    <a onClick={() => changePage(currentPage - 1)}>
                        <FAIcon
                            icon={'angle-left'}
                            size={'1.25rem'}
                        />
                    </a>
                </li>

                <li className={'active'}>
                    <span>{currentPage}</span>
                </li>

                <li className={isLast ? 'disabled' : ''}>
                    <a onClick={() => changePage(currentPage + 1)}>
                        <FAIcon
                            icon={'angle-right'}
                            size={'1.25rem'}
                        />
                    </a>
                </li>
            </ul>
        </>
    );
};

LargeDataPaging.propTypes = {
    className: PropTypes.string,
    currentPage: PropTypes.number,
    isLast: PropTypes.bool,
    onChange: PropTypes.func,
};

LargeDataPaging.defaultProps = {
    className: '',
    currentPage: 1,
    isLast: false,
};

export { LargeDataPaging };
