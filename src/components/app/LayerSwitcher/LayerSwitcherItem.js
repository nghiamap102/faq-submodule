import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
    Row, Column, Container,
    CheckBox, FAIcon,
    T,
} from '@vbd/vui';

import { LayerIcon } from './LayerIcon';

export class LayerSwitcherItem extends Component
{
    state = { isExpand: false };

    componentDidMount = () =>
    {
        this.setState({
            isExpand: this.props.data.expanded,
        });
    };

    toggleExpand = () =>
    {
        this.state.isExpand ? this.props.onCollapse?.(this.props.data) : this.props.onExpand?.(this.props.data);
        this.setState({ isExpand: !this.state.isExpand });
    };

    handleChecked = (e) =>
    {
        const nextValue = this.props.data.checkingType === 1 ? 0 : 1;
        this.props.onChange({ data: this.props.data, value: nextValue, type: 0 });
    };

    handleChildChecked = (event) =>
    {
        this.props.onChange({ data: event.data, value: event.value, type: 1 });
    };

    render()
    {
        const layerChild = [];

        if (Array.isArray(this.props.data.childes) && this.props.data.childes.length > 0)
        {
            for (const c of this.props.data.childes)
            {
                const checkingType = c.checkingType; // phải có dòng này

                layerChild.push(
                    <LayerSwitcherItem
                        key={c.Id}
                        data={c}
                        disableAll={this.props.disableAll}
                        onChange={this.handleChildChecked}
                        onExpand={this.props.onExpand}
                        onCollapse={this.props.onCollapse}
                    />,
                );
            }
        }

        return (
            <Container style={{ margin: '0.5rem 0 0 0.5rem' }}>
                <Row
                    crossAxisAlignment={'center'}
                >
                    <Column
                        flex={0}
                        width={'1.5rem'}
                    >
                        {this.props.data.Type === 'folder' && (
                            this.state.isExpand
                                ? (
                                        <FAIcon
                                            icon="angle-down"
                                            size="1.25rem"
                                            color="var(--text-color)"
                                            onClick={this.toggleExpand}
                                        />
                                    )
                                : (
                                        <FAIcon
                                            icon="angle-right"
                                            size="1.25rem"
                                            color="var(--text-color)"
                                            onClick={this.toggleExpand}
                                        />
                                    )
                        )}
                    </Column>

                    <Row
                        crossAxisAlignment={'center'}
                        onClick={this.handleChecked}
                    >
                        <Column
                            mainAxisSize="max"
                            mainAxisAlignment="center"
                            flex={0}
                            width={'2rem'}
                        >
                            {this.props.data.checkingType === -1 && (
                                <CheckBox
                                    checked={false}
                                    disabled={this.props.disableAll}
                                    onChange={this.handleChecked}
                                />
                            )}

                            {this.props.data.checkingType === 0 && (
                                <CheckBox
                                    checked={false}
                                    disabled={this.props.disableAll}
                                    onChange={this.handleChecked}
                                />
                            )}

                            {this.props.data.checkingType === 1 && (
                                <CheckBox
                                    disabled={this.props.disableAll}
                                    checked
                                    onChange={this.handleChecked}
                                />
                            )}

                            {this.props.data.checkingType === 2 && (
                                <CheckBox
                                    disabled={this.props.disableAll}
                                    checked
                                    indeterminate
                                    onChange={this.handleChecked}
                                />
                            )}
                        </Column>

                        <Column
                            mainAxisSize="max"
                            mainAxisAlignment="center"
                            flex={0}
                            width={'2rem'}
                        >
                            <LayerIcon
                                layer={this.props.data?.layerInfo?.LayerName}
                                width={'1.25rem'}
                                height={'1.25rem'}
                            />
                        </Column>

                        <Row
                            crossAxisSize="max"
                            crossAxisAlignment="center"
                        >
                            {(this.props.data.checkingType === -1 || this.props.disableAll)
                                ? (
                                        <Container style={{ color: 'var(--text-color-dark)' }}>
                                            <T>{this.props.data.Title}</T>
                                        </Container>
                                    )
                                : (
                                        <Container style={{ cursor: 'pointer' }}>
                                            <T>{this.props.data.Title}</T>
                                        </Container>
                                    )
                            }
                        </Row>
                    </Row>
                </Row>

                {this.state.isExpand && (
                    <Container style={{ marginLeft: '0.5rem' }}>
                        {layerChild}
                    </Container>
                )}
            </Container>
        );
    }
}

LayerSwitcherItem.propTypes = {
    data: PropTypes.object,
    disableAll: PropTypes.bool,
    onChange: PropTypes.func,
    onExpand: PropTypes.func,
    onCollapse: PropTypes.func,
};

LayerSwitcherItem.defaultProps = {
    data: {},
    disableAll: false,
};

LayerSwitcherItem = inject('appStore')(observer(LayerSwitcherItem));
