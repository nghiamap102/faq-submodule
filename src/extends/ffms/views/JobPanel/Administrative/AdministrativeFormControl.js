import './AdministrativeFormControl.scss';
import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

import {
    Container, Button,
    Line, TB1, TB2,
    Row, Column,
    AdvanceSelect, Input, FormControlLabel, withTenant,
} from '@vbd/vui';

import { Constants } from 'constant/Constants';
import MapLocationControl from 'components/app/Location/MapLocationControl';
import MapLocation from 'components/app/Location/ModifyMapLocation/MapLocation';
import MapLocationDisplay from 'components/app/Location/MapLocationDisplay';

import lightStyleOverride from 'extends/ffms/map-styles/light-style.override.js';
import darkStyleOverride from 'extends/ffms/map-styles/dark-style.override.js';
import satelliteStyleOverride from 'extends/ffms/map-styles/satellite-style.override.js';
import terrainStyleOverride from 'extends/ffms/map-styles/terrain-style.override.js';
import boundaryStyleOverride from 'extends/ffms/map-styles/boundary-style.override.js';

import { MAP_OPTIONS } from 'extends/ffms/constant/ffms-enum';
import GeocodeService from 'extends/ffms/services/GeocodeService';
export class AdministrativeFormControl extends Component
{
    // jobStore = this.props.fieldForceStore.jobStore;
    geocodeSvc = new GeocodeService();

    store = this.props.store;
    abStore = this.props.appStore.adminBoundariesStore;
    adminType = [Constants.TYPE_PROVINCE, Constants.TYPE_DISTRICT, Constants.TYPE_WARD];

    mapControlRef = createRef();
    mapOptions = this.props.tenantConfig.mapOptions ? this.props.tenantConfig.mapOptions : MAP_OPTIONS;
    state = {
        counter: 0,
        isLocationFields: false,
        currentLocation: {
            longitude: this.mapOptions.longitude,
            latitude: this.mapOptions.latitude,
        },
        validateDirty: { }, // dirty when change value control
    };

    componentDidMount = () =>
    {
        const { data } = this.props;
        const validateDirty = this.state.validateDirty;
        if (!this.abStore.countryRegion || this.abStore.countryRegion.length === 0)
        {
            this.abStore.initRegion().then((data) => this.bindRegionField(0, data));
        }
        else
        {
            this.bindRegionField(0, this.abStore.countryRegion);
        }

        try
        {
            data[this.props.inputNames.state] = !isNaN(data[this.props.inputNames.state]) ? parseInt(data[this.props.inputNames.state]) : data[this.props.inputNames.state];
            data[this.props.inputNames.district] = !isNaN(data[this.props.inputNames.district]) ? parseInt(data[this.props.inputNames.district]) : data[this.props.inputNames.district];
            data[this.props.inputNames.tehsil] = !isNaN(data[this.props.inputNames.tehsil]) ? parseInt(data[this.props.inputNames.tehsil]) : data[this.props.inputNames.tehsil];
        }
        finally
        {
            this.store.bindRegionOptions('AdministrativeID', data[this.props.inputNames.state], data[this.props.inputNames.district], data[this.props.inputNames.tehsil]);
        }

        for (const key in data)
        {
            if (data[key])
            {
                validateDirty[key] = true;
            }
        }


        this.setState({
            validateDirty,
            currentLocation: {
                // address: data[this.props.inputNames.street],
                longitude: data[this.props.inputNames.location] ? data[this.props.inputNames.location].coordinates[0] : this.mapOptions.longitude,
                latitude: data[this.props.inputNames.location] ? data[this.props.inputNames.location].coordinates[1] : this.mapOptions.latitude,
            },
        });
    }

    static getDerivedStateFromProps = (nextProps, prevState) =>
    {
        if (nextProps.data && nextProps.data[nextProps.inputNames.location] && nextProps.data[nextProps.inputNames.location].coordinates)
        {
            const nextLocation = {
                longitude: nextProps.data[nextProps.inputNames.location].coordinates[0],
                latitude: nextProps.data[nextProps.inputNames.location].coordinates[1],
            };
            if (!_isEqual(nextLocation, prevState.currentLocation))
            {
                return { currentLocation: nextLocation, counter: nextProps.store.shouldMapRerender ? prevState.counter + 1 : prevState.counter };
            }
        }

        return null;
    }

    handleValueChange = (name, value) =>
    {
        this.store.shouldMapRerender = false;
        this.props.onChange && this.props.onChange(name, value);

        if (value && !this.state.validateDirty[name])
        {
            const validateDirty = this.state.validateDirty;
            validateDirty[name] = true;
            this.setState({ validateDirty });
        }
    };

    handleValueChanges = (values) =>
    {
        const formData = Object.entries(values);

        for (let index = 0; index < formData.length; index++)
        {
            const [key, data] = formData[index];
            this.handleValueChange(key, data);
        }
    };

    bindRegionField = (level, regions) =>
    {
        this.store.setRegionOptions(level, regions);
    };

    handleSelectRegion = async (level, adminId) =>
    {

        // get child regions of this selected value
        const childLevel = level + 1;
        const adminType = this.adminType[childLevel];

        if (adminType)
        {
            const regions = await this.abStore.getChildByParentId(adminType, adminId);
            this.bindRegionField(childLevel, regions);
        }
    };

    handleLocationChange = (location) =>
    {
        this.mapControlRef.current.setLocationOnly(location);
        const { longitude, latitude } = location;

        this.handleValueChanges({
            [this.props.inputNames.location]: { type: 'Point', coordinates: [longitude, latitude] },
        });

        this.setState({ currentLocation: location });
    };

    handleTextChange = (value) =>
    {
        this.handleValueChange([this.props.inputNames.street] ,value);
    }

    handleStateSelect = (value) =>
    {
        this.handleValueChanges({
            [this.props.inputNames.state]: value,
            [this.props.inputNames.district]: null,
            [this.props.inputNames.tehsil]: null,
        });
        this.handleSelectRegion(0, value);
    };

    handleDistrictSelect = (value) =>
    {
        this.handleValueChanges({
            [this.props.inputNames.district]: value,
            [this.props.inputNames.tehsil]: null,
        });
        this.handleSelectRegion(1, value);
    };

    handleTehsilSelect = (value) =>
    {
        this.handleValueChange(this.props.inputNames.tehsil, value);
    };

    renderMapDropDown= (title, subtitle, actions)=>
    {

        return (
            <>
                <Row
                    className={'map-item-dropdown'}
                >
                    <Column
                        flex={0}
                        className={'map-item-dropdown-info'}
                        itemMargin={'md'}
                    >
                        <TB1>{title}</TB1>
                        <TB2>{subtitle}</TB2>
                    </Column>

                    <Column className={'map-item-dropdown-action'}>
                        {actions?.map(action => action)}

                    </Column>
                </Row>
            </>
        );
    }

    renderPopupCommandText = (text) =>
    {
        return (
            <Container className={'item-dropdown-command-container'}>
                <TB1
                    className={'item-dropdown-command-content'}
                >
                    {text}
                </TB1>
            </Container>
        );
    };

    handleRemoteValueChange = (name, value) =>
    {
        let type = undefined;

        switch (name)
        {
            case this.props.inputNames.state:
                type = Constants.TYPE_PROVINCE;
                break;
            case this.props.inputNames.district:
                type = Constants.TYPE_DISTRICT;
                break;
            case this.props.inputNames.tehsil:
                type = Constants.TYPE_WARD;
                break;
        }

        if (this.store.comSvc)
        {
            this.store.comSvc.queryData('ADMINISTRATIVE', {
                skip: 0,
                take: 50,
                searchKey: `${value}`,
                filterQuery: [`TYPE:("${type}")`],
            }).then((res) =>
            {
                const data = this.store.mapRegionOptions(res.data);

                switch (name)
                {
                    case this.props.inputNames.state:
                        this.store.stateOptions = data;
                        break;
                    case this.props.inputNames.district:
                        this.store.districtOptions = data;
                        break;
                    case this.props.inputNames.tehsil:
                        this.store.tehsilOptions = data;
                        break;
                }

            });
        }
    };

    render()
    {
        const { validateDirty } = this.state;
        const { data, isReadOnly, dirtyFields, inputNames, validators } = this.props;
        const { street, state, district, tehsil, pincode, village } = inputNames;
        const defaultRules = [{}];
        return (
            <>
                <MapLocationControl
                    required = {validators[street]?.required}
                    errorText={validateDirty[street] ? validators[street]?.message : ''}
                    key={'job_destination_address_street'}
                    ref={this.mapControlRef}
                    value ={data[street] || ''}
                    location={this.state.currentLocation}
                    label={'Đường/xá'}

                    disabled={isReadOnly}
                    clearable
                    dirty={dirtyFields ? !!dirtyFields[street] : false}

                    onSelectionChange={(location) =>
                    {
                        this.handleLocationChange(location);
                        this.setState({ counter: this.state.counter + 1 });
                    }}

                    onTextChange={this.handleTextChange}
                    renderDropdownDisplay={this.renderMapDropDown}
                    renderInputDisplay={(location) =>
                    {
                        if (location)
                        {
                            const isCoords = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.exec(location.address);

                            if (isCoords && isCoords.length)
                            {
                                return location.name;
                            }

                            return location.address;
                        }

                        return location;
                    }}
                    renderPopupCommandText = {this.renderPopupCommandText}
                    onGeoCodeSearch={(searchKey, bounds) => this.geocodeSvc.geocodeSearchDebounced(searchKey)}
                />
                {
                    isReadOnly ?
                        <MapLocationDisplay
                            height={'300px'}
                            location={this.state.currentLocation}

                            lightStyleOverride={lightStyleOverride}
                            darkStyleOverride={darkStyleOverride}
                            satelliteStyleOverride={satelliteStyleOverride}
                            terrainStyleOverride={terrainStyleOverride}
                            boundaryStyleOverride={boundaryStyleOverride}

                            interactive
                            scrollZoom={false}
                        /> :
                        <MapLocation
                            location={this.state.currentLocation}
                            onLocationChange={this.handleLocationChange}
                            counter={this.state.counter}
                            zoom={12}
                            scrollZoom={false}
                            
                            lightStyleOverride={lightStyleOverride}
                            darkStyleOverride={darkStyleOverride}
                            satelliteStyleOverride={satelliteStyleOverride}
                            terrainStyleOverride={terrainStyleOverride}
                            boundaryStyleOverride={boundaryStyleOverride}
                        />
                }

                <Row mainAxisAlignment={'end'}>
                    {
                        isReadOnly ?
                            <Line height={'1rem'}/> :
                            <Button
                                text={'Thêm chi tiết vị trí'}
                                icon={'plus'}
                                iconSize={'1rem'}
                                iconLocation={'right'}
                                className={'btn-add-fields'}
                                onClick={() => this.setState({ isLocationFields: !this.state.isLocationFields })}
                                color={'var(--text-color)'}
                                backgroundColor={this.state.isLocationFields ? 'var(--contrast-lighter)' : 'transparent'}
                            />
                    }
                </Row>

                <Column itemMargin={'sm'}>
                    <FormControlLabel
                        required = {validators[state]?.required}
                        errorText={validateDirty[state] ? validators[state]?.message : ''}

                        rules={defaultRules}
                        dirty={dirtyFields && dirtyFields[state]}
                        key={state}
                        label={'Bang'}
                        control={
                            <AdvanceSelect
                                className={'form-control'}
                                placeholder={'Chọn bang'}
                                name={state}
                                value={data[state] || ''}
                                options={this.store.stateOptions}
                                disabled={isReadOnly}

                                hasSearch
                                searchMode={'remote'}
                                onRemoteFetch={(value) => this.handleRemoteValueChange(state, value)}

                                clearable
                                onChange={(value) => this.handleStateSelect(value)}
                                onClear={() => this.handleStateSelect()}
                            />
                        }
                    />
                    <FormControlLabel
                        required = {validators[district]?.required}
                        errorText={validateDirty[district] ? validators[district]?.message : ''}

                        dirty={dirtyFields && dirtyFields[district]}
                        rules={defaultRules}
                        key={district}
                        label={'Quận'}
                        control={
                            <AdvanceSelect
                                placeholder={'Chọn quận'}
                                name={district}
                                value={data[district] || ''}
                                options={this.store.districtOptions}
                                disabled={isReadOnly}

                                hasSearch
                                searchMode={'remote'}
                                onRemoteFetch={(value) => this.handleRemoteValueChange(district, value)}

                                onChange={(value) => this.handleDistrictSelect(value)}
                                clearable
                                onClear={() => this.handleDistrictSelect()}
                            />
                        }
                    />
                    <FormControlLabel
                        required = {validators[tehsil]?.required}
                        errorText={validateDirty[tehsil] ? validators[tehsil]?.message : ''}
                        
                        dirty={dirtyFields && dirtyFields[tehsil]}
                        rules={defaultRules}
                        key={tehsil}
                        label={'Thị trấn'}
                        control={
                            <AdvanceSelect
                                placeholder={'Chọn thị trấn'}
                                name={tehsil}
                                value={data[tehsil] || ''}
                                options={this.store.tehsilOptions}
                                disabled={isReadOnly}

                                hasSearch
                                searchMode={'remote'}
                                onRemoteFetch={(value) => this.handleRemoteValueChange(tehsil, value)}

                                onChange={(value) => this.handleTehsilSelect(value)}
                                clearable
                                onClear={() => this.handleTehsilSelect()}
                            />
                        }
                    />
                    <FormControlLabel
                        required = {validators[pincode]?.required}
                        errorText={validateDirty[pincode] ? validators[pincode]?.message : ''}
                    
                        dirty={dirtyFields && dirtyFields[pincode]}
                        key={pincode}
                        label={'Mã pin'}
                        control={
                            <Input
                                placeholder={'Nhập mã pin'}
                                name={pincode}
                                value={data[pincode] || ''}
                                disabled={isReadOnly}
                                onChange={(val) => this.handleValueChange(pincode, val)}
                            />
                        }
                    />
                    {
                        (this.state.isLocationFields || isReadOnly) &&
                        <>
                            <FormControlLabel
                                required = {validators[village]?.required}
                                errorText={validateDirty[village] ? validators[village]?.message : ''}
                             
                                rules={defaultRules}
                                dirty={dirtyFields && dirtyFields[village]}
                                key={village}
                                label={'Làng'}
                                control={
                                    <Input
                                        autoFocus
                                        placeholder={'Làng'}
                                        name={village}
                                        value={data[village] || ''}
                                        disabled={isReadOnly}
                                        onChange={(val) => this.handleValueChange(village, val)}
                                    />
                                }
                            />
                        </>
                    }
                </Column>

            </>
        );
    }
}

AdministrativeFormControl.propTypes = {
    validators: PropTypes.object,
    data: PropTypes.object,
    isReadOnly: PropTypes.bool,
    onChange: PropTypes.func,
};
AdministrativeFormControl.defaultProps = {
    isReadOnly: false,
    required: false,
    validators: {},
};

AdministrativeFormControl = inject('appStore', 'fieldForceStore')(observer(AdministrativeFormControl));
AdministrativeFormControl = withTenant(AdministrativeFormControl);
export default AdministrativeFormControl;
