import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { Row2 } from 'components/bases/Layout/Row';
import { SearchBox } from 'components/bases/Input/SearchBox';
import { Button } from 'components/bases/Button/Button';
import { PopOver } from 'components/bases/Modal/PopOver';
import { ColumnSelector } from 'components/bases/DataGrid/ColumnSelector';

export const DataGridToolbar = (props) =>
{
    // const { showFullScreenSelector, showSortSelector, showStyleSelector } = props.toolbarVisibility;
    const { cols, setCols, toolbarActions = [], toolbarVisibility } = props;

    const [columnSelectorVisibility, setColumnSelectorVisibility] = useState(false);
    const columnSelectorButtonRef = useRef();

    const [searchValue, setSearchValue] = useState(props.searching?.searchKey);

    const searchDebounce = AwesomeDebouncePromise((value) => props.searching.onSearch(value), 200);

    const handleSearch = (value) =>
    {
        setSearchValue(value);
        props.searching?.onSearch && searchDebounce(value);
    };

    if (!toolbarVisibility && !toolbarActions)
    {
        return <></>;
    }

    if (typeof toolbarVisibility === 'object' || toolbarActions)
    {
        return (
            <div className={'toolbar'}>
                <Row2>
                    <Row2
                        gap={2}
                        sx={{ p: 2 }}
                    >
                        {props.toolbarVisibility?.showColumnSelector && (
                            <Button
                                innerRef={columnSelectorButtonRef}
                                tooltip={'Cột hiển thị'}
                                icon={'line-columns'}
                                onlyIcon
                                onClick={() => setColumnSelectorVisibility(!columnSelectorVisibility)}
                            />
                        )}

                        {columnSelectorVisibility && (
                            <PopOver
                                anchorEl={columnSelectorButtonRef}
                                onBackgroundClick={() => setColumnSelectorVisibility(!columnSelectorVisibility)}
                            >
                                <DndProvider backend={HTML5Backend}>
                                    <ColumnSelector
                                        columns={cols}
                                        setColumns={setCols}
                                        hideAllColumns={props.hideAllColumns}
                                        showAllColumns={props.showAllColumns}
                                        defaultColumns={props.defaultColumns}
                                        onClick={props.toggleColumnVisibility}
                                    />
                                </DndProvider>
                            </PopOver>
                        )}

                        {props.toolbarVisibility?.showReloadButton && (
                            <Button
                                icon={'redo-alt'}
                                tooltip={'Tải lại danh sách'}
                                isLoading={props.loading}
                                onlyIcon
                                onClick={props.onReload}
                            />
                        )}

                        {toolbarActions}
                    </Row2>

                    {props.searching && (
                        <Row2
                            panel={false}
                            gap={2}
                            sx={{ p: 2 }}
                        >
                            <SearchBox
                                width={'18rem'}
                                placeholder="Nhập từ khóa để tìm kiếm"
                                value={searchValue}
                                onChange={handleSearch}
                            />
                        </Row2>
                    )}
                </Row2>
            </div>
        );
    }
};

DataGridToolbar.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    searching: PropTypes.object,
    loading: PropTypes.bool,

    cols: PropTypes.array,
    setCols: PropTypes.func,

    // not implement yet - nice to have
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
    toggleColumnVisibility: PropTypes.func,

    // Button click handler
    defaultColumns: PropTypes.func,
    hideAllColumns: PropTypes.func,
    showAllColumns: PropTypes.func,

    // ADD
    toolbarActions: PropTypes.node,
};

export default DataGridToolbar;
