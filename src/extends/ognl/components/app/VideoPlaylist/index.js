import { Container, FAIcon, HD6, Paging, Row, Loading } from "@vbd/vui";
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { PAGE_DETAIL } from "extends/ognl/ONGLRoute";
import { Link } from "react-router-dom";
import Plyr from "plyr-react";
import "plyr-react/dist/plyr.css";

import "./VideoPlaylist.scss";
import _ from "lodash";

const initVideoSrc = {
    type: "video",
    sources: [
        {
            src: "epoImQqUEOs",
            provider: "youtube"
        }
    ]
};

const VideoPlaylist = (props) => {
    const { title, showWidgetTitle, ognlStore: { videoPlaylistStore }, paging, isWidget, numberOfVideo } = props;
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState(null);
    const [playVideo, setPlayVideo] = useState(null);

    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(numberOfVideo);

    useEffect(async () => {
        setLoading(true);
        try {
            const request = { count: pageSize, start: pageIndex * pageSize - pageSize };
            const result = await videoPlaylistStore.loadData(request);
            if (result) {
                const { data, total } = result;
                setVideos(data);
                handlePlayVideo(data[0]);
                setTotal(total);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }, [pageIndex, pageSize]);

    useEffect(() => {
        setPageSize(numberOfVideo);
    }, [numberOfVideo])

    const handlePlayVideo = function (video) {
        if (video?.Content) { //Phong: Handling video play from other source
            const src = { src: video.Content.src, provider: video.Content.provider };
            setPlayVideo({
                ...initVideoSrc, ...{
                    sources: [src]
                }, ...video
            });
        }
        if (video?.url) { //Phong: Handling video play from file
            const src = { src: video.url };
            setPlayVideo({
                ...initVideoSrc, ...{
                    sources: [src]
                }, ...video
            });
        }
    }

    return (
        <Container className={`video-playlist-container${isWidget ? ' post-widget' : ''}`}>
            {showWidgetTitle && <Row className="title">
                <Link to={`${PAGE_DETAIL}/video-gallery`}><HD6>{!_.isEmpty(title) ? title : 'Video hoạt động'}</HD6></Link>
            </Row>}
            <Container className="video-playlist">
                {loading ? <Loading /> :
                    <>
                        <Row>
                            <Container className="player">
                                {playVideo && <Plyr source={playVideo} />}
                            </Container>
                        </Row>
                        <Row>
                            <Container className="list">
                                {videos && videos.map(v =>
                                (
                                    <Container key={v.Id} className={`videoInfo ${playVideo.Id === v.Id ? "playing" : ""}`} onClick={() => { handlePlayVideo(v) }}>
                                        <FAIcon icon="play" size={24} />{v.Title}
                                    </Container>
                                ))}
                            </Container>
                        </Row>
                        {paging && <Paging total={total} currentPage={pageIndex} pageSize={pageSize} onChange={(index) => { setPageIndex(index) }} />}
                    </>}
            </Container>
        </Container>
    );
}

VideoPlaylist.propTypes = {
    title: PropTypes.string,
    showWidgetTitle: PropTypes.bool,
    paging: PropTypes.bool,
    isWidget: PropTypes.bool,
    numberOfVideo: PropTypes.number,
    // postId: PropTypes.string
};

VideoPlaylist.defaultProps = {
    showWidgetTitle: true,
    paging: false,
    isWidget: true,
    numberOfVideo: 10
}

export default inject('ognlStore')(observer(VideoPlaylist));