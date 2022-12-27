import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useTree from 'extends/ffms/bases/Tree/TreeHandle';

export const MenuContext = createContext();

export const MenuProvider = (props)=>
{
    const buildTreeWithChildren = (children, level = 0) =>
    {
        return children.reduce((accumulator, currentValue, index)=>
        {
            const id = currentValue.props?.id ? currentValue.props.id : level + '-' + index;
            if (currentValue.props?.type === 'group-item')
            {
                const elements = React.Children.toArray(currentValue.props.children);
                const a = buildTreeWithChildren(elements,level + 1);
                return [
                    {
                        id, child: a,
                        checkingType: 0,
                        level,
                        label: currentValue.props.title,
                    } ,
                    ...accumulator,
                ];
            }
            else if (currentValue.props?.type === 'sub-item')
            {
                const elements = React.Children.toArray(currentValue.props.children);
                const a = buildTreeWithChildren(elements,level + 1);
                return [
                    {
                        id, child: a,
                        checkingType: 0,
                        level,
                        label: currentValue.props.title,
                    } ,
                    ...accumulator,
                ];
            }
            else
            {
                const child = currentValue.props?.children;
                return [
                    {
                        id,
                        child: [],
                        checkingType: 0,
                        level ,
                        label: typeof child === 'string' ? child : '',
                    },
                    ...accumulator,
                ];
            }
        }, []);
    };

    const callAfterIntiTree = (treeData)=>
    {
        treeHandle.expandAll(treeData, props?.defaultOpenAll);
        treeHandle.checkAll(treeData, props?.defaultSelectedAll ? 1 : 0);
    };

    const elements = React.Children.toArray(props.elements);
    const treeData = buildTreeWithChildren(elements);

    const [{ data },treeHandle] = useTree({
        recursiveChildren: false,
        data: treeData,
        defaultExpandIds: props.defaultOpenIds,
        nodeSelected: [...props.defaultSelectedIds, ...props.selectedIds]?.map(id=>({ id })),
        multiple: props.multiple || props.selectedIds.length > 0,
        canCheck: props.selectable,
        onAfterInit: callAfterIntiTree,
    });

    const [menuMode] = useState(props.mode);

    const [expandIcon] = useState(props.expandIcon);
    const [inlineCollapsed] = useState(props.inlineCollapsed);
    const [inlineIndent] = useState(props.inlineIndent);

    useEffect(()=>
    {
        if (props.openIds?.length > 0)
        {
            treeHandle.expandIds(props.openIds, true);
        }
    }, [props.openIds]);

    useEffect(()=>
    {
        if (props.selectedIds?.length > 0 && data?.length > 0)
        {
            treeHandle.checkIds(props.selectedIds,1, true);
        }
    }, [props.selectedIds]);


    const eventItemClick = (node , event) =>
    {
        props.onClick && props.onClick({
            ...node, path: [node.id, node.parent && node.parent.id],
        }, event);
    };

    const eventItemSelect = (node , event) =>
    {
        node.checkingType !== 1 && props.onSelect &&
        props.onSelect({
            id: node.id,
            path: [node.id, node.parent && node.parent.id],
            label: node.label,
        }, event);
    };

    const eventItemExpand = (node , event) =>
    {
        props.onExpand && props.onExpand({
            id: node.id,
            path: [node.id, node.parent && node.parent.id],
            label: node.label,
            expand: node.expand,
        }, event);
    };


    const setActiveItem = (node,e = null) =>
    {
        eventItemClick(node, e);
        eventItemSelect(node,e);

        // disable handle active Item when has selectedIds
        if (props.selectedIds?.length > 0)
        {
            return null;
        }

        let checkingType = node?.checkingType || 0;

        // active toggle - if active set not active if not active set active
        checkingType = checkingType === 0 || checkingType === 2 ? 1 : 0;

        treeHandle.check(node,checkingType);
    };

    const expand = (node, isExpand, e = null) =>
    {
        eventItemExpand(node, e);

        if (props.openIds.indexOf(node.id) === -1)
        {
            treeHandle.expand(node, isExpand);
        }
    };

    const checkAllTree = (checkingType, cb) =>
    {
        treeHandle.checkAll(data,checkingType, cb);

    };


    return (
        <MenuContext.Provider
            value={{
                activeData: data,
                itemClassName: props.itemClassName,

                menuMode,
                expandIcon,
                inlineCollapsed,
                inlineIndent,

                setActiveItem,
                ...treeHandle,
                expand,
                checkAllTree,
            }}
        >
            {props.children}
        </MenuContext.Provider>
    );
};

MenuProvider.propTypes = {
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    inlineIndent: PropTypes.number,

    mode: PropTypes.oneOf(['vertical' , 'horizontal', 'inline' ]).isRequired,
    defaultOpenIds: PropTypes.array,
    defaultSelectedIds: PropTypes.array,
    openIds: PropTypes.array,
    selectedIds: PropTypes.array,

    multiple: PropTypes.bool,
    selectable: PropTypes.bool,
    inlineCollapsed: PropTypes.bool,

    expandIcon: PropTypes.element,

    onClick: PropTypes.func,
    onSelect: PropTypes.func,
    onExpand: PropTypes.func,
};


