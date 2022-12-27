import 'extends/ffms/pages/base/base.scss';
import './SelectionCard.scss';
import React, { useState } from 'react';
import * as _ from 'lodash';
import { Sub1 } from '@vbd/vui';
import SelectionItem from 'extends/ffms/pages/base/SelectionItem';

const SelectionCard = (props) =>
{
    const { title, data, hasBorder } = props;
    const [multiCheck, setMultiCheck] = useState(props.multiCheck ?? false);
    const [hasCheckbox, setHasCheckbox] = useState(props.hasCheckbox ?? false);

    const onClick = (item) =>
    {
        if (_.isFunction(props.onClick))
        {
            props.onClick(item);
        }
    };

    return (
        <div className={`selection-card ${hasBorder ? 'border' : '' }`} >
            <Sub1>{title}</Sub1>
            {
                _.map(data, item => <SelectionItem
                    key={item.key}
                    text={item.name}
                    checked={item.checked}
                    hasCheckbox={hasCheckbox}
                    id={item.id}
                    onClick={onClick}
                    {...item}
                />)
            }
        </div>
    );
};

export default SelectionCard;
