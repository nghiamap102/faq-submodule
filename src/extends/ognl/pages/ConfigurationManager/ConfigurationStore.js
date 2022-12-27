import { LAYERDATARURL, LAYERNAME } from "extends/ognl/constant/LayerInfo";
import _ from "lodash";
import { action, computed, decorate, observable } from "mobx";
import LayerService from "services/layer.service";

class ConfigurationStore {
    ognlStore;
    config = {}; 1
    configNode = [];
    layerSvc = new LayerService();

    constructor(ognlStore) {
        this.ognlStore = ognlStore;
    }

    loadConfig = async () => {
        const request = {
            path: LAYERDATARURL.CONFIGURATION,
            layers: [LAYERNAME.CONTAINER],
            searchKey: '',
            start: 0,
            count: -1,
            // filterQuery: ["type:(document)"],
            returnFields: ['*']
        }

        let configuration = {};

        try {
            const rs = await this.layerSvc.getLayers(request);
            if (rs?.status?.code === 200 && rs?.data?.length) {
                rs.data.forEach((d) => {
                    if (d.Content) {
                        const name = d.Title.split('.')[0];
                        const content = JSON.parse(d.Content);
                        configuration[name.toLowerCase()] = content;
                    }
                });
                this.configNode = rs.data;
            }
        } catch (error) {
            console.error("getConfiguration", error);
        }
        this.config = configuration;
        return configuration;
    }

    setConfig = (config) => {
        this.config = config;
    }

    setHomepageConfig = (config) => {
        this.config = { ...this.config, ...{ 'homepage': config } };
    }

    setPostConfig = (config) => {
        this.config = { ...this.config, ...{ 'post': config } };
    }

    setPostsConfig = (config) => {
        this.config = { ...this.config, ...{ 'posts': config } };
    }

    setPageConfig = (config) => {
        this.config = { ...this.config, ...{ 'page': config } };
    }

    setHeaderConfig = (config) => {
        this.config = { ...this.config, ...{ 'header': config } };
    }

    setFooterConfig = (config) => {
        this.config = { ...this.config, ...{ 'footer': config } };
    }

    saveHomepageConfig = async (config) => {
        const homepageNode = this.configNode.find((cn) => cn.Description === 'homepage');
        if (homepageNode) {
            const updateConfig = config ? config : this.config.homepage;
            const layerData = { Title: homepageNode.Title, Description: homepageNode.Description, Content: JSON.stringify(updateConfig) };
            return await this.layerSvc.updateNodeLayer(LAYERNAME.CONTAINER, homepageNode.Id, layerData);
        }
        return null;
    };

    saveHeaderConfig = async (config) => {
        const headerNode = this.configNode.find((cn) => cn.Description === 'header');
        if (headerNode) {
            const updateConfig = config ? config : this.config.header;
            const layerData = { Title: headerNode.Title, Description: headerNode.Description, Content: JSON.stringify(updateConfig) };
            return await this.layerSvc.updateNodeLayer(LAYERNAME.CONTAINER, headerNode.Id, layerData);
        }
        return null;
    };

    saveFooterConfig = async (config) => {
        const footerNode = this.configNode.find((cn) => cn.Description === 'footer');
        if (footerNode) {
            const updateConfig = config ? config : this.config.footer;
            return await this.layerSvc.updateNodeLayer(LAYERNAME.CONTAINER, footerNode.Id,
                {
                    Title: footerNode.Title,
                    Description: footerNode.Description,
                    Content: JSON.stringify(updateConfig)
                });
        }
        return null;
    };

    savePostConfig = async (config) => {
        const postNode = this.configNode.find((cn) => cn.Description === 'post');
        if (postNode) {
            const updateConfig = config ? config : this.config.post;
            const layerData =
            {
                Title: postNode.Title,
                Description: postNode.Description,
                Content: JSON.stringify(updateConfig)
            }
            return await this.layerSvc.updateNodeLayer(LAYERNAME.CONTAINER, postNode.Id, layerData);
        }
        return null;
    };

    savePostsConfig = async (config) => {
        const postsNode = this.configNode.find((cn) => cn.Description === 'posts');
        if (postsNode) {
            const updateConfig = config ? config : this.config.posts;
            const layerData = {
                Title: postsNode.Title,
                Description: postsNode.Description,
                Content: JSON.stringify(updateConfig)
            }
            return await this.layerSvc.updateNodeLayer(LAYERNAME.CONTAINER, postsNode.Id, layerData);
        }
        return null;
    };

    savePageConfig = async (config) => {
        const pageNode = this.configNode.find((cn) => cn.Description === 'page');
        if (pageNode) {
            const updateConfig = config ? config : this.config.page;
            const layerData = {
                Title: pageNode.Title,
                Description: pageNode.Description,
                Content: JSON.stringify(updateConfig)
            }
            return await this.layerSvc.updateNodeLayer(LAYERNAME.CONTAINER, pageNode.Id, layerData);
        }
        return null;
    }
    get configTab() {
        const configTabs = [];
        if (!_.isEmpty(this.config)) {
            for (const key in this.config) {
                if (Object.prototype.hasOwnProperty.call(this.config, key)) {
                    configTabs.push({
                        name: key,
                        title: key.toUpperCase()
                    });
                }
            }
        }
        console.log(this.config);
        return configTabs;
    }
}
decorate(ConfigurationStore, {
    config: observable,

    loadConfig: action,
    setConfig: action,

    setHomepageConfig: action,
    setPostConfig: action,
    setPostsConfig: action,
    setPageConfig: action,
    setHeaderConfig: action,
    setFooterConfig: action,
    saveHomepageConfig: action,
    saveHeaderConfig: action,
    saveFooterConfig: action,
    savePostConfig: action,
    savePostsConfig: action,
    savePageConfig: action,

    configTab: computed
});

export default ConfigurationStore;