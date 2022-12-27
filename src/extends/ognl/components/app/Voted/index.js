import { Container, HD6, CheckBox, CheckBoxGroup, Column, Row, Button } from "@vbd/vui";
import { useState } from "react";
import PropTypes from 'prop-types';

// import './Voted.scss';
import _ from "lodash";

const Voted = (props) => {
    const { title, showLabel } = props;
    const [vote, setVote] = useState(-1);

    const handleVoteClick = () => {
        console.log('Vote clicked');
    }

    const handleViewResultClick = () => {
        console.log('View result clicked');
    }

    return (
        <Container className={`voted-container`}>
            {showLabel && <Row className="title">
                <HD6>{!_.isEmpty(title) ? title : 'Đánh giá của bạn về cổng thông tin điện tử'}</HD6>
            </Row>}
            <Container className="voted-content">
                <Column>
                    <Row>
                        <CheckBoxGroup
                            orientation="vertical">
                            <CheckBox
                                label="Tốt"
                                name="vote"
                                onChange={() => {
                                    setVote(0);
                                }}
                            />
                            <CheckBox
                                label="Bình thường"
                                name="vote"
                                onChange={() => {
                                    setVote(1);
                                }}
                            />
                            <CheckBox
                                label="Không tốt"
                                name="vote"
                                onChange={() => {
                                    setVote(2);
                                }}
                            />
                        </CheckBoxGroup>
                    </Row>
                    <Row>
                        <Button text={"Bình chọn"} onClick={handleVoteClick} disabled={vote === -1} /><Button text={"Xem kết quả"} onClick={handleViewResultClick} />
                    </Row>
                </Column>
            </Container>
        </Container>
    );
}

Voted.prototype = {
    // acess hasOne Feature
    title: PropTypes.string,
    showLabel: PropTypes.bool
};

// Voted.defaultProps = {
//     config: {},
//     positition: 'right',
// };

export default Voted;