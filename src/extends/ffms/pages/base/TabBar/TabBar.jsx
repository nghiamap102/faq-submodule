import './TabBar.scss';

import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';

import { T } from '@vbd/vui';

import Tab from './Tab';

const TabBar = (props) =>
{
    const { tabs, flexHeader, onChange, title, defaultIndex, disabled } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() =>
    {
        setActiveIndex(defaultIndex);
    }, [defaultIndex]);
    const onChildClick = (id) =>
    {
        setActiveIndex(id);
        onChange(id);
    };
    return (
        <div className={`tab-control ${props.className}`}>
            <div className={'tab-header-wrap group-by'}>
                <div className={'tab-header'}>
                    { title && <div style={{ paddingRight: '10px' }}><T>{title}</T></div>}
                    {
                        _.map(tabs, (child) =>
                            <Tab
                                key={child.id}
                                title={child.title}
                                flex={flexHeader}
                                active={child.id === activeIndex}
                                onClick={() => !disabled && onChildClick(child.id)}
                                {...child}
                            />,
                        )
                    }
                </div>
            </div>
        </div>
    );

};
TabBar.propTypes = {
    title: PropTypes.string,
    defaultIndex: PropTypes.any,
    flexHeader: PropTypes.bool,
    tabs: PropTypes.array,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
};
export default TabBar;
