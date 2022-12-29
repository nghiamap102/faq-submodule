import React, { useEffect, useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
import PropTypes from 'prop-types';

import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';
import { FilterInput } from 'components/bases/DataToolBar/DataToolBarActive/FilterInput';
import { PopOver } from 'components/bases/Modal/PopOver';
import { IconButton } from 'components/bases/Button/Button';
import { Box } from 'components/bases/Layout/Box';
import { Flex } from 'components/bases/Layout/Flex';
import { Tag } from 'components/bases/Tag/Tag';

import { SCHEMAS, getDataType, isFilterActive } from 'helper/data.helper';

const ResizeableHeader = (props) =>
{
    const {
        id,
        width,
        displayAsText,
        schema,
        style,
        isResizable,
        onResize,
        isDraggable,
        display,
        defaultSortDirection,
        isSortable,
        sortDirection,
        onClick,
        // Filter props
        filter,
        onFilterChange,

        freeze,
        freezeEnd,
        options,
    } = props;

    const filterButtonRef = useRef();
    const [isOpeningFilterPopover, setOpeningFilterPopover] = useState(false);
    const [resizing, setResizing] = useState(false);

    // ADD
    useEffect(() =>
    {
        defaultSortDirection && onClick({ id, direction: defaultSortDirection });
    }, []);

    const cond = filter && filter.conditions.find((f) => f.columnName === id);

    const mappedOptions = (schema && getDataType(schema) === 10)
        ? options?.map((option) => ({
            Display: option.color
                ? (
                        <Tag
                            text={option.label}
                            color={option.color}
                            textStyle={{ color: option.textColor }}
                            isRound
                        />
                    )
                : option.label
            , Value: option.id,
        }))
        : null;

    const mappedFilter = {
        ...cond,
        columnName: id || '',
        dataType: getDataType(schema === 'select' && (!mappedOptions || (mappedOptions && !mappedOptions.length)) ? 'text' : schema),
    };


    const MAPPED_SORT_ICONS = {
        asc: 'arrow-up',
        desc: 'arrow-down',
    };

    const plainHeader = (
        <div
            className={`dg-header-item ${freeze ? 'dg-freeze' : ''} ${freezeEnd ? 'dg-freeze-end' : ''} ${isSortable ? 'dg-header-sort' : ''} ${sortDirection ? 'dg-header-sorting' : ''}`}
            style={{
                ...style,
                // cursor: `${isDraggable ? 'move' : 'default'}`,
                // userSelect: `${isDraggable ? 'auto' : 'none'}`
            }}
        >
            <div
                className={'dg-cell'}
                onClick={() => isSortable && onClick({ id, direction: changeSortDirection(sortDirection) })}
            >
                <Box>
                    <T>{display || displayAsText}</T>
                    {
                        MAPPED_SORT_ICONS[sortDirection] && (isSortable || defaultSortDirection) && (
                            <FAIcon
                                icon={MAPPED_SORT_ICONS[sortDirection]}
                                type={'solid'}
                                size={'1rem'}
                                className={'dg-header-sort-icon'}
                            />
                        )}
                </Box>
                <Flex
                    shrink={0}
                    item
                >
                    {
                        filter && (
                            <div
                                ref={filterButtonRef}
                                className={`cell-filter-icon ${isFilterActive(cond) ? 'active' : 'inactive'}`}
                            >
                                <IconButton
                                    icon='filter'
                                    iconType='solid'
                                    size="xs"
                                    iconSize='sm'
                                    color={`${isFilterActive(cond) ? 'primary' : 'default'}`}
                                    variant='empty'
                                    isRound
                                    onClick={(e) =>
                                    {
                                        e.stopPropagation();
                                        setOpeningFilterPopover(true);
                                    }}
                                />
                            </div>
                        )}
                </Flex>
            </div>

            {
                isOpeningFilterPopover && (
                    <PopOver
                        anchorEl={filterButtonRef}
                        onBackgroundClick={() => setOpeningFilterPopover(false)}
                    >
                        <FilterInput
                            filter={mappedFilter}
                            config={mappedOptions}
                            isStandalone
                            showVertical
                            clearable
                            isChangedOnConfirm
                            onFilterChange={onFilterChange}
                        />
                    </PopOver>
                )
            }
        </div>
    );

    function changeSortDirection(direction)
    {
        switch (direction)
        {
            case 'asc':
                return 'desc';
            case 'desc':
                return undefined;
            default:
                return 'asc';
        }
    }

    if (!isResizable)
    {
        return plainHeader;
    }

    return (
        <Resizable
            width={width}
            height={0}
            draggable={isDraggable && !resizing}
            onResizeStart={() => setResizing(true)}
            onResizeStop={() => setResizing(false)}
            onResize={onResize}
        >
            {plainHeader}
        </Resizable>
    );
};

ResizeableHeader.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    displayAsText: PropTypes.string,
    isResizable: PropTypes.bool,
    isDraggable: PropTypes.bool,
    width: PropTypes.number,
    format: PropTypes.string, // use ### for numbers, ISO format for date time
    schema: PropTypes.oneOf(SCHEMAS), // A Schema to use for the column. Can be expanded by defining your own
    locale: PropTypes.oneOf(['vi']),
    display: PropTypes.node, // A ReactNode used when rendering the column header. When providing complicated content, please make sure to utilize CSS to respect truncation as space allows.
    onClick: PropTypes.func,
    onResize: PropTypes.func,

    // Sorting
    isSortable: PropTypes.bool,
    defaultSortDirection: PropTypes.oneOf(['asc', 'desc']),
    sortDirection: PropTypes.oneOf(['asc', 'desc']),

    // Filters
    filter: PropTypes.shape({
        conditions: PropTypes.arrayOf(
            PropTypes.shape({
                operator: PropTypes.string,
                value: PropTypes.any,
                options: PropTypes.array, // select: [{id, label, color}]
            }),
        ),
        onChange: PropTypes.func,
    }),

    onFilterChange: PropTypes.func,

    // not implement yet but nice to have
    isExpandable: PropTypes.bool, // Defaults to true. Defines whether or not the column's cells can be expanded with a popup onClick / keydown.
};

ResizeableHeader.defaultProps = {
    isResizable: true,
    isDraggable: true,
    width: 50,
};

export { ResizeableHeader };
