import { decorate, observable } from 'mobx';
import Cookies from 'js-cookie';

import { PopupStore } from './PopupStore';
import { MarkerStore } from './MarkerStore';
import { MarkerPopupStore } from './MarkerPopupStore';
import { FeatureBarStore } from './FeatureBarStore';
import { LayerStore } from './LayerStore';
import { MapStore } from './MapStore';
import { IncidentStore } from './IncidentStore';
import { LocationStore } from './LocationStore';
import { DirectionStore } from './DirectionStore';
import { EventStore } from './EventStore';
import { SearchStore } from './SearchStore';
import { DrawToolStore } from './DrawToolStore';
import { GeofenceStore } from './GeofenceStore';
import { AdvanceSearchStore } from './AdvanceSearchStore';
import { SketchMapStore } from './SketchMapStore';
import { FaceRecognitionStore } from './FaceRecognitionStore';
import { FaceDetectionStore } from './FaceDetectionStore';
import { FaceAlertStore } from './FaceAlertStore';
import { FSImageDetailStore } from './FSImageDetailStore';
import { WatchListStore } from './WatchListStore';
import { BlockadeStore } from './BlockadeStore';
import { FaceGalleryStore } from './FaceGalleryStore';
import { FaceSettingStore } from './FaceSettingStore';
import { CameraGroupStore } from './CameraGroupStore';
import { CameraStreamStore } from './CameraStreamStore';
import { CaseStore } from './CaseStore';
import { ActivityLogsStore } from './ActivityLogsStore';
import { AdminBoundariesStore } from './AdminBoundariesStore';
import { MeasureStore } from './MeasureStore';
import { PlateWatchListStore } from './PlateWatchListStore';
import { AdminPageStore } from './AdminPageStore';
import { UserStore } from './UserStore';
import { SystemLogsStore } from './SystemLogsStore';
import { StreetViewStore } from './StreetViewStore';
import { DashboardStore } from './DashboardStore';

import { PlaceGalleryStore } from 'components/app/LPR/PlateGallery/PlaceGalleryStore';
import { CameraMonitoringStore } from 'components/app/CameraMonitoring/CameraMonitoringStore';
import { GeneralDetectionStore } from 'components/app/GeneralDetection/GeneralDetectionStore';
import { SpaceRainStore } from 'components/app/SpaceRain/SpaceRainStore';

import { DirectionService } from 'services/direction.service';
import { AuthService } from 'services/auth.service';

import { CaseHandlingStore } from './CaseHandlingStore';
import VBDLISFAQStore from 'extends/vbdlis_faq/VBDLISFAQStore';

class AppStore
{
    constructor(contexts)
    {
        this.contexts = contexts;

        this.popupStore = new PopupStore(this);
        this.markerStore = new MarkerStore(this);
        this.markerPopupStore = new MarkerPopupStore(this);
        this.featureBarStore = new FeatureBarStore(this);
        this.layerStore = new LayerStore(this);
        this.mapStore = new MapStore(this);
        this.incidentStore = new IncidentStore(this);
        this.locationStore = new LocationStore(this);
        this.directionStore = new DirectionStore(this, new DirectionService());
        this.eventStore = new EventStore(this);
        this.searchStore = new SearchStore(this, new DirectionService());
        this.drawToolStore = new DrawToolStore(this, new DirectionService());
        this.geofenceStore = new GeofenceStore(this, new DirectionService());
        this.watchListStore = new WatchListStore(this);
        this.plateWatchListStore = new PlateWatchListStore(this);
        this.faceRecognitionStore = new FaceRecognitionStore(this);
        this.faceDetectionStore = new FaceDetectionStore(this);
        this.faceGalleryStore = new FaceGalleryStore(this);
        this.plateGalleryStore = new PlaceGalleryStore(this);
        this.faceAlertStore = new FaceAlertStore(this);
        this.advanceSearchStore = new AdvanceSearchStore(this);
        this.blockadeStore = new BlockadeStore(this);
        this.cameraGroupStore = new CameraGroupStore(this);
        this.fsImageDetailStore = new FSImageDetailStore(this);
        this.faceSettingStore = new FaceSettingStore(this);
        this.cameraStreamStore = new CameraStreamStore(this);
        this.sketchMapStore = new SketchMapStore(this);
        this.caseStore = new CaseStore(this);
        this.activityLogsStore = new ActivityLogsStore(this);
        this.adminBoundariesStore = new AdminBoundariesStore(this);
        this.measureStore = new MeasureStore(this);
        this.adminPageStore = new AdminPageStore(this);
        this.userStore = new UserStore(this);
        this.cameraMonitoringStore = new CameraMonitoringStore();
        this.systemLogsStore = new SystemLogsStore(this);
        this.streetViewStore = new StreetViewStore(this);
        // this.chatStore = new ChatStore(this);
        this.generalDetectionStore = new GeneralDetectionStore(this);
        this.spacerainStore = new SpaceRainStore(this);
        this.dashboardStore = new DashboardStore(this);
        this.caseHandlingStore = new CaseHandlingStore(this);
        this.vbdlisFaqStore = new VBDLISFAQStore(this);
    }

    authService = new AuthService();

    // User profile
    profile = {
        userId: '',
        displayName: '',
        email: '',
        avatar: '',
    };

    loadProfile = async () =>
    {
        let profile = null;

        if (!this.profile.email)
        {
            profile = await this.authService.getProfile();
            this.setProfile(profile);
        }

        return profile;
    };

    setProfile = (profile) =>
    {
        if (profile && profile.displayName)
        {
            this.profile.displayName = profile.displayName;
            this.profile.email = profile.email;
            this.profile.avatar = profile.avatar;
            this.profile.roles = profile.roles;
            this.profile.products = profile.products || {};
            this.profile.userId = profile.userId;
            this.profile.userName = profile.userName;
            this.profile.isAuthorized = true;

            Cookies.set('vdmsAccesstoken', profile.vdmsAccesstoken);
            Cookies.set('t4UserId', profile.userId);
        }
        else // reset
        {
            this.removeProfile();
        }
    };

    removeProfile = () =>
    {
        this.profile.displayName = '';
        this.profile.email = '';
        this.profile.avatar = '';
        this.profile.roles = {};
        this.profile.products = {};
        this.profile.userId = '';
        this.profile.userName = '';
        this.profile.isAuthorized = false;

        // remove cookie
        Cookies.remove('vdmsAccesstoken');
    };

    logOut = () =>
    {
        this.removeProfile();
        window.location.href = '/auth/logout?redirect_uri=' + window.location.href;
    };

    ensureLogin = () =>
    {
        return this.profile.displayName !== '';
    };
}

decorate(AppStore, {
    profile: observable,

    // loadProfile: action,
    // setProfile: action,
});

export default AppStore;
