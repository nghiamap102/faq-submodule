import { decorate, observable } from 'mobx';
import { action } from 'mobx';

import { PlateDetectionStore } from 'components/app/LPR/PlateDetection/PlateDetectionStore';
import { SpatialSearchStore } from 'components/app/SpatialSearch/SpatialSearchStore';

export class PlateAlertStore
{
    tabSelected = 'detect';
    cameras = {};
    systems = [];

    constructor()
    {
        this.plateDetectionStore = new PlateDetectionStore();
        this.spatialSearchStore = new SpatialSearchStore();
    }

    setTab(tab)
    {
        this.tabSelected = tab;
    }

    setCameras(key, cameras)
    {
        this.cameras[key] = cameras;
    }

    setSystems(systems)
    {
        this.systems = systems;
    }
}

decorate(PlateAlertStore, {
    tabSelected: observable,
    cameras: observable,
    systems: observable,
    setTab: action,
    setCameras: action,
    setSystems: action
});
