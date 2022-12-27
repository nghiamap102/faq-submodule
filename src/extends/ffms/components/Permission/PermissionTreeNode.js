import './PermissionTreeView.scss';
import React from 'react';
import PropTypes from 'prop-types';

import {
    Row, Container, PanelHeaderWithSwitcher, T,
} from '@vbd/vui';
import { FAIcon } from '@vbd/vicon';
import PopperTooltip from 'extends/ffms/bases/Tooltip/PopperTooltip';
import ControlToggle from 'extends/ffms/bases/Control/ControlToggle';

import HelpContent from 'extends/ffms/components/Permission/HelpContent';


const PermissionTreeNode = (props) =>
{
    const { node, onSwitchChange, onExpand, isLoading, children, readOnly } = props;

    const handleItemChange = () =>
    {
        onSwitchChange(node, !node.CanAccess);
    };

    const renderParentNode = () =>
    {
        const icon = node.expand ? 'minus-square' : 'plus-square';
        return (
            <Row
                crossAxisAlignment={'center'}
                className={'node-item-header-container'}
                // onClick={() => onExpand(node)}
            >
                <Container
                    onClick={() => onExpand(node)}
                >
                    <FAIcon
                        icon={isLoading ? 'spinner' : icon}
                        spin={isLoading}
                        size={'1rem'}
                    />
                    <h3
                        className={'node-item-header-text'}
                    >
                        <T>{node.Description || node.Title || node.Name}</T>
                    </h3>
                </Container>
                {
                    node.Content &&
                        <PopperTooltip
                            tooltip={
                                <HelpContent
                                    data={JSON.parse(node.Content)}
                                />
                            }
                            placement={'top'}
                            trigger={['click']}
                            className={'popper-help'}
                        >
                            <FAIcon
                                icon={'question-circle'}
                                size={'1rem'}
                                className={'node-icon-help'}
                            />
                        </PopperTooltip>
                }
            </Row>
        );
    };

    return (
        <Container className={'node-item-container'}>
            {
                node.Type === 'feature' &&
                <PanelHeaderWithSwitcher
                    value={node.CanAccess ? 1 : 0}
                    onChanged={handleItemChange}
                    disabled={readOnly}
                >
                    {node.Description || node.Title || node.Name}
                </PanelHeaderWithSwitcher>
            }

            {
                node.Type === 'folder' &&
                <ControlToggle
                    visible={node.expand && node.child?.length > 0}
                    control={renderParentNode()}
                >
                    <div className={'node-item-child'}>
                        {children && children}
                    </div>
                </ControlToggle>
            }
        </Container>
    );
};

PermissionTreeNode.prototype = {
    node: PropTypes.object.isRequired,
    onSwitchChange: PropTypes.func,
    onExpand: PropTypes.func,
    readOnly: PropTypes.bool,
};


export default PermissionTreeNode;
