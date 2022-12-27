import { Column, Container, HD4, Image, Row } from "@vbd/vui";
import { inject, observer } from "mobx-react";
import moment from "moment";
import { Link } from "react-router-dom";
import './RelatedPosts.scss';

let RelatedPosts = (props) => {
    const { posts } = props;
    return (
        <Container className='related-post'>
            <Row className='related-post-title'><HD4>Bài viết liên quan</HD4></Row>
            <Row className='related-post-list'>
                {posts.map((p) => {
                    return (
                        <Column key={posts.indexOf(p)} width='20%' className='related-post-container'>
                            <Link to={`${p.Id}`}>
                                <Container className='related-post-content'>
                                    <Image className='post-featured-image' src={p.featured_image || "/no-image-available.png"} width='100%' height='auto' />
                                    <Row className='post-date'>{moment(p.ModifiedDate).format('DD/MM/YYYY hh:mm a')}</Row>
                                    <Row className='post-title'>{p.Title}</Row>
                                </Container>
                            </Link>
                        </Column>
                    );
                })}
            </Row>
        </Container>
    );
}
RelatedPosts = inject('ognlStore')(observer(RelatedPosts));
export default RelatedPosts;