// import { PermissionStore } from "extends/ffms/components/Permission/PermissionStore";
// import { AppConfigStore } from "extends/ffms/pages/AppConfig/AppConfigStore";
// import CommonService from "extends/ffms/services/CommonService";
// import { RoleStore } from "extends/ffms/views/RolePanel/RoleStore";
import HttpClient from "helper/http.helper";
import TenantService from "services/tenant.service";
import CategoriesStore from "./pages/CategoriesManager/CategoriesStore";
import PostStore from "./pages/PostManager/PostStore";
import TagsStore from "./pages/TagsManager/TagsStore";
import DocumentStore from "./pages/DocumentManager/DocumentStore";
import ImageSliderStore from "./stores/ImageSliderStore";
import VideoPlaylistStore from "./stores/VideoPlaylistStore";
import LayerService from "services/layer.service";
import ConfigurationStore from "./pages/ConfigurationManager/ConfigurationStore";
class OGNLStore {
    http = new HttpClient();
    tenantSvc = new TenantService();
    layerSvc = new LayerService();
    readyToStart = true;

    appStore;
    postStore;
    categoriesStore;
    tagsStore;
    documentStore;
    imageSliderStore;
    videoPlaylistStore;
    configurationStore;
    // comSvc;
    // roleStore;
    // permissionStore;
    // appConfigStore;

    constructor(appStore) {
        this.appStore = appStore;
        this.postStore = new PostStore(this);
        this.categoriesStore = new CategoriesStore(this);
        this.tagsStore = new TagsStore(this);
        this.documentStore = new DocumentStore(this);
        this.imageSliderStore = new ImageSliderStore(this);
        this.videoPlaylistStore = new VideoPlaylistStore(this);
        this.configurationStore = new ConfigurationStore(this);
        // this.comSvc = new CommonService(appStore.contexts);
        // this.roleStore = new RoleStore(this);
        // this.permissionStore = new PermissionStore();

        // this.appConfigStore = new AppConfigStore(this);         
    }
}
export default OGNLStore;