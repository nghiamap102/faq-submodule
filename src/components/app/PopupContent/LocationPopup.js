import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Image, Button, ContainField, Field, Info } from '@vbd/vui';

import WhatHerePopupContent from './WhatHerePopup';

class LocationContent extends Component
{
    searchStore = this.props.appStore.searchStore;
    layerStore = this.props.appStore.layerStore;
    directionStore = this.props.appStore.directionStore;

    handleClickDetailLayers = () =>
    {
        const { contextMenuSetPointWhatHere, setWhatHereLocation, whatHereLocation, setFromSearch } = this.searchStore;
        const lngLat = { lat: this.props.latitude, lng: this.props.longitude };

        setFromSearch(true);

        if (!(whatHereLocation?.id))
        {
            setWhatHereLocation(this.props);
        }

        const renderWhatHerePopupContent = (locationData, layerLocationData) =>
        {
            return (
                <WhatHerePopupContent
                    listAllLayers={this.layerStore.listAllLayers}
                    locationData={locationData}
                    layerLocationData={layerLocationData}
                />
            );
        };

        contextMenuSetPointWhatHere(lngLat, renderWhatHerePopupContent);
    };

    render()
    {
        return (
            <ContainField>
                <Field>
                    <Info>{this.props.address}</Info>
                </Field>

                {
                    this.props.id &&
                    <Field>
                        <Info>
                            <Image
                                width='330px'
                                canEnlarge
                                src={`/api/loc-image?guid=${this.props.id}`}
                            />
                        </Info>
                    </Field>
                }

                <Field>
                    <Info>
                        <Button
                            color={'primary'}
                            onClick={this.handleClickDetailLayers}
                            text={'Chi tiết địa điểm'}
                        />
                    </Info>
                </Field>
            </ContainField>
        );
    }
}

LocationContent = inject('appStore')(observer(LocationContent));
export { LocationContent };
