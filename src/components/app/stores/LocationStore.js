import {decorate, observable} from "mobx"

export class LocationStore
{
    appStore = null;
    addLocation = undefined;

    constructor (appStore)
    {
        this.appStore = appStore;
    }

    addShow(location = undefined)
    {
        if (location !== undefined) this.addLocation = location;
        else this.addLocation = {};
    }

    closeShow()
    {
        this.addLocation = undefined;
    }

    changeData(key, value)
    {
        if (this.addLocation !== undefined)
        {
            this.addLocation[key] = value;
        }
    }
}

decorate(LocationStore, {
    appStore: observable,
    addLocation: observable
});
