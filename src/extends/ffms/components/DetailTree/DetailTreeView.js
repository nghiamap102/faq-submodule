import './DetailTreeView.scss';

import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Container, Row,
    EmptyButton, Expanded, Label, T, ToggleButton, ScrollView,
} from '@vbd/vui';

import { TreeListItem } from 'extends/ffms/views/TreeListItem/TreeListItem';


let DetailTreeView = (props) =>
{
    const detailTreeStore = props.fieldForceStore.detailTreeStore;

    const [treeData, setTreeData] = useState([]);

    useEffect(() =>
    {
        detailTreeStore.appStore = props.appStore;

        detailTreeStore.resetDirectionSort();
        props.handleRefresh({
            sortDirection: detailTreeStore.sortDirection,
            sortField: detailTreeStore.sortField,
        });
    }, []);

    useEffect(() =>
    {
        setTreeData(detailTreeStore.buildTree(props.dataTree));
    }, [props.dataTree]);

    const handleExpand = (node, expand) =>
    {
        node.expand = expand;
    };

    const handleSortClick = (dir) =>
    {
        props.handleSort(dir);
        detailTreeStore.setDirection({ direction: dir });
        props.handleRefresh({
            sortDirection: dir,
            sortField: props.sortField,
        });
    };
    

    const renderTreeItem = (node) =>
    {
        const entryView =
            node.treeNodeInfo &&
            Object.keys(node.treeNodeInfo).map((field) => props.customItemFieldBuilder(field, node));

        return (
            node.visible !== false && (
                <TreeListItem
                    key={node.id}
                    node={node}
                    customInfo
                    entryView={entryView}
                    onExpand={handleExpand}
                    onSelect={props.handleSelect}
                    color={props.coloredItem ? props.setItemColor(node[props.colorByField]) : ''}
                    arrowVisible={props.arrowVisible ? node.arrowVisible : false}
                    root={node.root}
                    highlight={props.selected === node.Id}
                >
                    {node.expand &&
                    node.child &&
                    node.child.map((child) => renderTreeItem(child))}
                </TreeListItem>
            )
        );
    };
    
    return (
        <>
            <Container
                height={'fit-content'}
            >
                <Row itemMargin={'sm'}>
                    <Label><T>Danh sách công việc</T> ({props.totalItem}{props.totalItem > props.data.length ? '+' : ''})</Label>
                    <Expanded />
                    <ToggleButton
                        className={'btn-sort-up'}
                        icon={'long-arrow-up'}
                        pressed={detailTreeStore.sortDirection === 'ASC'}
                        onlyIcon
                        onClick={() => handleSortClick('ASC')}
                    />
                    <ToggleButton
                        className={'btn-sort-down'}
                        icon={'long-arrow-down'}
                        pressed={detailTreeStore.sortDirection === 'DESC'}
                        onlyIcon
                        onClick={() => handleSortClick('DESC')}
                    />
                    <EmptyButton
                        icon={'redo-alt'}
                        isLoading={detailTreeStore.loading}
                        onlyIcon
                        onClick={() => props.handleRefresh()}
                    />
                </Row>
            </Container>
            {
                props.data?.length > 0 && props.dataTree &&
                    <ScrollView>
                        {(treeData && treeData.length > 0) ? treeData.map((item) => renderTreeItem(item)) : null}
                    </ScrollView>
            }
        </>
    );
};

DetailTreeView.propTypes = {
    data: PropTypes.array,
    totalItem: PropTypes.number,
    dataTree: PropTypes.object,
    handleSelect: PropTypes.func,
    customItemFieldBuilder: PropTypes.func,
    coloredItem: PropTypes.bool,
    colorByField: PropTypes.string,
    setItemColor: PropTypes.func,
    handleRefresh: PropTypes.func,
    handleSort: PropTypes.func,
    sortField: PropTypes.string,
};

DetailTreeView.defaultProps = {
    handleSort: () =>
    {},
    arrowVisible: true,
};

DetailTreeView = inject('appStore', 'fieldForceStore')(observer(DetailTreeView));
export default DetailTreeView;
