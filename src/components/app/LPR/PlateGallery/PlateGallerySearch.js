import '../PlateAlert.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
    Input, Section, FormControlLabel, FormGroup, AdvanceSelect,
    FlexPanel, PanelBody, PanelFooter,
} from '@vbd/vui';

import { PlateWatchListService } from 'services/plate-watch-list.service';
import Enum from 'constant/app-enum';

class PlateGallerySearch extends Component
{
    plateGalleryStore = this.props.appStore.plateGalleryStore;
    plateWatchListStore = this.props.appStore.plateWatchListStore;
    plateWatchlistSvc = new PlateWatchListService();

    componentDidMount = () =>
    {
        this.plateWatchlistSvc.getAll().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.plateWatchListStore.setWatchList(rs.data);
            }
        });
    };

    handleChangeData = (key, value) =>
    {
        this.plateGalleryStore.setSearchState(key, value);
    };

    handleSearch = () =>
    {
        if (typeof this.props.onSearch === 'function')
        {
            this.props.onSearch(this.state);
        }
    };

    render()
    {
        const { watchList } = this.plateWatchListStore;

        return (
            <FlexPanel width={'20rem'}>
                <PanelBody scroll>
                    <Section header={'Thông tin'}>
                        <FormGroup>
                            <FormControlLabel
                                label={'Biển số xe'}
                                control={(
                                    <Input
                                        placeholder={'Nhập biển số xe'}
                                        value={this.plateGalleryStore.searchState.plateNumber}
                                        onChange={(value) =>
                                        {
                                            this.handleChangeData('plateNumber', value);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Màu xe'}
                                control={(
                                    <Input
                                        placeholder={'Nhập màu xe'}
                                        value={this.plateGalleryStore.searchState.color}
                                        onChange={(value) =>
                                        {
                                            this.handleChangeData('color', value);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Loại xe'}
                                control={(
                                    <Input
                                        placeholder={'Nhập loại xe'}
                                        value={this.plateGalleryStore.searchState.type}
                                        onChange={(value) =>
                                        {
                                            this.handleChangeData('type', value);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Chủ sở hữu'}
                                control={(
                                    <Input
                                        placeholder={'Nhập tên chủ sở hữu'}
                                        value={this.plateGalleryStore.searchState.owner}
                                        onChange={(value) =>
                                        {
                                            this.handleChangeData('owner', value);
                                        }}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Theo dõi'}
                                control={(
                                    <AdvanceSelect
                                        options={watchList.map((wl) =>
                                        {
                                            return { id: wl.id, label: wl.name };
                                        })}
                                        value={this.plateGalleryStore.searchState.watchListIds || []}
                                        multi
                                        onChange={(value) =>
                                        {
                                            this.handleChangeData('watchListIds', value);
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
                            text: 'Tìm kiếm',
                            onClick: this.handleSearch,
                        }]}
                />
            </FlexPanel>
        );
    }
}

PlateGallerySearch.propTypes = {
    onSearch: PropTypes.func,
};

PlateGallerySearch = inject('appStore')(observer(PlateGallerySearch));
export default PlateGallerySearch;
