import './DataGrid.scss';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { T } from 'components/bases/Translate/Translate';
import { EmptyData } from 'components/bases/Data/EmptyData';
import { CheckBox } from 'components/bases/CheckBox/CheckBox';
import { Row2 } from 'components/bases/Layout/Row';
import { Loading } from 'components/bases/Modal/Loading';
import { createUniqueId } from 'utils/uniqueId';

import { DataGridToolbar } from './DataGridToolbar';
import { DataGridBottomBar } from './DataGridBottomBar';
import { DataGridCell } from './DataGridCell';
import { ResizeableHeader } from './ResizeableHeader';
import { DataGridSummaryCell } from './DataGridSummaryCell';

export const DataGrid = (props) =>
{
    const {
        columns,
        sorting,
        leadingControlColumns,
        trailingControlColumns,
        rowNumber,
        pagination,
        loading,
        summary,
        selectRows,
        onRowClick,
        onCellClick,
        onCellDoubleClick,

        // ADD
        onDataChanged,
        onColumnsVisibilityChanged,
        selectedRow,
        border,
        stripes,
    } = props;

    const [cols, setCols] = useState([]);
    const [hideCols, setHideCols] = useState(true);
    const [dragOver, setDragOver] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [bodyWidth, setBodyWidth] = useState('');

    const scrollRef = useRef();
    const numOfEditableFieldPerRowRef = useRef(0);
    const containerRef = useRef();
    const headerRef = useRef();

    const items = useMemo(() => Array.isArray(props.items) && props.items.map(item =>
    {
        const uniqueId = createUniqueId();
        let selected = true;

        if (selectedRow && Object.keys(selectedRow).length && item)
        {
            for (const key in selectedRow)
            {
                if (item[key] !== selectedRow[key])
                {
                    selected = false;
                    break;
                }
            }
        }
        else
        {
            selected = false;
        }

        return { ...item, uniqueId, selected };
    }) || [], [props.items, selectedRow]);

    let borderStyle = 'row--';
    switch (border)
    {
        case 'vertical':
            borderStyle += 'vertical-border';
            break;
        case 'horizontal':
            borderStyle += 'horizontal-border';
            break;
        case 'all':
            borderStyle += 'border';
            break;
        default:
            borderStyle = '';
    }

    useEffect(() =>
    {
        if (!columns || !columns.length)
        {
            return;
        }

        setCols(columns);
        countEditableFieldsPerRow(columns);

        const checkColumn = columns.find(col => !col.hidden);
        setHideCols(checkColumn);
        onColumnsVisibilityChanged && onColumnsVisibilityChanged(columns);
    }, [columns]);

    useEffect(() =>
    {
        if (headerRef.current && containerRef.current)
        {
            containerRef.current.scrollLeft = headerRef.current.scrollLeft;
        }
    }, [items]);

    useEffect(() =>
    {
        const columns = [...cols, ...leadingControlColumns || [], ...trailingControlColumns || [], ...autoNumberRows || [], ...checkboxHeaderControl || [] ];
        let tableWidth = columns.reduce((pre, cur) => !cur.hidden ? pre + (cur.width ?? 0) : pre , 0);
        if (containerRef.current)
        {
            const containerWidth = containerRef.current.clientWidth;
            if (containerWidth - tableWidth > 0)
            {
                const unsetWidthCols = props.columns.filter(col => !col.width && !col.hidden);
                if (unsetWidthCols.length > 0)
                {
                    const width = Math.max((containerWidth - tableWidth) / unsetWidthCols.length, 200);
                    unsetWidthCols.forEach(col => col.width = width);
                    tableWidth += width * unsetWidthCols.length;
                }
                else
                {
                    props.columns[props.columns.length - 1].width = (props.columns[props.columns.length - 1].width || 0) + (containerWidth - tableWidth);
                }
            }
        }
        setBodyWidth(tableWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cols]);

    const countEditableFieldsPerRow = (cols) =>
    {
        const filteredColumns = cols.filter(col => col.editable && !col.hidden);

        if (filteredColumns.length !== numOfEditableFieldPerRowRef.current)
        {
            numOfEditableFieldPerRowRef.current = filteredColumns.length;
        }
    };

    const handleResize = (index) => (e, { size }) =>
    {
        const nextCols = [...cols]; // clone
        nextCols[index] = {
            ...nextCols[index],
            width: size.width,
        };

        setCols(nextCols);
    };

    const handleDragStart = (e) =>
    {
        const { id } = e.target;
        const idx = cols.findIndex((i) => i.id === id);
        e.dataTransfer.setData('colIdx', idx);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDragEnter = (e) =>
    {
        const { id } = e.target;
        setDragOver(id);
    };

    const handleOnDrop = (e) =>
    {
        let { id } = e.target;
        if (!id)
        {
            id = e.target.parentNode.id; // fix element was dropped on resizable icon
        }

        const tempCols = [...cols];
        const draggedColIdx = parseInt(e.dataTransfer.getData('colIdx'));
        const cutOut = tempCols.splice(draggedColIdx, 1)[0]; // cut the element at index 'draggedColIdx'

        let droppedColIdx = parseInt(tempCols.findIndex((i) => i.id === id));

        // calculate new position of dragged element
        const rect = e.target.getBoundingClientRect();
        const isFirstHalf = e.clientX < rect.left + rect.width / 2;
        if (!isFirstHalf)
        {
            droppedColIdx += 1;
        }

        tempCols.splice(droppedColIdx, 0, cutOut); // insert it at index 'droppedColIdx'

        setCols(tempCols);
        setDragOver('');
    };

    function hideAllColumns()
    {
        setHideCols(false);
        setCols(cols?.map((col) =>
        {
            return { ...col, hidden: true };
        }));
    }

    function showAllColumns()
    {
        setHideCols(true);
        setCols(cols?.map((col) =>
        {
            return { ...col, hidden: false };
        }));
    }

    function defaultColumns()
    {
        setHideCols(true);
        setCols(columns?.map((col) =>
        {
            return { ...col };
        }));
    }

    function toggleColumnVisibility(id)
    {
        const newCols = cols?.map((col) =>
        {
            if (col.id === id)
            {
                return { ...col, hidden: !col.hidden };
            }
            return col;
        });

        setCols(newCols);
        countEditableFieldsPerRow(newCols);
        onColumnsVisibilityChanged && onColumnsVisibilityChanged(newCols);
    }

    const getPosition = (col) =>
    {
        const freezeArr = cols.filter(col => col.freeze);
        if (selectRows)
        {
            freezeArr.unshift({
                width: 50,
                id: 'auto_number_id',
            });
        }
        if (rowNumber)
        {
            freezeArr.unshift({
                width: 50,
                id: 'auto_checkbox_id',
            });
        }
        const index = freezeArr.findIndex(freeze => freeze.id === col.id);
        const arrCopy = [];
        for (let i = 0; i < index; i++)
        {
            arrCopy.push(freezeArr[i]);
        }
        const sum = 0;
        const left = arrCopy.reduce((pre, cur) => pre + cur.width, sum);

        return left;
    };

    const getCellStyle = (col) =>
    {
        let style = {};

        if (col.width)
        {
            if (col.freeze)
            {
                style = { flex: `0 0 ${col.width}px`, maxWidth: col.width, left: getPosition(col) };
            }
            else
            {
                style = { flex: `0 0 ${col.width}px`, maxWidth: col.width };
            }
        }
        else
        {
            style = { flex: 1, minWidth: '200px' };
        }

        if (col.minWidth)
        {
            style.minWidth = col.minWidth;
        }

        return style;
    };

    const HeaderItem = (col, index) =>
    {
        return (
            <div
                key={col.id || index}
                className={`dg-header-item ${col.freeze ? 'dg-freeze' : ''} ${col.freezeEnd ? 'dg-freeze-end' : ''} ${borderStyle || ''}`}
                style={getCellStyle(col)}
            >
                <div className={'dg-cell'}>
                    <T>{col.headerCellRender}</T>
                </div>
            </div>
        );
    };

    const CellItem = ({ row, col, index }) =>
    {
        return (
            <div
                key={col.id || index}
                className={`dg-row-item ${col.freeze ? 'dg-freeze' : ''} ${col.freezeEnd ? 'dg-freeze-end' : ''} ${borderStyle}`}
                style={getCellStyle(col)}
            >
                <div className={'dg-cell'}>
                    {col.rowCellRender(row, index)}
                </div>
            </div>
        );
    };

    const cellContentStyle = (col) =>
    {
        switch (col.textWrapping)
        {
            case 'nowrap':
                return { textOverflow: 'ellipsis', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden' };
            default:
                return {};
        }
    };

    const RenderNumberRows = ({ col, index, pageSize = 0, pageIndex = 0 }) =>
    {
        const startIndex = index + pageSize * pageIndex - pageSize;

        return (
            <div
                key={col.id || index}
                className={`dg-row-item ${col.freeze ? 'dg-freeze' : ''} ${borderStyle}`}
                style={getCellStyle(col)}
            >
                <div className={'dg-cell'}>
                    <span className={'auto-number'}>{startIndex + 1}</span>
                </div>
            </div>
        );
    };

    const handleSort = ({ id: sortingId, direction: sortingDirection }) =>
    {
        if (sorting)
        {
            if (sorting.isSingleSort)
            {
                sorting.onSort([{ id: sortingId, direction: sortingDirection }]);
                return;
            }

            let found = false;
            const columns = sorting.columns?.map(({ id, direction }) =>
            {
                if (id === sortingId)
                {
                    found = true;
                    return { id, direction: sortingDirection };
                }

                return { id, direction };
            }) || [];

            if (!found)
            {
                columns.push({ id: sortingId, direction: sortingDirection });
            }

            sorting.onSort(columns);
        }
    };

    const handleFilterChange = (filter) =>
    {
        if (props.filter)
        {
            const newFilters = (props.filter.conditions || []).filter((f) => f.columnName !== filter.columnName);
            newFilters.push(filter);

            props.filter.onChange && props.filter.onChange(newFilters);
        }
    };

    const handleScrollDown = () =>
    {
        if (
            !isLoading &&
            props.pagination?.useInfiniteScroll &&
            containerRef.current.scrollHeight - containerRef.current.scrollTop < 3 * containerRef.current.clientHeight
        )
        {
            // Load more when 2 view height left
            setIsLoading(true);

            const prm = props.pagination?.onChangePage && props.pagination.onChangePage(pagination?.pageIndex, true, () => setIsLoading(false));

            if (prm && prm.then)
            {
                prm.then(() =>
                {
                    setIsLoading(false);
                });
            }
        }
    };

    const handleScrollX = (event) =>
    {
        // if (!headerRef.current)
        // {
        //     return;
        // }
        // // headerRef.current.scrollLeft = event.scrollLeft;
        // const width = headerRef.current.clientWidth + event.scrollLeft;
        // setBodyWidth(width);

    };

    const handleDataChange = (id, value) =>
    {
        const [colId, uniqueId] = id.split('--');
        const updatedItem = { ...items.find((item) => item.uniqueId === uniqueId) };

        if (updatedItem && updatedItem[colId] !== value)
        {
            updatedItem[colId] = value;
            onDataChanged && onDataChanged(updatedItem);
        }
    };

    const autoNumberRows = [];
    if (rowNumber)
    {
        autoNumberRows.push({
            headerCellRender: 'STT',
            width: 50,
            id: 'auto_number_id',
            freeze: true,
        });
    }

    const checkboxHeaderControl = [];
    if (selectRows)
    {
        checkboxHeaderControl.push({
            width: 50,
            id: 'auto_checkbox_id',
            freeze: true,
        });
    }

    const CheckBoxHeaderItem = (col, index) =>
    {
        const selected = items?.filter(row => row.isSelected);

        return (
            <div
                key={col.id || index}
                className={`dg-header-item ${col.freeze ? 'dg-freeze' : ''}`}
                style={getCellStyle(col)}
            >
                <div className={'dg-cell check-cell'}>
                    <span>
                        <CheckBox
                            indeterminate={!!selected?.length && selected?.length < items?.length}
                            checked={!!selected?.length && selected?.length <= items?.length}
                            onChange={(event) => selectRows.onChangeAll?.(event, items)}
                        />
                    </span>
                </div>
            </div>
        );
    };

    const CheckBoxItem = ({ row, col, index }) =>
    {
        return (
            <div
                key={col.id || index}
                className={`dg-row-item ${col.freeze ? 'dg-freeze' : ''} ${borderStyle}`}
                style={getCellStyle(col)}
            >
                <div className={'dg-cell check-cell'}>
                    <CheckBox
                        checked={row.isSelected}
                        onChange={(event) => selectRows.onChange?.(event, row)}
                    />
                </div>
            </div>
        );
    };

    const handleSelect = (target) =>
    {
        const selectedRows = Array.from(document.querySelectorAll('.dg-row.selected-row'));
        selectedRows.map(element => element.classList.remove('selected-row'));

        target.classList.add('selected-row');
    };

    return (
        <div className={'data-grid-wrapper'}>
            <div className={'data-grid-content'}>
                {props.toolbarVisibility && (
                    <DataGridToolbar
                        {...props}
                        loading={loading}
                        cols={cols}
                        setCols={setCols}
                        hideAllColumns={hideAllColumns}
                        showAllColumns={showAllColumns}
                        defaultColumns={defaultColumns}
                        toggleColumnVisibility={toggleColumnVisibility}
                    />
                )}

                {props.header && <h1>{props.header}</h1>}

                <div
                    className={'data-grid-container'}
                    onClick={props.onClick}
                >
                    {
                        cols?.length > 0 && (
                            <div className={`data-grid ${props.className || ''}`}>


                                <ScrollView
                                    ref={scrollRef}
                                    containerRef={(ref) =>
                                    {
                                        containerRef.current = ref;
                                    }}
                                    onScrollDown={() => handleScrollDown()}
                                    onScrollX={handleScrollX}
                                >
                                    <div style={{ width: bodyWidth, position: 'relative' }}>
                                        <div
                                            className={'dg-header'}
                                        >
                                            {checkboxHeaderControl?.map(CheckBoxHeaderItem)}
                                            {autoNumberRows?.map(HeaderItem)}
                                            {leadingControlColumns?.map(HeaderItem)}

                                            {
                                                cols?.map((col, index) => !col.hidden && (
                                                    <ResizeableHeader
                                                        key={col.id}
                                                        width={col.width}
                                                        style={getCellStyle(col)}
                                                        sortDirection={sorting?.columns?.filter(({ id, direction }) => id === col.id)[0]?.direction}
                                                        isDraggable={false}
                                                        filter={props.filter}
                                                        isResizable={(index !== cols.length - 1)}
                                                        onDragStart={handleDragStart}
                                                        onDragOver={handleDragOver}
                                                        onResize={handleResize(index)}
                                                        onDrop={handleOnDrop}
                                                        onDragEnter={handleDragEnter}
                                                        onClick={handleSort}
                                                        onFilterChange={handleFilterChange}
                                                        {...col}
                                                    />
                                                ),
                                                    // isDraggable too buggy, disabled
                                                )
                                            }

                                            {trailingControlColumns?.map(HeaderItem)}
                                        </div>
                                        {
                                            loading && (
                                                <Row2 justify='center'>
                                                    <Loading />
                                                </Row2>
                                            )
                                        }
                                        {
                                            !loading && items?.length > 0 && (
                                                <div className={`dg-body ${stripes ? 'dg-body--stripes' : ''}`}>
                                                    {items.map((row, rowIndex) => (
                                                        <div
                                                            key={props.rowKey && row[props.rowKey] || rowIndex}
                                                            className={['dg-row', props.rowClassName && props.rowClassName(row, rowIndex), (row.selected) ? 'selected-row' : '', (onRowClick || onCellClick || onCellDoubleClick) ? 'selectable-row' : ''].join(' ')}
                                                            onClick={(e) =>
                                                            {
                                                                handleSelect(e.currentTarget);
                                                                typeof onRowClick === 'function' && onRowClick(event, row);
                                                            }}
                                                        >
                                                            {
                                                                checkboxHeaderControl?.map((col, index) => (
                                                                    <CheckBoxItem
                                                                        key={`${row[props.rowKey]}_${col.id}`}
                                                                        row={row}
                                                                        col={col}
                                                                        index={index}
                                                                    />
                                                                ))
                                                            }

                                                            {
                                                                autoNumberRows?.map((col) => (
                                                                    <RenderNumberRows
                                                                        key={`${row[props.rowKey]}_${col.id}`}
                                                                        col={col}
                                                                        index={rowIndex}
                                                                        pageSize={pagination?.pageSize}
                                                                        pageIndex={pagination?.pageIndex}
                                                                    />
                                                                ))
                                                            }

                                                            {
                                                                leadingControlColumns?.map((col, index) => (
                                                                    <CellItem
                                                                        key={`${row[props.rowKey]}_${col.id}`}
                                                                        row={row}
                                                                        col={col}
                                                                        index={index}
                                                                    />
                                                                ))
                                                            }

                                                            {
                                                                cols?.map((col, colIndex) =>
                                                                {
                                                                    const isSorting = sorting?.columns?.find(c => c.id === col.id)?.direction;
                                                                    const isFiltering = props?.filter?.conditions?.find(({ columnName }) => columnName === col.id);
                                                                    if (!col.hidden)
                                                                    {
                                                                        return (
                                                                            <div
                                                                                key={`${props.rowKey && row[props.rowKey] || rowIndex}_${col.id}`}
                                                                                className={clsx('dg-row-item', col.freeze && 'dg-freeze', col.freezeEnd && 'dg-freeze-end', isSorting && 'dg-row-sorting', isFiltering && 'dg-row-filtering', borderStyle)}
                                                                                style={getCellStyle(col)}
                                                                                onClick={(e) =>
                                                                                {
                                                                                    if (onCellClick)
                                                                                    {
                                                                                        e.stopPropagation();
                                                                                        onCellClick && onCellClick(e, row, col);
                                                                                    }

                                                                                    handleSelect(e.currentTarget.parentNode);
                                                                                }}
                                                                                onDoubleClick={(e) => onCellDoubleClick && onCellDoubleClick(e, row, col)}
                                                                            >
                                                                                <div
                                                                                    className={`dg-cell ${col.editable ? 'editable' : ''}`}
                                                                                    tabIndex={col.editable ? 1 : 0}
                                                                                >
                                                                                    {
                                                                                        row[col.id] !== undefined &&
                                                                                            (
                                                                                                props.cellRender
                                                                                                    ? props.cellRender(col, row, rowIndex)
                                                                                                    : (
                                                                                                            <DataGridCell
                                                                                                                id={col.id}
                                                                                                                definition={{ ...col, uniqueId: `${col.id}--${row.uniqueId}` }}
                                                                                                                content={row[col.id]}
                                                                                                                index={rowIndex}
                                                                                                                row={row}
                                                                                                                style={cellContentStyle(col)}
                                                                                                                editable={col.editable}
                                                                                                                getNumOfEditableFieldsPerRow={
                                                                                                                    () => numOfEditableFieldPerRowRef.current
                                                                                                                }
                                                                                                                onDataChanged={handleDataChange}
                                                                                                            />
                                                                                                        )
                                                                                            )
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                    else
                                                                    {
                                                                        return null;
                                                                    }
                                                                })
                                                            }

                                                            {
                                                                trailingControlColumns?.map((col, index) => (
                                                                    <CellItem
                                                                        key={index}
                                                                        row={row}
                                                                        col={col}
                                                                        index={index}
                                                                    />
                                                                ))
                                                            }
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        }

                                        {
                                            summary && items?.length > 0 && (
                                                <div
                                                    className={'dg-footer summary'}
                                                    style={summary.stick ? { position: 'sticky', top: 'unset', bottom: 0 } : { position: 'relative' }}
                                                >
                                                    {

                                                        [...checkboxHeaderControl || [],
                                                            ...autoNumberRows || [],
                                                            ...leadingControlColumns || [],
                                                            ...cols,
                                                            ...trailingControlColumns || [] ].map((col, index) => !col.hidden && (
                                                            <DataGridSummaryCell
                                                                key={col.id}
                                                                col={col}
                                                                items={items}
                                                                style={getCellStyle(col)}
                                                                className={clsx({
                                                                    'dg-freeze': col.freeze,
                                                                    'dg-freeze-end': col.freezeEnd,
                                                                })}
                                                            />
                                                        ))
                                                    }

                                                </div>
                                            )}
                                    </div>

                                </ScrollView>

                                {!loading && !items?.length && (
                                    <Row2 className="dg-empty">
                                        <EmptyData />
                                    </Row2>
                                )}
                            </div>
                        )}
                </div>

                {!props.hideBottomBar && (
                    <DataGridBottomBar
                        {...props}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    );
};

DataGrid.propTypes = {
    // Display
    className: PropTypes.string,
    header: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.shape({
        // Display
        width: PropTypes.number,
        hidden: PropTypes.bool,

        // Data
        id: PropTypes.string,
        displayAsText: PropTypes.string,
        display: PropTypes.node,
        schema: PropTypes.string,
        locale: PropTypes.string,
        format: PropTypes.string,
        // Feature
        isSortable: PropTypes.bool,
        defaultSortDirection: PropTypes.oneOf(['desc', 'asc']),
        isMiniStyle: PropTypes.bool,
        options: PropTypes.array,
    })),

    // Data
    items: PropTypes.arrayOf(PropTypes.object),
    pagination: PropTypes.shape({
        // Infinite Scroll
        useInfiniteScroll: PropTypes.bool,
        pageIndex: PropTypes.number,
        pageSize: PropTypes.number,
        pageSizeOptions: PropTypes.arrayOf(PropTypes.number), // [50, 100, 200] An array of page sizes the user can select from. Leave this prop undefined or use an empty array to hide "Rows per page" select button
        onChangePage: PropTypes.func, // (itemsPerPage: number) => void
        onChangeItemsPerPage: PropTypes.func, // (pageIndex: number) => void
    }),
    externalPaginationRow: PropTypes.bool,

    // Sorting feature
    total: PropTypes.number,
    sorting: PropTypes.shape({
        isSingleSort: PropTypes.bool,
        columns: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string,
                direction: PropTypes.string,
            }),
        ), // [{ id: 'C', direction: 'asc' }]
        onSort: PropTypes.func, // (columns: { id: string; direction: "asc" | "desc"; }[]) => void
    }),

    // Filter feature
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

    // Search feature
    searching: PropTypes.shape({
        searchKey: PropTypes.string,
        onSearch: PropTypes.func,
    }),

    rowKey: PropTypes.string,

    leadingControlColumns: PropTypes.array,
    trailingControlColumns: PropTypes.array,

    // plugin to show number column at first column, apply with paging as well
    rowNumber: PropTypes.bool,

    // plugin to have check column at first column
    selectRows: PropTypes.shape({
        onChange: PropTypes.func,
        onChangeAll: PropTypes.func,
    }),

    loading: PropTypes.bool,
    onReload: PropTypes.func,

    // Top bar
    toolbarVisibility: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            showColumnSelector: PropTypes.bool,
            showStyleSelector: PropTypes.bool,
            showSortSelector: PropTypes.bool,
            showFullScreenSelector: PropTypes.bool,
            showReloadButton: PropTypes.bool,
        }),
    ]),

    // Summary feature
    summary: PropTypes.shape({
        stick: PropTypes.bool,
    }),

    toolbarActions: PropTypes.node,
    onDataChanged: PropTypes.func,

    // Top bar Events
    onColumnsVisibilityChanged: PropTypes.func,

    selectedRow: PropTypes.object,

    border: PropTypes.oneOf(['none', 'horizontal', 'vertical', 'all']),
    stripes: PropTypes.bool,

    // Remove onSelect because it's duplicated with onCellClick
    onRowClick: PropTypes.func,
    onCellClick: PropTypes.func,
    onCellDoubleClick: PropTypes.func,

    hideBottomBar: PropTypes.bool,
};

DataGrid.defaultProps = {
    currentPage: 1,
    pageSize: 10,
    toolbarVisibility: true,
    rowNumber: false,
    loading: false,
    border: 'horizontal',
    stripes: false,
};

export default DataGrid;
