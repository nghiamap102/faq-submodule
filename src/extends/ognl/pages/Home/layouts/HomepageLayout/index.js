import { Column, Container, FAIcon, FlexPanel, HD6, Image, Row } from "@vbd/vui";
import FeaturedContent from "extends/ognl/components/app/FeaturedContent";
import Footer from "extends/ognl/components/app/Footer";
import Header from "extends/ognl/components/app/Header";
import ImageSlider from "extends/ognl/components/app/ImageSlider";
import NewDocument from "extends/ognl/components/app/NewDocument";
import PostsWidget from "extends/ognl/components/app/PostsWidget";
import VideoPlaylist from "extends/ognl/components/app/VideoPlaylist";
import { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import './HomePage.scss';
import Sidebar from "extends/ognl/components/app/Sidebar";
import Visits from "extends/ognl/components/app/Visits";

let HomepageLayout = (props) => {
    const { ognlStore } = props;
    const { configurationStore } = ognlStore;
    const [layout, setLayout] = useState('');
    const [width, setWidth] = useState('');
    const [contentWidth, setContentWidth] = useState('100%');
    const [featuredContent, setFeaturedContent] = useState();
    const [isFeaturedContentEnable, setIsFeaturedContentEnable] = useState(false);
    const [sidebarLeft, setSidebarLeft] = useState(null);
    const [sidebarRight, setSidebarRight] = useState(null);

    useEffect(() => {
        const { config: { homepage } } = configurationStore;
        if (homepage) {
            setLayout(homepage.config.layout);
            setWidth(homepage.config.width);

            // Set feature config
            setIsFeaturedContentEnable(homepage.config.enableFeatureContent);
            setFeaturedContent(homepage.components.featuredContent);

            // Set sidebar left config
            setSidebarLeft(homepage.components.sidebarLeft);

            // Set sidebar right config
            setSidebarRight(homepage.components.sidebarRight);
        }
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
        <>
            <FlexPanel className="container">
                <Header />
                <Container className="body-container">
                    {isFeaturedContentEnable && <Row>
                        <Container className={`body-content feature-content ${width}`}>
                            <Container className='content' width={featuredContent?.layout === "sidebar_right" ? "80%" : "100%"}>
                                <Row><FeaturedContent category="su-kien-noi-bat" /></Row>
                            </Container>

                            {(featuredContent?.layout === "sidebar_right") &&
                                <Sidebar config={featuredContent} position={'right'} />
                            }
                        </Container>
                    </Row>}
                    <Row>
                        <Container className={`body-content ${width}`}>
                            {(layout === "sidebar_left" || layout === "both_sidebar") &&
                                <Sidebar components={(<>
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
                                        <Container className="image-button hoat-dong tai-lieu-ky-hop" ><Image src="/ognl/TLHop_043631.jpg" /></Container>
                                    </Row>
                                    <Row className='row-sidebar'>
                                        <ImageSlider />
                                    </Row>
                                    <Row className='row-sidebar'>
                                        <Visits />
                                    </Row>
                                </>)} position={'left'} config={sidebarLeft} />
                            }
                            <Container className='content' width={contentWidth}>

                                <Row className='row-content'><Container className="image-button ky-hop-quoc-hoi"><Image src="/ognl/Kyhop2B_043301.jpg" /></Container></Row>
                                <Row className='row-content'>
                                    <Column className='col-content'><Container className="image-button button-chi-dao"></Container></Column>
                                    <Column className='col-content'><Container className="image-button button-pc-covid" ><Image src="/ognl/phongchongdich.png" /></Container></Column>
                                    <Column className='col-content'><Container className="image-button button-duong-day-nong"> <FAIcon icon="phone-alt" size={'2rem'} /><HD6>Đường dây nóng tiếp nhận phản ánh và giải pháp về Covid-19</HD6></Container></Column>
                                </Row>
                                <Row className='row-content'>
                                    <Column className='col-content'><PostsWidget category="hoat-dong-cua-doan-dbqh" /></Column>
                                    <Column className='col-content'><PostsWidget category="hoat-dong-cua-hdnd-tinh" /></Column>
                                </Row>
                                <Row className='row-content'>
                                    <Column className='col-content'><PostsWidget category="nghien-cuu-trao-doi" /></Column>
                                    <Column className='col-content'><PostsWidget category="tin-tuc-su-kien" /></Column>
                                    <Column className='col-content'><PostsWidget category="hoat-dong-cua-van-phong" /></Column>
                                </Row>
                                <Row className='row-content'>
                                    <Column className="col-content">
                                        <Container className="newest-document">
                                            <NewDocument showTitle={true} />
                                        </Container>
                                    </Column>
                                </Row>
                            </Container>

                            {(layout === "sidebar_right" || layout === "both_sidebar") &&
                                <Sidebar components={(<>
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
                                        <Container className="image-button hoat-dong tai-lieu-ky-hop" ><Image src="/ognl/TLHop_043631.jpg" /></Container>
                                    </Row>
                                    <Row className='row-sidebar'>
                                        <ImageSlider />
                                    </Row>
                                    <Row className='row-sidebar'>
                                        <Visits visitors={0} onlines={0} />
                                    </Row>
                                </>)} position={'right'} config={sidebarRight} />
                            }
                        </Container>
                    </Row>
                </Container >
                <Footer />
            </FlexPanel >
        </>
    );
}
HomepageLayout = inject('appStore', 'ognlStore')(observer(HomepageLayout));
export default HomepageLayout;