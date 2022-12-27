import { FlexPanel, Container, Column, Row, Image, HD4 } from "@vbd/vui";
import Footer from "extends/ognl/components/app/Footer";
import Header from "extends/ognl/components/app/Header";
import ImageSlider from "extends/ognl/components/app/ImageSlider";
import VideoPlaylist from "extends/ognl/components/app/VideoPlaylist";
import _ from "lodash";
import { inject, observer } from "mobx-react"
import { useEffect, useState } from "react";
import "./VideoGallery.scss";

const VideoGallery = (props) => {
    const { ognlStore } = props;
    const { configurationStore } = ognlStore;
    // const { config: { page } } = ognlStore;
    // const { layout } = page.config;
    const [layout, setLayout] = useState();
    const [contentWidth, setContentWidth] = useState('100%');

    useEffect(() => {
        const { page } = configurationStore.config;
        if (page?.config) setLayout(page.config.layout);

    }, [configurationStore.config]);

    useEffect(() => {
        setContentWidth(getContentWidth());
    }, [layout]);

    const getContentWidth = () => {
        switch (layout) {
            case 'sidebar_left':
            case 'sidebar_right':
                return '80%';
            case 'both_sidebar':
                return '60%';
            default:
                return '100%';
        }
    }
    return (
        <FlexPanel className='container'>
            <Header />
            <Container className=" body-container">
                <Container className="body-content fixedwidth">
                    {(layout === "sidebar_left" || layout === "both_sidebar") &&
                        <Container className='sidebar sidebar-left'>
                            <Container className='content'>
                                <h1>Sidebar left</h1>
                            </Container>
                        </Container>
                    }
                    <Container className='content page-content video-gallery' width={getContentWidth()}>
                        <Column>
                            <Row>
                                <HD4 className="title">Thư viện video</HD4>
                            </Row>
                            <Row>
                                <VideoPlaylist isWidget={false} paging={true} showWidgetTitle={false} />
                            </Row>
                        </Column>
                    </Container>

                    {(layout === "sidebar_right" || layout === "both_sidebar") &&
                        <Container className='sidebar sidebar-right'>
                            <Row className='row-sidebar'>
                                <VideoPlaylist />
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button hoat-dong quoc-hoi"><Image src="/ognl/QuocHoi_034835.jpg" /></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button hoat-dong chinh-phu"><Image src="/ognl/ChinhPhu_042901.jpg" /></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button hoat-dong cong-thong-tin"><Image src="/ognl/portal_043937.jpg" /></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button hoat-dong luat-vn"><Image src="/ognl/CSDL_044310.jpg" /></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button hoat-dong tai-lieu-ky-hop"><Image src="/ognl/TLHop_043631.jpg" /></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <ImageSlider />
                            </Row>
                        </Container>
                    }
                </Container>
            </Container>
            <Footer />
        </FlexPanel>
    );
}

export default inject('appStore', 'ognlStore')(observer(VideoGallery));