import { Container, FlexPanel, HD4, Loading, Image, Row, Column, Button } from "@vbd/vui";
import Footer from "extends/ognl/components/app/Footer";
import Header from "extends/ognl/components/app/Header";
import ImageSlider from "extends/ognl/components/app/ImageSlider";
import RelatedPosts from "extends/ognl/components/app/RelatedPosts";
import VideoPlaylist from "extends/ognl/components/app/VideoPlaylist";
import { initPostRequest, POST } from "extends/ognl/pages/PostManager/PostStore";
import _ from "lodash";
import { inject, observer } from "mobx-react";
import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import "./PostLayout.scss";
import Sidebar from "extends/ognl/components/app/Sidebar";

let PostLayout = (props) => {
    const { ognlStore } = props;
    const { configurationStore } = ognlStore;
    const { config, postStore } = ognlStore;
    const { id } = useParams();

    const [postContent, setPostContent] = useState("");
    const [postType, setPostType] = useState(-1);
    const [postTitle, setPostTitle] = useState("");
    const [relatedPost, setRelatedPost] = useState([]);
    const [pageStart, setPageStart] = useState(1);
    const [pageLength, setPageLength] = useState(5);
    const [media, setMedia] = useState([]);
    const imageVideoGallery = useRef();
    const [videoSlide, setVideoSlide] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [layout, setLayout] = useState();
    const [contentWidth, setContentWidth] = useState('100%');

    useEffect(() => {
        const { post } = configurationStore.config;
        if (post?.config) setLayout(post.config.layout);

    }, [configurationStore.config]);

    useEffect(() => {
        setContentWidth(getContentWidth());
    }, [layout]);

    useEffect(() => {
        // const request = {
        //     ...initPostRequest, ...{
        //         searchKey: `Id:(${id})`,
        //     }
        // }
        const initPost = async () => {
            setLoading(true);
            const res = await postStore.getPostById(id);
            console.log(res);
            if (res?.data) {
                let { Title, noiDung, categories, tags, type } = res.data;
                setPostTitle(Title);
                setPostType(type);
                if (type === 1 && !_.isEmpty(noiDung)) {
                    const mediaIds = noiDung.split(',');
                    let medias = await postStore.getPostMedias({ filterQuery: [`(${mediaIds.join(' OR ')})`] });
                    if (medias) {
                        const result = medias.map((ms) =>
                            ms.type.includes('video') ? ({
                                description: ms.Title,
                                data: ms,
                                renderItem: renderVideoItem
                            }) : ({
                                original: ms.url,
                                thumbnail: ms.url,
                                data: ms,
                                description: ms.Title,
                            })
                        );
                        setVideoSlide(result[0].data?.type?.includes('video') ? result[0].data : null);
                        setMedia(result);
                    }
                } else {
                    if (noiDung) {
                        setPostContent(noiDung);
                    }
                }

                if (categories && typeof (categories) === "string") {
                    categories = JSON.parse(categories);
                }

                if (tags && typeof (tags) === "string") {
                    tags = JSON.parse(tags);
                }

                if (categories || tags) {
                    await getRelatedPost(categories, tags);
                }
            }
            setLoading(false);
        }
        if (id) {
            initPost();
        }
    }, [id]);

    const renderVideoItem = (ms) => {
        const data = ms.data;
        let url = data.url;
        if (!_.isEmpty(data.Content)) {
            const content = JSON.parse(data.Content);
            return (<Plyr source={{
                type: "video",
                sources: [
                    content
                ]
            }} />);
        }
        return (<div><video src={url} controls={true} autoPlay={false} width={'100%'} onPlay={(e) => {
            const currentSlide = imageVideoGallery.current;
            if (currentSlide.state.isPlaying) {
                currentSlide.pause();

            }
        }} onPause={() => {
            const currentSlide = imageVideoGallery.current;
            if (!currentSlide.state.isPlaying && currentSlide.props.autoPlay) {
                currentSlide.play();
            }
        }}></video></div>);
    }

    const getRelatedPost = async (categories, tags) => {
        let filters = [];
        if (categories && categories.length) {
            filters.push(`categories:(${categories.join(' OR ')})`);
        }
        if (tags && tags.length) {
            filters.push(`tags:(${tags.join(' OR ')})`);
        }
        const request = {
            ...initPostRequest, ...{
                filterQuery: filters.length ? [filters.join(' OR ')] : null,
                start: pageStart * pageLength - pageLength,
                length: pageLength
            }
        }
        const result = await postStore.loadData(request);
        if (result?.data) {
            setRelatedPost(result.data.filter((d) => d.Id !== id));
        }
    }

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

    const handleSlideMedia = (m) => {
        imageVideoGallery.current.slideToIndex(media.indexOf(m));
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
                    <Container className='content post-content' width={contentWidth}>
                        {loading && <Loading text="Đang tải dữ liệu ..." spinnerSize="lg" />}
                        {!loading && <Column>
                            {!_.isEmpty(postTitle) && (<HD4 className="title">{postTitle}</HD4>)}
                            {postType === 0 && !_.isEmpty(postContent) && (<Row><Container className="content"><div dangerouslySetInnerHTML={{ __html: postContent }} /></Container></Row>)}
                            {postType === 1 && media.length > 0 && (
                                <>
                                    <Row>
                                        <Container className="content">
                                            <ImageGallery
                                                ref={imageVideoGallery}
                                                autoPlay={true}
                                                infinate={false}
                                                items={media}
                                                showBullets={true}
                                                showIndex={true}
                                                showThumbnails={false}
                                                lazyLoad={true}
                                                slideInterval={30000}
                                                showPlayButton={videoSlide == null || !videoSlide?.type?.includes('video/')}
                                                showGalleryPlayButton={videoSlide == null || !videoSlide?.type?.includes('video/')}
                                                useWindowKeyDown={true}
                                                showGalleryFullscreenButton={videoSlide == null}
                                                showFullscreenButton={videoSlide == null}
                                                onBeforeSlide={(index) => {
                                                    const slide = media[index];
                                                    if (slide?.data?.type?.includes('video')) setVideoSlide(slide.data); else setVideoSlide(null);
                                                }}
                                            />
                                        </Container>
                                    </Row>
                                    {
                                        media?.length && <Container className="media-list">
                                            <Row><Container className="toolbar"><Button icon="list" color={viewMode === 'list' ? 'primary' : 'default'} onlyIcon onClick={() => { setViewMode('list'); }} /><Button icon="th" onlyIcon color={viewMode === 'grid' ? 'primary' : 'default'} onClick={() => { setViewMode('grid'); }} /></Container></Row>
                                            <Row>
                                                <Container className={`${viewMode}-view`}>
                                                    {media.map((m) => (
                                                        <Container className="item" key={m.Id} onClick={() => { handleSlideMedia(m) }}>
                                                            <Container className="media-content">
                                                                <Image src={m.data.type.includes('video') ? '/ognl/video-playback-512.png' : m.data.url} /><span>{m.data.Title}</span>
                                                            </Container>
                                                        </Container>
                                                    ))}
                                                </Container>
                                            </Row>
                                        </Container>
                                    }
                                </>
                            )
                            }
                            {
                                relatedPost?.length > 0 && (<Row><RelatedPosts posts={relatedPost} handleNextPage={setPageStart} /></Row>)
                            }
                        </Column>
                        }
                    </Container>

                    {(layout === "sidebar_right" || layout === "both_sidebar") &&
                        <Sidebar components={(
                            <>
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
                            </>
                        )} position={'right'} />
                    }
                </Container>
            </Container>
            <Footer />
        </FlexPanel>
    );
}
PostLayout = inject('appStore', 'ognlStore')(observer(PostLayout));
export default PostLayout;