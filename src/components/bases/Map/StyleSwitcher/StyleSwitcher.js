import './StyleSwitcher.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StyleSwitcherItem from './StyleSwitcherItem';
import { MapControlButton } from 'components/bases/Map/MapControlButton';

export class StyleSwitcher extends Component
{
    static propTypes = {
        onChangeMapStyle: PropTypes.func.isRequired,
        onToggleMapOverlay: PropTypes.func.isRequired
    };

    state = {
        isExpand: false,
        selectedStyleId: this.props.style.id,
        selectedOverlayIds: this.props.overlays.map((o) => o.id)
    };

    // handle Toggle Fab
    handleToggleFab = () =>
    {
        this.setState({ isExpand: !this.state.isExpand });
    };

    onChangeMapStyle = (style) =>
    {
        if (style.id !== this.state.selectedStyleId)
        {
            if (this.props.onChangeMapStyle)
            {
                this.props.onChangeMapStyle(style);
            }

            this.setState({ selectedStyleId: style.id });
        }
    };

    onToggleMapOverlay = (overlay) =>
    {
        if (this.state.selectedOverlayIds.includes(overlay.id))
        {
            this.setState({ selectedOverlayIds: this.state.selectedOverlayIds.filter((id) => id !== overlay.id) });

            if (this.props.onToggleMapOverlay)
            {
                this.props.onToggleMapOverlay(overlay, false);
            }
        }
        else
        {
            this.setState({ selectedOverlayIds: [...this.state.selectedOverlayIds, overlay.id] });

            if (this.props.onToggleMapOverlay)
            {
                this.props.onToggleMapOverlay(overlay, true);
            }
        }
    };

    render()
    {
        return (
            <div className={'style-switcher-container'}>
                <MapControlButton
                    icon={'layer-group'}
                    onClick={this.handleToggleFab}
                    active={this.state.isExpand}
                />

                {
                    this.state.isExpand &&
                    <div className={'style-switcher-popup action-menu'}>
                        {
                            this.props.mapStyles.map((style) =>
                                <StyleSwitcherItem
                                    key={style.id}
                                    isActive={style.id === this.state.selectedStyleId}
                                    mapStyle={style}
                                    onClick={this.onChangeMapStyle}
                                />
                            )
                        }

                        {
                            this.props.showOverlays &&
                            <>
                                <div className={'style-switcher-popup-break'} />
                                {
                                    this.props.mapOverlays.map((overlay) =>
                                        <StyleSwitcherItem
                                            key={overlay.id}
                                            isActive={this.state.selectedOverlayIds.includes(overlay.id)}
                                            mapStyle={overlay}
                                            onClick={this.onToggleMapOverlay}
                                        />
                                    )
                                }
                            </>
                        }
                    </div>
                }
            </div>
        );
    }

}

StyleSwitcher.propTypes = {
    showOverlays: PropTypes.bool
};

StyleSwitcher.defaultProps = {
    showOverlays: true
};
