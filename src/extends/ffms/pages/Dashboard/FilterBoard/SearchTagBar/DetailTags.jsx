
import './WrapperTags.scss';

import React, { Fragment } from 'react';
import _ from 'lodash';
import WrapperTags from './WrapperTags';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';

const DetailTag = ()=>
{
    return (
        <WrapperTags
            className='detail-tag'
            isShowAll
            isBrief
        >
            {
                ({ data })=>
                {
                    return _.map(data, (item, index)=>(
                        <Fragment key={index}>
                            <PopperTooltip
                                placement="top"
                                trigger={['click', 'hover']}
                                tooltip={_.get(item,'description')}
                                tag="span"
                            >
                                {item.name}
                            </PopperTooltip>
                            {(index + 1) < _.size(data) && <span>, </span>}
                        </Fragment>
                    ));
                }
            }
        </WrapperTags>

    );
};

export default DetailTag;
