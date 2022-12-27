import { decorate, observable } from 'mobx';
import { action } from 'mobx';

import { SpaceRainSearchStore } from './SpaceRainSearchStore';

export class SpaceRainStore
{
    appStore = null;

    tabSelected = 'spacerain-search';

    constructor(appStore)
    {
        this.appStore = appStore;
        this.spacerainSearchStore = new SpaceRainSearchStore(appStore);
    }

    setTab(tab)
    {
        this.tabSelected = tab;
    }
}

decorate(SpaceRainStore, {
    appStore: observable,
    tabSelected: observable,
    setTab: action,
});
