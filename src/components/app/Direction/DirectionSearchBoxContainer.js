import './DirectionSearchBoxContainer.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Container, Button, Input, SearchSuggestContainer } from '@vbd/vui';

class DirectionSearchBoxContainer extends Component
{
    directionStore = this.props.appStore.directionStore;
    direction = this.directionStore.direction;
    onAction = false;

    handleFocus = (index) =>
    {
        // to prevent onblur hide the list result too quick
        setTimeout(() =>
        {
            if (index === null && this.onAction)
            {
                this.onAction = false;
                return;
            }

            this.directionStore.setDirectionLocationFocusing(index);
        }, 200);
    };

    handleBack = () =>
    {
        this.directionStore.handleBackFromDirection();
    };

    handleClearSearchText = (i) =>
    {
        this.onAction = true;

        this.directionStore.clearDirectionSearchText(i);
        this.directionStore.setDirectionLocationFocusing(i);
    };

    handleTextChange = async (i, searchText) =>
    {
        this.directionStore.getDirectionSearchTempResult(i, searchText);
    };

    handleSelect = async (data) =>
    {
        this.onAction = true;

        if (data)
        {
            if (data.isMyLocation)
            {
                await this.directionStore.refreshMyLocation();
            }

            this.directionStore.setDirectionLocation(this.direction.locationFocusing, data);
            this.directionStore.showDirectionControl();
            this.directionStore.setDirectionLocationFocusing(null);
            // this.directionStore.placesHistory.addPlaceHistory(data);
        }
    };

    handleReverseDirection = () =>
    {
        this.directionStore.reverseDirection();
    };

    renderInputSearch = (loc, i) =>
    {
        if (this.direction.locations && this.direction.locations[i])
        {
            const populated = this.direction.locations[i].key !== '';

            return (
                <Container
                    key={i}
                    className="ml-waypoint-wrapper"
                >
                    <Container className={'ml-waypoint-searchbox' + (populated ? ' ml-waypoint-populated' : '')}>
                        <Container
                            className="gsst_b sbib_c"
                            onClick={() =>
                            {
                                this.handleClearSearchText(i);
                            }}
                        >
                            {
                                this.direction.locations[i].key && (i === this.direction.locationFocusing) &&
                                (
                                    <Button
                                        className="gsst_a icon-clearText"
                                        icon={'times'}
                                        size='sm'
                                        iconSize='md'
                                        onlyIcon
                                        isDefault
                                    />
                                )
                            }
                        </Container>

                        <Container className="sbib_b">
                            <Input
                                placeholder={loc.placeHolder}
                                autoComplete="off"
                                spellCheck="false"
                                value={this.direction.locations[i].key}
                                onFocus={() => this.handleFocus(i)}
                                onBlur={() => this.handleFocus(null)}
                                onChange={(value) => this.handleTextChange(i, value)}
                            />
                        </Container>
                    </Container>
                </Container>
            );
        }
    };

    renderAllInputs = () =>
    {
        if (this.direction.locations)
        {
            return this.direction.locations.map((loc, i) =>
            {
                return this.renderInputSearch(loc, i);
            });
        }

        return null;
    };

    handleRemoveLocation = (index) =>
    {
        this.props.appStore.directionStore.removeMiddleDirectionLocation(index);
    };

    handleAddMoreLocation = () =>
    {
        this.props.appStore.directionStore.addMiddleDirectionLocation();
    };

    renderMiddleLocations = () =>
    {
        if (this.direction.locations && this.direction.locations.length > 2)
        {
            const middleLocations = this.direction.locations.slice(1, this.direction.locations.length - 1);

            return (
                middleLocations.map((loc, i) =>
                {
                    const indexInLocations = i + 1;
                    return (
                        <button
                            key={indexInLocations}
                            className="ml-directions-icon"
                            onClick={() =>
                            {
                                this.handleRemoveLocation(indexInLocations);
                            }}
                        >

                            <svg
                                className={'vbdicons_dele_point'}
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2c5.523,0 10,4.477 10,10 0,5.523 -4.477,10 -10,10 -5.523,0 -10,-4.477 -10,-10 0,-5.523 4.477,-10 10,-10zm-4 9.001l8 0c0.55,0 1,0.449 1,0.999l0 0.001c0,0.55 -0.45,1 -1,1l-8 0c-0.55,0 -1,-0.45 -1,-1l0 -0.001c0,-0.55 0.45,-0.999 1,-0.999z"
                                />
                            </svg>
                        </button>
                    );
                })
            );
        }

        return null;
    };

    getSearchResult = () =>
    {
        const direction = this.props.appStore.directionStore.direction;
        let suggests = [];

        if (direction.locationFocusing != null && direction.locations[direction.locationFocusing])
        {
            const tempResult = direction.locations[direction.locationFocusing].tempResult;
            const currentResult = direction.locations[direction.locationFocusing].result;

            if (tempResult && tempResult.length)
            {
                suggests = tempResult;
            }
            else
            {
                suggests = currentResult;
            }
        }

        const searchResults = suggests.map((loc) =>
        {
            return Object.assign({
                query: loc.name,
                hint: loc.address,
                provider: loc.providerType,
            }, loc);
        });

        return searchResults;
    };

    render()
    {
        return (
            <Container className="ml-directions-searchbox-top-content">
                <Container className="ml-directions-waypoints-wrapper">

                    <Container className="ml-directions-center-panel">
                        <Container
                            id="ml-directions-waypoints"
                            className="ml-directions-waypoints visible"
                        >
                            {this.renderAllInputs()}
                        </Container>
                    </Container>

                    <Container className="ml-directions-right-panel">
                        <button
                            className="ml-directions-icon"
                            onClick={this.handleReverseDirection}
                        >
                            <svg
                                className={'vbdicons_switch'}
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15.001 17.001l0 -6.001c0,-0.549 -0.45,-1 -1,-1l-0.001 0c-0.549,0 -0.999,0.45 -0.999,1l0 6.001 -2.501 0c-0.276,0 -0.5,0.224 -0.5,0.5 0,0.142 0.06,0.271 0.155,0.362l0.001 0 0.008 0.008 0.009 0.008 3.137 2.845 0.01 0.009 0 0c0.179,0.166 0.418,0.267 0.68,0.267 0.263,0 0.502,-0.101 0.681,-0.267l0 0 0.009 -0.009 3.137 -2.845 0.009 -0.008 0.009 -0.008 0.001 0c0.095,-0.091 0.154,-0.22 0.154,-0.362 0,-0.276 -0.224,-0.5 -0.5,-0.5l-2.499 0zm-4 -10.001l0 6c0,0.55 -0.451,1 -1,1l-0.001 0c-0.549,0 -1,-0.45 -1,-1l0 -6 -2.5 0c-0.276,0 -0.5,-0.224 -0.5,-0.5 0,-0.142 0.06,-0.271 0.155,-0.362l0 0 0.009 -0.008 0.009 -0.008 3.137 -2.846 0.01 -0.009 0 0c0.178,-0.165 0.417,-0.267 0.68,-0.267 0.263,0 0.502,0.102 0.68,0.267l0.001 0 0.009 0.009 3.137 2.846 0.009 0.008 0.009 0.008 0 0c0.096,0.091 0.155,0.22 0.155,0.362 0,0.276 -0.224,0.5 -0.5,0.5l-2.499 0z"
                                />
                            </svg>
                        </button>

                        {this.renderMiddleLocations()}

                        {
                            this.props.appStore.directionStore.screen.isLarge && // only apply add middle locations for desktop
                            this.props.appStore.directionStore.direction.locations.length < this.props.appStore.directionStore.direction.maxLocations && (
                                <button
                                    className="ml-directions-icon"
                                    onClick={this.handleAddMoreLocation}
                                >
                                    <svg
                                        className={'vbdicons_add_point'}
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12 2c5.523,0 10,4.477 10,10 0,5.523 -4.477,10 -10,10 -5.523,0 -10,-4.477 -10,-10 0,-5.523 4.477,-10 10,-10zm-4 9.001l3 0 0 -3.001c0,-0.55 0.45,-0.999 1,-0.999l0.001 0c0.549,0 0.999,0.449 0.999,0.999l0 3.001 3 0c0.55,0 1,0.449 1,0.999l0 0.001c0,0.55 -0.45,1 -1,1l-3 0 0 3c0,0.55 -0.45,1 -0.999,1l-0.001 0c-0.55,0 -1,-0.45 -1,-1l0 -3 -3 0c-0.55,0 -1,-0.45 -1,-1l0 -0.001c0,-0.55 0.45,-0.999 1,-0.999z"
                                        />
                                    </svg>
                                </button>
                            )}
                    </Container>
                </Container>

                {
                    this.direction.locationFocusing != null && (
                        <SearchSuggestContainer
                            maxHeight={'calc(100vh - 210px)'}
                            searchResults={this.getSearchResult()}
                            handleClickSetting={this.handleClickSetting}
                            isProvider={this.props.isProvider}
                            onSelect={this.handleSelect}
                        />
                    )}
            </Container>
        );
    }
}

DirectionSearchBoxContainer = inject('appStore')(observer(DirectionSearchBoxContainer));
export { DirectionSearchBoxContainer };
