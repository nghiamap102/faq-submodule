import 'components/app/LPR/PlateAlert.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
    FormControlLabel,
    FormGroup,
    Input,
    InputGroup, Section,
    DateTimePicker,
    FlexPanel, PanelBody,
    PanelFooter,
    Radio,
} from '@vbd/vui';

class SpaceRainSearchRequest extends Component
{

    spacerainSearchStore = this.props.store;

    handleChangeData = (key, value) =>
    {
        if (typeof this.props.onSearchStateChange === 'function')
        {
            this.props.onSearchStateChange(key, value);
        }
    };

    handlePlateNumberKeyDown = (e) =>
    {
        if (e.key === 'Enter' || e.keyCode === 13)
        {
            this.handleSearch();
        }
    };

    handleSearch = () =>
    {
        if (typeof this.props.onSearch === 'function')
        {
            this.props.onSearch();
        }
    };

    render()
    {
        const isByPlate = this.spacerainSearchStore.searchState.mode === 'init-by-plate';

        return (
            <FlexPanel width={'20rem'}>
                <PanelBody scroll>
                    <Section header={'Kiểu tìm kiếm'}>
                        <FormGroup>
                            <Radio
                                label="Theo biển số"
                                checked={isByPlate}
                                onChange={() => this.handleChangeData('mode', 'init-by-plate')}
                            />

                            <Radio
                                label="Theo Mac"
                                checked={!isByPlate}
                                onChange={() => this.handleChangeData('mode', 'mac')}
                            />
                        </FormGroup>
                    </Section>
                    <Section header={'Thông tin'}>
                        <FormGroup>
                            <FormControlLabel
                                label={isByPlate ? 'Biển số' : 'Mac'}
                                control={(
                                    <InputGroup>
                                        <Input
                                            placeholder={isByPlate ? 'Nhập biển số' : 'Nhập Mac'}
                                            value={this.spacerainSearchStore.searchState.value}
                                            onKeyDown={this.handlePlateNumberKeyDown}
                                            onChange={(event) =>
                                            {
                                                this.handleChangeData('value', event);
                                            }}
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormControlLabel
                                label={'Từ ngày'}
                                control={(
                                    <DateTimePicker
                                        value={this.spacerainSearchStore.searchState.startDate}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('startDate', event);
                                        }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label={'Đến ngày'}
                                control={(
                                    <DateTimePicker
                                        value={this.spacerainSearchStore.searchState.endDate}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('endDate', event);
                                        }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label={'Số lần khớp'}
                                control={(
                                    <Input
                                        value={this.spacerainSearchStore.searchState.matches}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('matches', event);
                                        }}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>
                </PanelBody>
                <PanelFooter
                    actions={[
                        {
                            text: 'Tìm kiếm', onClick: this.handleSearch,
                        },
                    ]}
                />
            </FlexPanel>
        );
    }
}

SpaceRainSearchRequest.propTypes = {
    onSearch: PropTypes.func,
    onSearchStateChange: PropTypes.func,
};

SpaceRainSearchRequest = inject('appStore')(observer(SpaceRainSearchRequest));
export default SpaceRainSearchRequest;
