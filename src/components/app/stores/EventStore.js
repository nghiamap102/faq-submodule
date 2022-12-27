import { action, decorate, observable } from 'mobx';
import { CommonHelper } from 'helper/common.helper';

export class EventStore
{
    appStore = null;
    events = [];
    event = undefined;
    isShowDetail = false;
    attachEvent = undefined;
    isDeleting = false;

    isMute = localStorage.getItem('isEventNotification') || '0';

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    replace(events)
    {
        // this.events = events;

        for (const event of events)
        {
            this.update(event);
        }

        const removeIds = [];
        for (const event of this.events)
        {
            const exists = events.find(e => e.id === event.id);
            if (!exists)
            {
                removeIds.push(event.id);
            }
        }

        for (const id of removeIds)
        {
            this.remove(id);
        }

        this.events.replace(this.events.slice().sort((e1, e2) => e2.receiveTime - e1.receiveTime));
    }

    remove(id)
    {
        this.events = this.events.filter((e) => e.id !== id);
    }

    get(id)
    {
        return this.events.find((i) => i.id === id);
    }

    update(event)
    {
        event.active = event.id === (this.event ? this.event.id : null);
        event.receiveTime = Date.parse(event.receiveTime);

        let isExisted = false;
        for (let i = 0; i < this.events.length; i++)
        {
            if (this.events[i].id === event.id)
            {
                event.getTime = this.events[i].getTime;
                this.events[i] = event;
                isExisted = true;
                break;
            }
        }

        if (!isExisted)
        {
            event.getTime = new Date();
            this.events.unshift(event);
        }
    }

    activeById(id)
    {
        const events = CommonHelper.clone(this.events);
        events.forEach((i) =>
        {
            if (i.id === id)
            {
                i.active = true;
                i.getTime = null;
            }
            else
            {
                i.active = false;
            }
        });
        this.events = events;
    }

    setDetail(event = undefined)
    {
        if (event === undefined)
        {
            this.activeById(null);
            this.event = {};
        }
        else
        {
            this.activeById(event.id);
            this.event = event;
        }
    }

    setStateDetail(isOpen)
    {
        this.isShowDetail = isOpen;
    }

    attachToIncident(id)
    {
        this.attachEvent = {
            eventId: id
        };
    }

    attachToIncidentDataChange(key, value)
    {
        if (this.attachEvent !== undefined)
        {
            this.attachEvent[key] = value;
        }
    }

    closeAttachToIncident()
    {
        this.attachEvent = undefined;
    }

    setDeleteState(isDeleting)
    {
        this.isDeleting = isDeleting;
    }

    setMuteState(state)
    {
        this.isMute = state;
        localStorage.setItem('isEventNotification', state);
    }
}

decorate(EventStore, {
    appStore: observable,
    events: observable,
    event: observable,
    isShowDetail: observable,
    attachEvent: observable,
    isDeleting: observable,
    isMute: observable,
    replace: action,
    activeById: action,
    setDetail: action,
    setStateDetail: action,
    attachToIncident: action,
    attachToIncidentDataChange: action,
    closeAttachToIncident: action,
    setDeleteState: action,
    setMuteState: action
});
