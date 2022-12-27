import './SearchBoxContainer.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import {
    Container, PanelHeader,
    FAIcon,
    Button, Input,
    SearchSuggestContainer,
} from '@vbd/vui';

import { LocationContent } from 'components/app/PopupContent/LocationPopup';
import { SimplePopupContent } from 'components/app/PopupContent/SimplePopupContent';

class SearchBoxContainer extends Component
{
    directionStore = this.props.appStore.directionStore;
    searchStore = this.props.appStore.searchStore;
    direction = this.directionStore.direction;
    featureBarStore = this.props.appStore.featureBarStore;
    markerPopupStore = this.props.appStore.markerPopupStore;
    mapStore = this.props.appStore.mapStore;
    onAction = false;

    handleClearSearchText = () =>
    {
        this.handlePopupClose();
        this.searchStore.clearSearch();
    };

    handleTextChange = async (searchText) =>
    {
        this.searchStore.getSearchTempResult(searchText);
    };

    handlePopupClose = () =>
    {
        if (this.searchStore.selectedResult)
        {
            this.markerPopupStore.remove(this.searchStore.selectedResult.id);
        }
    };

    handleSelect = async (data, simpleContent) =>
    {
        this.onAction = true;
        this.handlePopupClose();

        if (data)
        {
            this.searchStore.selectedResult = data;

            if (this.mapStore.map !== undefined)
            {
                // go to location
                this.mapStore.map.flyTo({
                    center: [data.longitude, data.latitude],
                    zoom: 15,
                });
            }

            setTimeout(() =>
            {
                this.markerPopupStore.add({
                    id: data.id,
                    title: data.name,
                    sub: data.subcategory,
                    content: simpleContent ? <SimplePopupContent {...data} /> : <LocationContent {...data} />,
                    lng: data.longitude,
                    lat: data.latitude,
                    width: 350,
                    height: 230,
                    isActivate: true,
                    onClose: this.handlePopupClose,
                    // headerActions: [{ icon: 'film-alt' }, { icon: 'external-link' }],
                    // actions: [{ icon: 'sliders-v' }, { icon: 'link' }, { icon: 'engine-warning' }, { icon: 'exclamation-triangle' }]
                });
            }, 500);
        }
    };

    renderInputSearch = () =>
    {
        return (
            <Container className="ml-waypoint-wrapper">
                <Container className={'ml-waypoint-searchbox ' + (this.searchStore.key ? 'ml-waypoint-populated' : '')}>
                    <Container className="">
                        <Container
                            className="gsst_b sbib_c"
                            onClick={this.handleClearSearchText}
                        >
                            {
                                !this.searchStore.key
                                    ? (
                                            <FAIcon
                                                className="gsst_a"
                                                icon={'search'}
                                                type={'light'}
                                                color="var(--contrast-color)"
                                                size={'1.5rem'}
                                            />
                                        )
                                    : (
                                            <Button
                                                className="gsst_a icon-clearText"
                                                icon="times"
                                                size="sm"
                                                iconSize="md"
                                                onlyIcon
                                                isDefault
                                            />
                                        )
                            }
                        </Container>

                        <Container className="sbib_b">
                            <Input
                                placeholder={'Tìm vị trí'}
                                autoComplete="off"
                                spellCheck="false"
                                value={this.searchStore.key}
                                onChange={(value) => this.handleTextChange(value)}
                            />
                        </Container>
                    </Container>
                </Container>
            </Container>
        );
    };

    handleClose = () =>
    {
        this.searchStore.clearSearch();
        const path = this.props.match.path.split('/');
        path.pop();
        this.props.history.push(path.join('/'));
    };

    getSearchResult = () =>
    {
        let suggests = [];

        if (this.searchStore.tempResult && this.searchStore.tempResult.length)
        {
            suggests = this.searchStore.tempResult;
        }

        return suggests.map((loc) =>
        {
            return Object.assign({
                query: loc.name,
                hint: loc.address,
                provider: loc.providerType,
            }, loc);
        });
    };

    render()
    {
        return (
            <Container>
                <PanelHeader actions={[{ icon: 'times', onClick: this.handleClose }]}>
                    Tìm kiếm vị trí
                </PanelHeader>

                <Container className="ml-search-searchbox-top-content">
                    <Container className="ml-search-waypoints-wrapper">
                        <Container className="ml-search-center-panel">
                            <Container
                                id="ml-search-waypoints"
                                className="ml-search-waypoints visible"
                            >
                                {this.renderInputSearch()}
                            </Container>
                        </Container>
                    </Container>

                    <SearchSuggestContainer
                        maxHeight={'calc(100vh - 7.75rem)'}
                        searchResults={this.getSearchResult()}
                        isProvider={this.props.isProvider}
                        onSelect={(data) => this.handleSelect(data, this.props.isSimpleContent)}
                    />
                </Container>
            </Container>
        );
    }
}

SearchBoxContainer = inject('appStore')(observer(SearchBoxContainer));
SearchBoxContainer = withRouter(SearchBoxContainer);
export { SearchBoxContainer };
