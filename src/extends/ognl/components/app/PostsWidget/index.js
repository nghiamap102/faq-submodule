import { Column, Container, HD6, Image, Loading, Row, Sub2 } from "@vbd/vui";
import { initCategoryRequest } from "extends/ognl/pages/CategoriesManager/CategoriesManagerPanel";
import { initPostRequest } from "extends/ognl/pages/PostManager/PostStore";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
// import './PostsWidget.scss';
import { Link } from "react-router-dom";
import { POST_DETAIL } from "extends/ognl/ONGLRoute";
import _ from "lodash";

const PostsWidget = (props) => {
    const { category, highlightFirstChild, showLabel, title, numberOfPost, ognlStore } = props;
    const { postStore, categoriesStore } = ognlStore;
    const [catData, setCatData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        setLoading(true);
        if (category) {
            const catRequest = { ...initCategoryRequest, ...{ filterQuery: [`slug:${category}`], start: 0, length: 1 } };
            const cat = await categoriesStore.loadData(catRequest);
            setCatData(cat?.data?.length ? cat.data[0] : null);

            const postsRequest = {
                ...initPostRequest, ...{
                    searchKey: category,
                    start: 0,
                    count: numberOfPost,
                    filterQuery: [`visibility:(0) AND trangThai:(1)`]
                }
            };

            const posts = await postStore.loadData(postsRequest);
            setPosts(posts.data);
        }
        setLoading(false);
    }, [category, numberOfPost]);

    return (
        <Container className="post-widget">
            {showLabel && <Row className="title">
                {!_.isEmpty(title) ? <HD6>{title}</HD6> : (catData !== null && <HD6>{catData.Title}</HD6>)}
            </Row>}
            <Column className="list">
                {
                    posts?.length > 0 && posts.map((p) => (
                        <Link key={p.Id} to={`${POST_DETAIL}/${p.Id}`}>
                            <Row className="item">
                                {posts.indexOf(p) === 0 && highlightFirstChild ?
                                    <Container className='highlight'>
                                        <Image src={p.featured_image || "/no-image-available.png"} width='100%' height='auto' />
                                        <Container className="info">
                                            <Column className="item-date"><Sub2>{moment(p.ModifiedDate).format('DD/MM/YYYY hh:mm A')}</Sub2></Column>
                                            <Column className="item-title"><HD6>{p.Title}</HD6></Column>
                                        </Container>
                                    </Container> : <Container className="info">
                                        <Column className="item-date"><Sub2>{moment(p.ModifiedDate).format('DD/MM/YYYY hh:mm A')}</Sub2></Column>
                                        <Column className="item-title"><HD6>{p.Title}</HD6></Column>
                                    </Container>
                                }
                                {/* <Container className="info">
                                    <Column className="item-date"><Sub2>{moment(p.ModifiedDate).format('DD/MM/YYYY hh:mm A')}</Sub2></Column>
                                    <Column className="item-title"><HD6>{p.Title}</HD6></Column>
                                </Container> */}
                            </Row>
                        </Link>
                    ))
                }
            </Column>
            {loading && <Loading direction='column' text='Đang tải dữ liệu ...' spinnerSize='lg' />}
        </Container>
    );
}
PostsWidget.propTypes = {
    category: PropTypes.string,
    highlightFirstChild: PropTypes.bool,
    showLabel: PropTypes.bool,
    title: PropTypes.string,
    numberOfPost: PropTypes.number
}
PostsWidget.defaultProps = {
    highlightFirstChild: true,
    showLabel: true,
    numberOfPost: 5
}
export default inject('ognlStore')(observer(PostsWidget));