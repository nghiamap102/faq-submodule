import './DirectionTravelMode.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Container, withModal } from '@vbd/vui';

import IconWalk from 'images/icon_walk.svg';
import IconCar from 'images/icon_car.svg';
import IconTransit from 'images/icon_transit.svg';
import Icon2W from 'images/icon_2w.svg';

const IconTravelMode = {
    'walk': IconWalk,
    'car': IconCar,
    'transit': IconTransit,
    '2w': Icon2W,
};

class DirectionTravelMode extends Component
{
    directionStore = this.props.appStore.directionStore;

    handleClick = (e) =>
    {
        this.directionStore.optionMenuToggle();

        if (this.directionStore.travelModeControl.isOptionMenuExpand)
        {
            const actions = this.directionStore.ROUTE_CRITERIA.map((mode) =>
            {
                const checked = mode.val === this.directionStore.direction.routeCriteria.val;

                return {
                    label: mode.name,
                    className: 'ml-directions-route-criteria-option',
                    iconClassName: 'ml-icon ' + (checked ? 'ml-checked' : ''),
                    onClick: () =>
                    {
                        this.directionStore.setDirectionRouteCriteria(mode.val);
                    },
                };
            },
            );

            const target = e.currentTarget.getBoundingClientRect();

            this.props.menu({
                id: 'directions-route-criteria-option',
                isTopLeft: false,
                position: { x: window.innerWidth - target.x - target.width - 15, y: target.y + 30 },
                actions: actions,
                onClose: this.directionStore.optionMenuToggle.bind(this.directionStore),
            });

        }
    };

    handleBarrierBtnClick = () =>
    {
        this.directionStore.barrierPanelToggle();
        this.directionStore.onToggleBarrierManager();
    };

    changeTravelMode = (mode) =>
    {
        this.directionStore.setDirectionTravelMode(mode);
    };

    renderTravelMode = (mode) =>
    {
        if (!this.directionStore.direction.travelMode)
        {
            return null;
        }

        const checked = mode === this.directionStore.direction.travelMode.name;

        return (
            <Container
                key={mode}
                className={'ml-directions-travel-mode-option ' + (checked ? 'ml-checked' : '')}
                onClick={() => this.changeTravelMode(mode)}
            >

                <input
                    name="travel-mode"
                    type="radio"
                    value="drive"
                    className="ml-directions-travel-mode-option-radio"
                />

                <label htmlFor={'ml-directions-travel-mode-' + mode}>
                    <span className="ml-directions-travel-mode-option-highlight">
                        <img
                            className={'ml-icon ml-icon-' + mode}
                            alt={mode}
                            src={IconTravelMode[mode]}
                        />
                        <span className={'ml-directions-travel-mode-option-time ml-directions-travel-mode-' + mode} />
                    </span>
                </label>
            </Container>
        );
    };

    renderAllTravelModes = () =>
    {
        return this.directionStore.TRAVEL_MODE.map((mode) => this.renderTravelMode(mode.name));
    };

    render()
    {
        return (
            <Container className={'ml-directions-searchbox-tabs'}>
                <Container className="ml-directions-travel-mode-switcher">
                    <form
                        name="travel"
                        className="ml-directions-travel-mode-form"
                    >
                        {this.renderAllTravelModes()}
                    </form>

                    <Container className="ml-directions-route-criteria-switcher">
                        <button
                            className={'ml-directions-switcher-btn option-btn ' + (this.directionStore.travelModeControl.isOptionMenuExpand ? 'active' : '')}
                            onClick={this.handleClick}
                        />
                        <button
                            className={'ml-directions-switcher-btn barrier-btn ' + (this.directionStore.travelModeControl.isBarrierPanelExpand ? 'active' : '')}
                            onClick={this.handleBarrierBtnClick}
                        />
                    </Container>

                </Container>
            </Container>
        );
    }

}

DirectionTravelMode = withModal(inject('appStore')(observer(DirectionTravelMode)));
export { DirectionTravelMode };
