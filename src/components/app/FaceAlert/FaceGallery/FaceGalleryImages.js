import './FaceGalleryAddOrUpdate.scss';

import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container, Positioned, Row, FAIcon,
    Sub2,
    ScrollView,
    UploadImage,
    FSDataBody, FSDataContainer,
    SectionHeader,
} from '@vbd/vui';

import { CommonHelper } from 'helper/common.helper';
import { FaceAlertService } from 'services/face-alert.service';

const errorTexts = {
    'undetected': 'Không nhận dạng được mặt',
    'more-face': 'Nhiều hơn 1 mặt trong ảnh',
    'internal-error': 'Lỗi hệ thống',
};

class FaceGalleryImages extends Component
{
    faceGalleryStore = this.props.appStore.faceGalleryStore;
    faceAlertSvc = new FaceAlertService();
    scrollRef = createRef();

    handleMainImageChange = (croppedImage) =>
    {
        this.faceGalleryStore.setDetailProperty('imageData', croppedImage);
    };

    handleSubImageChange = (data, index) =>
    {
        if (!this.faceGalleryStore.type || !this.faceGalleryStore.detailData)
        {
            return;
        }
        let images = this.faceGalleryStore.detailData.images;
        images = images || [];

        if (images.length > index)
        {
            images[index] = data;
        }

        this.faceGalleryStore.setDetailProperty('images', images);
    };

    handleSubImageAdd = (data, index) =>
    {
        if (!this.faceGalleryStore.type || !this.faceGalleryStore.detailData)
        {
            return;
        }

        let images = this.faceGalleryStore.detailData.images;
        images = images || [];
        if (images.length <= index)
        {
            images.length = index + 1;
        }

        images[index] = data;
        this.faceGalleryStore.setDetailProperty('images', images);
    };

    handleSubImageDelete = (index) =>
    {
        const { imageStatuses = [] } = this.faceGalleryStore.detailData;
        imageStatuses.splice(index + 1, 1);

        this.faceGalleryStore.setDetailProperty('imageStatuses', imageStatuses);

        if (!this.faceGalleryStore.type || !this.faceGalleryStore.detailData)
        {
            return;
        }

        let images = this.faceGalleryStore.detailData.images;
        images = images || [];

        if (images.length > index)
        {
            images = CommonHelper.removeItemInArray(images, index);
        }

        this.faceGalleryStore.setDetailProperty('images', images);
    };

    handleUploadImage = async (data, callback, index) =>
    {
        const { imageStatuses } = this.faceGalleryStore.detailData;
        if (imageStatuses.length <= index)
        {
            imageStatuses.length = index + 1;
        }
        imageStatuses[index] = 'loading';

        this.faceGalleryStore.setDetailProperty('imageStatuses', imageStatuses);

        const rs = await this.faceAlertSvc.checkFace(data.rawData, data.orientation);
        const detects = rs?.[0]?.Objects;

        if (detects?.length === 1)
        {
            imageStatuses[index] = null;

            this.faceGalleryStore.setDetailProperty('imageStatuses', imageStatuses);

            const firstItem = detects[0];
            const croppedImage = firstItem ? 'data:image/jpeg;base64,' + firstItem.Data : '';

            callback(croppedImage, index - 1);
        }
        else if (detects?.length > 1)
        {
            imageStatuses[index] = 'more-face';
            this.faceGalleryStore.setDetailProperty('imageStatuses', imageStatuses);

            callback(data.data, index - 1);
        }
        else
        {
            imageStatuses[index] = 'undetected';
            this.faceGalleryStore.setDetailProperty('imageStatuses', imageStatuses);

            callback(data.data, index - 1);
        }
    };

    render()
    {
        const { type, detailData } = this.faceGalleryStore;
        const { imageStatuses = [] } = detailData;

        return (
            <Container className={'fs-imageInfo-container'}>
                <FSDataContainer>
                    <FSDataBody
                        layout={'flex'}
                        className={'fs-probe-image-body'}
                    >
                        <FSDataContainer className={'fs-probe'}>
                            <SectionHeader textAlign={'center'}>
                                Ảnh chính
                            </SectionHeader>

                            <UploadImage
                                className={`${(imageStatuses[0] && imageStatuses[0] !== 'loading') ? 'invalid' : ''}`}
                                title={'Hình toàn cảnh'}
                                src={detailData.imageData ? detailData.imageData : (type === 'update' ? this.faceAlertSvc.getBestMatchImageUrl(detailData.faceId) : '')}
                                fitMode={'contain'}
                                width={'260px'}
                                height={'180px'}
                                isLoading={imageStatuses[0] === 'loading'}
                                canEnlarge
                                canChange
                                onChange={(data) =>
                                {
                                    this.faceGalleryStore.detailData.imageStatuses ||= [];
                                    this.handleUploadImage(data, this.handleMainImageChange, 0);
                                }}
                            />

                            {errorTexts[imageStatuses[0]] && (
                                <Positioned
                                    top={36}
                                    left={0}
                                >
                                    <Row itemMargin="md">
                                        <FAIcon
                                            icon={'exclamation-circle'}
                                            color={'var(--danger-color)'}
                                            size="1.25rem"
                                            type="solid"
                                        />
                                        <Sub2 color={'danger'}>
                                            {errorTexts[imageStatuses[0]]}
                                        </Sub2>
                                    </Row>
                                </Positioned>
                            )}
                        </FSDataContainer>

                        <FSDataContainer className="fs-gallery">
                            <SectionHeader textAlign={'center'}>
                                Các ảnh phụ
                            </SectionHeader>

                            <Container>
                                <ScrollView
                                    containerRef={(element) => this.scrollRef.current = element}
                                    onScroll={this.handleScroll}
                                >
                                    <FSDataBody
                                        layout={'flex'}
                                        className={'fs-results-image'}
                                    >
                                        {
                                            (imageStatuses.length > 1 || detailData.images) && (detailData.images || Array(imageStatuses.length - 1)).map((image, index) => (
                                                <Container
                                                    key={index}
                                                    className={'image-item'}
                                                    style={{ position: 'relative' }}
                                                >
                                                    <UploadImage
                                                        className={`${(imageStatuses[index + 1] && imageStatuses[index + 1] !== 'loading') ? 'invalid' : ''}`}
                                                        src={(image && image.length === 24) ? this.faceAlertSvc.getGallerySubImageUrl(image) : image}
                                                        width={'130px'}
                                                        height={'180px'}
                                                        fitMode={'contain'}
                                                        isLoading={imageStatuses[index + 1] === 'loading'}
                                                        canEnlarge
                                                        canDelete
                                                        onChange={(data) =>
                                                            this.handleUploadImage(data, this.handleSubImageChange, index + 1)
                                                        }
                                                        onDelete={() => this.handleSubImageDelete(index)}
                                                    />

                                                    {errorTexts[imageStatuses[index + 1]] && (
                                                        <Positioned
                                                            top={0}
                                                            left={0}
                                                        >
                                                            <Row itemMargin="md">
                                                                <FAIcon
                                                                    icon={'exclamation-circle'}
                                                                    color={'var(--danger-color)'}
                                                                    size="1.25rem"
                                                                    type="solid"
                                                                />
                                                                <Sub2 color={'danger'}>
                                                                    {errorTexts[imageStatuses[index + 1]]}
                                                                </Sub2>
                                                            </Row>
                                                        </Positioned>
                                                    )}
                                                </Container>
                                            ))
                                        }

                                        <Container className={'image-item'}>
                                            <UploadImage
                                                width={'130px'}
                                                height={'180px'}
                                                fitMode={'contain'}
                                                limit={5}
                                                multi
                                                onChange={(files) =>
                                                {
                                                    this.faceGalleryStore.detailData.imageStatuses ||= [];
                                                    files.map(async (data, index) =>
                                                    {
                                                        await this.handleUploadImage(data, this.handleSubImageAdd, (detailData.images?.length ?? 0) + index + 1);
                                                    });
                                                }}
                                            />
                                        </Container>
                                    </FSDataBody>
                                </ScrollView>
                            </Container>
                        </FSDataContainer>
                    </FSDataBody>
                </FSDataContainer>
            </Container>
        );
    }
}

FaceGalleryImages = inject('appStore')(observer(FaceGalleryImages));
export default FaceGalleryImages;
