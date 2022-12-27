import { decorate, observable, action } from 'mobx';

import { FaceAlertService } from 'services/face-alert.service';
import { IncidentService } from 'services/incident.service';
import { WatchListService } from 'services/watchList.service';

import { CommonHelper } from 'helper/common.helper';

const Enum = require('constant/app-enum');

export class FSImageDetailStore
{
    faceAlertSvc = new FaceAlertService();
    incidentSvc = new IncidentService();
    watchListSvc = new WatchListService();

    isShowImageDetail = false;
    probe = null;
    gallery = [];
    originData = undefined;
    galleryIndex = null;

    loadProbe = (probe) =>
    {
        this.probe = probe;
    };

    loadGallery = (gallery) =>
    {
        this.gallery = gallery;

        if (this.gallery)
        {
            const selected = this.gallery.find((g) => g.selected);
            if (selected)
            {
                this.loadDataForGallery(selected);
            }
        }
    };

    loadOriginData = (data) =>
    {
        this.originData = data;
    };

    setGalleryById = (id, data) =>
    {
        const gallery = this.gallery.map((gItem) => ({ ...gItem }));
        for (let i = 0; i < gallery.length; i++)
        {
            if (gallery[i].id === id)
            {
                data.selected = gallery[i].selected;
                gallery[i] = data;
                break;
            }
        }
        this.gallery = gallery;
    };

    setWatchListById = (id, data) =>
    {
        const gallery = this.gallery.find((g) => g.id === id);
        if (gallery)
        {
            gallery.watchList = data;
            this.setGalleryById(gallery.id, gallery);
            this.loadDataForGallery(gallery);

            // Set gallery data for origin data to update data from list data
            if (this.originData.gallery.faceId === gallery.id)
            {
                this.originData.gallery = CommonHelper.clone(gallery);
            }
        }
    };

    deleteWatchListByFaceId = (faceId) =>
    {
        const gallery = this.gallery.find((g) => g.id === faceId);
        if (gallery)
        {
            delete gallery.watchList;
            this.setGalleryById(gallery.id, gallery);

            // Set gallery data for origin data to update data from list data
            if (this.originData.gallery.faceId === gallery.id)
            {
                this.originData.gallery = CommonHelper.clone(gallery);
            }
        }
    };

    onUpdateComment = (type, data) =>
    {
        this.gallery[this.galleryIndex].commentForm[type] = data;
    };

    toggleShowImageDetail = () =>
    {
        this.isShowImageDetail = !this.isShowImageDetail;
    };

    handleSelectImage = (id) =>
    {
        // reset all gallery image
        const gallery = this.gallery.map((gItem) => ({ ...gItem, selected: false }));

        // active gallery item
        gallery.find((gItem) => gItem.id === id).selected = true;
        this.loadDataForGallery(gallery.find((gItem) => gItem.id === id));

        this.gallery = gallery;
    };

    loadDataForGallery = (data) =>
    {
        // fill incident and watchlist name
        if (data && data.watchList)
        {
            this.incidentSvc.getByIds(data.watchList.incidentIds || []).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    data.watchList.incident = rs.data.map((i) => 'ICS-' + i.incidentId).join(', ');
                }
            });

            this.watchListSvc.getByIds(data.watchList.watchListIds || []).then((rs) =>
            {
                if (rs.result === Enum.APIStatus.Success)
                {
                    data.watchList.watchlist = rs.data.map((i) => i.name).join(', ');
                }
            });
        }
    };
}

decorate(FSImageDetailStore, {
    isShowImageDetail: observable,
    gallery: observable,
    galleryIndex: observable,
    onUpdateComment: action,
    toggleShowImageDetail: action,
    loadProbe: action,
    loadGallery: action,
    setGalleryById: action,
    handleSelectImage: action,
    setWatchListById: action,
    loadDataForGallery: action,
    deleteWatchListByFaceId: action,
});
