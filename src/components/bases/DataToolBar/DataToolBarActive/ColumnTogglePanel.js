import './ColumnTogglePanel.scss';

import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'components/bases/Input';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { Button } from 'components/bases/Button/Button';
import { ScrollView } from 'components/bases/ScrollView/ScrollView';

import { DataToolBarContext } from '../DataToolBarContext';

export const ColumnTogglePanel = (props) =>
{
    const { fields, defaultFields, primaryFields, fieldsShow, setFieldsShow, setVisibleActive } = useContext(DataToolBarContext);

    const [keyFilter, setKeyFilter] = useState('');
    const [listFiledProp, setListFiledProp] = useState(props.listFiledProp);

    useEffect(() =>
    {
        if (!keyFilter)
        {
            setListFiledProp(fields);
        }
        else
        {
            const listFieldFilter = fields.filter((f) => f.ColumnName.toUpperCase().includes(keyFilter.toUpperCase()));
            setListFiledProp(listFieldFilter);
        }
    }, [keyFilter]);

    const handleFieldCheck = (checked, field) =>
    {
        let fieldsShowUpdate = [...fieldsShow];

        if (checked)
        {
            fieldsShowUpdate.push(field.ColumnName);
        }
        else
        {
            fieldsShowUpdate = fieldsShowUpdate.filter((f) => f !== field.ColumnName);
        }

        setFieldsShow(fieldsShowUpdate);
    };

    const handleDefault = () =>
    {
        setFieldsShow(defaultFields);
    };

    const handleApply = () =>
    {
        props.onColumnToggle && props.onColumnToggle(fieldsShow);
        setVisibleActive(false);
    };

    const renderFieldItem = (field, isPrimary) =>
    {
        return (
            <CheckBox
                key={field.ColumnName}
                className={'column-toggle-item'}
                label={field.ColumnName}
                checked={fieldsShow.indexOf(field.ColumnName) !== -1}
                disabled={isPrimary}
                onChange={(isCheck) => handleFieldCheck(isCheck, field)}
            />
        );
    };

    const primField = fields.filter((field) => primaryFields.indexOf(field.ColumnName) !== -1);
    const normalField = listFiledProp.filter((field) => primaryFields.indexOf(field.ColumnName) === -1);

    return (
        <div className={'column-toggle-container'}>
            <div className={'column-toggle-body'}>
                <Input
                    className={'column-toggle-filter'}
                    placeholder={'Tìm kiếm thuộc tính'}
                    value={keyFilter}
                    onChange={setKeyFilter}
                />
                <div style={{ height: '400px' }}>
                    <ScrollView>
                        {primField.map((field) => renderFieldItem(field, true))}
                        {normalField.map((field) => renderFieldItem(field, false))}
                    </ScrollView>
                </div>
            </div>

            <div className={'column-toggle-footer'}>
                <Button
                    text={'Mặc định'}
                    onClick={handleDefault}
                />
                <Button
                    color={'primary'}
                    text={'Áp dụng'}
                    onClick={handleApply}
                />
            </div>
        </div>
    );
};

ColumnTogglePanel.propTypes = {
    onColumnToggle: PropTypes.func,
    listFiledProp: PropTypes.array,
};

ColumnTogglePanel.defaultProps = {
    listFiledProp: [],
};
