import '../FaceAlert.scss';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import {
    Input, AdvanceSelect, Section, FormControlLabel, FormGroup,
    FlexPanel, PanelBody, PanelFooter,
    DateTimePicker,
    withModal, ImageInput, Button, Container,
} from '@vbd/vui';

import { WatchListService } from 'services/watchList.service';
import { FaceAlertService } from 'services/face-alert.service';

const Enum = require('constant/app-enum');

class FaceGallerySearch extends Component
{
    faceGalleryStore = this.props.appStore.faceGalleryStore;
    watchListStore = this.props.appStore.watchListStore;
    watchListSvc = new WatchListService();
    faceAlertSvc = new FaceAlertService();

    constructor(props)
    {
        super(props);

        this.watchListSvc.gets().then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.watchListStore.setWatchList(rs.data);
            }
        });
    }


    handleChangeData = (key, value) =>
    {
        this.faceGalleryStore.setSearchState(key, value);
    };

    handleSearch = () =>
    {
        const { searchState } = this.faceGalleryStore;
        if (searchState.fromDateOfBirth > searchState.toDateOfBirth)
        {
            this.props.toast({ type: 'error', message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc' });
            return;
        }

        if (typeof this.props.onSearch === 'function')
        {
            this.props.onSearch(this.state);
        }
    };

    handleImageChange = async (file, image, orientation) =>
    {
        if (file)
        {
            this.faceGalleryStore.setSearchState('imagePath', file.name);
            this.faceGalleryStore.setSearchState('imageData', image);

            this.faceGalleryStore.setSearchState('status', 1);
            this.faceGalleryStore.setSearchState('faces', []);
            this.faceGalleryStore.setSearchState('boxes', {});

            this.faceAlertSvc.getFaceIds(file, orientation).then((rs) =>
            {
                if (!rs || rs.error)
                {
                    this.faceGalleryStore.setSearchState('status', -1);
                }

                if (rs && rs.face)
                {
                    const faces = [];
                    const boxes = {};

                    for (const face of rs.face)
                    {
                        faces.push({
                            candidates: face.ListCandidate?.map((c) =>
                            {
                                return {
                                    id: c.ID,
                                    accuracy: c.Prob,
                                };
                            }) || [],
                        });

                        if (face.ListCandidate)
                        {
                            for (const candidate of face.ListCandidate)
                            {
                                boxes[candidate.ID] = {
                                    x: face.X,
                                    y: face.Y,
                                    width: face.Width,
                                    height: face.Height,
                                };
                            }
                        }
                    }

                    this.faceGalleryStore.setSearchState('faces', faces);
                    this.faceGalleryStore.setSearchState('boxes', boxes);
                }

                this.faceGalleryStore.setSearchState('status', 2);
            });
        }
        else
        {
            this.faceGalleryStore.setSearchState('imagePath', '');
            this.faceGalleryStore.setSearchState('imageData', undefined);
            this.faceGalleryStore.setSearchState('faces', undefined);
        }
    };

    renderSearchPart = () =>
    {
        let searchPart;

        if (this.faceGalleryStore.searchState.imagePath)
        {
            const status = this.faceGalleryStore.searchState.status;

            if (status === 1)
            {
                searchPart = <Container className={'face-recognition-search'}>Đang xử lý...</Container>;
            }
            else if (status === 2)
            {
                if (this.faceGalleryStore.searchState.faces && this.faceGalleryStore.searchState.faces.length)
                {
                    searchPart = (
                        <Button
                            className={'face-recognition-search'}
                            color={'primary'}
                            text={'Tìm kiếm'}
                            onClick={this.handleSearch}
                        />
                    );
                }
                else
                {
                    searchPart = <Container className={'face-recognition-search'}>Không nhận dạng được mặt.</Container>;
                }
            }
            else if (status === -1)
            {
                searchPart = <Container className={'face-recognition-search'}>Có lỗi xảy ra, vui lòng thử lại sau.</Container>;
            }
        }
        else
        {
            searchPart = <Container className={'face-recognition-search'}>Vui lòng chọn ảnh để nhận dạng</Container>;
        }

        return searchPart;
    };

    render()
    {
        const { watchList } = this.watchListStore;

        return (
            <FlexPanel width={'20rem'}>
                <PanelBody scroll>
                    <Section header={'Thông tin'}>
                        <FormGroup>
                            <ImageInput onChange={this.handleImageChange} />

                            <FormControlLabel
                                label={'Họ và tên'}
                                control={(
                                    <Input
                                        placeholder={'Nhập họ và tên'}
                                        value={this.faceGalleryStore.searchState.fullName}
                                        onChange={(value) => this.handleChangeData('fullName', value)}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Giới tính'}
                                control={(
                                    <AdvanceSelect
                                        options={[
                                            { id: '', label: 'Tất cả' },
                                            { id: 'Nam', label: 'Nam' },
                                            { id: 'Nữ', label: 'Nữ' },
                                            { id: 'Khác', label: 'Khác' },
                                        ]}
                                        value={this.faceGalleryStore.searchState.gender}
                                        onChange={(value) => this.handleChangeData('gender', value)}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label={'Theo dõi'}
                                control={(
                                    <AdvanceSelect
                                        options={watchList.map((wl) => ({ id: wl.id, label: wl.name }))}
                                        value={this.faceGalleryStore.searchState.watchListIds || []}
                                        multi
                                        onChange={(value) => this.handleChangeData('watchListIds', value)}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>
                    <Section header={'Tuổi'}>
                        <FormGroup>
                            <FormControlLabel
                                label="Từ"
                                control={(
                                    <Input
                                        type={'number'}
                                        value={this.faceGalleryStore.searchState.fromAge}
                                        onChange={(event) => this.handleChangeData('fromAge', event)}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label="Đến"
                                control={(
                                    <Input
                                        type={'number'}
                                        value={this.faceGalleryStore.searchState.toAge}
                                        onChange={(event) => this.handleChangeData('toAge', event)}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>

                    <Section header={'Ngày sinh'}>
                        <FormGroup>
                            <FormControlLabel
                                label="Từ"
                                control={(
                                    <DateTimePicker
                                        value={this.faceGalleryStore.searchState.fromDateOfBirth}
                                        onChange={(event) => this.handleChangeData('fromDateOfBirth', event)}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label="Đến"
                                control={(
                                    <DateTimePicker
                                        value={this.faceGalleryStore.searchState.toDateOfBirth}
                                        onChange={(event) => this.handleChangeData('toDateOfBirth', event)}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>

                    <FormGroup>
                        <FormControlLabel
                            label="Quốc gia"
                            control={(
                                <AdvanceSelect
                                    options={[
                                        { id: '', label: 'Tất cả' },
                                        { id: 'VN', label: 'Việt Nam' },
                                        { id: 'US', label: 'Mỹ' },
                                        { id: 'JP', label: 'Nhật' },
                                        { id: 'CN', label: 'Trung Quốc' },
                                    ]}
                                    value={this.faceGalleryStore.searchState.country}
                                    onChange={(value) => this.handleChangeData('country', value)}
                                />
                            )}
                        />
                    </FormGroup>

                </PanelBody>

                <PanelFooter
                    actions={[{
                        text: 'Tìm kiếm',
                        onClick: this.handleSearch,
                        isLoading: this.faceGalleryStore.searchState.status === 1,
                        disabled: this.faceGalleryStore.searchState.status === 1,
                    }]}
                />
            </FlexPanel>
        );
    }
}

FaceGallerySearch.propTypes = {
    onSearch: PropTypes.func,
};

FaceGallerySearch = withModal(inject('appStore')(observer(FaceGallerySearch)));
export default FaceGallerySearch;
