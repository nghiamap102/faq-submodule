import './TreeListItem.scss';

import React, { useState } from 'react';

import { Row, T } from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';

const TreeListItem = (props) =>
{
    const { root, children, node, onExpand, onSelect, customInfo, panned, panEntry, entryView, icon, color, arrowVisible = true, highlight } = props;

    // const textColor = 'rgba(255, 255, 255, 0.6)';
    const type = node.child && node.child.length ? 'folder' : 'file';
    const [isExpand, setExpand] = useState(children && children.length);

    const handleSelect = () =>
    {
        if (node.child)
        {
            onExpand(node, !node.expand);
            setExpand(node.expand);
        }
        onSelect && onSelect(node);
    };

    let nodeClass = 'tli-container';

    if (node.treeNodeInfo)
    {
        nodeClass = 'tli-child';
        if (panned && panEntry === node.Id)
        {
            nodeClass = 'tli-child';
        }
    }
    
    const highlightClass = highlight ? 'active' : '';

    return (
    // <div className={panned && panEntry === node.Id && node.treeNodeInfo ? 'tli-container active' : 'tli-container'}>

        <div
            className={`${highlightClass} ${nodeClass} ${color ? 'tli-with-color' : '' } ${root ? 'tli-root' : ''}`}
            style={{ borderLeftColor: `${color}` }}
        >
            <div className={'tli-node'}>
                { type === 'folder' && arrowVisible && (
                    <div className={'tli-node-expand'}>
                        {isExpand ? (
                            <FAIcon
                                icon="caret-down"
                                size="1.5rem"
                                type="solid"
                                // color={textColor}
                                // onClick={() => onExpand(node, !node.expand)}
                                onClick={handleSelect}
                            />
                        ) : (
                            <FAIcon
                                icon="caret-right"
                                size="1.5rem"
                                type="solid"
                                // color={textColor}
                                // onClick={() => onExpand(node, !node.expand)}
                                onClick={handleSelect}
                            />
                        ) }
                    </div>
                ) }

                <div className={`tli-node-content ${ type === 'file' ? 'file' : 'folder'}`}>
                    <div
                        className={`tli-node-label ${root ? 'tli-node-root' : ''}`}
                        onClick={handleSelect}
                    >
                        <div>
                            <Row
                                mainAxisAlignment={'space-between'}
                            >
                                <T>{node.label}</T>
                                {icon}
                            </Row>
                            {
                                customInfo && entryView
                            }
                        </div>
                    </div>
                </div>
            </div>

            { node?.expand ? <div className={'tli-child'}>{ children }</div> : null }
        </div>
    );
};

TreeListItem.propTypes = {};

export { TreeListItem };
