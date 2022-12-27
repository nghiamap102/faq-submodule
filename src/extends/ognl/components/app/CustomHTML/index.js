import { useEffect } from "react";
import { Container, HD6, Row } from "@vbd/vui";
import PropTypes from 'prop-types';
import './CustomHTML.scss';
import _ from "lodash";
import { observer } from "mobx-react";

// interface CustomHTMLParameters {
//     title?: string,
//     showLabel?: boolean,
//     content?: string
// }

const CustomHTML = (props) => {
    const { title, showLabel, content } = props;

    useEffect(() => {
        console.log('CustomHTML-Title', title);
        console.log('CustomHTML-ShowLabel', showLabel);
        console.log('CustomHTML-Content', content);

    }, [title, showLabel, content]);

    return (
        <Container className='post-widget customhtml-container'>
            {showLabel && <Row className="title">
                <HD6>{!_.isEmpty(title) ? title : 'Số lượt truy cập'}</HD6>
            </Row>}
            <Container className="customhtml-content">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </Container>
        </Container>
    );
}

CustomHTML.prototype = {
    title: PropTypes.string,
    showLabel: PropTypes.bool,
    content: PropTypes.string
};

// Visits.defaultProps = {
//     config: {},
//     positition: 'right',
// };
export default observer(CustomHTML);