import './TreeSelect.scss';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ScrollView } from 'components/bases/ScrollView/ScrollView';
import { Input } from 'components/bases/Input';
import TagSelected from 'components/bases/Tree/TagSelected';
import { FormControlLabel } from 'components/bases/Form';

import { TreeItem } from './TreeItem';
import useTree from './hooks/useTree';

export const TreeSelect = ({ showTag, height,hasSearch, ...treeProps }) =>
{
    const [keySearch, setKeySearch] = useState();

    const callAfterIntiTree = (treeData)=>
    {
        expandAll(treeData, treeProps.expandAll);
    };

    // call useTree to build tree (get state, and function off Tree) from tree data
    const [
        {
            data,
            nodeSelected,
        },
        {
            expand,
            filter,
            check,
            expandAll,
        },
    ] = useTree({ ...treeProps, onAfterInit: callAfterIntiTree });

    const handleRemoveTag = (node) =>
    {
        check(node, false);
    };

    const handleSearch = (key)=>
    {
        filter(key);
        setKeySearch(key);
    };

    const renderTreeItem = (node)=>
    {
        return (
            node.visible !== false && (
                <TreeItem
                    key={node.id}
                    node={node}
                    onChecked={check}
                    onExpand={expand}
                >
                    {
                        node.expand && node.child && node.child.map((child) => renderTreeItem(child))
                    }
                </TreeItem>
            )
        );
    };
    return (
        <div>
            {
                hasSearch && (
                    <FormControlLabel
                        control={(
                            <Input
                                placeholder={'Tìm kiếm'}
                                value={keySearch}
                                onChange={handleSearch}
                            />
                        )}
                    />
                )}

            {
                showTag && nodeSelected?.length > 0 && (
                    <TagSelected
                        data={nodeSelected}
                        size={'small'}
                        onRemoveTag={handleRemoveTag}
                    />
                )}

            <ScrollView style={{ height }}>
                {
                    data && data?.length > 0 &&
                    data.map((node) => renderTreeItem(node))
                }
            </ScrollView>
        </div>

    );
};

TreeSelect.propTypes = {
    data: PropTypes.array,
    nodeSelected: PropTypes.array,
    onlySelectLeaves: PropTypes.bool,
    showTag: PropTypes.bool,
    height: PropTypes.string,
    expandAll: PropTypes.bool,
    onChecked: PropTypes.func,
    hasSearch: PropTypes.bool,
};

TreeSelect.defaultProps = {
    data: [],
    hasSearch: true,
    onlySelectLeaves: true,
    height: 'auto',
    showTag: true,
    expandAll: false,
};
