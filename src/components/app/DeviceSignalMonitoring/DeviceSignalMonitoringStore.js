import { decorate, observable, action } from 'mobx';

export class DeviceSignalMonitoringStore
{
    map = null;
    data = [];
    popups = [];

    addMapPopup(popupData)
    {
        if (!popupData.x || !popupData.y)
        {
            return;
        }

        if (this.popups.find((p) => p.id === popupData.name) === undefined)
        {
            const map = this.map;

            const popup = {
                id: popupData.name,
                title: popupData.name,
                sub: popupData.sub,
                lng: popupData.y,
                lat: popupData.x,
                width: 350,
                height: 180,
                isActivate: true,
                onClose: this.onMarkerPopupClose,
                data: popupData
            };

            this.popups.clear();
            this.popups.push(popup);

            if (map)
            {
                map.panTo({ lat: popupData.x, lng: popupData.y });
            }
        }
    }

    onMarkerPopupClose = (event) =>
    {
        this.removeMapPopup(event.id);
    };

    removeMapPopup = (id) =>
    {
        this.popups = this.popups.filter((p) => p.id !== id);
    };

    setData(data)
    {
        this.data = data;
    }

}

decorate(DeviceSignalMonitoringStore, {
    data: observable,
    popups: observable,
    setData: action,
    addMapPopup: action,

});
