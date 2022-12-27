import './FilterBar.scss';

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';
import { PopOver } from '@vbd/vui';
import { T } from '@vbd/vui';
import _ from 'lodash';

const FilterBar = ({ children })=>
{
    const [visibleActive, setVisibleActive] = useState(false);
    const [index, setIndex] = useState(-1);
    const $containerRef = useRef(null);
    children = _.isArray(children) ? children : [children];

    const handleChangeItem = (index)=>()=>
    {
        setIndex(index);
        setVisibleActive(true);
    };
    return (
        <div
            ref={$containerRef}
            className='container-filter-bar'
        >
            <div className={'filter-header-actions'}>
                {
                    children.map((child, index) =>
                        <button
                            key={child.props.icon}
                            onClick={_.isFunction(child.props.onClick) ? child.props.onClick : handleChangeItem(index)}
                            className={child.props.className}
                        >
                            <FAIcon
                                icon={child.props.icon}
                                size={'1rem'}
                                type={'light'}
                            />
                            <span><T>{child.props.title}</T></span>
                        </button>
                    )
                }
            </div>
            {index > -1 && _.get(children[index],'props.isPopover', true) && visibleActive && (
                <PopOver
                    anchorEl={$containerRef}
                    onBackgroundClick={() => setVisibleActive(false)}
                >
                    {children[index]}
                </PopOver>
            )}
        </div>
    );
};

FilterBar.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    isPopover: PropTypes.bool
};

export default FilterBar;