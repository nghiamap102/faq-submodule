import './MapControl.scss';
import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { Column, PopOver, Container, Button } from '@vbd/vui';

import { MapContext, MapStateProvider } from 'extends/ffms/pages/Layerdata/MapControl/MapContext';
import { MapInput } from 'extends/ffms/pages/Layerdata/MapControl/MapInput';
import { MapEditor } from 'extends/ffms/pages/Layerdata/MapControl/MapEditor';
import { Search } from 'extends/ffms/pages/Layerdata/MapControl/SearchLocation/Search';

const MapControlContainer = (props) =>
{

    const { mapState, dispatch } = useContext(MapContext);
    const { value } = props;

    const mapControlRef = useRef();

    const closeMap = () =>
    {
        dispatch({
            type: 'closeMap',
        });
    };
    const onFocus = () =>
    {
        dispatch({
            type: 'openMap',
        });
    };

    const drawGeoJson = (val) =>
    {
        if (val)
        {
            try
            {
                // if (mapState.drawObj) {
                //     mapState.draw.delete([mapState.drawObj.id]);
                // }
                const geometry = JSON.parse(val);
                const id = mapState.draw.add(geometry)[0];
                dispatch({
                    type: 'createDraw',
                    data: {
                        id: id,
                        geometry: geometry,
                    },
                });
                mapState.mapUtil.fitBound([{ y: geometry.coordinates[0], x: geometry.coordinates[1] }]);
            }
            catch (err)
            {
                console.error(err.message);
            }
        }
    };

    const onMapStyleLoad = () =>
    {
        drawGeoJson(value);
    };
    const onSearchSuggestClick = (item) =>
    {
        drawGeoJson(JSON.stringify({
            'type': 'Point',
            'coordinates': [
                item.longitude,
                item.latitude,
            ],
        }));
    };
    const onSave = () =>
    {
        if (mapState.drawObj)
        {
            dispatch({
                type: 'setValue',
                data: JSON.stringify(mapState.drawObj.geometry),
            });
            if (typeof props.onChange === 'function')
            {
                props.onChange(JSON.stringify(mapState.drawObj.geometry));
            }
            dispatch({
                type: 'closeMap',
            });
        }
    };

    return (
        <Container
            style={{ width: '100%' }}
            className="form-map-container"
        >
            <div
                className="form-map-control-container"
                ref = {mapControlRef}
            >
                <MapInput
                    onFocus={onFocus}
                    value={value}
                    readOnly={props.readOnly}
                />
                {
                    mapState.open && !props.readOnly &&
                    <PopOver
                        className={'minimap-popover'}
                        anchorEl={mapControlRef}
                        onBackgroundClick={closeMap}
                    >
                        <Column>
                            <Search
                                onSuggestClick={onSearchSuggestClick}
                            />
                            <MapEditor
                                height={'20rem'}
                                onMapStyleLoad={onMapStyleLoad}
                            />
                            <Button
                                disabled={!mapState.drawObj}
                                icon={'save'}
                                iconSize={'0.875rem'}
                                text={'Lưu'}
                                onClick={onSave}
                            />
                        </Column>

                    </PopOver>
                }
            </div>
        </Container>
    );
};
export const MapControl = (props) =>
{
    return (
        <MapStateProvider>
            <MapControlContainer
                {...props}
            />
        </MapStateProvider>);
};
MapControl.propTypes = {
    required: PropTypes.bool,
    value: PropTypes.string,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
};

MapControl.defaultProps = {
    required: false,
    readOnly: false,
    value: '',
    onChange: () =>
    {
    },
};


