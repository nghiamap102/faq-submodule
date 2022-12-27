import './WrapperTags.scss';

import React, { Fragment } from 'react';

import { PopperTooltip } from '@vbd/vui';

import WrapperTags from './WrapperTags';

const DetailTag = () =>
{
    return (
        <WrapperTags
            className="detail-tag"
            isShowAll
            isBrief
        >
            {({ data }) =>
            {
                return data?.map((item, index) => (
                    <Fragment key={index}>
                        <PopperTooltip
                            placement="top"
                            trigger={['click', 'hover']}
                            tooltip={item.description}
                            tag="span"
                        >
                            {item.name}
                        </PopperTooltip>
                        {(index + 1) < data.length && <span>, </span>}
                    </Fragment>
                ));
            }}
        </WrapperTags>
    );
};

export default DetailTag;
