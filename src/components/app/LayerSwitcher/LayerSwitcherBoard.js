import { observer } from 'mobx-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isValidElementType } from 'react-is';

import _uniq from 'lodash/uniq';

import { Panel, PanelBody, PanelHeader, Loading, Row, IconButton, T, Container } from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';

import { LayerSwitcherItem } from './LayerSwitcherItem';

export class LayerSwitcherBoard extends Component
{
    state = {
        disableHeader: false,
    };

    componentDidMount = () =>
    {
        this.setState({
            disableHeader: !this.props.toggleOn,
        });
    };

    recursiveHeaderChange = (data, toplevelCheckingType = 0, header = false) =>
    {
        if (header)
        {
            data.childes.forEach((toplevel) =>
            {
                if (data.checkingType === 1)
                {
                    if (toplevel.checkingType === 1)
                    {
                        this.props.onChange(toplevel, true);
                    }
                }
                else
                {
                    this.props.onChange(toplevel, false);
                }
                if (toplevel.childes)
                {
                    this.recursiveHeaderChange(toplevel, data.checkingType, false);
                }
            });
        }
        else
        {
            if (toplevelCheckingType === 0)
            {
                data.childes.forEach((item) =>
                {
                    this.props.onChange(item, false);
                    if (item.childes)
                    {
                        this.recursiveHeaderChange(item, 0, false);
                    }
                });
            }
            else
            {
                data.childes.forEach((item) =>
                {
                    if (item.checkingType === 1)
                    {
                        this.props.onChange(item, true);
                    }
                    else
                    {
                        this.props.onChange(item, false);
                    }
                    if (item.childes)
                    {
                        this.recursiveHeaderChange(item, 1, false);
                    }
                });
            }
        }
    };

    recursiveCheckChange = (data, parentCheckingType = 0, onChangeCalled = false) =>
    {
        if (parentCheckingType === 0)
        {
            data.childes.forEach((item) =>
            {
                item.checkingType = parentCheckingType;
                if (!onChangeCalled)
                {
                    this.props.onChange(item, false);
                }
                if (item.childes)
                {
                    this.recursiveCheckChange(item, parentCheckingType, null, true);
                }
            });
        }
        else
        {
            data.childes.forEach((item) =>
            {
                item.checkingType = parentCheckingType;
                if (!onChangeCalled)
                {
                    if (item.checkingType === 1)
                    {
                        this.props.onChange(item, true);
                    }
                    else
                    {
                        this.props.onChange(item, false);
                    }
                }
                if (item.childes)
                {
                    this.recursiveCheckChange(item, parentCheckingType, null, true);
                }
            });
        }
    };

    findAndCheckParents = (treeObj, currentItem, header = null) =>
    {
        if (treeObj.Id === currentItem.Id)
        {
            treeObj.checkingType = currentItem.checkingType;
            return treeObj.checkingType;
        }

        if (treeObj.childes)
        {
            const treeItemChildrenCheckingType = [];
            treeObj.childes.forEach(treeItem =>
            {
                const treeItemCheckingType = this.findAndCheckParents(treeItem, currentItem, header);
                if (!CommonHelper.isFalsyValue(treeItemCheckingType))
                {
                    treeItemChildrenCheckingType.push(treeItemCheckingType);
                }
            });

            const allCheckingValues = _uniq(treeItemChildrenCheckingType);

            // TODO: have to find a way to dynamically seperate the header case later, for now i have to
            // make a hard case for "TRACKING" group since it is built in a different way with no
            // parent property present.
            if (header !== 'TRACKING')
            {
                if (treeObj.parent)
                {
                    // add parent check to avoid the outmost layer - the header, from changing checking type, that check should be manually activated only
                    if (allCheckingValues.length === 1)
                    {
                        if (allCheckingValues[0] === 1)
                        {
                            treeObj.checkingType = 1;
                        } // all checked
                        else if (allCheckingValues[0] === 0)
                        {
                            treeObj.checkingType = 0;
                        } // none checked
                        else
                        {
                            treeObj.checkingType = 2;
                        } // all partially checked
                    }
                    else if (allCheckingValues.length > 1)
                    {
                        treeObj.checkingType = 2; // partially checked
                    }
                }
            }
            else
            {
                if (treeObj.Id !== 'TRACKING')
                {
                    if (allCheckingValues.length === 1)
                    {
                        if (allCheckingValues[0] === 1)
                        {
                            treeObj.checkingType = 1;
                        } // all checked
                        else if (allCheckingValues[0] === 0)
                        {
                            treeObj.checkingType = 0;
                        } // none checked
                        else
                        {
                            treeObj.checkingType = 2;
                        } // all partially checked
                    }
                    else if (allCheckingValues.length > 1)
                    {
                        treeObj.checkingType = 2; // partially checked
                    }
                }
            }

            return treeObj.checkingType;
        }

        // NOTE: this return statement seemed redundant but it is MUST HAVE because we want to preserve the original checking state if this is
        // 1. not the currentItem we are looking for
        // or 2. not a folder node
        return treeObj.checkingType;
    };

    handleItemChange = (event) =>
    {
        if (this.state.disableHeader)
        {
            return;
        }
        const item = event.data;

        item.checkingType = item.checkingType === 0 ? 1 : 0;
        this.props.onChange(item, item.checkingType === 1, item.parent);
        // if (item.parent)
        // {
        //     if (item.parent.Title !== item.group.Title)
        //     {
        //         const currentCheckingValues = _uniq(item.parent.childes.map(_property(['checkingType'])));
        //         if (currentCheckingValues.length === 1)
        //         {
        //             item.parent.checkingType = currentCheckingValues[0]; // all checked, or none checked
        //         }
        //         else if (currentCheckingValues.length > 0)
        //         {
        //             item.parent.checkingType = 2; // partially checked
        //         }
        //     }
        // }

        // TODO: have to find a way to dynamically seperate the header case later, for now i have to
        // make a hard case for "TRACKING" group since it is built in a different way with no
        // parent property present.
        this.findAndCheckParents(this.props.data, item, this.props.data.Id);

        if (item.childes)
        {
            this.recursiveCheckChange(item, item.checkingType, false);
        }
    };

    handleHeaderChange = () =>
    {
        if (this.props.data.checkingType === 1)
        {
            this.setState({ disableHeader: true });
        }
        else
        {
            this.setState({ disableHeader: false });
        }
        const item = this.props.data;
        item.checkingType = item.checkingType === 0 ? 1 : 0;
        this.props.onChange(item, item.checkingType === 1, true);

        if (item.childes)
        {
            this.recursiveHeaderChange(item, item.checkingType, true);
        }
    };

    render()
    {
        const ItemComponent = this.props.itemComponent || LayerSwitcherItem;

        const layerChild = [];

        if (Array.isArray(this.props.data.childes) && this.props.data.childes.length > 0)
        {
            for (const c of this.props.data.childes)
            {
                layerChild.push(
                    <ItemComponent
                        key={c.Id}
                        data={c}
                        disableAll={this.state.disableHeader}
                        onChange={this.handleItemChange}
                        onExpand={this.props.onExpand}
                        onCollapse={this.props.onCollapse}
                    />,
                );
            }
        }

        const hasEye = this.props.data.childes?.some(child => child.checkingType > 0);
        const hasSetting = !!this.props.onSettingClick;

        return (
            <Panel>
                <PanelHeader>
                    <Row crossAxisAlignment="center">
                        <Row>
                            <T>{this.props.data.Title}</T>
                        </Row>

                        {hasEye && (
                            <IconButton
                                icon={this.props.data.checkingType > 0 ? 'eye' : 'eye-slash'}
                                size="sm"
                                iconType={'solid'}
                                variant="empty"
                                onClick={this.handleHeaderChange}
                            />
                        )}

                        {hasSetting && (
                            <IconButton
                                icon={'ellipsis-v'}
                                size="sm"
                                iconType={'solid'}
                                variant="empty"
                                onClick={this.props.onSettingClick}
                            />
                        )}
                    </Row>
                </PanelHeader>

                <Container style={{ padding: '0.5rem' }}>
                    {layerChild.length
                        ? layerChild
                        : (
                                <Row
                                    width="100%"
                                    mainAxisAlignment="center"
                                    itemMargin="lg"
                                >
                                    <Loading />
                                </Row>
                            )
                    }
                </Container>
            </Panel>
        );
    }
}

LayerSwitcherBoard.propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func,
    onExpand: PropTypes.func,
    toggleOn: PropTypes.bool,
    itemComponent: (props, propName) =>
    {
        if (props[propName] && !isValidElementType(props[propName]))
        {
            return new Error(
                'Invalid prop \'itemComponent\' supplied to \'LayerSwitcherBoard\': the prop is not a valid React component',
            );
        }
    },
};

LayerSwitcherBoard.defaultProps = {
    data: {},
    toggleOn: true,
};

LayerSwitcherBoard = (observer(LayerSwitcherBoard));
