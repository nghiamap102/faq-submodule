import { decorate, observable } from 'mobx';
import { action } from 'mobx';
import { SpatialSearchStore } from 'components/app/SpatialSearch/SpatialSearchStore';

export class FaceAlertStore
{
    appStore = null;

    isCollapseSearch = false;
    tabSelected = 'detect';
    cameras = [];

    constructor(appStore)
    {
        this.appStore = appStore;

        this.faceRecognitionStore = appStore.faceRecognitionStore;
        this.faceDetectionStore = appStore.faceDetectionStore;
        this.watchListStore = appStore.watchListStore;
        this.faceGalleryStore = appStore.faceGalleryStore;
        this.liveViewStore = appStore.liveViewStore;
        this.spatialSearchStore = new SpatialSearchStore();
    }

    setTab(tab)
    {
        this.tabSelected = tab;
    }

    setSearchCollapse(isCollapseSearch)
    {
        this.isCollapseSearch = isCollapseSearch;
    }

    setCameras(cameras)
    {
        this.cameras = cameras;
    }
}

decorate(FaceAlertStore, {
    appStore: observable,
    isCollapseSearch: observable,
    tabSelected: observable,
    cameras: observable,
    setSearchCollapse: action,
    setTab: action,
    setCameras: action
});
