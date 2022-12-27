import { computed, decorate, observable, action } from 'mobx';

export class MarkerStore
{
    appStore = null;
    listMarker = [];
    markerId = '';

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    onBoxSelectChange(startLatLng, endLatLng)
    {
        if (!startLatLng || !endLatLng)
        {
            return;
        }

        this.listMarker.forEach((marker) =>
        {
            if (
                !(endLatLng.lat < marker.lat || endLatLng.lng < marker.lng) &&
                !(startLatLng.lat > marker.lat || startLatLng.lng > marker.lng)
            )
            {
                marker.active = true;
            }
            else
            {
                marker.active = false;
            }
        });
    }

    add(marker)
    {
        this.listMarker.push(marker);

        // must get marker after push, so marker can be observable
        const addedMarker = this.listMarker[this.listMarker.length - 1];
        addedMarker.onActiveMarker = () =>
        {
            addedMarker.active = !addedMarker.active;
        };
    }

    addList(markers)
    {
        if (markers && markers.length)
        {
            this.listMarker.push(...markers);
        }
    }

    addOrUpdate(markers = [])
    {
        markers.forEach((marker) =>
        {
            const m = this.getPopup(marker.id);
            if (m)
            {
                this.updateProps(m, marker);
            }
            else
            {
                this.listMarker.push(marker);
            }
        });
    }

    /**
     * Create, update, delete markers from listMarker
     * @param {array} cuMarkers markers to create or update
     * @param {array} dMarkers marker to delete
     */
    modify(cuMarkers, dMarkers)
    {
        if (cuMarkers)
        {
            this.addOrUpdate(cuMarkers);
        }

        if (dMarkers)
        {
            dMarkers.forEach((m) => this.remove(m.id));
        }
    }

    update(pMarker)
    {
        const marker = this.listMarker.find((p) => p.id === pMarker.id);
        Object.keys(marker).forEach(function (item)
        {
            marker[item] = pMarker[item];
        });
    }

    updateProps(marker, props)
    {
        Object.assign(marker, props);
    }

    remove(id)
    {
        this.listMarker = this.listMarker.filter((p) => p.id !== id);
    }

    clearActive()
    {
        for (const marker of this.listMarker)
        {
            marker.active = false;
        }
    }

    removeBy(func)
    {
        this.listMarker = this.listMarker.filter((p) =>
        {
            return !func(p);
        });
    }

    setState(id, key, value)
    {
        const popup = this.listMarker.find((p) => p.id === id);
        popup[key] = value;
    }

    setStates(key, value)
    {
        this.listMarker.forEach((p) =>
        {
            p[key] = value;
        });
    }

    getPopup(id)
    {
        return this.listMarker.find((p) => p.id === id);
    }

    get markers()
    {
        return this.listMarker;
    }

    get listActive()
    {
        return this.listMarker.filter((m) => m.active);
    }
}

decorate(MarkerStore, {
    listMarker: observable,
    onBoxSelectChange: action,
    add: action,
    update: action,
    updateProps: action,
    remove: action,
    removeBy: action,
    setState: action,
    setStates: action,
    markers: computed,
    clearActive: action,
    listActive: computed,
    addList: action,
    addOrUpdate: action,
    modify: action,
});
