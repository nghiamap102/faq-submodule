import PropTypes from 'prop-types';
import './FilterTags.scss';
import React from 'react';
import * as _ from 'lodash';
import { T, Tag } from '@vbd/vui';

const FilterTags = (props) =>
{
    const { data, onChange, title } = props;
    const onRemove = (item, index)=>
    {
        onChange({ ...item, checked: false, index });
    };
    return (
        <div className={'search-tag-bar'}>
            {_.size(data) > 0 && <span><T>{title}</T></span>}
            <div>
                {
                    _.map(data, (item,index) =>(
                        <Tag
                            key={item.key}
                            text={item.label}
                            onCloseClick={() =>
                            {
                                onRemove(item, index);
                            }}
                            {...props}
                        />
                    ))
                }
            </div>
        </div>
    );
};

FilterTags.propTypes = {
    data: PropTypes.any,
    onChange: PropTypes.func,
    title: PropTypes.string,
};

export default FilterTags;
