import { computed, decorate, observable, action } from 'mobx';

export class PopupStore
{
    appStore = null;
    listPopup = [];
    imagePopup = null;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    setImagePopup = (imageFile) =>
    {
        this.imagePopup = imageFile;
    };

    clearImagePopup = () =>
    {
        this.imagePopup = null;
    };

    add(popup)
    {
        if (!popup.type)
        {
            popup = { ...popup, type: 'normal' };
        }

        this.listPopup.push(popup);
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

decorate(PopupStore, {
    appStore: observable,
    listPopup: observable,
    imagePopup: observable,

    add: action,
    remove: action,
    setState: action,
    setStates: action,
    popups: computed
});
