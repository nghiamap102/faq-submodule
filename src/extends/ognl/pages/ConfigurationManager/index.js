import { Row, Column, Flex, Button, HD4, Container } from "@vbd/vui";

import _ from "lodash";
import { inject, observer } from "mobx-react"
import { useEffect, useState } from "react";
import HomepageLayout from "../Home/layouts/HomepageLayout";
import HomepageWidgetBuildConfig from "./Components/Homepage/HomepageWidgetBuildConfig";
import './Configuration.scss';

const ConfigurationManager = (props) => {
    const { ognlStore } = props;
    const { configurationStore } = ognlStore;
    const [config, setConfig] = useState('');

    useEffect(() => {
        const init = async () => {
            await configurationStore.loadConfig();
            if (configurationStore.configTab?.length) setConfig(configurationStore.configTab[0]);
        };
        init();
    }, []);

    const setHomepageConfig = (config) => {
        configurationStore.setHomepageConfig(config);
    }

    const onConfigurationItemChange = (config) => {
        setConfig(config);
    }

    const getConfigBuildFormByName = (name) => {
        switch (name) {
            case 'homepage':
                return getBuildHomePageWidgetConfig();
            case 'header':
                return getBuildHeaderConfig();
            case 'footer':
                return getBuildFooterConfig();
            case 'post':
                return getBuildPostWidgetConfig();
            case 'posts':
                return getBuildPostsWidgetConfig();
            case 'page':
                return getBuildPageConfig();
        }
        return (<></>);
    }

    const getConfigPreviewByName = (name) => {
        switch (name) {
            case 'homepage':
                return getPreviewHomepageWidgetConfig();
            case 'header':
                return getPreviewHeaderConfig();
            case 'footer':
                return getPreviewFooterConfig();
            case 'post':
                return getPreviewPostWidgetConfig();
            case 'posts':
                return getPreviewPostsWidgetConfig();
            case 'page':
                return getPreviewPageConfig();
        }
        return (<></>);
    }

    /* ==== HOMEPAGE ==== */
    const getBuildHomePageWidgetConfig = () => (
        <HomepageWidgetBuildConfig
            homepageConfig={configurationStore.config.homepage}
            setHomepageConfig={setHomepageConfig}
            saveHomepageConfig={handleSaveHomepageConfig} />
    );

    const getPreviewHomepageWidgetConfig = () => (
        <Container className="preview-container" >
            <HomepageLayout />
        </Container>
    );

    const handleSaveHomepageConfig = async () => {
        return await configurationStore.saveHomepageConfig();
    }

    /* ==== HEADER ==== */
    const getBuildHeaderConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    const getPreviewHeaderConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    /* ==== FOOTER ==== */
    const getBuildFooterConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    const getPreviewFooterConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    /* ==== POST WIDGET ==== */
    const getBuildPostWidgetConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    const getPreviewPostWidgetConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    /* ==== POSTS WIDGET ==== */
    const getBuildPostsWidgetConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    const getPreviewPostsWidgetConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    /* ==== PAGE ==== */
    const getBuildPageConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    const getPreviewPageConfig = () => {
        return (<><HD4>Coming soon</HD4></>);
    }

    return (
        <Row className="config-container">
            <Column>
                <Flex
                    direction="col"
                    height='fit'
                    width='full'
                    panel>
                    <Flex
                        className="config-tab-container"
                        panel
                        gap={4}
                        sx={{ p: 2 }}
                    >
                        {configurationStore.configTab.map((ct) => (
                            <Flex key={ct.name} direction="col" >
                                <Button color={ct.name === config.name ? 'success' : 'secondary'} onClick={() => { onConfigurationItemChange(ct) }} text={ct.title} />
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
                <Row>
                    <Column className="build-config-form" flex={1}>
                        {!_.isEmpty(config) && getConfigBuildFormByName(config.name)}
                    </Column>
                    <Column className="preview-config" flex={1}>
                        {!_.isEmpty(config) && getConfigPreviewByName(config.name)}
                    </Column>
                </Row>
            </Column>
        </Row>
    );
}

export default inject('appStore', 'ognlStore')(observer(ConfigurationManager));