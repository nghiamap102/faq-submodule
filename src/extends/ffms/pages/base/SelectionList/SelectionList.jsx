import 'extends/ffms/pages/base/base.scss';
import PropTypes from 'prop-types';
import './SelectionList.scss';
import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';
import SelectionItem from 'extends/ffms/pages/base/SelectionItem';
import { Sub1 } from '@vbd/vui';

const SelectionList = (props) =>
{
    const { title, data, hasBorder, hasCheckbox, borderBottom, multiCheck, defaultValue, cols } = props;
    const [values, setValues] = useState(data);
    useEffect(() =>
    {
        _.forEach(data, element =>
        {
            element['checked'] = _.includes(defaultValue, element?.id);
        });
        setValues(_.cloneDeep(data));
    }, [data]);

    const onClick = (item) =>
    {
        _.forEach(values, element=>
        {
            if (element.id === item.id)
            {
                element['checked'] = item.checked;
            }
            else
            {
                if (!multiCheck)
                {
                    element['checked'] = false;
                }
            }
        });
        if (_.isFunction(props.onClick))
        {
            props.onClick(_.filter(values, element => element.checked));
        }
    };

    return (
        <div className={`selection-list ${hasBorder ? 'border' : '' }`} >
            <Sub1>{title}</Sub1>
            {
                _.map(values, item => (
                    <SelectionItem
                        key={item.key ?? item.id}
                        text={item.name ?? item.label}
                        checked={item.checked}
                        hasCheckbox={hasCheckbox}
                        id={item.id}
                        onClick={onClick}
                        borderBottom={borderBottom}
                        {...item}
                        style={{ width: `calc(${100 / cols}% - 1rem)` }}
                    />),
                )
            }
        </div>
    );
};
SelectionList.propTypes = {
    title: PropTypes.string,
    data: PropTypes.any,
    hasBorder: PropTypes.bool,
    hasCheckbox: PropTypes.bool,
    multiCheck: PropTypes.bool,
    onClick: PropTypes.func,
    defaultValue: PropTypes.array,
    borderBottom: PropTypes.bool,
    cols: PropTypes.number,
};
SelectionList.defaultProps = {
    hasBorder: false,
    borderBottom: false,
    multiCheck: true,
    cols: 1,
};

export default SelectionList;
