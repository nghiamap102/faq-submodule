import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';

import MapLocationDisplay from 'components/app/Location/MapLocationDisplay';
import ModifyMapLocation from 'components/app/Location/ModifyMapLocation/ModifyMapLocation';
import MapLocationControl from 'components/app/Location/MapLocationControl';

class MapLocationAdvance extends Component
{
    state = {
        location: null,
        showModify: false,
    };

    mapControlRef = createRef();

    componentDidMount()
    {
        const { location } = this.props;

        this.setState({ location });
    }

    handleClickMap = () =>
    {
        if (!this.props.disable)
        {
            this.setState({ showModify: true });
        }
    };

    handleCloseModifyMap = () =>
    {
        this.setState({ showModify: false });
    };

    static getDerivedStateFromProps(nextProps, prevState)
    {
        if (!_isEqual(nextProps.location, prevState.location))
        {
            return { location: nextProps.location }; // return new state
        }

        return null; // don't change state
    }

    handleApplyLocation = (location) =>
    {
        this.mapControlRef.current.setLocation(location);

        this.setState({ location });
        this.props.onLocationChange(location);
    };

    handleSelectionChange = (location) =>
    {
        this.setState({ location });
        this.props.onLocationChange(location);
    };

    render()
    {
        const { location, showModify } = this.state;

        return (
            <>
                <MapLocationControl
                    ref={this.mapControlRef}
                    location={location}
                    onSelectionChange={this.handleSelectionChange}
                    {...this.props}
                />

                <MapLocationDisplay
                    location={location}
                    interactive={this.props.interactive}
                    zoomLevel={this.props.zoomLevel}
                    onClick={this.handleClickMap}
                />

                {
                    showModify && (
                        <ModifyMapLocation
                            location={location}
                            onClose={this.handleCloseModifyMap}
                            onApplyLocation={this.handleApplyLocation}
                        />
                    )}

            </>
        );
    }
}

MapLocationAdvance.propTypes = {
    location: PropTypes.object,
    onLocationChange: PropTypes.func,
    interactive: PropTypes.bool,

    zoomLevel: PropTypes.number,
};

MapLocationAdvance.defaultProps = {
    interactive: false,
};

export default MapLocationAdvance;
