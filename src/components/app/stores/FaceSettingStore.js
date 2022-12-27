import { decorate, observable, action } from 'mobx';

export class FaceSettingStore
{
    appStore = null;
    itemActive = null;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    haveActive = (id) =>
    {
        return this.itemActive === id ? true : false;
    };

    handleSetActive(id)
    {
        this.itemActive = id;
    }
}

decorate(FaceSettingStore, {
    appStore: observable,
    itemActive: observable,
    haveActive: action

});
