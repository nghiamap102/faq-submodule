import { useEffect, useState } from "react";
import { Container, HD6, Row } from "@vbd/vui";
import PropTypes from 'prop-types';
// import './Visits.scss';
import _ from "lodash";

// interface VisitParameters {
//     title?: string,
//     showLabel?: boolean,
//     visitors?: number,
//     onlines?: number
// }

const Visits = (props) => {
    const { title, showLabel } = props;
    const [visitors, setVisitors] = useState(props.visitors || 0);
    const [onlines, setOnlines] = useState(props.onlines || 0);

    useEffect(() => {
        setVisitors(2666866);
        setOnlines(666);
    }, []);

    return (
        <Container className='visit-container'>
            {showLabel && <Row className="title">
                <HD6>{!_.isEmpty(title) ? title : 'Số lượt truy cập'}</HD6>
            </Row>}
            <Container className="visit-content">
                <Row className='visitors'>{visitors}</Row>
                <Row className='online'>{onlines}</Row>
            </Container>
        </Container>
    );
}

Visits.prototype = {
    title: PropTypes.string,
    showLabel: PropTypes.bool,
};

// Visits.defaultProps = {
//     config: {},
//     positition: 'right',
// };
export default Visits;