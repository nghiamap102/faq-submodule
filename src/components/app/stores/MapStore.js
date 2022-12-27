import { decorate, observable, action } from 'mobx';

export class MapStore
{
    appStore = null;

    map = null;

    viewport = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        level: 0
    };

    bounds = {
        north: null,
        east: null,
        south: null,
        west: null
    };

    coords = {
        lng: null,
        lat: null,
        zoom: null
    };

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    setBounds = (bounds, center) =>
    {
        this.bounds.north = bounds.getNorth();
        this.bounds.east = bounds.getEast();
        this.bounds.south = bounds.getSouth();
        this.bounds.west = bounds.getWest();
    };

    setCoordinate = (coords) =>
    {
        this.coords.lng = coords.lng;
        this.coords.lat = coords.lat;
        this.coords.zoom = coords.zoom;
    };

    setViewport(view)
    {
        this.viewport = view;
    }

    get getViewport()
    {
        return this.viewport;
    }
}

decorate(MapStore, {
    viewport: observable,
    defaultStyle: observable,
    currentStyleId: observable,
    bounds: observable,
    coords: observable,
    setBounds: action,
    setViewport: action,
    setCoordinate: action
});
