import './GeoAdvanceSearchPopup.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    QueryBuilderGroup,
    Button, EmptyButton,
    Container,
    Popup, PopupFooter,
    AdvanceSelect,
} from '@vbd/vui';

import LayerService from 'services/layer.service';

class GeoAdvanceSearchPopupContent extends Component
{
    layerSvc = new LayerService();

    groupRefs = [];

    state = {
        selectedLayers: [],
        layerProps: null,
        layers: [],
    };

    constructor(props)
    {
        super(props);

        this.groupRef = React.createRef();
    }

    componentDidMount()
    {
        this.setState({ layers: this.props.layers });
    }

    setGroupRef = (ref) =>
    {
        this.groupRefs.push(ref);
    };

    handleApply = () =>
    {
        this.groupRefs = this.groupRefs.filter((x) => x !== null);

        const queries = [];
        for (let i = 0; i < this.groupRefs.length; i++)
        {
            queries.push(this.groupRefs[i].queryFormStatus());
        }

        this.props.onApply && this.props.onApply(this.state.layers, queries);
    };

    handleAddQuery = (layerName) =>
    {
        const layers = this.state.layers;

        if (layers && layers.length)
        {
            const layer = layers.find((l) => l.LayerName === layerName);

            this.layerSvc.getLayerProps(layerName).then((rs) =>
            {
                if (rs.data !== null)
                {
                    layer.advanceQuery = {
                        condition: 'AND',
                        no: false,
                        rules: [],
                    };

                    layer.props = rs.data.Properties;

                    this.setState({ layers: layers });
                }
            });
        }
    };

    handleRemoveQuery(layerName)
    {
        const layers = this.state.layers;
        const layer = layers.find((l) => l.LayerName === layerName);
        if (layer)
        {
            layer.advanceQuery = null;
            const groupRef = this.groupRefs.find((g) => g && g.props && g.props.layer === layerName);
            if (groupRef)
            {
                this.groupRefs.splice(this.groupRefs.indexOf(groupRef), 1);
            }
            this.setState({ layers: layers });
        }
    }

    handleLayerChanged = (value, currentSelect) =>
    {
        if (Array.isArray(value))
        {
            const layers = this.state.layers;
            const layer = layers.find((l) => l.LayerName === currentSelect);
            if (!layer || !layer.advanceQuery)
            {
                this.handleAddQuery(currentSelect);
            }
            else
            {
                this.handleRemoveQuery(currentSelect);
            }
        }
    };

    render()
    {
        const value = [];
        for (let i = 0; i < this.state.layers.length; i++)
        {
            if (this.state.layers[i].advanceQuery)
            {
                value.push(this.state.layers[i].LayerName);
            }
        }

        return (
            <Popup
                title={'Thiết lập truy vấn nâng cao'}
                width={'1000px'}
                height={'800px'}
                onClose={this.props.onClose}
            >

                <Container className={'advance-search-popup-header'}>
                    <AdvanceSelect
                        options={this.state.layers.map((layer) =>
                        {
                            return { id: layer.LayerName, label: layer.Caption };
                        })}
                        value={value}
                        placeholder={'Chọn lớp dữ liệu'}
                        multi
                        onChange={this.handleLayerChanged}
                    />
                </Container>

                <Container>
                    {
                        this.state.layers.filter((layer) => layer.advanceQuery).map((layer, index) => (
                            <Container key={index}>
                                <Container className={'query-builder-group-name'}>{layer.Caption}</Container>
                                <QueryBuilderGroup
                                    ref={this.setGroupRef}
                                    id={layer.LayerId}
                                    idGroup={layer.LayerId}
                                    layerData={this.state.layers}
                                    queryData={layer.advanceQuery}
                                    layer={layer.LayerName}
                                    props={layer.props}
                                    isFirst
                                />
                            </Container>
                        ),
                        )
                    }
                </Container>

                <PopupFooter>
                    <EmptyButton
                        text={'Hủy'}
                        onClick={this.props.onCancel}
                    />
                    <Button
                        text={'Xác nhận'}
                        color={'primary'}
                        onClick={this.handleApply}
                    />
                </PopupFooter>
            </Popup>
        );
    }
}

GeoAdvanceSearchPopupContent.propTypes = {
    queryData: PropTypes.object,
    onApply: PropTypes.func,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
};

GeoAdvanceSearchPopupContent.defaultProps = {
    queryData: {},
};

export { GeoAdvanceSearchPopupContent };
