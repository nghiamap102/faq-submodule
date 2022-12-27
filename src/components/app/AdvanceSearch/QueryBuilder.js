import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    IconButton, Popup, Container,
    AdvanceSelectControl,
    FormControlLabel, FormGroup, Input, InputAppend, InputGroup,
} from '@vbd/vui';

import { LayerSelector } from '../LayersSelector/LayerSelector';
import { CommonHelper } from 'helper/common.helper';
import { GeoAdvanceSearchPopupContent } from '../PopupContent/GeoAdvanceSearchPopup';

import { Constants } from 'constant/Constants';

class QueryBuilder extends Component
{
    state = {
        showQueryBuilder: false,
        layers: [],
        showLayersSelector: false,
    };

    advanceSearchStore = this.props.appStore.advanceSearchStore;
    advanceSearchSvc = this.advanceSearchStore.advanceSearchSvc;
    layerStore = this.props.appStore.layerStore;

    handleQueryNameChange = (value) =>
    {
        this.advanceSearchStore.updateQuery('name', value);
    };

    handleQueryRadiusChange = (value) =>
    {
        this.advanceSearchStore.updateQuery('radius', value);
    };

    handleChangeSearchKey = (value) =>
    {
        this.advanceSearchStore.setSearchKey(value);
    };

    handleOpenQueryBuilder = () =>
    {
        this.layerStore.layerData = this.advanceSearchStore.selectedQuery.layers;
        this.setState({ showQueryBuilder: true });
    };

    handleCloseQueryBuilder = () =>
    {
        this.setState({ showQueryBuilder: false });
    };

    handleCloseLayersSelector = () =>
    {
        this.setState({ showLayersSelector: false });
    };

    handleSelectLayer = async (e) =>
    {
        const res = await this.advanceSearchSvc.getAllLayers();
        this.setState({ showLayersSelector: true, layers: res.data });
    };

    setLayerFields = async (layer) =>
    {
        const layerInfo = (await this.advanceSearchSvc.getLayerProps(layer.LayerName)).data;
        if (layerInfo && layerInfo.Properties)
        {
            const geoField = layerInfo.Properties.filter((o) => o.DataType === 7)[0];
            const props = layerInfo.Properties.filter((o) => o.DataType !== 7);
            if (props.length)
            {
                const propFields = [];
                props.forEach((p) =>
                {
                    propFields.push(p.ColumnName);
                });
                layer.propFields = propFields;
            }
            if (geoField)
            {
                layer.geoField = geoField.ColumnName;
            }
        }
        return layer;
    };

    onLayerSelectionChange = async (selected, lastChanged, checked) =>
    {
        let layers = CommonHelper.clone(this.advanceSearchStore.selectedQuery.layers);

        if (!layers)
        {
            layers = [];
        }

        if (checked)
        {
            const layerUpdated = await this.setLayerFields(lastChanged);
            layers.push(layerUpdated);
        }
        else
        {
            layers = layers.filter((l) => l.LayerId !== lastChanged.LayerId);
            this.advanceSearchStore.clearResultByLayerName(lastChanged.LayerName);
        }

        this.advanceSearchStore.updateQuery('layers', layers);
    };

    getLayersSelectorBtnText()
    {
        const layers = this.advanceSearchStore.selectedQuery.layers;

        if (!layers)
        {
            return null;
        }

        let text = '';
        for (let i = 0; i < layers.length; i++)
        {
            text += (text ? ', ' : '') + layers[i].LayerName;
        }

        if (text.length > 16)
        {
            text = text.substr(0, 12) + '..';
        }

        return text;
    }

    handleClearLayers = async () =>
    {
        this.advanceSearchStore.clearResultBeforeSearch(this.advanceSearchStore.selectedQuery);
        this.advanceSearchStore.updateQuery('layers', []);
        await this.advanceSearchStore.doSearch(this.advanceSearchStore.selectedQuery, false);
    };

    onAdvanceQueryChange = (layers, queries) =>
    {
        layers.forEach((l) =>
        {
            const queryData = queries.find((q) => q.layer === l.LayerName);
            if (queryData)
            {
                l.advanceQuery = queryData;
            }
        });

        this.advanceSearchStore.updateQuery('layers', layers);
        this.handleCloseQueryBuilder();
    };

    render()
    {
        const selectedQuery = this.advanceSearchStore.selectedQuery;

        return (
            <>
                {
                    selectedQuery && (
                        <Container className="query-detail-builder-container">
                            <FormGroup>
                                {
                                    selectedQuery.type !== Constants.MAP_OBJECT.POLYGON && (
                                        <FormControlLabel
                                            label={'Bán kính'}
                                            control={(
                                                <InputGroup>
                                                    <Input
                                                        disabled={this.props.readOnly}
                                                        type="number"
                                                        value={selectedQuery.radius}
                                                        step={50}
                                                        onChange={this.handleQueryRadiusChange}
                                                    />
                                                    <InputAppend>m</InputAppend>
                                                </InputGroup>
                                            )}
                                        />
                                    )}

                                <FormControlLabel
                                    label={'Lớp dữ liệu'}
                                    control={(
                                        <InputGroup>
                                            <AdvanceSelectControl
                                                disabled={this.props.readOnly}
                                                placeholder={this.getLayersSelectorBtnText() || 'Chọn lớp dữ liệu'}
                                                onControlClick={this.handleSelectLayer}
                                            />

                                            <InputAppend>
                                                <IconButton
                                                    disabled={this.props.readOnly}
                                                    icon={'trash-alt'}
                                                    iconSize="xs"
                                                    variant="empty"
                                                    isRound={false}
                                                    onClick={this.handleClearLayers}
                                                />
                                            </InputAppend>
                                        </InputGroup>
                                    )}
                                />

                                {
                                    this.state.showLayersSelector && (
                                        <Popup
                                            title={'Chọn lớp dữ liệu'}
                                            width={'700px'}
                                            onClose={this.handleCloseLayersSelector}
                                        >
                                            <LayerSelector
                                                layers={this.state.layers}
                                                height={500}
                                                layerNameField={'LayerName'}
                                                descriptionField={'Caption'}
                                                selectedLayers={CommonHelper.clone(this.advanceSearchStore.selectedQuery.layers)}
                                                onSelectionChange={this.onLayerSelectionChange}
                                            />
                                        </Popup>
                                    )
                                }

                                <FormControlLabel
                                    label={'Nội dung'}
                                    control={(
                                        <InputGroup>
                                            <Input
                                                disabled={this.props.readOnly}
                                                value={this.advanceSearchStore.searchKey}
                                                placeholder="Nhập từ khóa"
                                                onChange={this.handleChangeSearchKey}
                                            />
                                            <InputAppend>
                                                <IconButton
                                                    disabled={this.props.readOnly}
                                                    icon={'plus'}
                                                    iconSize="xs"
                                                    variant="empty"
                                                    isRound={false}
                                                    onClick={this.handleOpenQueryBuilder}
                                                />
                                            </InputAppend>
                                        </InputGroup>
                                    )}
                                />
                            </FormGroup>

                            {
                                this.state.showQueryBuilder && (
                                    <GeoAdvanceSearchPopupContent
                                        layers={CommonHelper.clone(this.advanceSearchStore.selectedQuery.layers)}
                                        onApply={this.onAdvanceQueryChange}
                                        onCancel={this.handleCloseQueryBuilder}
                                        onClose={this.handleCloseQueryBuilder}
                                    />
                                )
                            }
                        </Container>
                    )}
            </>
        );
    }
}

QueryBuilder.propTypes = {
    readOnly: PropTypes.bool,
};

QueryBuilder.defaultProps = {
    readOnly: false,
};

QueryBuilder = inject('appStore')(observer(QueryBuilder));
export default QueryBuilder;
