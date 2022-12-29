import './TreeItem.scss';

import React from 'react';

import { FAIcon } from '@vbd/vicon';
import { T } from 'components/bases/Translate/Translate';

const TreeItem = ({ children, node, onChecked, onExpand }) =>
{
    const textColor = 'var(--text-color)';

    const type = node.child && node.child.length ? 'folder' : 'file';
    const isExpand = children && children.length;
    const checkingType = node.checkingType || 0;

    const handleChecked = () =>
    {
        onChecked(node, checkingType === 0 || checkingType === 2 ? 1 : 0);
    };


    return (
        <div className={'tree-item-container'}>
            <div className={'tree-item-node'}>
                {
                    type === 'folder' && (
                        <div className={'tree-item-node-expand'}>
                            {
                                isExpand
                                    ? (
                                            <FAIcon
                                                icon="angle-down"
                                                size="1.5rem"
                                                color={'var(--contrast-color)'}
                                                onClick={() => onExpand(node, !isExpand)}
                                            />
                                        )
                                    : (
                                            <FAIcon
                                                icon="angle-right"
                                                size="1.5rem"
                                                color={textColor}
                                                onClick={() => onExpand(node, !isExpand)}
                                            />
                                        )
                            }
                        </div>
                    )}

                <div className={`tree-item-node-content ${type === 'file' ? 'file' : 'folder'}`}>
                    <div className="tree-item-node-check">
                        {
                            checkingType === 0 && (
                                <FAIcon
                                    color={textColor}
                                    size="1.25rem"
                                    icon="square"
                                    onClick={handleChecked}
                                />
                            )}
                        {
                            checkingType === 1 && (
                                <FAIcon
                                    color="var(--primary-color)"
                                    size="1.25rem"
                                    icon="check-square"
                                    onClick={handleChecked}
                                />
                            )}
                        {
                            checkingType === 2 && (
                                <FAIcon
                                    size="1.25rem"
                                    icon="check-square"
                                    color={textColor}
                                    backgroundColor="var(--contrast-highlight)"
                                    onClick={handleChecked}
                                />
                            )}
                    </div>

                    <div
                        className="tree-item-node-label"
                        onClick={handleChecked}
                    >
                        <T>{node.label}</T>
                    </div>
                </div>
            </div>

            <div className={'tree-item-child'}>
                {children}
            </div>
        </div>
    );
};

TreeItem.propTypes = {};

export { TreeItem };
