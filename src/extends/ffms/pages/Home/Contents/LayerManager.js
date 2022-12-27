import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Layer, Source } from 'react-mapbox-gl';

import { Container } from '@vbd/vui';
import { AppConstant } from 'constant/app-constant';

class LayerManager extends Component
{
    markerStore = this.props.appStore.markerStore;
    layerStore = this.props.appStore.layerStore;
    mapStore = this.props.appStore.mapStore;

    componentDidMount()
    {
        this.layerStore.listAllLayers = [];
    }

    render()
    {
        if (this.props.isSingleOverlay)
        {
            if (this.layerStore.rasterSources && this.layerStore.rasterSources.length)
            {
                const layerNames = [];
                const strokes = [];
                const fills = [];
                const timestamp = new Date().getTime();

                for (let i = 0; i < this.layerStore.rasterSources.length; i++)
                {
                    const rasterSource = this.layerStore.rasterSources[i];
                    layerNames.push(rasterSource.name);
                    strokes.push(rasterSource.strokeStyle);
                    fills.push(rasterSource.fillStyle);
                }

                const tileUrl = layerNames.length === 1 ?
                    `&Layers=${layerNames.join('')}&Strokes=${strokes.join('')}&Fills=${fills.join('')}` :
                    `&Layers=${layerNames.join('|') + '|'}&Strokes=${strokes.join('|') + '|'}&Fills=${fills.join('|') + '|'}`;

                this.layerStore.combinedRasterSource = {
                    id: 'rasterSourceId',
                    name: 'rasterSource',
                    type: 'raster',
                    tiles: [`${AppConstant.vdms.url}/App/Render/Overlay.ashx?Level={z}&X={x}&Y={y}${tileUrl}&t=${timestamp}`],
                    tileSize: 256,
                };
            }
            else
            {
                this.layerStore.combinedRasterSource = {};
            }
        }

        return (
            <Container>
                {
                    !this.props.isSingleOverlay && this.layerStore.rasterSources && this.layerStore.rasterSources.map((source) =>
                    {
                        return (
                            <React.Fragment key={source.id}>
                                <Source
                                    id={`source_${source.name}`}
                                    tileJsonSource={source}
                                />
                                <Layer
                                    type="raster"
                                    id={`layer_${source.name}`}
                                    sourceId={`source_${source.name}`}
                                />
                            </React.Fragment>
                        );
                    })
                }
                {
                    this.props.isSingleOverlay && this.layerStore.combinedRasterSource && this.layerStore.combinedRasterSource.type &&
                    <>
                        <React.Fragment key={this.layerStore.combinedRasterSource.id}>
                            <Source
                                id={`source_${this.layerStore.combinedRasterSource.name}`}
                                tileJsonSource={this.layerStore.combinedRasterSource}
                            />
                            <Layer
                                type="raster"
                                id={`layer_${this.layerStore.combinedRasterSource.name}`}
                                sourceId={`source_${this.layerStore.combinedRasterSource.name}`}
                            />
                        </React.Fragment>
                    </>
                }
                {
                    this.layerStore.mapnikSources &&
                    <>
                        <Source
                            id="source_mapnik"
                            tileJsonSource={this.layerStore.mapnikSources}
                        />
                        <Layer
                            type="raster"
                            id="layer_mapnik"
                            sourceId="source_mapnik"
                        />
                    </>
                }
            </Container>
        );
    }
}

LayerManager.propTypes = {
    isSingleOverlay: PropTypes.bool,
};

LayerManager.defaultProps = {
    isSingleOverlay: false,
};

LayerManager = inject('appStore')(observer(LayerManager));
export default LayerManager;
