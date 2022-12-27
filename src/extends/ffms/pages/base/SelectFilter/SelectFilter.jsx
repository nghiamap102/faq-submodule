import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Container, AdvanceSelect, CheckBox, FormControlLabel } from '@vbd/vui';

import { DATA_TYPE } from 'helper/data.helper';

import DateRangePicker from 'extends/ffms/pages/base/DateRangePicker';
import ClearableInputFilter from 'extends/ffms/pages/base/SelectFilter/ClearableInputFilter';

const SelectFilter = React.forwardRef(({ multi = false, options, placeholder, label, defaultValue, onChange, name, hasSearch, customDefault, block, isCustom, searchMode, remote, selectedOptions, type, clearable }, ref) =>
{
    const [customValue, setCustomValue] = useState(customDefault);
    const [data, setData] = useState({
        options,
        value: defaultValue,
        searchKey: '*',
    });
    const prevQuery = useRef();

    const handleChange = (name) => (obj) =>
    {
        if (_.isEqual(obj, ''))
        {
            return;
        }
        
        let tmp;
       
        if (_.isArray(obj))
        {
            tmp = _.size(obj) == 0 ? null : obj;
        }
        else
        {
            tmp = (multi && obj != null) ? [obj] : obj;
        }
        const selected = [];
        _.forEach(_.isArray(tmp) ? tmp : [tmp],element =>
        {
            let sel = _.find(data.options, opt=> opt.id == element);
            if (!sel)
            {
                sel = _.find(selectedOptions, opt=> opt.id == element);
            }
            sel && selected.push(sel);
        });

        setData({ ...data, value: tmp });

        // Send data to OnChange
        _.isFunction(onChange) && obj !== '' && onChange({ name, value: tmp, custom: null, selected, searchKey: data?.searchKey });
        
    };

    const handleCustomChange = (name) => ({ date }) =>
    {
        setCustomValue(date);
        _.isFunction(onChange) && onChange({ name, value: data.value, custom: date });
    };

    useEffect(() =>
    {
        if (searchMode)
        {
            getRemote();
        }
        else
        {
            setData({
                options,
                value: defaultValue,
            });
        }
    }, [options, defaultValue]);

    if (_.isNull(options))
    {
        return <Container>Loading...</Container>;
    }

    const handleSearch = _.debounce(async (searchTerm)=>
    {
        getRemote(searchTerm);
    }, 600);

    const getRemote = async (searchTerm)=>
    {
        const { service, model, params, item } = remote;

        searchTerm = searchTerm ?? item?.searchKey ?? '';
        const conditionBinding = {};
        item?.conditionBindingKey && Object.entries(item.conditionBindingKey).forEach(
            ([key, value]) => conditionBinding[key] = _.isArray(value) ? { inq: _.map(value, 'key') } : value,
        );
        const query = { ...params, ...conditionBinding, searchKey: `${searchTerm}`, order: `${item?.display || item?.field || 'Title'} ASC` };
        if (!_.isEqual(query, prevQuery.current))
        {
            prevQuery.current = query;
            const results = await service(model, query);
            const newOptions = results?.data.map(element=>
            {
                return { ..._.pick(element,element?.bindingFields), id: element[item?.field], label: element[item?.display] ?? element[item?.field] };
            });
            setData({ ...data, value: defaultValue, options: _.values(newOptions), searchKey: query.searchKey });
        }
        else
        {
            setData({
                options,
                value: defaultValue,
            });
        }
    };
    const handleInput = _.debounce(async (value)=>
    {
        _.isFunction(onChange) && onChange({ name, value: value, custom: null, selected: [{ id: value, label: value }] });
    },600);

    const handleCheckbox = (id, value, type)=>
    {
        let val = data.value ?? [];
        val = (type == 'radio' || multi == false) ? [] : _.filter(val, item=>item != id);
        if (value)
        {
            val.push(id);
        }
        const selected = [];
        _.forEach(val,element =>
        {
            selected.push({ id: element, label: element });
        });

        setData({ ...data,value: val });
        _.isFunction(onChange) && onChange({ name, value: _.size(val) > 0 ? val : null, custom: null, selected });
    };

    const getControl = (type)=>
    {
        switch (_.toUpper(type))
        {
            case _.toUpper('checkbox') || _.toUpper('radio'):
                return (
                    <div>
                        {
                            _.map(data.options, item => (
                                <CheckBox
                                    displayAs={type}
                                    label={item.label}
                                    checked={_.includes(data.value, item.id)}
                                    checkBoxSize="1rem"
                                    onChange={(value) => handleCheckbox(item.id, value, type)}
                                />
                            ))
                        }
                    </div>
                );
            case (_.toUpper('text') || _.toUpper('number') || _.toUpper('range')):
                return (
                    <ClearableInputFilter
                        className={'form-control'}
                        placeholder={'Nhập giá trị'}
                        value={data.value}
                        type={type}
                        clearable
                        onChange={handleInput}
                    />);
            default:
                return (
                    <AdvanceSelect
                        isVisible={data.isVisible}
                        multi={multi}
                        ref={ref}
                        placeholder={placeholder}
                        options={data.options}
                        selectedOptions={selectedOptions}
                        value={data.value}
                        defaultValue={defaultValue}
                        onChange={handleChange(name)}
                        hasSearch={hasSearch}
                        searchMode={searchMode}
                        onRemoteFetch={handleSearch}
                        clearable={clearable}
                    />);
        }
    };

    return (
        <>
            {
                !isCustom &&
                <FormControlLabel
                    label={label}
                    control={
                        getControl(type)
                    }
                />
            }
            {
                data.value == 'Custom' &&
                <DateRangePicker
                    block={block}
                    defaultValue={customValue}
                    onChange={handleCustomChange('custom')}
                />
            }
        </>
    );
});


SelectFilter.defaultProps = {
    block: false,
    isCustom: false,
    type: DATA_TYPE.array,
};

export default SelectFilter;
