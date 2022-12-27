import './MeasureDistance.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { GeoJSONLayer } from 'react-mapbox-gl';

import { Container, T, MapControlButton } from '@vbd/vui';

import { Constants } from 'constant/Constants';

class MeasureDistance extends Component
{
    measureStore = this.props.appStore.measureStore;
    mapStore = this.props.appStore.mapStore;

    componentDidMount()
    {
        this.mapStore.map.on('mousemove', this.handleMouseMove);
        this.mapStore.map.on('click', this.handleAddMeasurePoint);
        this.mapStore.map.on('dblclick', this.handleCancelMeasure);
    }

    componentWillUnmount()
    {
        this.mapStore.map.off('mousemove', this.handleMouseMove);
        this.mapStore.map.off('click', this.handleAddMeasurePoint);
        this.mapStore.map.off('dblclick', this.handleCancelMeasure);
    }

    handleActiveMeasure = () =>
    {
        this.measureStore.handleToggleMeasure();
    };

    handleMouseMove = (e) =>
    {
        const { active, complete, showMeasurePopup, setMeasureOnDragPosition } = this.measureStore;

        if (active)
        {
            if (!complete)
            {
                this.mapStore.map.getCanvas().style.cursor = 'crosshair';
            }
            else
            {
                this.mapStore.map.getCanvas().style.cursor = 'default';
            }

            if (this.measureStore.drawingObject.points.length) // drawing map object
            {
                const point = {
                    longitude: e.lngLat.lng,
                    latitude: e.lngLat.lat,
                };

                setMeasureOnDragPosition(point);
                showMeasurePopup(point);
            }
        }
        else
        {
            this.mapStore.map.getCanvas().style.cursor = 'default';
        }
    };

    handleAddMeasurePoint = (e) =>
    {
        const { lat, lng } = e.lngLat;
        const { active, complete, addPointToDrawingObject, setMeasureDragPoints } = this.measureStore;

        if (active && !complete)
        {
            const newestClickPoint = {
                longitude: lng,
                latitude: lat,
            };

            addPointToDrawingObject(newestClickPoint);

            const lineObj = {
                type: Constants.MAP_OBJECT.LINES,
                points: [newestClickPoint, newestClickPoint],
            };

            setMeasureDragPoints(lineObj, 1 /* indexDrag */);
        }
    };

    handleCancelMeasure = (e) =>
    {
        this.handleAddMeasurePoint(e);
        if (this.measureStore.active && !this.measureStore.complete && this.measureStore.drawingObject.points && this.measureStore.drawingObject.points.length > 1) // measureStore
        {
            this.measureStore.addLastPointToDrawingObject({
                longitude: e.lngLat.lng,
                latitude: e.lngLat.lat,
            });


            this.measureStore.setComplete(true);
        }
    };

    render()
    {
        const { active, distances } = this.measureStore;
        const dotLineCoords = this.measureStore.renderOnDrag.points.map((o) => ([o.longitude, o.latitude]));
        const lineCoors = this.measureStore.drawedObject.points.map((o) => ([o.longitude, o.latitude]));
        const drawingLineCoors = this.measureStore.drawingObject.points.map((o) => ([o.longitude, o.latitude]));

        return (
            <Container className={'md-container'}>

                {/* MeasureLines */}
                <GeoJSONLayer
                    id={Constants.MEASURE_LINE_LAYER_ID}
                    data={{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': lineCoors || [],
                        },
                    }}
                    lineLayout={{
                        'line-join': 'round',
                        'line-cap': 'round',
                    }}
                    linePaint={{
                        'line-color': Constants.MEASURE_LINE_COLOR,
                        'line-width': Constants.MEASURE_LINE_WIDTH,
                    }}
                />

                {/* MeasureDrawingLines */}
                <GeoJSONLayer
                    id={Constants.MEASURE_DRAWING_LINES_LAYER_ID}
                    data={{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': drawingLineCoors || [],
                        },
                    }}
                    lineLayout={{
                        'line-join': 'round',
                        'line-cap': 'round',
                    }}
                    linePaint={{
                        'line-color': Constants.MEASURE_LINE_COLOR,
                        'line-width': Constants.MEASURE_LINE_WIDTH,
                        'line-opacity': Constants.MEASURE_DRAWING_LINE_OPACITY,
                    }}
                />

                {/* MeasureOnDrag */}
                <GeoJSONLayer
                    id={Constants.MEASURE_DRAG_LINE_LAYER_ID}
                    data={{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': dotLineCoords || [],
                        },
                    }}
                    lineLayout={{
                        'line-join': 'round',
                        'line-cap': 'square',
                    }}
                    linePaint={{
                        'line-color': Constants.MEASURE_LINE_COLOR,
                        'line-width': Constants.MEASURE_LINE_WIDTH,
                        'line-dasharray': [0.8, 0.6],
                    }}
                />


                <MapControlButton
                    active={active}
                    icon="ruler"
                    onClick={this.handleActiveMeasure}
                />
                {
                    distances?.length > 0 && active && (
                        <Container className={'distance-container action-menu'}>
                            <T params={[distances.reduce((sum, x) => sum + x).toFixed(2)]}>Tổng khoảng cách: %0% m</T>
                        </Container>
                    )}
            </Container>
        );
    }
}

MeasureDistance = inject('appStore')(observer(MeasureDistance));
export default MeasureDistance;

