import './BarrierManager.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import area from '@turf/area';
import length from '@turf/length';

import { PanelHeader , Container, PanelFooter } from '@vbd/vui';

import BarrierList from './BarrierList';

class BarrierManager extends Component
{
    directionStore = this.props.appStore.directionStore;
    mapStore = this.props.appStore.mapStore;

    handleClose = () =>
    {
        const draw = this.directionStore.barrier.barrierDrawTool;

        this.directionStore.removeBarrierFromServer(true);
        this.directionStore.findDirectionShortestPath(false);

        if (draw)
        {
            draw.deleteAll();
        }

        this.directionStore.barrierPanelToggle();
        this.directionStore.onToggleBarrierManager();
    };

    buildMyBarrier(barrier)
    {
        const type = barrier.features[0].geometry.type;
        const geometry = barrier.features[0].geometry;
        let des = '';

        switch (type)
        {
            case 'Point':
                des = geometry.coordinates[1].toFixed(6) + ', ' + geometry.coordinates[0].toFixed(6);
                break;
            case 'Polygon':
                des = (area(geometry) / 1000000).toFixed(2) + ' km²';
                break;
            case 'LineString':
                des = length(geometry).toFixed(2) + ' km';
                break;
            default:
        }

        return {
            id: barrier.features[0].id,
            type: type,
            coords: barrier.features[0].geometry.coordinates,
            des: des,
        };
    }

    onBarrierCreate = (barrier) =>
    {
        this.directionStore.addBarrier(this.buildMyBarrier(barrier));
    };

    onBarrierDelete = (barrier) =>
    {
        this.directionStore.removeSingleBarrier(barrier.features[0].id);
    };

    onBarrierUpdate = (barrier) =>
    {
        this.directionStore.updateBarrier(this.buildMyBarrier(barrier));
    };

    handleDeleteAll = () =>
    {
        const draw = this.directionStore.barrier.barrierDrawTool;
        this.directionStore.removeBarrierFromServer(true);
        this.directionStore.findDirectionShortestPath(false);

        if (draw)
        {
            draw.deleteAll();
        }
    };

    handleApply = () =>
    {
        this.directionStore.findDirectionShortestPath(false);
    };

    componentDidMount()
    {
        const draw = new MapboxDraw({
            clickBuffer: 3,
            displayControlsDefault: false,
            controls: { point: true, line_string: true, polygon: true, trash: true },
        });

        this.mapStore.map.addControl(draw, 'top-left');
        this.mapStore.map.on('draw.create', this.onBarrierCreate);
        this.mapStore.map.on('draw.delete', this.onBarrierDelete);
        this.mapStore.map.on('draw.update', this.onBarrierUpdate);

        this.directionStore.barrier.barrierDrawTool = draw;
    }

    componentWillUnmount()
    {
        this.mapStore.map.removeControl(this.directionStore.barrier.barrierDrawTool);
    }

    render()
    {
        return (
            <Container>
                {
                    <Container>
                        <PanelHeader actions={[{ icon: 'times', onClick: this.handleClose }]}>
                            Chướng ngại vật
                        </PanelHeader>
                        <BarrierList />
                        <PanelFooter
                            actions={[
                                {
                                    text: 'Xóa hết',
                                    onClick: this.handleDeleteAll,
                                },
                                {
                                    text: 'Áp dụng',
                                    onClick: this.handleApply,
                                },
                            ]}
                        />
                    </Container>
                }
            </Container>
        );
    }
}

BarrierManager.propTypes = {
    // className: PropTypes.string,
};

BarrierManager.defaultProps = {
    className: '',
    // title: 'Facility Evacuation',
};

BarrierManager = inject('appStore')(observer(BarrierManager));
export default BarrierManager;
