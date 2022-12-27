import { computed, decorate, observable, action } from 'mobx';

export class OverlayPopupStore
{
    listPopup = [];

    add(popup)
    {
        const p = this.getPopup(popup.id);

        if (!p)
        {
            this.listPopup.push(popup);
        }
        else
        {
            this.setState(popup.id, 'isActivate', true);
        }
    }

    remove(id)
    {
        this.listPopup = this.listPopup.filter((p) => p.id !== id);
    }

    setState(id, key, value)
    {
        const popup = this.listPopup.find((p) => p.id === id);
        if (popup)
        {
            popup[key] = value;
        }
    }

    setStates(key, value)
    {
        this.listPopup.forEach((p) =>
        {
            p[key] = value;
        });
    }

    getPopup(id)
    {
        return this.listPopup.find((p) => p.id === id);
    }

    get popups()
    {
        return this.listPopup;
    }
}

decorate(OverlayPopupStore, {
    listPopup: observable,
    add: action,
    remove: action,
    setState: action,
    setStates: action,
    popups: computed
});
