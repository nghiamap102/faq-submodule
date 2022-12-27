import { decorate, observable } from 'mobx';
import { action } from 'mobx';

export class CameraGroupStore
{
    appStore = null;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    cameraGroups = [];
    cameraGroupDetail = undefined;

    set(cameraGroups)
    {
        this.cameraGroups = cameraGroups;
    }

    add(cameraGroup)
    {
        this.cameraGroups.push(cameraGroup);
    }

    update(cameraGroup)
    {
        this.cameraGroups = this.cameraGroups.map((group) =>
        {
            if (group.id === cameraGroup.id)
            {
                return cameraGroup;
            }
            else
            {
                return group;
            }
        });
    }

    setDetail(detail = undefined)
    {
        this.cameraGroupDetail = detail;
    }

    setDetailProperty(key, value)
    {
        if (this.cameraGroupDetail)
        {
            this.cameraGroupDetail[key] = value;
        }
    }
}


decorate(CameraGroupStore, {
    appStore: observable,
    isShowPopup: observable,
    cameraGroups: observable,
    cameraGroupDetail: observable,
    set: action,
    add: action,
    update: action,
    setDetailProperty: action
});
