import { decorate, observable } from 'mobx';
import { action } from 'mobx';

export class CameraStreamStore
{
    appStore = null;
    cameras = [];
    cameraDetail = undefined;
    location = undefined;

    constructor(appStore)
    {
        this.appStore = appStore;
    }

    set(cameraStreams)
    {
        this.cameras = cameraStreams;
    }

    add(cameraStream)
    {
        this.cameras.push(cameraStream);
    }

    update(cameraStream)
    {
        this.cameras = this.cameras.map((stream) =>
        {
            if (stream.id === cameraStream.id)
            {
                return cameraStream;
            }
            else
            {
                return stream;
            }
        });
    }

    setDetail(detail = undefined)
    {
        this.cameraDetail = detail;

        if (this.cameraDetail !== undefined)
        {
            if (!this.cameraDetail.location)
            {
                this.cameraDetail.location = JSON.stringify(this.getDefaultLocation());
            }

            this.location = JSON.parse(this.cameraDetail.location).coordinates;
        }
    }

    setDetailProperty(key, value)
    {
        if (this.cameraDetail)
        {
            this.cameraDetail[key] = value;
        }
    }

    getLocation()
    {
        return this.location;
    }

    setLocation(coordinates)
    {
        if (this.cameraDetail)
        {
            let location = this.cameraDetail.location;
            if (!location)
            {
                location = this.getDefaultLocation();
            }
            else
            {
                location = JSON.parse(location);
            }
            location.coordinates = coordinates;
            this.setDetailProperty('location', JSON.stringify(location));
            this.location = coordinates;
        }
    }

    getDefaultLocation()
    {
        return {
            type: 'Point',
            coordinates: [106.65474772453308, 10.782070292002865]
        };
    }
}

decorate(CameraStreamStore, {
    appStore: observable,
    cameras: observable,
    cameraDetail: observable,
    location: observable,
    set: action,
    add: action,
    update: action,
    setDetail: action,
    setDetailProperty: action,
    getLocation: action,
    setLocation: action
});
