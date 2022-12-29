import './DataSortPanel.scss';

import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Button, EmptyButton } from 'components/bases/Button/Button';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { TB1 } from 'components/bases/Text/Text';

import { DataToolBarContext } from '../DataToolBarContext';

export const DataSortPanel = (props) =>
{
    const { fields, fieldsShow, sortFields, setSortFields, isAutoSort, setAutoSort, setVisibleActive } = useContext(DataToolBarContext);

    const fieldOptions = fields.filter((f) => fieldsShow.includes(f.ColumnName)).map((field) => ({
        id: field.ColumnName,
        label: field.DisplayName,
        direction: 'Ascending',
    }));

    const fieldsObj = {};
    fieldOptions.forEach((field) =>
    {
        fieldsObj[field.id] = field;
    });

    const handleChooseField = (fieldId) =>
    {
        const newSortFields = [...sortFields, fieldsObj[fieldId]];

        setSortFields(newSortFields);

        if (isAutoSort)
        {
            props.onSort(newSortFields);
        }
    };

    const handleRemoveFieldSort = (fieldId) =>
    {
        const fieldsUpdate = sortFields.filter((sortField) => sortField.id !== fieldId);

        if (fieldsUpdate.length === 0)
        {
            props.onSort(fieldsUpdate);
        }
        setSortFields(fieldsUpdate);
    };

    const handleAddFieldSort = (curFieldObj, newFieldId, index) =>
    {
        if (curFieldObj.id !== newFieldId)
        {
            const sortFieldsUpdate = sortFields.map((field, fIndex) =>
            {
                if (index === fIndex)
                {
                    field = fieldsObj[newFieldId];
                }
                return field;
            });

            setSortFields(sortFieldsUpdate);

            if (isAutoSort)
            {
                props.onSort(sortFieldsUpdate);
            }
        }
    };

    const handleSortDirectionClick = (typeSort, index) =>
    {
        const newSortFields = [...sortFields];
        if (newSortFields[index].direction !== typeSort)
        {
            newSortFields[index].direction = typeSort;
            setSortFields(newSortFields);
        }

        if (isAutoSort)
        {
            props.onSort(sortFields);
        }
    };

    const handleCancel = () =>
    {
        setVisibleActive(false);
    };

    const handleApply = () =>
    {
        props.onSort(sortFields);

        setVisibleActive(false);
    };

    const handleCheckAuto = (value) =>
    {
        setAutoSort(value);

        if (value)
        {
            props.onSort(sortFields);
        }
    };

    const renderSortField = (fieldSort, index) =>
    {
        // build options that excluded selected sort
        const addSortOptions = fieldOptions.filter((field) => !sortFields.find((sf) => sf.id === field.id) || field.id === fieldSort.id);

        return (
            <div
                key={fieldSort.id}
                className={'data-sort-condition-item'}
            >
                <EmptyButton
                    icon={'times'}
                    iconSize='md'
                    iconColor={'var(--contrast-color)'}
                    onlyIcon
                    onClick={() => handleRemoveFieldSort(fieldSort.id)}
                />

                <TB1 style={{ minWidth: '50px' }}>{index === 0 ? 'Sắp xếp' : 'sau đó'}</TB1>

                <AdvanceSelect
                    options={addSortOptions}
                    value={fieldSort?.id}
                    onChange={(id) => handleAddFieldSort(fieldSort, id, index)}
                />

                <TB1>theo</TB1>

                <div className={'data-sort-action-group'}>
                    <Button
                        text={'Tăng dần'}
                        className={fieldSort?.direction === 'Ascending' ? 'active' : ''}
                        onClick={() => handleSortDirectionClick('Ascending', index)}
                    />
                    <Button
                        className={fieldSort?.direction === 'Descending' ? 'active' : ''}
                        text={'Giảm dần'}
                        onClick={() => handleSortDirectionClick('Descending', index)}
                    />
                </div>
            </div>
        );
    };

    const addSortOptions = fieldOptions.filter((field) => !sortFields.find((sf) => sf.id === field.id));

    return (
        <div className={'data-sort-container'}>
            <div className={'data-sort-condition-content'}>
                {
                    sortFields?.length === 0
                        ? (
                                <TB1 style={{ color: 'gray' }}>
                            Chưa có sắp xếp nào được áp dụng
                                </TB1>
                            )

                        : (
                                <div className={'data-sort-condition-item-container'}>
                                    {sortFields.map(renderSortField)}
                                </div>
                            )
                }
            </div>

            <div className={'data-sort-add-condition'}>
                <AdvanceSelect
                    options={addSortOptions}
                    disabled={addSortOptions.length === 0}
                    placeholder={'Chọn thuộc tính để sắp xếp'}
                    onChange={handleChooseField}
                />

                {
                    sortFields?.length > 0 && !isAutoSort && (
                        <div className={'data-sort-action-button'}>
                            <EmptyButton
                                text={'Hủy bỏ'}
                                onClick={handleCancel}
                            />
                            <EmptyButton
                                color={'primary'}
                                text={'Áp dụng'}
                                onClick={handleApply}
                            />
                        </div>
                    )}
            </div>

            {
                sortFields?.length > 0 && (
                    <div className={'data-sort-footer'}>
                        <CheckBox
                            label="Tự động"
                            checked={isAutoSort}
                            onChange={handleCheckAuto}
                        />
                    </div>
                )}

        </div>
    );
};

DataSortPanel.propTypes = {
    fields: PropTypes.array,
    onSort: PropTypes.func,
};

DataSortPanel.defaultProps = {
    fields: [],
};
