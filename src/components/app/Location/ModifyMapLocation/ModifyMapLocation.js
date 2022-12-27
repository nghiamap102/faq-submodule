import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Popup, PopupFooter,
    Button, EmptyButton,
    Input, FormControlLabel,
    withModal,
} from '@vbd/vui';

import MapLocation from 'components/app/Location/ModifyMapLocation/MapLocation';

import { LocationService } from 'services/location.service';
import Enum from 'constant/app-enum';

class ModifyMapLocation extends Component
{
    locationSvc = new LocationService();

    state = {
        location: null,
        locationSave: null,
    };

    componentDidMount()
    {
        const { location } = this.props;
        this.setState({ location });
    }

    // update date callBack location
    getNewLocation = (location, cb) =>
    {
        this.setState({ location: location });

        this.locationSvc.getLocationDataByGeo(location.longitude, location.latitude).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success && rs.data)
            {
                const newLocation = {
                    ...location,
                    address: [rs.data.street === undefined ? '' : rs.data.street, rs.data.ward === undefined ? '' : rs.data.ward, rs.data.district === undefined ? '' : rs.data.district].filter((x) => x).join(', '),
                    city: rs.data.province,
                    country: rs.data.country,
                };

                if (typeof cb === 'function')
                {
                    cb(newLocation);
                }
            }
        });
    };

    handleAddChangeData = (event, dataType) =>
    {
        this.setState((state) => ({
            location: {
                ...state.location,
                [dataType]: event,
            },
        }));
    };

    handleApplyLocationClicked = () =>
    {
        const { location } = this.state;

        if (!location.address)
        {
            this.props.toast({ type: 'error', message: 'Đường không được bỏ trống' });
            return;
        }

        if (!location.city)
        {
            this.props.toast({ type: 'error', message: 'Tỉnh/Thành phố không được bỏ trống' });
            return;
        }

        this.props.onApplyLocation(location);
        this.props.onClose();
    };

    handleLocationChange = (location) =>
    {
        this.setState({ location: location });

        this.getNewLocation(location, (locationUpdate) =>
        {
            this.setState({ location: locationUpdate });
        });
    };

    onAddressChange = (value) => this.handleAddChangeData(value, 'address');

    onCityChange = (value) => this.handleAddChangeData(value, 'city');

    onCountryChange = (value) => this.handleAddChangeData(value, 'country');

    render()
    {
        const { location } = this.state;
        if (!location)
        {
            return null;
        }

        return (
            <Popup
                title="Chọn vị trí"
                width={'800px'}
                onClose={this.props.onClose}
            >
                <FormControlLabel
                    label={'Địa chỉ'}
                    control={(
                        <Input
                            value={location.address}
                            placeholder="Điền địa chỉ..."
                            width="100%"
                            onChange={this.onAddressChange}
                        />
                    )}
                />

                <FormControlLabel
                    label={'Thành phố'}
                    control={(
                        <Input
                            value={location.city}
                            placeholder="Điền tên thành phố..."
                            width="100%"
                            onChange={this.onCityChange}
                        />
                    )}
                />

                <FormControlLabel
                    label={'Quốc gia'}
                    control={(
                        <Input
                            value={location.country}
                            placeholder="Điền tên quốc gia..."
                            width="100%"
                            onChange={this.onCountryChange}
                        />
                    )}
                />

                <FormControlLabel
                    label={'Vị trí'}
                    direction={'column'}
                    control={(
                        <MapLocation
                            location={this.props.location}
                            onLocationChange={this.handleLocationChange}
                        />
                    )}
                />

                <PopupFooter>
                    <EmptyButton
                        text="Hủy"
                        onClick={this.props.onClose}
                    />
                    <Button
                        color="primary"
                        text="Xác nhận"
                        onClick={this.handleApplyLocationClicked}
                    />
                </PopupFooter>
            </Popup>
        );
    }
}

ModifyMapLocation.propTypes = {
    location: PropTypes.object,
    onClose: PropTypes.func,
    onApplyLocation: PropTypes.func,
};

ModifyMapLocation.defaultProps = {
    onClose: () =>
    {
    },
    onApplyLocation: () =>
    {
    },
};

export default withModal(ModifyMapLocation);
