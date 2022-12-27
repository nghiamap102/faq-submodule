import './LayerSelector.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    ScrollView, CheckBox, Input,
    Tag,
    FormControlLabel,
} from '@vbd/vui';

class LayerSelector extends Component
{
    state = {
        searchkey: '',
        selectedLayers: this.props.selectedLayers || [],
    };

    isExist = (layer) =>
    {
        return (this.state.selectedLayers.filter((l) => l.LayerId === layer.LayerId)).length > 0;
    };

    getIndex = (layer) =>
    {
        const l = (this.state.selectedLayers.filter((l) => l.LayerId === layer.LayerId))[0];
        return l ? this.state.selectedLayers.indexOf(l) : -1;
    };

    search = (arr, key) =>
    {
        if (!key)
        {
            return arr;
        }

        const layerNameField = this.props.layerNameField;
        const descriptionField = this.props.descriptionField;
        key = key.toLowerCase();

        return arr.filter(function (item)
        {
            return item[layerNameField].toString().toLowerCase().indexOf(key) > -1 ||
                item[descriptionField].toLowerCase().indexOf(key) > -1;
        });
    };

    handleClick = (layer) =>
    {
        if (this.isExist(layer))
        {
            this.state.selectedLayers.splice(this.getIndex(layer), 1);
        }
        else
        {
            this.state.selectedLayers.push(layer);
        }

        this.onSelectionChange(layer);
    };

    onSelectionChange = async (layer) =>
    {
        await this.props.onSelectionChange(this.state.selectedLayers, layer, this.isExist(layer));
        this.setState({ selectedLayers: this.state.selectedLayers });
    };

    handleRemoveTag = async (layer, index) =>
    {
        this.state.selectedLayers.splice(index, 1);
        await this.onSelectionChange(layer);
    };

    render()
    {
        const layers = this.props.layers || [];
        const height = this.props.height || 500;

        return (
            <Container>
                <FormControlLabel
                    label={'Lớp dữ liệu'}
                    control={(
                        <Input
                            placeholder="Nhập từ khóa để tìm kiếm"
                            value={this.state.searchkey}
                            onChange={(v) =>
                            {
                                this.setState({ searchkey: v });
                            }}
                        />
                    )}
                />

                <Container className="layers-selector-tags-container">
                    {
                        this.state.selectedLayers.map((l, i) => (
                            <Tag
                                key={i}
                                text={l.LayerName}
                                onCloseClick={() =>
                                {
                                    this.handleRemoveTag(l, i);
                                }}
                            />
                        ),
                        )
                    }
                </Container>

                <Container style={{ height: height - 30 }}>
                    <ScrollView>
                        {
                            this.search(layers, this.state.searchkey).map((layer, i) => (
                                <Container
                                    key={i}
                                    className={'layers-selector-row-container'}
                                    onClick={this.handleClick.bind(this, layer)}
                                >
                                    <CheckBox checked={this.isExist(layer)} />

                                    <Container className={'layers-selector-layer-name'}>
                                        {layer[this.props.layerNameField]}
                                    </Container>

                                    <Container className={'layers-selector-layer-description'}>
                                        {layer[this.props.descriptionField]}
                                    </Container>
                                </Container>
                            ),
                            )
                        }
                    </ScrollView>
                </Container>
            </Container>
        );
    }
}

LayerSelector = inject('appStore')(observer(LayerSelector));
export { LayerSelector };
