import {action, extendObservable} from "mobx"

export class MarkerPopupStore
{
    constructor (appStore)
    {
        extendObservable(this, {
            popups: [],
        });

        this.appStore = appStore;
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
        let popup = this.getPopup(id);
        popup[key] = value;
    });

    setStates = action((key, value) =>
    {
        this.popups.forEach((p) =>
        {
            p[key] = value;
        });
    });

    getPopup (id)
    {
        return this.popups.find((p) => p.id === id);
    }

    sort ()
    {
        let temp;
        for (let i = 0; i < this.popups.length - 1; i++)
        {
            for (let j = 0; j < this.popups.length - 1 - i; j++)
            {
                if (!(!this.popups[j].isNotFixed && this.popups[j + 1].isNotFixed))
                {
                    temp = this.popups[j];
                    this.popups[j] = this.popups[j + 1];
                    this.popups[j + 1] = temp;
                }
            }
        }
    }
}