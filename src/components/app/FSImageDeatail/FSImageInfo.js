import './FSimageDetail.scss';

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import {
    Container,
    FSImage,
    FSDataBody, FSDataContainer,
    Button,
    SectionHeader,
    ScrollView,
} from '@vbd/vui';

import { FaceAlertService } from 'services/face-alert.service';

import Enum from 'constant/app-enum';

class FSImageInfo extends Component
{
    fsImageDetailStore = this.props.appStore.fsImageDetailStore;
    faceDetectionStore = this.props.appStore.faceDetectionStore;

    faceAlertSvc = new FaceAlertService();

    onSelectGalleryImage = (id) =>
    {
        if (Array.isArray(this.fsImageDetailStore.gallery))
        {
            const gallery = this.fsImageDetailStore.gallery.find((g) => g.id === id);
            if (gallery && !gallery.isLoaded)
            {
                this.faceAlertSvc.galleryGetByFaceId(gallery.faceId).then((rs) =>
                {
                    if (rs && rs.result === Enum.APIStatus.Success && rs.data)
                    {
                        this.fsImageDetailStore.setGalleryById(gallery.id, {
                            id: gallery.id,
                            personId: rs.data.personId,
                            faceId: rs.data.faceId,
                            selected: gallery.selected,
                            isLoaded: true,
                            quickInfo: {
                                faceId: rs.data.faceId,
                                name: rs.data.name,
                                province: rs.data.province,
                                dateOfBirth: rs.data.dob,
                                personId: rs.data.personId,
                                reference: '', // hard
                            },
                            galleryImages: gallery.galleryImages,
                            galleryInfo: {
                                personId: rs.data.personId,
                                name: rs.data.name,
                                alias: rs.data.alias,
                                gender: rs.data.gender,
                                dateOfBirth: rs.data.dob,
                                street: rs.data.street,
                                province: rs.data.province,
                                country: rs.data.country,
                                race: rs.data.race,
                                agency: rs.data.agency,
                                updateDate: rs.data.updateDate,
                                nickName: rs.data.nickName,
                                scarsMarksTattoos: rs.data.scarsMarksTattoos,
                                hairColor: rs.data.hairColor,
                                eyeColor: rs.data.eyeColor,
                                height: rs.data.height,
                                weight: rs.data.weight,
                                notes: rs.data.notes,
                                status: rs.data.status,
                                expiredAfter: rs.data.expiredAfter,
                            },
                            cases: {},
                            commentForm: {},
                            watchList: rs.data.watchList,
                        });
                    }
                    this.fsImageDetailStore.handleSelectImage(id);
                });
            }
            else
            {
                this.fsImageDetailStore.handleSelectImage(id);
            }
        }
        else
        {
            this.fsImageDetailStore.handleSelectImage(id);
        }
    };

    render()
    {
        const { gallery, probe } = this.props;
        const gallerySelected = gallery.find((g) => g.selected === true);

        return (
            <Container className={`fs-imageInfo-container ${probe && 'probe'}`}>
                {!probe
                    ? (
                            <FSDataContainer>
                                <SectionHeader>Hình ảnh</SectionHeader>

                                <Container className={'fs-imageInfo-body'}>
                                    <FSImage
                                        score={gallerySelected.galleryImages.score}
                                        src={gallerySelected.galleryImages.source}
                                        id={'faceImage'}
                                        widthImage={'130px'}
                                        heightImage={'180px'}
                                    />
                                </Container>
                            </FSDataContainer>
                        )
                    : (
                            <FSDataContainer>
                                <FSDataBody
                                    layout={'flex'}
                                    className={'fs-probe-image-body'}
                                >

                                    <FSDataContainer className={'fs-probe'}>
                                        <SectionHeader textAlign={'center'}>
                                        Ảnh cần nhận dạng
                                        </SectionHeader>

                                        <FSDataBody layout={'flex'}>
                                            <FSImage
                                                title={'Hình toàn cảnh'}
                                                src={probe.images.overview.source}
                                                fitMode={'contain'}
                                                widthImage={'260px'}
                                                heightImage={'180px'}
                                                canEnlarge
                                            />
                                            <FSImage
                                                title={'Hình gương mặt'}
                                                src={probe.images.seachable.source}
                                                score={probe.images.seachable.score}
                                                widthImage={'130px'}
                                                heightImage={'180px'}
                                                canEnlarge
                                            />
                                        </FSDataBody>
                                    </FSDataContainer>

                                    <Container className="fs-probe-button">
                                        <Button
                                            text="So sánh"
                                            className="verify"
                                        />
                                    </Container>

                                    <FSDataContainer className="fs-gallery">
                                        <SectionHeader textAlign={'center'}>
                                        Kết quả nhận dạng
                                        </SectionHeader>

                                        <Container>
                                            <ScrollView options={{ suppressScrollY: true, useBothWheelAxes: true }}>
                                                <FSDataBody
                                                    layout={'flex'}
                                                    className={'fs-results-image'}
                                                >
                                                    {
                                                        gallery.map((gItem, index) =>
                                                        {
                                                            if (gItem.id === 'search-id' && !this.faceDetectionStore.searchState.imageData)
                                                            {
                                                                return;
                                                            }

                                                            return (
                                                                <FSImage
                                                                    key={index}
                                                                    active={this.faceDetectionStore.searchState.imageData ? gItem.id === 'search-id' : gItem.selected}
                                                                    score={gItem.galleryImages.score}
                                                                    accuracy={gItem.galleryImages.accuracy}
                                                                    src={gItem.id === 'search-id' ? this.faceDetectionStore.searchState.imageData : gItem.galleryImages.source}
                                                                    id={gItem.id}
                                                                    widthImage={'130px'}
                                                                    heightImage={'180px'}
                                                                    onClick={() => this.onSelectGalleryImage(gItem.id)}
                                                                />
                                                            );
                                                        },
                                                        )
                                                    }
                                                </FSDataBody>
                                            </ScrollView>
                                        </Container>
                                    </FSDataContainer>
                                </FSDataBody>

                                <Container className="fs-probe-button">
                                    <Button
                                        text="Xác thực"
                                        className="verify"
                                    />
                                    <Button
                                        text="Tìm lại"
                                        className="seach-again"
                                    />
                                </Container>
                            </FSDataContainer>
                        )
                }
            </Container>
        );
    }
}

FSImageInfo.propTypes = {
    gallery: PropTypes.array.isRequired,
    probe: PropTypes.object,
};

FSImageInfo = inject('appStore')(observer(FSImageInfo));
export default FSImageInfo;
