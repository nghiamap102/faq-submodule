import './MapControl.scss';

import React, { useContext, useRef } from 'react';

import { PopOver } from 'components/bases/Modal/PopOver';
import { Col2, Row2 } from 'components/bases/Layout';
import { Container } from 'components/bases/Container/Container';
import { Button } from 'components/bases/Button/Button';

import { MapEditor } from './MapEditor';
import { MapInput } from './MapInput';
import { MapStateProvider, MapContext } from './MapContext';
// import {Search} from './SearchLocation/Search';

type MapControlProps = {
    value?: string,
    onChange?: Function,
    readOnly?: boolean,
    required?: boolean,
    placeholder?: string
}

export const MapControlContainer: React.FC<MapControlProps> = (
    {
        value = '',
        onChange = () =>
        {
        },
        readOnly = false,
        required = false,
        placeholder = '',
        ...props
    }) =>
{
    const { mapState, dispatch } = useContext<any>(MapContext);

    const mapControlRef = useRef<any>();

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

    const drawGeoJson = (val: string) =>
    {
        if (val)
        {
            try
            {
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
            catch (err: any)
            {
                console.error(err.message);
            }
        }
    };

    const onMapStyleLoad = () =>
    {
        drawGeoJson(value);
    };

    // const onSearchSuggestClick = (item: any) =>
    // {
    //     drawGeoJson(JSON.stringify({
    //         'type': 'Point',
    //         'coordinates': [
    //             item.longitude,
    //             item.latitude,
    //         ],
    //     }));
    // };

    const onSave = () =>
    {
        if (mapState.drawObj)
        {
            dispatch({
                type: 'setValue',
                data: JSON.stringify(mapState.drawObj.geometry),
            });
            onChange(JSON.stringify(mapState.drawObj.geometry));
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
                ref={mapControlRef}
                className="form-map-control-container"
            >
                <MapInput
                    value={value}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    onFocus={onFocus}
                />
                {
                    mapState.open && !readOnly && (
                        <PopOver
                            width={600}
                            height={360}
                            className={'minimap-popover'}
                            anchorEl={mapControlRef}
                            onBackgroundClick={closeMap}
                        >
                            <Col2 sx={{ spaceBetweenX: 0, spaceBetweenY: 0 }}>
                                {/* <Search onSuggestClick={onSearchSuggestClick} /> */}
                                <MapEditor
                                    onMapStyleLoad={onMapStyleLoad}
                                />
                                <Row2
                                    justify='end'
                                >
                                    <Button
                                        disabled={!mapState.drawObj}
                                        icon={'save'}
                                        text={'Lưu'}
                                        onClick={onSave}
                                    />
                                </Row2>
                            </Col2>
                        </PopOver>
                    )}
            </div>
        </Container>
    );
};

export const MapControl: React.FC<MapControlProps> = (props) =>
{
    return (
        <MapStateProvider>
            <MapControlContainer
                {...props}
            />
        </MapStateProvider>
    );
};
