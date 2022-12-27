import { decorate, observable } from 'mobx';

export class FeatureBarStore
{
    featureItemActive = '';
    showChat = false;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    setState(value)
    {
        this.featureItemActive = value;
    }
}

decorate(FeatureBarStore, {
    featureItemActive: observable,
    showChat: observable
});
