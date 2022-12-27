import { decorate, observable, action } from 'mobx';

export class MiniMapStore
{
    appStore = null;

    map = null;

    viewport = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        level: 0,
    };

    popupVisible = false; // show/hide popup
    popupContents = null; // visible popups

    popups = [];

    bounds = {
        north: null,
        east: null,
        south: null,
        west: null,
    };

    coords = {
        lng: null,
        lat: null,
        zoom: null,
    };

    jobStatuses = {};

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

    add = action((marker) =>
    {
        if (!this.getPopup(marker.id))
        {
            this.popups.push(marker);
        }
        // this.sort();
    });

    remove = action((id) =>
    {
        this.popups = this.popups.filter(p => p.id !== id);
        // this.sort();
    });

    setState = action((id, key, value) =>
    {
        const popup = this.getPopup(id);
        popup[key] = value;
    });

    setStates = action((key, value) =>
    {
        this.popups.forEach((p) =>
        {
            p[key] = value;
        });
    });

    removeAllPopups = action(() =>
    {
        this.popups = [];
    })

    getPopup (id)
    {
        return this.popups.find((p) => p.id === id);
    }

    // togglePopup = (poi) =>
    // {
    //     this.popupVisible = !this.popupVisible;
    //     this.popupContents = poi;
    // }
}

decorate(MiniMapStore, {
    map: observable,
    viewport: observable,
    defaultStyle: observable,
    currentStyleId: observable,
    bounds: observable,
    coords: observable,
    setBounds: action,
    setViewport: action,
    setCoordinate: action,

    popupVisible: observable,
    popupContents: observable,
    popups: observable,
});
