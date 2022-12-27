import { decorate, observable } from 'mobx';
import { action } from 'mobx';
import moment from 'moment';

export class FaceRecognitionStore
{
    appStore = null;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    isCollapseSearch = false;
    searchState = {
        imagePath: '',
        imageData: '',
        status: 0,
        boxes: {},
        faces: undefined,
        dataLocation: 0, // 0: gallery; 1: history
        gender: '',
        race: 0,
        fromAge: 0,
        toAge: 80,
        fromDateOfBirth: undefined,
        toDateOfBirth: undefined,
        country: '',
        noCandidates: 25
    };

    dataLocation = 0;
    imageData = '';
    boxes = {};
    data = undefined;
    detailData = undefined;
    selectedId = undefined;

    setSearchCollapse(isCollapseSearch)
    {
        this.isCollapseSearch = isCollapseSearch;
    }

    setSearchState(key, value)
    {
        this.searchState[key] = value;
    }

    setData(data, dataLocation, imageData, boxes)
    {
        this.data = data;
        this.dataLocation = dataLocation;
        this.imageData = imageData;
        this.boxes = boxes;
    }

    setDetail(detail = undefined)
    {
        this.detailData = detail;
    }

    setSelected(selectedId = undefined)
    {
        this.selectedId = selectedId;
    }
}


decorate(FaceRecognitionStore, {
    appStore: observable,
    isCollapseSearch: observable,
    searchState: observable,
    dataLocation: observable,
    imageData: observable,
    boxes: observable,
    data: observable,
    detailData: observable,
    selectedId: observable,
    setSearchCollapse: action,
    setSearchState: action,
    setData: action,
    setDetail: action,
    setSelected: action
});
