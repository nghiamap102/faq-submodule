import './TreeSelect.scss';

import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';

import { TagSelected, Input, FormControlLabel, ScrollView } from '@vbd/vui';

import { TreeItem } from 'extends/ffms/bases/Tree/TreeItem';
import useTree from 'extends/ffms/bases/Tree/TreeHandle';

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

    const handleSeach = (key)=>
    {
        filter(key);
        setKeySearch(key);
    };

    const renderTreeItem = (node)=>
    {
        return (
            node.visible !== false &&
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
        );
    };
    return (
        <div>
            {
                hasSearch &&
                <FormControlLabel
                    control={
                        <Input
                            placeholder={'Tìm kiếm'}
                            onChange={handleSeach}
                            value={keySearch}
                        />
                    }
                />
            }

            {
                showTag && nodeSelected?.length > 0 &&
                    <TagSelected
                        data={nodeSelected}
                        size={'small'}
                        onRemoveTag={handleRemoveTag}
                    />
            }

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
