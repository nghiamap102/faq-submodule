import './WhatHerePoup.scss';

import React from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import {
    Row, Container,
    Field, Info, ContainField, Label,
    FAIcon, TB1,
    Section,
    Panorama,
    DescriptionItem,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';

import { POIContent } from 'components/app/PopupContent/POIPopup';

const WhatHerePopup = ({ locationData, layerLocationData, listAllLayers, ...props }) =>
{
    const history = useHistory();

    const formatAddress = (locationData) =>
    {
        let address = [locationData?.number, locationData?.street, locationData?.ward, locationData?.district, locationData?.province, locationData?.country];
        address = address.filter(Boolean).join(', ');
        return address;
    };

    const layerData = layerLocationData;
    const hasLayersData = layerLocationData?.length > 0;
    const address = formatAddress(locationData);

    const { searchStore, directionStore } = props.appStore;

    const handleDirection = (layersObject, layerData) =>
    {
        const whatHereLngLat = { lng: locationData.longitude, lat: locationData.latitude };

        directionStore.clearDirect();

        searchStore.geoFields.forEach((geoField) =>
        {
            if (layerData[geoField])
            {
                const coords = JSON.parse(layerData[geoField])?.coordinates;

                directionStore.contextMenuSetDirectionAtHere(true, whatHereLngLat).then(() =>
                {
                    directionStore.contextMenuSetDirectionAtHere(false, { lng: coords[0], lat: coords[1] }).then(() =>
                    {
                        searchStore.handleCloseWhatHerePopup();
                        const path = history.location.pathname.split('/');
                        const newPath = ['', path[1], 'direction'].join('/');
                        history.push(newPath);
                    });
                });
            }
        });
    };

    const renderLabelLayerInfo = (layersObject, layerData) =>
    {
        const nearestDistance = layerData.NearestDistance || '';

        return (
            <Row>
                <Container>{`${layersObject[layerData.Layer]?.Caption} (${nearestDistance}m)`}</Container>
                <FAIcon
                    className={'what-here-direct-icon'}
                    icon={'directions'}
                    size={'1.2rem'}
                    color={'var(--primary-color)'}
                    onClick={() => handleDirection(layersObject, layerData)}
                />
            </Row>
        );
    };

    const renderLayerInfo = (layerNotPanorama, layersObject) =>
    {
        return (
            <Container className={'what-here-layer-data-container'}>
                {
                    layerNotPanorama.map((layerData, i) =>
                    {
                        const isOddNumber = i % 2 !== 0;
                        const layerLabelData = CommonHelper.clone(layerData);
                        delete layerData.NearestDistance;

                        return (
                            <Container
                                key={i}
                                className={'what-here-layer-field-item-cover'}
                            >
                                {isOddNumber && <i className={'vertical-line '} />}

                                <DescriptionItem
                                    key={layerData.Id}
                                    direction={'column'}
                                    label={renderLabelLayerInfo(layersObject, layerLabelData)}
                                    className={'what-here-layer-field-item'}
                                >
                                    <POIContent
                                        labelWidth={'120px'}
                                        className={'what-here-layer-data-item'}
                                        contents={layerData}
                                    />
                                </DescriptionItem>
                            </Container>
                        );
                    })
                }
            </Container>
        );
    };

    const renderPopupContent = () =>
    {
        const layerPanoramaData = layerData.find((data) => data.Layer === 'ICS_PANORAMA');
        const layerNotPanorama = layerData.filter((data) => data.Layer !== 'ICS_PANORAMA' && data.Id);

        const layersObject = listAllLayers.reduce((acc, cur, i) =>
        {
            acc[cur.LayerName] = cur;
            return acc;
        }, {});

        return (
            <Container>
                {
                    (locationData?.name || address) && (
                        <Section
                            className={'what-here-section'}
                            header={'Thông tin vị trí'}
                        >
                            {
                                locationData?.name && (
                                    <DescriptionItem
                                        label={'Địa điểm'}
                                    >
                                        <TB1>{locationData?.name}</TB1>
                                    </DescriptionItem>
                                )}

                            {
                                address && (
                                    <DescriptionItem
                                        label={'Địa chỉ'}
                                    >
                                        <TB1>{address}</TB1>
                                    </DescriptionItem>
                                )}

                            {
                                (locationData?.longitude && locationData.latitude) && (
                                    <DescriptionItem
                                        label={'Tọa độ'}
                                    >
                                        <TB1>{locationData?.longitude} {locationData.latitude}</TB1>
                                    </DescriptionItem>
                                )}

                        </Section>
                    )}
                {
                    layerPanoramaData?.guid && (
                        <Section
                            className={'what-here-section'}
                            header={'Thông tin chi tiết lớp dữ liệu'}
                        >
                            <Panorama
                                height={'350px'}
                                img={`/api/pano?id=${layerPanoramaData?.guid}`}
                            />
                        </Section>
                    )}
                {
                    layerNotPanorama?.length > 0 && (
                        <Section
                            className={'what-here-section'}
                            header={'Thông tin liên quan'}
                        >
                            {renderLayerInfo(layerNotPanorama, layersObject)}
                        </Section>
                    )}
            </Container>
        );
    };

    const renderMarkerPopupContent = () =>
    {
        return (
            <ContainField>
                {
                    locationData?.name && (
                        <Field>
                            <Label width={'40px'}>
                                <FAIcon
                                    icon="question-circle"
                                    type={'solid'}
                                    size={'18px'}
                                    color={'#E83030'}
                                />
                            </Label>
                            <Info>{locationData?.name}</Info>
                        </Field>
                    )}
                {
                    address && (
                        <Field>
                            <Label width={'40px'}>
                                <FAIcon
                                    icon="map-marker-alt"
                                    type={'solid'}
                                    size={'18px'}
                                />
                            </Label>
                            <Info>{address}</Info>
                        </Field>
                    )}

                {
                    (locationData?.longitude && locationData?.latitude) && (
                        <Field>
                            <Label width={'40px'}>
                                <FAIcon
                                    icon="compass"
                                    type={'solid'}
                                    size={'18px'}
                                />
                            </Label>
                            <Info>{locationData?.latitude}, {locationData?.longitude}</Info>
                        </Field>
                    )}
            </ContainField>
        );
    };

    return hasLayersData ? renderPopupContent() : renderMarkerPopupContent();
};

export default inject('appStore')(observer(WhatHerePopup));

WhatHerePopup.propTypes = {
    locationData: PropTypes.object,
    layerLocationData: PropTypes.array,
    listAllLayers: PropTypes.array,
};

WhatHerePopup.defaultProps = {
    locationData: {},
    layerLocationData: [],
    listAllLayers: [],
};
