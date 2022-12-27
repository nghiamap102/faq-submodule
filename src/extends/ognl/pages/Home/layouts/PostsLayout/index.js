import { Column, Container, FlexPanel, HD4, HD6, Image, Panel, Row, Sub2 } from "@vbd/vui";
import Footer from "extends/ognl/components/app/Footer";
import Header from "extends/ognl/components/app/Header";
import PostsWidget from "extends/ognl/components/app/PostsWidget";
import useQuery from "extends/ognl/helper/useQuery";
import { POST_DETAIL } from "extends/ognl/ONGLRoute";
import { initCategoryRequest } from "extends/ognl/pages/CategoriesManager/CategoriesManagerPanel";
import { initPostRequest } from "extends/ognl/pages/PostManager/PostStore";
import { initTagRequest } from "extends/ognl/pages/TagsManager/TagsManagerPanel";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './PostsLayout.scss';

let PostsLayout = (props) => {
    const { ognlStore } = props;
    const { postStore, categoriesStore, tagsStore, configurationStore } = ognlStore;
    // const { config: { posts } } = ognlStore;
    // const { layout } = posts.config;
    const query = useQuery();

    const [pageStart, setPageStart] = useState(1);
    const [pageLength, setPageLength] = useState(25);

    const [data, setData] = useState(null);
    const [catItem, setCatItem] = useState(null);
    const [tagItem, setTagItem] = useState(null);

    const [layout, setLayout] = useState();
    const [contentWidth, setContentWidth] = useState('100%');

    useEffect(() => {
        const { posts } = configurationStore.config;
        if (posts?.config) setLayout(posts.config.layout);

    }, [configurationStore.config]);

    useEffect(() => {
        setContentWidth(getContentWidth());
    }, [layout]);

    useEffect(() => {
        const init = async () => {
            const categorySlug = query.get('category');
            const tagSlug = query.get('tag');
            if (categorySlug) {
                const category = await getCategoryBySlug(categorySlug);
                setCatItem(category);
                const request = {
                    ...initPostRequest, ...{
                        searchKey: categorySlug,
                        start: pageStart * pageLength - pageLength,
                        length: pageLength
                    }
                }
                const result = await postStore.loadData(request);
                console.log(result);
                if (result?.data) {
                    setData(result.data);
                }
            } else if (tagSlug) {
                const tag = await getTagBySlug(tagSlug);
                setTagItem(tag);
                const request = {
                    ...initPostRequest, ...{
                        searchKey: tagSlug,
                        start: pageStart * pageLength - pageLength,
                        length: pageLength
                    }
                }
                const result = await postStore.loadData(request);
                console.log(result);
                if (result?.data) {
                    setData(result.data);
                }
            }
        }
        init();
    }, []);

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

    const getCategoryBySlug = async (slug) => {
        const requestCategory = {
            ...initCategoryRequest, ...{
                filterQuery: [`slug:${slug}`],
                start: 0,
                length: 1
            }
        }
        const result = await categoriesStore.loadData(requestCategory);
        if (result?.data) {
            return result.data[0];
        }
        return null;
    }

    const getTagBySlug = async (slug) => {
        const requestTag = {
            ...initTagRequest, ...{
                filterQuery: [`slug:${slug}`],
                start: 0,
                length: 1
            }
        }
        const result = await tagsStore.loadData(requestTag);
        if (result?.data) {
            return result.data[0];
        }
        return null;
    }

    return (
        <FlexPanel className='container'>
            <Header />
            <Container className="body-container">
                <Container className="body-content fixedwidth">
                    {(layout === "sidebar_left" || layout === "both_sidebar") &&
                        <Container className='sidebar sidebar-left full-height'>
                            <h1>Sidebar left</h1>
                        </Container>
                    }
                    <Container className='content' width={contentWidth}>
                        {data &&
                            <Panel className="post-group-content">
                                <Container className="post-group-title">
                                    {
                                        catItem && (<><HD6>Danh mục : </HD6><HD4>{catItem != null ? catItem.Title : ''}</HD4></>)
                                    }
                                    {
                                        tagItem && (<><HD6>Thẻ : </HD6><HD4>{tagItem != null ? tagItem.Title : ''}</HD4></>)
                                    }
                                </Container>
                                <Container className="post-group-list">
                                    {
                                        data.map((d) => (
                                            <Container key={data.indexOf(d)} className="post-group-item">
                                                <Link to={`${POST_DETAIL}/${d.Id}`}>
                                                    <Row
                                                        mainAxisAlignment="start"
                                                        crossAxisAlignment="stretch"
                                                        mainAxisSize="min"
                                                        crossAxisSize="min"
                                                        itemMargin="md">
                                                        <Column className="item-featured-image"><Image src={d.featured_image || "/no-image-available.png"} /></Column>
                                                        <Container className="item-info">
                                                            <Column className="item-date"><Sub2>{moment(d.ModifiedDate).format('DD/MM/YYYY hh:mm A')}</Sub2></Column>
                                                            <Column className="item-title"><HD6>{d.Title}</HD6></Column>
                                                            {/* <Column className="item-description"><Sub1>{d.Description}</Sub1></Column> */}
                                                        </Container>
                                                    </Row>
                                                </Link>
                                            </Container>
                                        ))
                                    }
                                </Container>
                            </Panel>
                        }
                    </Container>

                    {(layout === "sidebar_right" || layout === "both_sidebar") &&
                        <Container className='sidebar sidebar-right'>
                            <Row>
                                <PostsWidget category="thong-bao-moi-hop" highlightFirstChild={false} />
                            </Row>
                            <Row className='row-sidebar'>
                                <HD6>Video hoạt động</HD6>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button"> <HD6>Quốc hội</HD6></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button"><HD6>Chính phủ</HD6></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button"><HD6>Cổng thông tin điện tử</HD6></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button"><HD6>CSDL Luật Việt Nam</HD6></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <Container className="image-button"> <HD6>Tài liệu kỳ họp HĐND</HD6></Container>
                            </Row>
                            <Row className='row-sidebar'>
                                <HD6>Thư viện ảnh</HD6>
                            </Row>
                            <Row className='row-sidebar'>
                                <HD6>Bình chọn</HD6>
                            </Row>
                            <Row className='row-sidebar'>
                                <HD6>Thống kê truy cập</HD6>
                            </Row>
                        </Container>
                    }
                </Container>
            </Container>
            <Footer />
        </FlexPanel>
    );
}
PostsLayout = inject('appStore', 'ognlStore')(observer(PostsLayout));
export default PostsLayout;