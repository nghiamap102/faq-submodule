import './FaceRecognitionSearch.scss';

import { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    Button,
    T,
    DateTimePicker,
    Input, AdvanceSelect, Section, FormControlLabel, FormGroup,
    FlexPanel, PanelBody, PanelFooter,
    withModal,
    ImageInput,
} from '@vbd/vui';

import { FaceAlertService } from 'services/face-alert.service';

class FaceRecognitionSearch extends Component
{
    faceRecognitionStore = this.props.appStore.faceRecognitionStore;
    faceAlertSvc = new FaceAlertService();

    handleChangeData = (key, value) =>
    {
        this.faceRecognitionStore.setSearchState(key, value);
    };

    handleImageChange = async (file, image, orientation) =>
    {
        if (file)
        {
            this.faceRecognitionStore.setSearchState('imagePath', file.name);
            this.faceRecognitionStore.setSearchState('imageData', image);
            this.faceRecognitionStore.setSearchState('status', 1);
            this.faceRecognitionStore.setSearchState('faces', []);
            this.faceRecognitionStore.setSearchState('boxes', {});

            this.faceAlertSvc.getFaceIds(file, orientation).then((rs) =>
            {
                if (!rs || rs.error)
                {
                    this.faceRecognitionStore.setSearchState('status', -1);
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
                            }),
                        });

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

                    this.faceRecognitionStore.setSearchState('faces', faces);
                    this.faceRecognitionStore.setSearchState('boxes', boxes);
                }

                this.faceRecognitionStore.setSearchState('status', 2);
            });
        }
        else
        {
            this.faceRecognitionStore.setSearchState('imagePath', '');
            this.faceRecognitionStore.setSearchState('imageData', undefined);
        }
    };

    handleSearch = () =>
    {
        const { searchState } = this.faceRecognitionStore;
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

    render()
    {
        let searchPart;

        if (this.faceRecognitionStore.searchState.imagePath)
        {
            const status = this.faceRecognitionStore.searchState.status;

            if (status === 1)
            {
                searchPart = <Container className={'face-recognition-search'}>Đang xử lý...</Container>;
            }
            else if (status === 2)
            {
                if (this.faceRecognitionStore.searchState.faces && this.faceRecognitionStore.searchState.faces.length)
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

        return (
            <FlexPanel width={'20rem'}>
                <PanelBody scroll>
                    <FormGroup>
                        <ImageInput onChange={this.handleImageChange} />

                        {/* <Section header={'Tìm trong'}> */}
                        {/*    <FormGroup direction={'row'}> */}
                        {/*        <CheckBox */}
                        {/*            label="Thư viện" */}
                        {/*            checked={this.faceRecognitionStore.searchState.dataLocation === 0} */}
                        {/*            onChange={() => this.handleChangeData('dataLocation', 0)} */}
                        {/*        /> */}

                        {/*        <CheckBox */}
                        {/*            label="Lịch sử" */}
                        {/*            checked={this.faceRecognitionStore.searchState.dataLocation === 1} */}
                        {/*            onChange={() => this.handleChangeData('dataLocation', 1)} */}
                        {/*        /> */}
                        {/*    </FormGroup> */}
                        {/* </Section> */}

                        <FormControlLabel
                            label="Giới tính"
                            control={(
                                <AdvanceSelect
                                    options={[
                                        { id: '', label: 'Tất cả' },
                                        { id: 'Nam', label: 'Nam' },
                                        { id: 'Nữ', label: 'Nữ' },
                                        { id: 'Khác', label: 'Khác' },
                                    ]}
                                    value={this.faceRecognitionStore.searchState.gender}
                                    onChange={(value) => this.handleChangeData('gender', value)}
                                />
                            )}
                        />
                    </FormGroup>

                    <Section header={'Tuổi'}>
                        <FormGroup>
                            <FormControlLabel
                                label="Từ"
                                control={(
                                    <Input
                                        type={'number'}
                                        value={this.faceRecognitionStore.searchState.fromAge}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('fromAge', event);
                                        }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label="Đến"
                                control={(
                                    <Input
                                        type={'number'}
                                        value={this.faceRecognitionStore.searchState.toAge}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('toAge', event);
                                        }}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>

                    <Section
                        header={'Ngày sinh'}
                        className="date-of-birth"
                    >
                        <FormGroup>
                            <FormControlLabel
                                label="Từ"
                                control={(
                                    <DateTimePicker
                                        value={this.faceRecognitionStore.searchState.fromDateOfBirth}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('fromDateOfBirth', event);
                                        }}
                                    />
                                )}
                            />
                            <FormControlLabel
                                label="Đến"
                                control={(
                                    <DateTimePicker
                                        value={this.faceRecognitionStore.searchState.toDateOfBirth}
                                        onChange={(event) =>
                                        {
                                            this.handleChangeData('toDateOfBirth', event);
                                        }}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>

                    <Section>
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
                                        value={this.faceRecognitionStore.searchState.country}
                                        onChange={(value) => this.handleChangeData('country', value)}
                                    />
                                )}
                            />

                            <FormControlLabel
                                label="Giới hạn"
                                control={(
                                    <AdvanceSelect
                                        options={[
                                            { id: 25, label: <T params={[25]}>%0% dòng</T> },
                                            { id: 50, label: <T params={[50]}>%0% dòng</T> },
                                            { id: 100, label: <T params={[100]}>%0% dòng</T> },
                                            { id: 250, label: <T params={[250]}>%0% dòng</T> },
                                        ]}
                                        value={this.faceRecognitionStore.searchState.noCandidates}
                                        onChange={(value) => this.handleChangeData('noCandidates', value)}
                                    />
                                )}
                            />
                        </FormGroup>
                    </Section>
                </PanelBody>

                <PanelFooter>
                    {searchPart}
                </PanelFooter>
            </FlexPanel>
        );
    }
}


FaceRecognitionSearch = withModal(inject('appStore')(observer(FaceRecognitionSearch)));
export default FaceRecognitionSearch;
