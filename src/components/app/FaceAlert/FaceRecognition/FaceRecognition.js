import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import {
    Container,
    withModal,
} from '@vbd/vui';

import FaceRecognitionSearch from './FaceRecognitionSearch';
import { FaceRecognitionContent } from './FaceRecognitionContent';

import Enum from 'constant/app-enum';

import { CommonHelper } from 'helper/common.helper';
import { FaceAlertService } from 'services/face-alert.service';

class FaceRecognition extends Component
{
    faceAlertStore = this.props.appStore.faceAlertStore;
    faceRecognitionStore = this.props.appStore.faceAlertStore.faceRecognitionStore;
    fsImageDetailStore = this.props.appStore.fsImageDetailStore;

    faceAlertSvc = new FaceAlertService();

    constructor(props)
    {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    handleOnSearch = async () =>
    {
        const searchState = CommonHelper.clone(this.faceRecognitionStore.searchState);

        const dataLocation = searchState.dataLocation;
        const imageData = searchState.imageData;
        const boxes = searchState.boxes;

        delete searchState.imagePath;
        delete searchState.imageData;
        delete searchState.boxes;
        delete searchState.dataLocation;

        // loading
        this.faceRecognitionStore.setData(null, dataLocation, '', {});

        this.setState({ isLoading: true });
        this.faceAlertSvc.gallerySearch(searchState).then((rs) =>
        {
            if (rs.result === Enum.APIStatus.Success)
            {
                this.faceRecognitionStore.setData(rs.data, dataLocation, imageData, boxes);
            }
            else
            {
                this.props.toast({ type: 'error', message: rs.errorMessage });
            }
            this.setState({ isLoading: false });
        });
    };

    handleDetailClick = (data) =>
    {
        const prob = {
            images: {
                overview: {
                    source: this.faceRecognitionStore.searchState.imageData,
                },
                seachable: {
                    source: {
                        imageData: this.faceRecognitionStore.searchState.imageData,
                        box: this.faceRecognitionStore.boxes[data.faceId],
                    },
                    score: 1,
                },
            },
            isShowProbeInfo: false,
        };

        let candidates = [];
        for (let i = 0; i < this.faceRecognitionStore.searchState.faces.length; i++)
        {
            const searchCandidates = this.faceRecognitionStore.searchState.faces[i].candidates;
            if (Array.isArray(searchCandidates) && searchCandidates.length > 0 && searchCandidates[0].id === data.faceId)
            {
                candidates = searchCandidates;
                break;
            }
        }

        const gallery = candidates.map((c) =>
        {
            return {
                id: c.id,
                faceId: c.id,
                selected: false,
                isLoaded: false,
                galleryImages: {
                    source: this.faceAlertSvc.getBestMatchImageUrl(c.id),
                    accuracy: c.accuracy,
                },
                quickInfo: {},
                galleryInfo: {},
                cases: {},
                commentForm: {},
            };
        });

        gallery[0] = {
            id: data.gallery.faceId,
            personId: data.gallery.personId,
            faceId: data.gallery.faceId,
            selected: true,
            isLoaded: true,
            quickInfo: {
                name: data.gallery.name,
                personId: data.gallery.personId,
                faceId: data.gallery.faceId,
                province: data.gallery.province,
                dateOfBirth: data.gallery.dob,
            },
            galleryImages: {
                source: this.faceAlertSvc.getBestMatchImageUrl(data.gallery.faceId),
                accuracy: data.accuracy,
            },
            galleryInfo: {
                personId: data.gallery.personId,
                name: data.gallery.name,
                alias: data.gallery.alias,
                gender: data.gallery.gender,
                dateOfBirth: data.gallery.dob,
                street: data.gallery.street,
                province: data.gallery.province,
                country: data.gallery.country,
                race: data.gallery.race,
                agency: data.gallery.agency,
                updateDate: data.gallery.updateDate,
                nickName: data.gallery.nickName,
                scarsMarksTattoos: data.gallery.scarsMarksTattoos,
                hairColor: data.gallery.hairColor,
                eyeColor: data.gallery.eyeColor,
                height: data.gallery.height,
                weight: data.gallery.weight,
                notes: data.gallery.notes,
                status: data.gallery.status,
                expiredAfter: data.gallery.expiredAfter,
            },
            cases: {},
            commentForm: {},
            watchList: data.gallery.watchList,
        };

        this.fsImageDetailStore.loadProbe(prob);
        this.fsImageDetailStore.loadGallery(gallery);
        this.fsImageDetailStore.loadOriginData(this.faceRecognitionStore.data.find((d) => d.faceId === data.faceId));

        if (!this.fsImageDetailStore.isShowImageDetail)
        {
            this.fsImageDetailStore.toggleShowImageDetail();
        }
    };

    handleRecognitionSearchClick = (data) =>
    {
        this.faceRecognitionStore.searchState.imageData = data.faceImage;
    };

    render()
    {
        return (
            <Container className={'face-alert-container'}>
                <FaceRecognitionSearch onSearch={this.handleOnSearch} />
                <FaceRecognitionContent
                    className={this.faceAlertStore.isCollapseSearch ? 'full-content' : ''}
                    data={this.faceRecognitionStore.data}
                    isLoading={this.state.isLoading}
                    imageData={this.faceRecognitionStore.imageData}
                    boxes={this.faceRecognitionStore.boxes}
                    detailClick={this.handleDetailClick}
                    searchClick={this.handleRecognitionSearchClick}
                />
            </Container>
        );
    }
}

FaceRecognition = withModal(inject('appStore')(observer(FaceRecognition)));
export { FaceRecognition };
