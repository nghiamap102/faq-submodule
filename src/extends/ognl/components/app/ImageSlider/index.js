import { Column, Container, HD6, Loading, Row, Paging } from "@vbd/vui";
import { inject, observer } from "mobx-react";
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { PAGE_DETAIL } from "extends/ognl/ONGLRoute";
import "./ImageSlider.scss";
import { Link } from "react-router-dom";
import _ from "lodash";


const ImageSlider = (props) => {
    const {
        title,
        showWidgetTitle,
        // postId,
        ognlStore: { imageSliderStore },
        paging,
        isWidget,
        numberOfImages,
        showBullets,
        showIndex,
        showThumbnails,
        lazyLoad,
        showPlayButton,
        useWindowKeyDown,
        showImageDescription,
        showGalleryFullscreenButton } = props;

    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    const [total, setTotal] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(numberOfImages);
    const [data, setData] = useState([]);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const request = { count: pageSize, start: pageIndex * pageSize - pageSize };
                const result = await imageSliderStore.loadData(request);
                if (result) {
                    setImages(result.urls);
                    setTotal(result.total);
                    setData(result.data);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
        init();
    }, [pageIndex, pageSize]);

    useEffect(() => { setPageSize(numberOfImages) }, [numberOfImages]);

    return (
        <Container className={`image-slider-container${isWidget ? ' post-widget' : ''}`}>
            {showWidgetTitle && <Row className="title">
                <Link to={`${PAGE_DETAIL}/image-gallery`}><HD6>{!_.isEmpty(title) ? title : 'Thư viện ảnh'}</HD6></Link>
            </Row>}
            <Container className="image-slider-content">
                {
                    loading ? <Loading /> : (<Column>
                        <Row>
                            <ImageGallery
                                items={images.map(i => {
                                    let item = { original: i, thumbnail: i };
                                    if (showImageDescription) item = { ...item, ...{ description: data[images.indexOf(i)].Title } }
                                    return item;
                                })}
                                showBullets={showBullets}
                                showIndex={showIndex}
                                showThumbnails={showThumbnails}
                                lazyLoad={lazyLoad}
                                showPlayButton={showPlayButton}
                                useWindowKeyDown={useWindowKeyDown}
                                showGalleryFullscreenButton={showGalleryFullscreenButton}
                            />
                        </Row>
                        {paging && <Paging total={total} currentPage={pageIndex} pageSize={pageSize} onChange={(index) => { setPageIndex(index) }} />}
                    </Column>)
                }
            </Container>
        </Container>
    );
}

ImageSlider.propTypes = {
    title: PropTypes.string,
    // postId: PropTypes.string,
    showWidgetTitle: PropTypes.bool,
    isWidget: PropTypes.bool,
    paging: PropTypes.bool,
    numberOfImages: PropTypes.number,
    showBullets: PropTypes.bool,
    showIndex: PropTypes.bool,
    showThumbnails: PropTypes.bool,
    lazyLoad: PropTypes.bool,
    showPlayButton: PropTypes.bool,
    useWindowKeyDown: PropTypes.bool,
    showGalleryFullscreenButton: PropTypes.bool,
    showImageDescription: PropTypes.bool
};

ImageSlider.defaultProps = {
    showWidgetTitle: true,
    isWidget: true,
    paging: false,
    numberOfImages: 10,
    showBullets: true,
    showIndex: true,
    showThumbnails: false,
    lazyLoad: false,
    showPlayButton: false,
    useWindowKeyDown: false,
    showGalleryFullscreenButton: true,
    showImageDescription: false,
};

export default inject('ognlStore')(observer(ImageSlider));
