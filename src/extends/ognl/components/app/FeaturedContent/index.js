import "./FeaturedContent.scss";
import { Container, Column, Row, Sub2, HD6, Loading, Image } from "@vbd/vui";
import { POST_DETAIL } from "extends/ognl/ONGLRoute";
import { initCategoryRequest } from "extends/ognl/pages/CategoriesManager/CategoriesManagerPanel";
import { initPostRequest } from "extends/ognl/pages/PostManager/PostStore";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FeaturedContent = (props) => {
    const { category, ognlStore } = props;
    const { postStore, categoriesStore } = ognlStore;
    const [posts, setPosts] = useState(null);
    const [catData, setCatData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [highlight, setHighlight] = useState(-1);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            if (category) {
                try {
                    const catRequest = { ...initCategoryRequest, ...{ filterQuery: [`slug:${category}`], start: 0, length: 1 } };
                    const cat = await categoriesStore.loadData(catRequest);
                    setCatData(cat.data[0]);

                    const postsRequest = {
                        ...initPostRequest, ...{
                            searchKey: category,
                            start: 0,
                            length: 10
                        }
                    };

                    const result = await postStore.loadData(postsRequest);
                    if (result?.data?.length) {
                        setPosts(result.data);
                        setHighlight(0);
                    }
                } catch (error) {
                    console.log("Featured Content ", error.message)
                }

            }

            setLoading(false);
        }
        init();
    }, []);

    useEffect(() => {
        if (posts?.length) {

            if (window.nextHighlightInterval) clearInterval(window.nextHighlightInterval);

            window.nextHighlightInterval = setInterval(() => {
                setHighlight(highlight => { return highlight < posts.length - 1 ? highlight + 1 : 0 });
            }, 5000);
        }
    }, [posts]);

    return (
        <Container className="post-featured-widget">
            <Row>
                {highlight > -1 &&
                    <Column className="highlight-item">
                        <Container className="highlight-item-content">
                            <Image src={posts[highlight]?.featured_image || "/no-image-available.png"} width='100%' height='auto' />
                            <Link to={`${POST_DETAIL}/${posts[highlight]?.Id}`}>
                                <Container className="info">
                                    <Row className="date"><Sub2>{moment(posts[highlight]?.ModifiedDate).format('DD/MM/YYYY hh:mm A')}</Sub2></Row>
                                    <Row className="title"><HD6>{posts[highlight]?.Title}</HD6></Row>
                                    <Row className="description"><Sub2>{posts[highlight]?.Description}</Sub2></Row>
                                </Container>
                            </Link>
                        </Container>
                    </Column>
                }
                <Column className="list">
                    <Row className="category-title">
                        {catData !== null && <HD6>{catData.Title}</HD6>}
                    </Row>
                    {
                        posts?.length > 0 && posts.map((p) => (
                            <Link key={p.Id} to={`${POST_DETAIL}/${p.Id}`}>
                                <Row key={p.Id} className={`item ${posts.indexOf(p) === highlight && "active"}`}>
                                    <div className="info" onMouseEnter={() => { setHighlight(posts.indexOf(p)) }}>
                                        <Column className="date"><Sub2>{moment(p.ModifiedDate).format('DD/MM/YYYY hh:mm A')}</Sub2></Column>
                                        <Column className="title"><HD6>{p.Title}</HD6></Column>
                                    </div>
                                </Row>
                            </Link>
                        ))
                    }
                </Column>
            </Row>
            {loading && <Loading direction='column' text='Đang tải dữ liệu ...' spinnerSize='lg' overlay={true} />}
        </Container >
    );
}

export default inject('ognlStore')(observer(FeaturedContent));