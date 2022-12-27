import { Container, Row, FAIcon, HD6 } from "@vbd/vui";
import { useEffect } from "react";
import PostsWidget from "../PostsWidget";
import PropTypes from 'prop-types';

import './Sidebar.scss';
import { observer } from "mobx-react";
import VideoPlaylist from "../VideoPlaylist";
import ImageSlider from "../ImageSlider";
import Visits from "../Visits";
import Voted from "../Voted";
import CustomHTML from "../CustomHTML";

const Sidebar = (props) => {
    const { config, position } = props;
    // const [config, setConfig] = useState(props.config || []);
    // const [position, setPosition] = useState(props.position || '');

    useEffect(() => {
        console.log(`Sidebar-${position}`, config);
    }, [config, position]);
    const buildViewByConfig = () => {
        return config.map((c) => {
            const config = c.config;
            switch (c.name.toLowerCase()) {
                case 'customhtml':
                    return (
                        <Row className='row-sidebar'>
                            <CustomHTML
                                title={config.label}
                                showLabel={config.showLabel}
                                content={config.content} />
                        </Row>
                    );
                case 'postwidget':
                    return (
                        <Row className='row-sidebar'>
                            <PostsWidget
                                title={config.label}
                                category={config.postsByCategory}
                                highlightFirstChild={config.highlightFirstChild}
                                showLabel={config.showLabel}
                                numberOfPost={config.numberOfPosts} />
                        </Row>);
                case 'videoplaylist':
                    return (
                        <Row className='row-sidebar'>
                            <VideoPlaylist
                                title={config.label}
                                showWidgetTitle={config.showLabel}
                                postId={config.postId}
                                numberOfVideo={config.numberOfVideos} />
                        </Row>);
                case 'imageslider':
                    return (
                        <Row className='row-sidebar'>
                            <ImageSlider
                                title={config.label}
                                showWidgetTitle={config.showLabel}
                                postId={config.postId}
                                numberOfImages={config.numberOfImages} />
                        </Row>);
                case 'visits':
                    return (
                        <Row className='row-sidebar'>
                            <Visits
                                title={config.label}
                                showLabel={config.showLabel} />
                        </Row>
                    );
                case 'voted':
                    return (
                        <Row className='row-sidebar'>
                            <Voted title={config.label} showLabel={config.showLabel} />
                        </Row>
                    );
            }
            return (<></>);
        });
    }


    return (
        <Container className={`sidebar sidebar-${position}`}>
            <Row className='row-sidebar'><PostsWidget highlightFirstChild={false} category="thong-bao-moi-hop" /></Row>
            <Row className='row-sidebar'>
                <Container className="image-button hoat-dong"><FAIcon icon="file" /> <HD6>Chương trình kỳ họp</HD6></Container>
            </Row>
            <Row className='row-sidebar'>
                <Container className="image-button hoat-dong"><FAIcon icon="file-alt" /> <HD6>Đề án dự thảo</HD6></Container>
            </Row>
            <Row className='row-sidebar'>
                <Container className="image-button hoat-dong"><FAIcon icon="file-excel" /> <HD6>Báo cáo, chuyên đề</HD6></Container>
            </Row>
            <Row className='row-sidebar'>
                <Container className="image-button hoat-dong"><FAIcon icon="calendar-alt" /> <HD6>Lịch công tác</HD6></Container>
            </Row>
            {config?.length > 0 && buildViewByConfig()}
        </Container>
    );
}

Sidebar.prototype = {
    config: PropTypes.object.isRequired,
    components: PropTypes.any,
    positition: PropTypes.string
};

Sidebar.defaultProps = {
    config: {},
    positition: 'right',
};
export default observer(Sidebar);