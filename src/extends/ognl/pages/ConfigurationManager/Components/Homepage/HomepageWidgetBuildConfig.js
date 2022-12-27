import { AdvanceSelect, Button, CheckBox, CollapsibleSection, Container, FAIcon, Flex, FormControlLabel, useModal } from '@vbd/vui';
import BaseConfiguration from 'extends/ognl/components/app/ConfigurationComponents/BaseConfiguration';
import CustomHTMLConfiguration from 'extends/ognl/components/app/ConfigurationComponents/CustomHTMLConfiguration';
import ImagePlaylistConfiguration from 'extends/ognl/components/app/ConfigurationComponents/ImagePlaylistConfiguration';
import PostWidgetConfiguration from 'extends/ognl/components/app/ConfigurationComponents/PostWidgetConfiguration';
import VideoPlaylistConfiguration from 'extends/ognl/components/app/ConfigurationComponents/VideoPlaylistConfiguration';
import _ from 'lodash';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const initComponents = [
    {
        name: 'CustomHTML',
        title: 'Tùy chỉnh HTML',
        config: {}
    }, {
        name: 'PostWidget',
        title: 'Danh mục bài viết',
        config: {}
    }, {
        name: 'VideoPlaylist',
        title: 'Thư viện video',
        config: {}
    }, {
        name: 'ImageSlider',
        title: 'Thư viện hình ảnh',
        config: {}
    }, {
        name: 'Visits',
        title: 'Số lượng truy cập',
        config: {}
    },
    {
        name: 'Voted',
        title: 'Đánh giá',
        config: {}
    }
]

const HomepageWidgetBuildConfig = (props) => {
    const { homepageConfig, setHomepageConfig, saveHomepageConfig } = props;

    const [sidebarRightComponents, setSidebarRightComponents] = useState(homepageConfig?.components?.sidebarRight?.length ? homepageConfig.components.sidebarRight : []);

    const [sidebarLeftComponents, setSidebarLeftComponents] = useState(homepageConfig?.components?.sidebarLeft?.length ? homepageConfig.components.sidebarLeft : []);

    // const [featuredContent, setFeaturedContent] = useState(homepageConfig?.components?.featuredContent ? homepageConfig?.components?.featuredContent : {});
    const featuredContent = homepageConfig?.components?.featuredContent ? homepageConfig?.components?.featuredContent : {};
    // const [featuredSidebarRightComponents, setFeaturedSidebarRightComponents] = useState([]);

    const [homepageConfiguration, setHomepageConfiguration] = useState(homepageConfig?.config ? homepageConfig?.config : {
        layout: "sidebar_right",
        width: "fixedwidth",
        enableFeatureContent: true
    });

    const [loading, setLoading] = useState(false);

    const { menu, toast } = useModal();

    useEffect(() => {
        setHomepageConfig({
            ...homepageConfig, ...{
                config: homepageConfiguration,
                components: {
                    featuredContent: featuredContent,
                    sidebarLeft: sidebarLeftComponents,
                    sidebarRight: sidebarRightComponents
                }
            }
        });

    }, [sidebarRightComponents, sidebarLeftComponents, homepageConfiguration, featuredContent]);

    const handleUpdateSideBarRightComponent = (id, config) => {
        let comps = [...sidebarRightComponents];
        const index = comps.findIndex((c) => c.id === id);
        comps[index].config = config;
        setSidebarRightComponents(comps);
    }

    const handleUpdateSideBarLeftComponent = (id, config) => {
        let comps = [...sidebarLeftComponents];
        const index = comps.findIndex((c) => c.id === id);
        comps[index].config = config;
        setSidebarLeftComponents(comps);
    }

    const handleRemoveSideBarRightComponent = (id) => {
        setSidebarRightComponents(sidebarRightComponents.filter((c) => c.id !== id));
    }

    const handleRemoveSideBarLeftComponent = (id) => {
        setSidebarLeftComponents(sidebarLeftComponents.filter((c) => c.id !== id));
    }

    const getBuildConfigView = (components, onChange, onDelete) => {
        const compViews = components.map((comp) => (getComponentConfig(comp, onChange, onDelete)));
        return compViews;
    };

    const getComponentConfig = (component, onChange, onDelete) => {
        let returnComps = null;

        switch (component.name.toLowerCase()) {
            case 'customhtml':
                returnComps = (
                    <Container className='sidebar-component-item-content'>
                        <CustomHTMLConfiguration
                            onChange={(value) => {
                                onChange(component.id, value);
                            }}
                            config={component.config} />
                    </Container>
                );
                break;
            case 'postwidget':
                returnComps = (
                    <Container className='sidebar-component-item-content'>
                        <PostWidgetConfiguration
                            onChange={(value) => {
                                onChange(component.id, value);
                            }}
                            config={component.config} />
                    </Container>
                );
                break;
            case 'videoplaylist':
                returnComps = (
                    <Container className='sidebar-component-item-content'>
                        <VideoPlaylistConfiguration
                            onChange={(value) => {
                                onChange(component.id, value);
                            }}
                            config={component.config} />
                    </Container>
                );
                break;
            case 'imageslider':
                returnComps = (
                    <Container className='sidebar-component-item-content'>
                        <ImagePlaylistConfiguration
                            onChange={(value) => {
                                onChange(component.id, value);
                            }}
                            config={component.config} />
                    </Container>
                );
                break;
            case 'visits':
            case 'voted':
                <Container className='sidebar-component-item-content'>
                    <BaseConfiguration onChange={(value) => {
                        onChange(component.id, value);
                    }}
                        config={component.config} />
                </Container>
                break;
        }
        return (<CollapsibleSection className='sidebar-component-item' key={component.id} header={component.title} defaultExpanded={false} actions={[{
            icon: 'trash',
            onClick: () => {
                console.log('remove', component);
                onDelete(component.id);
            }
        }]}>
            {returnComps}
        </CollapsibleSection>);
    }

    return (
        <>
            <Flex
                direction="row"
                height='fit'
                width='full'
                panel>
                <Flex direction="col" panel>
                    <FormControlLabel
                        label="Layout"
                        direction="row"
                        control={(
                            <AdvanceSelect
                                options={[{ id: 'sidebar_right', label: 'Sidebar Right' }, { id: 'sidebar_left', label: 'Sidebar Left' }, { id: 'both_sidebar', label: 'Both Sidebar' }]}
                                value={homepageConfig?.config?.layout != null ? homepageConfig.config.layout : null}
                                onChange={(value) => {
                                    setHomepageConfiguration({ ...homepageConfiguration, ...{ layout: value } });
                                }}
                            />
                        )}
                    />
                    <FormControlLabel
                        label="Width"
                        direction="row"
                        control={(
                            <AdvanceSelect
                                options={[{ id: 'fullwidth', label: 'Fullwidth' }, { id: 'fixedwidth', label: 'Fixed Width' }]}
                                value={homepageConfig?.config?.width != null ? homepageConfig.config.width : null}
                                onChange={(value) => {
                                    setHomepageConfiguration({ ...homepageConfiguration, ...{ width: value } });
                                }}
                            />
                        )}
                    />
                    <CheckBox
                        label="Nội dung nổi bật"
                        name="visibility"
                        checked={homepageConfiguration.enableFeatureContent}
                        onChange={(value) => {
                            console.log(value);
                            setHomepageConfiguration({ ...homepageConfiguration, ...{ enableFeatureContent: value } });
                            // setHomepageConfig({ ...homepageConfig, ...{ config: config } });
                        }}
                    />
                </Flex>
            </Flex>
            <Flex
                direction="row"
                width='full'
                items='center'
                justify='center'
                panel
                sx={{ p: 2 }}>
                <Button text={"Cập nhật"} onClick={async () => {
                    setLoading(true);
                    const rs = await saveHomepageConfig();
                    if (rs?.status.success) {
                        toast({ message: "Cập nhật cấu hình thành công!", type: "success" });
                    } else {
                        toast({ message: rs.error?.message, type: "error" });
                    }
                    setLoading(false);
                }} color="primary" isLoading={loading} />
            </Flex>
            <Flex
                direction="row"
                width='full'
                panel>
                {
                    (homepageConfiguration.layout === 'sidebar_right' || homepageConfiguration.layout === 'both_sidebar') &&
                    <Flex direction="col" panel height='full' width='full' className='sidebar-component'>
                        <FormControlLabel
                            label="Sidebar Right"
                            direction="column"
                            control={(
                                <>
                                    {!_.isEmpty(sidebarRightComponents) && getBuildConfigView(sidebarRightComponents, handleUpdateSideBarRightComponent, handleRemoveSideBarRightComponent)}
                                    <Button style={{ marginTop: '1rem' }} className="add-other-widget" icon='plus' onlyIcon onClick={(event) => {
                                        menu({
                                            id: 'theme-menu',
                                            isTopLeft: true,
                                            position: { x: event.clientX, y: event.clientY },
                                            actions: initComponents.map((component) => ({
                                                label: component.name,
                                                icon: (
                                                    <FAIcon
                                                        type="solid"
                                                        icon="cog"
                                                        size="1rem"
                                                        color={'var(--primary-color)'}
                                                    />
                                                ),
                                                onClick: () => {
                                                    const newLst = [...sidebarRightComponents];
                                                    newLst.push({ ...component, ... { id: `${component.name}-${new Date().getTime()}` } });
                                                    setSidebarRightComponents(newLst);
                                                },
                                            })),
                                        });
                                    }} />
                                </>
                            )}
                        />
                    </Flex>
                }
                {
                    (homepageConfiguration.layout === 'sidebar_left' || homepageConfiguration.layout === 'both_sidebar') &&
                    <Flex direction="col" panel height='full' width='full' className='sidebar-component'>
                        <FormControlLabel
                            label="Sidebar Left"
                            direction="column"
                            control={(<>
                                {!_.isEmpty(sidebarLeftComponents) && getBuildConfigView(sidebarLeftComponents, handleUpdateSideBarLeftComponent, handleRemoveSideBarLeftComponent)}
                                <Button style={{ marginTop: '1rem' }} className="add-other-widget" icon='plus' onlyIcon onClick={(event) => {
                                    menu({
                                        id: 'theme-menu',
                                        isTopLeft: true,
                                        position: { x: event.clientX, y: event.clientY },
                                        actions: initComponents.map((component) => ({
                                            label: component.name,
                                            icon: (
                                                <FAIcon
                                                    type="solid"
                                                    icon="cog"
                                                    size="1rem"
                                                    color={'var(--primary-color)'}
                                                />
                                            ),
                                            onClick: () => {
                                                const newLst = [...sidebarLeftComponents];
                                                newLst.push(component);
                                                setSidebarLeftComponents(newLst);
                                            },
                                        })),
                                    });
                                }} />
                            </>)}
                        />
                    </Flex>
                }
            </Flex>
        </>
    );
}

HomepageWidgetBuildConfig.prototype = {
    // acess hasOne Feature
    homepageConfig: PropTypes.object.isRequired,
    setHome: PropTypes.func,

};

HomepageWidgetBuildConfig.defaultProps = {
    homepageConfig: {}
};

export default observer(HomepageWidgetBuildConfig);